namespace AuthAPI.Infrastructure.Settings
{
    public class S3Settings
    {
        public string BucketName { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string KeyPrefix { get; set; } = "users";
        public int PresignExpiryMinutes { get; set; } = 15;
        public long MaxLogoBytes { get; set; } = 5 * 1024 * 1024;
    }
}
