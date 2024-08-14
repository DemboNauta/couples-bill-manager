namespace CouplesBillManagerAPI.DTO
{
  public partial class UserForLoginConfirmationDTO
  {
    public byte[] PasswordHash { get; set; } = new byte[0];
    public byte[] PasswordSalt { get; set; } = new byte[0];
  }
}

