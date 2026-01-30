using System.ComponentModel;

namespace AuthAPI.Data.Models
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Username { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string? LogoKey { get; set; }
        public string? LogoUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [DefaultValue(false)]
        public bool IsEmailConfirmed { get; set; }
        public string? RefreshToken { get; set; } = null;
        public DateTime? RefreshTokenExpiryTime { get; set; } = null;
        public string? Provider { get; set; }
        public string? ProviderId { get; set; }
        public List<UserRole> UserRoles { get; set; }
        public List<UserOtp> UserOtps { get; set; }
    }
}
