using AuthAPI.Application.Services.Interfaces;
using AuthAPI.Contracts.DTOs.Request;
using Microsoft.AspNetCore.Mvc;

namespace AuthAPI.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OAuthController : ControllerBase
    {
        private readonly IOAuthService _oAuthService;
        private readonly string _frontendBaseUrl;

        public OAuthController(IOAuthService oAuthService, IConfiguration configuration)
        {
            _oAuthService = oAuthService;
            var raw = configuration["Frontend:BaseUrl"] ?? "http://localhost:5174/";
            _frontendBaseUrl = raw.EndsWith("/") ? raw : raw + "/";
        }

        [HttpGet("google-auth-url")]
        public async Task<IActionResult> GetGoogleAuthUrl()
        {
            var response = await _oAuthService.GetGoogleAuthUrlAsync();
            return Ok(response);
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback([FromQuery] string? code, [FromQuery] string? error, [FromQuery] string? error_description)
        {
            if (!string.IsNullOrWhiteSpace(error) || string.IsNullOrWhiteSpace(code))
            {
                var reason = string.IsNullOrWhiteSpace(error) ? "missing_code" : error;
                return Redirect($"{_frontendBaseUrl}login?oauth=failed&reason={Uri.EscapeDataString(reason)}");
            }

            var requestDto = new GoogleAuthCodeRequestDTO
            {
                Code = code
            };
            var response = await _oAuthService.LoginWithGoogleCodeAsync(requestDto);
            return Redirect($"{_frontendBaseUrl}?accessToken={response.AccessToken}&refreshToken={response.RefreshToken}&isNewUser={response.IsNewUser.ToString().ToLower()}");
        }
    }
}
