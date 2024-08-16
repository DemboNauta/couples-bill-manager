using CouplesBillManagerAPI.Data;
using CouplesBillManagerAPI.DTO;
using CouplesBillManagerAPI.Helpers;
using CouplesBillManagerAPI.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json;

namespace CouplesBillManagerAPI.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly DataContextDapper _dapper;
    private readonly AuthHelper _authHelper;
    private readonly ReusbleSqlHelper _reusbleSqlHelper;
    private readonly IConfiguration _config;


    public AuthController(IConfiguration config)
    {
      _dapper = new DataContextDapper(config);
      _authHelper = new AuthHelper(config);
      _reusbleSqlHelper = new ReusbleSqlHelper(config);
      _config = config;
    }
    [HttpPost("register")]
    public IActionResult Register(UserRegisterDTO userRegister)
    {
      if(userRegister.Password == userRegister.PasswordConfirm)
      {
        string sqlCheckUserExist = $"SELECT Email FROM Auth WHERE Email = @EmailParam";
        DynamicParameters sqlParametersUserExist = new DynamicParameters();
        sqlParametersUserExist.Add("@EmailParam", userRegister.Email, DbType.String);
        if (_dapper.LoadDataWithParameters<string>(sqlCheckUserExist, sqlParametersUserExist).Count() == 0)
        {
          UserLoginDTO userLoginDTO = new UserLoginDTO()
          {
            Password = userRegister.Password,
            Email = userRegister.Email,

          };
          if(_authHelper.SetPassword(userLoginDTO))
          {
            User user = new User()
            {
              Email = userRegister.Email,
              UserName = userRegister.UserName,

            };
            if(_reusbleSqlHelper.insertUser(user))
            {
              return Ok();
            }

          }
          return Ok();

        }

      }
      return BadRequest("The passwords don't match");
    }

    [HttpPut("ResetPassword")]
    public IActionResult ResetPassword(UserLoginDTO userForSet)
    {
      if (_authHelper.SetPassword(userForSet)) return Ok("Password changed succesfuly!");

      return BadRequest("Error, can't change password");
    }

    [HttpPost("Login")]
    public IActionResult Login(UserLoginDTO userLogin)
    {
      string sqlForHasSalt = @"SELECT PasswordHash, PasswordSalt FROM Auth
        WHERE Email = @EmailParam";
      DynamicParameters sqlParameters = new DynamicParameters();
      sqlParameters.Add("@EmailParam", userLogin.Email, DbType.String);
      UserForLoginConfirmationDTO userForLoginConfirmation = _dapper
          .LoadDataSingleWithParameters<UserForLoginConfirmationDTO>(sqlForHasSalt, sqlParameters);
      byte[] passwordHash = _authHelper.GetPasswordHash(userLogin.Password, userForLoginConfirmation.PasswordSalt);
      for(int index = 0; index < passwordHash.Length; index++)
      {
        if (passwordHash[index] != userForLoginConfirmation.PasswordHash[index])
        {
          return StatusCode(401, "Incorrect password or email");
        }
      }
      string userIdSql = $@"
                SELECT * FROM Users WHERE Email = @EmailParam ";
      DynamicParameters getUserIdParams = new DynamicParameters();
      getUserIdParams.Add("@EmailParam", userLogin.Email, DbType.String);

      User userLogged = _dapper.LoadDataSingleWithParameters<User>(userIdSql, getUserIdParams);

      return Ok(new {
                token = _authHelper.CreateToken(userLogged.Id),
                user = userLogged
            });
    }

    [HttpGet("VerifyToken")]
    public IActionResult VerifyToken()
    {
      int userId = int.Parse(this.User.FindFirst("userId")?.Value);
      if(userId != null)
      {
        return Ok(_reusbleSqlHelper.getUser(userId));
      }
      return BadRequest("Token not allowed");
    }

    //[HttpGet("verifytoken/{token}")]
    //public IActionResult VerifyToken(string token)
    //{
    //  JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

    //  TokenValidationParameters tokenValidationParameters = new TokenValidationParameters()
    //  {
    //    IssuerSigningKey = new SymmetricSecurityKey(
    //          Encoding.UTF8.GetBytes(
    //              _config.GetSection("AppSettings:TokenKey").Value ?? ""
    //          )
    //      ),
    //    ValidateIssuer = false,
    //    ValidateIssuerSigningKey = false,
    //    ValidateAudience = false,
    //  };

    //  try
    //  {
    //    // Validar el token
    //    var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);

    //    // Extraer el userId desde las claims
    //    var userIdClaim = principal.FindFirst("userId");
    //    if (userIdClaim != null)
    //    {
    //      var userId = userIdClaim.Value;

    //      // Cargar el usuario desde la base de datos usando el userId
    //      User user = _dapper.LoadDataSingle<User>("SELECT * FROM Users WHERE UserId = " + userId);

    //      return Ok(new { Valid = true, User = user });
    //    }
    //    else
    //    {
    //      return BadRequest("Token válido, pero no contiene 'userId'.");
    //    }
    //  }
    //  catch (Exception)
    //  {
    //    return Unauthorized(new { Valid = false });
    //  }
    //}

  }
}
