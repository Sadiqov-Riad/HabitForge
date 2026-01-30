namespace AuthAPI.Contracts.DTOs.Response
{
    public class CurrentUserResponseDTO
    {
        public string Email { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? LogoUrl { get; set; }
    }
}


