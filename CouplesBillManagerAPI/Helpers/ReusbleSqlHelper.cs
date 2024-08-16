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

    public User getUser(int userId)
    {
      string sqlGetUser="SELECT * FROM USERS WHERE Id = @UserId";
      DynamicParameters selectUserParams = new DynamicParameters();
      selectUserParams.Add("@UserId", userId);
      return _dapper.LoadDataSingleWithParameters<User>(sqlGetUser, selectUserParams);

    }

    public List<Expense> selectExpenses(int userId, string period)
    {
      string sqlQuery = "SELECT * FROM Expenses WHERE UserId = @UserIdParameter";
      DynamicParameters parameters = new DynamicParameters();
      parameters.Add("@UserIdParameter", userId, DbType.Int32);

      DateTime now = DateTime.Now;
      DateTime startOfWeek = now.StartOfWeek(DayOfWeek.Monday);
      DateTime endOfWeek = startOfWeek.AddDays(6);
      DateTime startOfYear = new DateTime(now.Year, 1, 1);
      DateTime endOfYear = new DateTime(now.Year, 12, 31);

      // Filtrar según el período de tiempo especificado
      switch (period.ToLower())
      {
        case "lastmonth":
          // Selecciona solo los registros del mes actual
          sqlQuery += " AND MONTH(Date) = MONTH(GETDATE()) AND YEAR(Date) = YEAR(GETDATE())";
          break;

        case "last14days":
          // Selecciona los registros de los últimos 14 días
          sqlQuery += " AND Date >= DATEADD(day, -14, GETDATE())";
          break;

        case "lastweek":
          // Selecciona los registros de la semana actual
          sqlQuery += " AND Date >= @StartOfWeek AND Date <= @EndOfWeek";
          parameters.Add("@StartOfWeek", startOfWeek);
          parameters.Add("@EndOfWeek", endOfWeek);
          break;

        case "lastyear":
          // Selecciona los registros del año actual
          sqlQuery += " AND Date >= @StartOfYear AND Date <= @EndOfYear";
          parameters.Add("@StartOfYear", startOfYear);
          parameters.Add("@EndOfYear", endOfYear);
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

    // Helper Method to get the start of the week
    
  }
  public static class DateTimeExtensions
  {
    public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
    {
      int diff = dt.DayOfWeek - startOfWeek;
      if (diff < 0) diff += 7;
      return dt.AddDays(-1 * diff).Date;
    }
  }
}
