using AuthAPI.Application.Services.Interfaces;
using AuthAPI.Contracts.DTOs.Request;
using AuthAPI.Contracts.DTOs.Response;
using AuthAPI.Infrastructure.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AuthAPI.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly S3Settings _s3Settings;
        public AccountController(IAccountService accountService, IOptions<S3Settings> s3Options)
        {
            _accountService = accountService;
            _s3Settings = s3Options.Value ?? new S3Settings();
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterAsync(RegisterRequestDTO request)
        {
            var response = await _accountService.RegisterAsync(request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtpAsync(VerifyOtpRequestDTO request)
        {
            var response = await _accountService.VerifyOtpAsync(request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPasswordAsync(ForgotPasswordRequestDTO request)
        {
            var response = await _accountService.SendForgotPasswordOtpAsync(request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("verify-forgot-otp")]
        public async Task<IActionResult> VerifyForgotOtpAsync(VerifyForgotPasswordOtpRequestDTO request)
        {
            var response = await _accountService.VerifyForgotPasswordOtpAsync(request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("set-password")]
        public async Task<IActionResult> SetPasswordAsync(SetPasswordRequestDTO request)
        {
            var userId = User.FindFirst("uid")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var response = await _accountService.SetPasswordAsync(userId, request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("reset-password-with-otp")]
        public async Task<IActionResult> ResetPasswordWithOtpAsync(ResetPasswordWithOtpRequestDTO request)
        {
            var response = await _accountService.ResetPasswordWithOtpAsync(request);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtpAsync()
        {
            var userId = User.FindFirst("uid")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var response = await _accountService.SendOtpAsync(userId);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpPost("change-password-with-otp")]
        public async Task<IActionResult> ChangePasswordWithOtpAsync(ChangePasswordWithOtpRequestDTO request)
        {
            var userId = User.FindFirst("uid")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var response = await _accountService.ChangePasswordWithOtpAsync(userId, request);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpPut("username")]
        public async Task<IActionResult> UpdateUsernameAsync(UpdateUsernameRequestDTO request)
        {
            var userId = User.FindFirst("uid")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var response = await _accountService.UpdateUsernameAsync(userId, request);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfileAsync([FromBody] UpdateProfileRequestDTO request, CancellationToken ct)
        {
            var userId = User.FindFirst("uid")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            request ??= new UpdateProfileRequestDTO();
            var response = await _accountService.UpdateProfileAsync(userId, request, ct);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpPost("delete-with-otp")]
        public async Task<IActionResult> DeleteAccountWithOtpAsync(DeleteAccountWithOtpRequestDTO request)
        {
            var userId = User.FindFirst("uid")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var response = await _accountService.DeleteAccountWithOtpAsync(userId, request);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> MeAsync()
        {
            var userId = User.FindFirst("uid")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var response = await _accountService.GetMeAsync(userId);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpPost("logo")]
        [RequestSizeLimit(50 * 1024 * 1024)]
        public async Task<IActionResult> UploadLogoAsync([FromForm] IFormFile file, CancellationToken ct)
        {
            var userId = User.FindFirst("uid")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            if (file == null || file.Length <= 0)
                return StatusCode(400, APIResponse<UploadLogoResponseDTO>.Error("File is required", 400));
            if (_s3Settings.MaxLogoBytes > 0 && file.Length > _s3Settings.MaxLogoBytes)
                return StatusCode(413, APIResponse<UploadLogoResponseDTO>.Error($"File is too large. Max {_s3Settings.MaxLogoBytes} bytes", 413));
            var allowed = new[]
            {
                "image/png",
                "image/jpeg",
                "image/webp",
                "image/gif"
            };
            if (string.IsNullOrWhiteSpace(file.ContentType) || !allowed.Contains(file.ContentType.ToLowerInvariant()))
                return StatusCode(400, APIResponse<UploadLogoResponseDTO>.Error("Only PNG/JPEG/WEBP/GIF are allowed", 400));
            await using var stream = file.OpenReadStream();
            var response = await _accountService.UploadLogoAsync(userId, stream, file.ContentType, file.FileName, file.Length, ct);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize]
        [HttpDelete("logo")]
        public async Task<IActionResult> DeleteLogoAsync(CancellationToken ct)
        {
            var userId = User.FindFirst("uid")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var response = await _accountService.DeleteLogoAsync(userId, ct);
            return StatusCode(response.StatusCode, response);
        }
    }
}
