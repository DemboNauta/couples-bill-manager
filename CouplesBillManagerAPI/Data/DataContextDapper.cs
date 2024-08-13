using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;

namespace CouplesBillManagerAPI.Data
{
  public class DataContextDapper
  {
    private readonly IConfiguration _config;
    public DataContextDapper(IConfiguration config)
    {
      _config = config;
    }

    public IEnumerable<T> LoadData<T>(string sql)
    {
      IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
      return dbConnection.Query<T>(sql);
    }
    public T LoadDataSingle<T>(string sql)
    {
      IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
      return dbConnection.QuerySingle<T>(sql);
    }

    public bool ExecuteSql(string sql)
    {
      IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
      return dbConnection.Execute(sql) > 0;
    }
    public int ExecuteSqlRowCount(string sql)
    {
      IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
      return dbConnection.Execute(sql);
    }

    public bool ExecuteSqlWithParameters(string sql, DynamicParameters parameters)
    {
      IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
      return dbConnection.Execute(sql, parameters) > 0;
    }

    public IEnumerable<T> LoadDataWithParameters<T>(string sql, DynamicParameters parameters)
    {
      IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
      return dbConnection.Query<T>(sql, parameters);
    }
    public T LoadDataSingleWithParameters<T>(string sql, DynamicParameters parameters)
    {
      IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
      return dbConnection.QuerySingle<T>(sql, parameters);
    }
  }
}
