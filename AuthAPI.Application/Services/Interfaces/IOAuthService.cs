using AuthAPI.Contracts.DTOs.Request;
using AuthAPI.Contracts.DTOs.Response;

namespace AuthAPI.Application.Services.Interfaces
{
    public interface IOAuthService
    {
        Task<GoogleAuthUrlResponseDTO> GetGoogleAuthUrlAsync();
        Task<GoogleLoginResponseDTO> LoginWithGoogleCodeAsync(GoogleAuthCodeRequestDTO request);
    }
}
