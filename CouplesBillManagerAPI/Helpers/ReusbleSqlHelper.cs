using CouplesBillManagerAPI.Data;
using CouplesBillManagerAPI.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CouplesBillManagerAPI.Helpers
{

  public class ReusbleSqlHelper
  {
    private readonly DataContextDapper _dapper;
    public ReusbleSqlHelper(IConfiguration config)
    {
      _dapper = new DataContextDapper(config);
    }

    public bool insertUser(User user)
    {
      string sqlAddAuth = $@"INSERT INTO Users (Username, Email, RegistrationDate)
                    VALUES (@UserNameParam, @EmailParam, GETDATE())";

      DynamicParameters insertUserParams = new DynamicParameters();
      insertUserParams.Add("@UserNameParam", user.UserName, DbType.String);
      insertUserParams.Add("@EmailParam", user.Email, DbType.String);

      return _dapper.ExecuteSqlWithParameters(sqlAddAuth, insertUserParams);

    }

    public List<Expense> selectExpenses(int userId, string periodo)
    {
      string sqlQuery = "SELECT * FROM Expenses WHERE UserId = @UserIdParameter";
      DynamicParameters parameters = new DynamicParameters();
      parameters.Add("@UserIdParameter", userId, DbType.Int32);

      // Filtrar según el período de tiempo especificado
      switch (periodo.ToLower())
      {
        case "month":
          sqlQuery += " AND Date >= DATEADD(month, -1, GETDATE())";
          break;

        case "last14days":
          sqlQuery += " AND Date >= DATEADD(day, -14, GETDATE())";
          break;

        case "lastWeek":
          sqlQuery += " AND Date >= DATEADD(week, -1, GETDATE())";
          break;

        case "lastYear":
          sqlQuery += " AND YEAR(Date) = YEAR(GETDATE())";
          break;

        case "all":
          // No se añade ninguna condición adicional para "siempre"
          break;

        default:
          throw new ArgumentException("Período no reconocido");
      }

      // Ejecutar la consulta y devolver los resultados
      List<Expense> expenses = _dapper.LoadDataWithParameters<Expense>(sqlQuery, parameters).ToList();
      return expenses;
    }
  }
}
