namespace AuthAPI.Contracts.DTOs.Request
{
    public class GoogleLoginRequestDTO
    {
        public string? Email { get; set; }
        public string? Username { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? GoogleId { get; set; }
        public string IdToken { get; set; }



        public GoogleLoginRequestDTO(string email, string username, string name, string surname, string googleId, string idToken)
        {
            Email = email;
            Username = username;
            Name = name;
            Surname = surname;
            GoogleId = googleId;
            IdToken = idToken;
        }
    }
}
