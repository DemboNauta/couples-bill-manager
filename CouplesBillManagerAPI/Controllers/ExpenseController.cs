using CouplesBillManagerAPI.Data;
using CouplesBillManagerAPI.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Xml;
using System.Xml.Serialization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CouplesBillManagerAPI.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class ExpenseController : ControllerBase
  {
    DataContextDapper _dapper;
    public ExpenseController(IConfiguration config)
    {
      _dapper = new DataContextDapper(config);
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

          foreach (XmlNode row in rows)
          {
            var cells = row.SelectNodes("ss:Cell", nsmgr);

            if (cells.Count >= 6) // Asegurarse de que haya al menos 6 celdas (una por cada columna esperada)
            {
              var fecha = cells[0].InnerText.Substring(6);
              var concepto = cells[1].InnerText; // Concepto está en la tercera celda
              var categoria = cells[2].InnerText; // Categoría está en la cuarta celda
              var importe = cells[3].InnerText; // Importe está en la quinta celda
              var tipoMovimiento = cells[4].InnerText; // Tipo Movimiento está en la sexta celda
              var cuentaTarjeta = cells[5].InnerText; // Cuenta/Tarjeta está en la séptima celda

              gastos.Add(new Expense
              {
                UserId = Int32.Parse(this.User.FindFirst("userId")?.Value),
                Date = fecha,
                Description = concepto,
                Category = categoria,
                Amount = importe,
              });
            }
          }
          foreach (Expense gasto in gastos)
          {
            string insertExpense = @"
            INSERT INTO Expenses(UserId, Amount, Description, Date, Category)
            VALUES(@UserIdParam, @AmountParam, @DescriptionParam, @DateParam, @CategoryParam)";
            DynamicParameters expenseDetailParams = new DynamicParameters();
            expenseDetailParams.Add("@UserIdParam", gasto.UserId, DbType.Int32);
            expenseDetailParams.Add("@AmountParam", gasto.Amount, DbType.Int32);
            expenseDetailParams.Add("@DescriptionParam", gasto.Description, DbType.String);
            expenseDetailParams.Add("@DateParam", gasto.Date, DbType.Date);
            expenseDetailParams.Add("@CategoryParam", gasto.Category, DbType.String);

            _dapper.ExecuteSqlWithParameters(insertExpense, expenseDetailParams);
          }
        }
        catch (System.Exception ex)
        {
          return BadRequest($"Error al procesar el archivo XML: {ex.Message}");
        }
      }
      Console.WriteLine(gastos);
      return Ok(new { Message = "Archivo XML procesado correctamente.", Gastos = gastos });
    }
  }
}
