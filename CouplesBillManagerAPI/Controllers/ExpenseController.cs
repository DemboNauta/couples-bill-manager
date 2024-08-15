using CouplesBillManagerAPI.Data;
using CouplesBillManagerAPI.Helpers;
using CouplesBillManagerAPI.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Globalization;
using System.Xml;

namespace CouplesBillManagerAPI.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class ExpenseController : ControllerBase
  {
    DataContextDapper _dapper;
    ReusbleSqlHelper _sqlHelper;
    public ExpenseController(IConfiguration config)
    {
      _dapper = new DataContextDapper(config);
      _sqlHelper = new ReusbleSqlHelper(config);
    }

    [HttpGet("TestConnection")]
    public DateTime TestConnection()
    {
      return _dapper.LoadDataSingle<DateTime>("SELECT GETDATE()");
    }

    [HttpPost("upload")]
    public IActionResult UploadXml([FromForm] IFormFile file)
    {
      if (file == null || file.Length == 0)
      {
        return BadRequest("No se subió ningún archivo");
      }

      List<Expense> gastos = new List<Expense>();
      List<Expense> ingresos = new List<Expense>();
      List<string> errores = new List<string>();

      using (var stream = file.OpenReadStream())
      {
        try
        {
          var xmlDoc = new XmlDocument();
          xmlDoc.Load(stream);

          // Encontrar las filas que contienen datos
          XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmlDoc.NameTable);
          nsmgr.AddNamespace("ss", "urn:schemas-microsoft-com:office:spreadsheet");

          var rows = xmlDoc.SelectNodes("//ss:Worksheet[@ss:Name='Ingresos y Gastos']//ss:Table//ss:Row", nsmgr);

          int rowCounter = 0; // Contador de filas

          foreach (XmlNode row in rows)
          {
            // Saltar las primeras 5 filas
            if (rowCounter < 5)
            {
              rowCounter++;
              continue;
            }

            try
            {
              var cells = row.SelectNodes("ss:Cell", nsmgr);

              if (cells.Count >= 6) // Asegurarse de que haya al menos 6 celdas (una por cada columna esperada)
              {
                var fecha = cells[0].InnerText;
                var concepto = cells[1].InnerText;
                var categoria = cells[2].InnerText;
                var importe = cells[3].InnerText;
                var tipoMovimiento = cells[4].InnerText;
                var cuentaTarjeta = cells[5].InnerText;

                // Intentar convertir el importe a decimal
                if (decimal.TryParse(importe, NumberStyles.AllowDecimalPoint | NumberStyles.AllowLeadingSign, CultureInfo.InvariantCulture, out decimal amountDecimal))
                {
                  int userId = int.Parse(this.User.FindFirst("userId")?.Value); // Convertir UserId a int

                  // Convertir la fecha al tipo DateTime usando el formato específico
                  if (DateTime.TryParseExact(fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
                  {
                    var expense = new Expense
                    {
                      UserId = userId,
                      Date = date.Date, // Solo la parte de la fecha, sin hora
                      Description = concepto,
                      Category = categoria,
                      Amount = amountDecimal,
                      TransactionType = tipoMovimiento
                    };

                    // Clasificar como gasto o ingreso basado en el importe
                    if (amountDecimal < 0)
                    {
                      gastos.Add(expense);
                    }
                    else
                    {
                      ingresos.Add(expense);
                    }
                  }
                  else
                  {
                    errores.Add($"Error al convertir la fecha en la fila {rowCounter + 1}: {fecha}");
                  }
                }
                else
                {
                  errores.Add($"Error al convertir el importe en la fila {rowCounter + 1}: {importe}");
                }
              }
              else
              {
                errores.Add($"Error en la fila {rowCounter + 1}: Número de celdas insuficiente");
              }
            }
            catch (Exception ex)
            {
              errores.Add($"Error al procesar la fila {rowCounter + 1}: {ex.Message}");
            }

            rowCounter++; // Incrementar el contador de filas
          }

          foreach (Expense gasto in gastos)
          {
            string insertExpense = @"
                    INSERT INTO Expenses(UserId, Amount, Description, Date, Category)
                    VALUES(@UserIdParam, @AmountParam, @DescriptionParam, @DateParam, @CategoryParam)";
            DynamicParameters expenseDetailParams = new DynamicParameters();
            expenseDetailParams.Add("@UserIdParam", gasto.UserId, DbType.Int32);
            expenseDetailParams.Add("@AmountParam", gasto.Amount, DbType.Decimal);
            expenseDetailParams.Add("@DescriptionParam", gasto.Description, DbType.String);
            expenseDetailParams.Add("@DateParam", gasto.Date, DbType.Date); // Tipo DbType.Date para asegurarse de que solo se guarde la fecha
            expenseDetailParams.Add("@CategoryParam", gasto.Category, DbType.String);

            try
            {
              _dapper.ExecuteSqlWithParameters(insertExpense, expenseDetailParams);
            }
            catch (Exception ex)
            {
              errores.Add($"Error al insertar el gasto con descripción '{gasto.Description}': {ex.Message}");
            }
          }

          foreach (Expense ingreso in ingresos)
          {
            string insertIncome = @"
                    INSERT INTO Incomes(UserId, Amount, Description, Date, Category)
                    VALUES(@UserIdParam, @AmountParam, @DescriptionParam, @DateParam, @CategoryParam)";
            DynamicParameters incomeDetailParams = new DynamicParameters();
            incomeDetailParams.Add("@UserIdParam", ingreso.UserId, DbType.Int32);
            incomeDetailParams.Add("@AmountParam", ingreso.Amount, DbType.Decimal);
            incomeDetailParams.Add("@DescriptionParam", ingreso.Description, DbType.String);
            incomeDetailParams.Add("@DateParam", ingreso.Date, DbType.Date); // Tipo DbType.Date para asegurarse de que solo se guarde la fecha
            incomeDetailParams.Add("@CategoryParam", ingreso.Category, DbType.String);

            try
            {
              _dapper.ExecuteSqlWithParameters(insertIncome, incomeDetailParams);
            }
            catch (Exception ex)
            {
              errores.Add($"Error al insertar el ingreso con descripción '{ingreso.Description}': {ex.Message}");
            }
          }
        }
        catch (Exception ex)
        {
          return BadRequest($"Error al procesar el archivo XML: {ex.Message}");
        }
      }
      int userIdSelect = int.Parse(this.User.FindFirst("userId")?.Value);
      return Ok(new { Message = "Archivo XML procesado con éxito.", Gastos = _sqlHelper.selectExpenses(userIdSelect, "month") });
    }
    [Authorize]
    [HttpGet("expenses")]
    public IActionResult getLastExpenses()
    {
      int userIdSelect = int.Parse(this.User.FindFirst("userId")?.Value);
      return Ok(_sqlHelper.selectExpenses(userIdSelect, "month"));
    }
  }
}
