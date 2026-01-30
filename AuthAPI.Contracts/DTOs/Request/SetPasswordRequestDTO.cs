namespace AuthAPI.Contracts.DTOs.Request
{
    public class SetPasswordRequestDTO
    {
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}

