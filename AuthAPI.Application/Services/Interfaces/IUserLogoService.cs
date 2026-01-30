namespace AuthAPI.Application.Services.Interfaces
{
    public interface IUserLogoService
    {
        Task<string?> GetPresignedReadUrlAsync(string? key, CancellationToken ct = default);
        Task<string> UploadUserLogoAsync(string userId, string email, string originalFileName, Stream content, string contentType, long contentLength, CancellationToken ct = default);
        Task DeleteAsync(string key, CancellationToken ct = default);
        string BuildS3Uri(string key);
    }
}
