namespace AuthAPI.Contracts.DTOs.Request
{
    public class VerifyForgotPasswordOtpRequestDTO
    {
        public string Email { get; set; } = null!;
        public string Otp { get; set; } = null!;
    }
}
