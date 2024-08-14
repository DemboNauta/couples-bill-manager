namespace CouplesBillManagerAPI.Models
{
  public class Expense
  {
    public int UserId { get; set; }
    public string Date { get; set; } = "";
    public string Description { get; set; } = "";
    public string Category { get; set; } = "";
    public string Amount { get; set; } = "";
    public string TransactionType { get; set; } = "";
    public string AccountOrCard { get; set; } = "";
  }
}

