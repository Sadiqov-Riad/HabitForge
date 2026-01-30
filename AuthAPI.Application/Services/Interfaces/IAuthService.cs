using AuthAPI.Contracts.DTOs.Request;
using AuthAPI.Contracts.DTOs.Response;

namespace AuthAPI.Application.Services.Interfaces
{
    public interface IAuthService
    {
        public Task<APIResponse<RefreshTokenResponse>> LoginAsync(LoginRequestDTO request);
        public Task<APIResponse<RefreshTokenResponse>> RefreshAsync(RefreshTokenRequestDTO request, string? accessToken = null);
    }
}
