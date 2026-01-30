namespace AuthAPI.Contracts.DTOs.Request
{
    public class ChangePasswordWithOtpRequestDTO
    {
        public string Otp { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
        public string ConfirmPassword { get; set; } = null!;
    }
}


