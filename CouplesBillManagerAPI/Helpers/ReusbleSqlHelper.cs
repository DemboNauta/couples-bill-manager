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
  }
}
