namespace CouplesBillManagerAPI.Models
{
  public class Expense
  {
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = "";
    public string Category { get; set; } = "";
    public decimal Amount { get; set; }
    public string TransactionType { get; set; } = "";
  }
}

