namespace AuthAPI.Contracts.DTOs.Request
{
    public class RegisterRequestDTO
    {
        public string Username { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

        public RegisterRequestDTO(string username, string name, string surname, string email, string password, string confirmPassword) {
            Username = username;
            Name = name;
            Surname = surname;
            Email = email;
            Password = password;
            ConfirmPassword = confirmPassword;
        }
    }
}
