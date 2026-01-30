namespace AuthAPI.Contracts.DTOs.Response
{
    public class GoogleAuthUrlResponseDTO
    {
        public string AuthUrl { get; set; }
    }

    public class GoogleLoginResponseDTO
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public bool IsNewUser { get; set; }
    }
}
