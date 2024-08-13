namespace CouplesBillManagerAPI.Models
{
  public partial class Expense
  {
    public int Id { get; set; }
    public int userId { get; set; }
    public int categoryId { get; set; }
    public decimal amount { get; set; }
    public string description { get; set; } = "";
    public DateTime date { get; set; }
  }
}

