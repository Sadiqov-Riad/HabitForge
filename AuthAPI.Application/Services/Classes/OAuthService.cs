using AuthAPI.Application.Services.Interfaces;
using AuthAPI.Application.Services.Utils;
using AuthAPI.Contracts.DTOs.Request;
using AuthAPI.Contracts.DTOs.Response;
using AuthAPI.Data.Models;
using AuthAPI.Infrastructure.Contexts;
using AutoMapper;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace AuthAPI.Application.Services.Classes
{
    public class OAuthService : IOAuthService
    {
        private readonly UserDbContext _context;
        private readonly TokenManager _tokenManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public OAuthService(UserDbContext context, IMapper mapper, TokenManager tokenManager, IConfiguration config, HttpClient httpClient)
        {
            _context = context;
            _mapper = mapper;
            _tokenManager = tokenManager;
            _config = config;
            _httpClient = httpClient;
        }

        public Task<GoogleAuthUrlResponseDTO> GetGoogleAuthUrlAsync()
        {
            var clientId = _config["GoogleKeys:ClientId"];
            var redirectUri = _config["GoogleKeys:RedirectUri"];
            var scope = "openid email profile";

            if (string.IsNullOrEmpty(clientId) || clientId.Contains("YOUR_"))
            {
                throw new Exception("Google OAuth ClientId is not configured. Please set GoogleKeys__ClientId in .env file or appsettings.json");
            }

            var url = $"https://accounts.google.com/o/oauth2/v2/auth" +
                      $"?client_id={clientId}" +
                      $"&redirect_uri={redirectUri}" +
                      $"&response_type=code" +
                      $"&scope={scope}" +
                      $"&access_type=offline" +
                      $"&prompt=consent";

            return Task.FromResult(new GoogleAuthUrlResponseDTO { AuthUrl = url });
        }

        public async Task<GoogleLoginResponseDTO> LoginWithGoogleCodeAsync(GoogleAuthCodeRequestDTO request)
        {
            var clientId = _config["GoogleKeys:ClientId"];
            var clientSecret = _config["GoogleKeys:ClientSecret"];
            var redirectUri = _config["GoogleKeys:RedirectUri"];

            var tokenRequest = new Dictionary<string, string>
            {
                { "code", request.Code },
                { "client_id", clientId },
                { "client_secret", clientSecret },
                { "redirect_uri", redirectUri },
                { "grant_type", "authorization_code" }
            };

            var tokenResponse = await _httpClient.PostAsync(
                "https://oauth2.googleapis.com/token",
                new FormUrlEncodedContent(tokenRequest)
            );

            if (!tokenResponse.IsSuccessStatusCode)
            {
                var errorContent = await tokenResponse.Content.ReadAsStringAsync();
                throw new Exception($"Failed to exchange code for tokens. Status: {tokenResponse.StatusCode}, Response: {errorContent}");
            }

            var tokenJson = await tokenResponse.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(tokenJson);
            var idToken = doc.RootElement.GetProperty("id_token").GetString();

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);
            bool isNewUser = false;

            if (user == null)
            {
                user = _mapper.Map<User>(payload);
                user.Provider = "Google";
                user.CreatedAt = DateTime.UtcNow;
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                isNewUser = true;
            }
            else if (user.Provider != "Google")
            {
                user.Provider = "Google";
                await _context.SaveChangesAsync();
            }

            if (!isNewUser && string.IsNullOrEmpty(user.Password))
            {
                isNewUser = true;
            }

            var userRoles = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Select(ur => ur.Role.Name)
                .ToListAsync();

            var accessToken = await _tokenManager.GenerateAccessTokenAsync(user, userRoles);
            var refreshToken = user.RefreshToken;
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                refreshToken = await _tokenManager.GenerateRefreshTokenAsync();
                user.RefreshToken = refreshToken;
            }
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddYears(100);
            await _context.SaveChangesAsync();

            return new GoogleLoginResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken!,
                IsNewUser = isNewUser
            };
        }
    }
}
