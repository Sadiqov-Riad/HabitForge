using AuthAPI.Application.Services.Interfaces;
using AuthAPI.Contracts.DTOs.Request;
using Microsoft.AspNetCore.Mvc;

namespace AuthAPI.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> LoginAsync(LoginRequestDTO request)
        {
            return Ok(await _authService.LoginAsync(request));
        }

        [HttpPost("Refresh")]
        public async Task<IActionResult> RefreshAsync(RefreshTokenRequestDTO request)
        {
            string? accessToken = null;
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(authHeader) && authHeader.StartsWith("Bearer "))
            {
                accessToken = authHeader.Substring("Bearer ".Length).Trim();
            }

            var response = await _authService.RefreshAsync(request, accessToken);
            return StatusCode(response.StatusCode, response);
        }
    }
}
