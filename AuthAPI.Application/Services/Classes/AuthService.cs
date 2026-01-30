using AuthAPI.Application.Constants.AuthAPI.Application.Enums;
using AuthAPI.Application.Enums;
using AuthAPI.Application.Services.Interfaces;
using AuthAPI.Application.Services.Utils;
using AuthAPI.Contracts.DTOs.Request;
using AuthAPI.Contracts.DTOs.Response;
using AuthAPI.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using static BCrypt.Net.BCrypt;

namespace AuthAPI.Application.Services.Classes
{
    public class AuthService : IAuthService
    {
        private readonly UserDbContext _context;
        private readonly TokenManager _tokenManager;
        public AuthService(UserDbContext context, TokenManager tokenManager)
        {
            _context = context;
            _tokenManager = tokenManager;
        }

        public async Task<APIResponse<RefreshTokenResponse>> LoginAsync(LoginRequestDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return APIResponse<RefreshTokenResponse>.Error("Email and Password are required", 400);
            }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
            if (user == null || Verify(request.Password, user.Password) == false)
            {
                var error = ErrorCode.InvalidUsernameOrPassword.GetErrorDetail();
                return APIResponse<RefreshTokenResponse>.Error(error.Message, error.StatusCode);
            }

            var userRoles = await _context.UserRoles.Where(ur => ur.UserId == user.Id).Include(ur => ur.Role).Select(ur => ur.Role.Name).ToListAsync();
            var accessToken = await _tokenManager.GenerateAccessTokenAsync(user, userRoles);
            var refreshToken = user.RefreshToken;
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                refreshToken = await _tokenManager.GenerateRefreshTokenAsync();
                user.RefreshToken = refreshToken;
            }

            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddYears(100);
            await _context.SaveChangesAsync();
            var response = RefreshTokenResponse.Create(accessToken, refreshToken!);
            return APIResponse<RefreshTokenResponse>.Success(response, "Successfully logged in");
        }

        public async Task<APIResponse<RefreshTokenResponse>> RefreshAsync(RefreshTokenRequestDTO request, string? accessToken = null)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                return APIResponse<RefreshTokenResponse>.Error("RefreshToken is required", 400);
            }

            return await _tokenManager.RefreshAccessTokenAsync(request.RefreshToken, accessToken);
        }
    }
}
