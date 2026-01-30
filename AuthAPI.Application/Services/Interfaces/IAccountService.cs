using AuthAPI.Contracts.DTOs.Request;
using AuthAPI.Contracts.DTOs.Response;

namespace AuthAPI.Application.Services.Interfaces
{
    public interface IAccountService
    {
        public Task<APIResponse<object>> RegisterAsync(RegisterRequestDTO request);
        public Task<APIResponse<object>> VerifyOtpAsync(VerifyOtpRequestDTO request);
        public Task<APIResponse<object>> SetPasswordAsync(string userId, SetPasswordRequestDTO request);
        public Task<APIResponse<object>> SendOtpAsync(string userId);
        public Task<APIResponse<object>> SendForgotPasswordOtpAsync(ForgotPasswordRequestDTO request);
        public Task<APIResponse<object>> VerifyForgotPasswordOtpAsync(VerifyForgotPasswordOtpRequestDTO request);
        public Task<APIResponse<object>> ChangePasswordWithOtpAsync(string userId, ChangePasswordWithOtpRequestDTO request);
        public Task<APIResponse<object>> ResetPasswordWithOtpAsync(ResetPasswordWithOtpRequestDTO request);
        public Task<APIResponse<object>> UpdateUsernameAsync(string userId, UpdateUsernameRequestDTO request);
        public Task<APIResponse<object>> DeleteAccountWithOtpAsync(string userId, DeleteAccountWithOtpRequestDTO request);
        public Task<APIResponse<CurrentUserResponseDTO>> GetMeAsync(string userId);
        public Task<APIResponse<UploadLogoResponseDTO>> UploadLogoAsync(string userId, Stream content, string contentType, string originalFileName, long contentLength, CancellationToken ct = default);
        public Task<APIResponse<object>> DeleteLogoAsync(string userId, CancellationToken ct = default);
        public Task<APIResponse<CurrentUserResponseDTO>> UpdateProfileAsync(string userId, UpdateProfileRequestDTO request, CancellationToken ct = default);
    }
}
