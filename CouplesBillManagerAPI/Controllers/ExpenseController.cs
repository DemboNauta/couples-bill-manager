using CouplesBillManagerAPI.Data;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CouplesBillManagerAPI.Controllers
{
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
  }
}
