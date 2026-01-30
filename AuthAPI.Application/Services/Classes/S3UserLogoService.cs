using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using AuthAPI.Application.Services.Interfaces;
using AuthAPI.Infrastructure.Settings;
using Microsoft.Extensions.Options;

namespace AuthAPI.Application.Services.Classes
{
    public class S3UserLogoService : IUserLogoService
    {
        private readonly S3Settings _settings;
        private readonly IAmazonS3 _s3;
        public S3UserLogoService(IOptions<S3Settings> options)
        {
            _settings = options.Value ?? new S3Settings();
            var region = !string.IsNullOrWhiteSpace(_settings.Region) ? RegionEndpoint.GetBySystemName(_settings.Region) : RegionEndpoint.USEast1;
            _s3 = new AmazonS3Client(region);
        }

        public string BuildS3Uri(string key)
        {
            return $"s3://{_settings.BucketName}/{key}";
        }

        public async Task<string?> GetPresignedReadUrlAsync(string? key, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(key))
                return null;
            if (string.IsNullOrWhiteSpace(_settings.BucketName))
                return null;
            var req = new GetPreSignedUrlRequest
            {
                BucketName = _settings.BucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddMinutes(Math.Max(1, _settings.PresignExpiryMinutes))
            };
            var url = _s3.GetPreSignedURL(req);
            return await Task.FromResult(url);
        }

        private static string SanitizeEmailForKey(string email)
        {
            var normalized = (email ?? string.Empty).Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(normalized))
                return "unknown";
            var chars = normalized.Select(ch => ch is '/' or '\\' or ':' or '*' or '?' or '"' or '<' or '>' or '|' ? '_' : ch).ToArray();
            var safe = new string (chars);
            safe = safe.Replace("..", ".");
            return safe.Length > 200 ? safe[..200] : safe;
        }

        private static string SanitizeFileNameForKey(string originalFileName)
        {
            var name = (originalFileName ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(name))
                return "logo.img";
            name = Path.GetFileName(name);
            var cleaned = new string (name.Select(ch => ch is '/' or '\\' or ':' or '*' or '?' or '"' or '<' or '>' or '|' ? '_' : ch).ToArray());
            cleaned = cleaned.Replace("..", ".");
            if (cleaned.Length > 180)
                cleaned = cleaned[..180];
            return cleaned;
        }

        public async Task<string> UploadUserLogoAsync(string userId, string email, string originalFileName, Stream content, string contentType, long contentLength, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(_settings.BucketName))
                throw new InvalidOperationException("S3 bucket name is not configured (AWS__S3__BucketName).");
            var emailKey = SanitizeEmailForKey(email);
            var fileNameKey = SanitizeFileNameForKey(originalFileName);
            var key = $"{_settings.KeyPrefix.TrimEnd('/')}/{emailKey}/logo/{fileNameKey}";
            var put = new PutObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = key,
                InputStream = content,
                ContentType = contentType
            };
            await _s3.PutObjectAsync(put, ct);
            return key;
        }

        public async Task DeleteAsync(string key, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(key))
                return;
            if (string.IsNullOrWhiteSpace(_settings.BucketName))
                return;
            try
            {
                await _s3.DeleteObjectAsync(new DeleteObjectRequest { BucketName = _settings.BucketName, Key = key }, ct);
            }
            catch
            {
            }
        }
    }
}
