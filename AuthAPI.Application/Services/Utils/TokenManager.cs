using AuthAPI.Application.Constants.AuthAPI.Application.Enums;
using AuthAPI.Application.Enums;
using AuthAPI.Contracts.DTOs.Response;
using AuthAPI.Data.Models;
using AuthAPI.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace AuthAPI.Application.Services.Utils
{
    public class TokenManager
    {
        private readonly IConfiguration _configuration;
        private readonly UserDbContext _context;
        public TokenManager(IConfiguration configuration, UserDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<string> GenerateAccessTokenAsync(User user, List<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim("username", user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("uid", user.Id)
            };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return await Task.Run(() =>
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("JWT:SecretKey").Value));
                var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                var tokenOptions = new JwtSecurityToken(issuer: _configuration["Jwt:Issuer"], audience: _configuration["Jwt:Audience"], claims: claims, expires: DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:AccessTokenExpiryMinutes"] ?? "15")), signingCredentials: signingCredentials);
                string tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                return tokenString;
            });
        }

        public async Task<string> GenerateRefreshTokenAsync()
        {
            return await Task.Run(() =>
            {
                var randomNumber = new byte[64];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(randomNumber);
                    return Convert.ToBase64String(randomNumber);
                }
            });
        }

        public async Task<APIResponse<RefreshTokenResponse>> RefreshAccessTokenAsync(string refreshToken, string? accessToken = null)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user == null && !string.IsNullOrWhiteSpace(accessToken))
            {
                try
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("JWT:SecretKey").Value));
                    var validationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = securityKey,
                        ValidateIssuer = true,
                        ValidIssuer = _configuration["Jwt:Issuer"],
                        ValidateAudience = true,
                        ValidAudience = _configuration["Jwt:Audience"],
                        ValidateLifetime = false
                    };
                    var principal = tokenHandler.ValidateToken(accessToken, validationParameters, out SecurityToken validatedToken);
                    var emailClaim = principal.FindFirst(ClaimTypes.Email)?.Value;
                    var userIdClaim = principal.FindFirst("uid")?.Value;
                    if (!string.IsNullOrWhiteSpace(emailClaim))
                    {
                        user = await _context.Users.FirstOrDefaultAsync(u => u.Email == emailClaim);
                    }
                    else if (!string.IsNullOrWhiteSpace(userIdClaim))
                    {
                        user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userIdClaim);
                    }

                    if (user != null)
                    {
                        var newRefreshToken = await GenerateRefreshTokenAsync();
                        user.RefreshToken = newRefreshToken;
                        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddYears(100);
                        await _context.SaveChangesAsync();
                        var userRoles = await _context.UserRoles.Where(ur => ur.UserId == user.Id).Select(ur => ur.Role.Name).ToListAsync();
                        var newAccessToken = await GenerateAccessTokenAsync(user, userRoles);
                        var response = RefreshTokenResponse.Create(newAccessToken, newRefreshToken);
                        return APIResponse<RefreshTokenResponse>.Success(response, "Access token refreshed (recovered session)");
                    }
                }
                catch
                {
                }
            }

            if (user == null)
            {
                var error = ErrorCode.InvalidRefreshToken.GetErrorDetail();
                return APIResponse<RefreshTokenResponse>.Error(error.Message, error.StatusCode);
            }

            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddYears(100);
            if (string.IsNullOrWhiteSpace(user.RefreshToken))
            {
                user.RefreshToken = await GenerateRefreshTokenAsync();
            }

            await _context.SaveChangesAsync();
            var userRolesNormal = await _context.UserRoles.Where(ur => ur.UserId == user.Id).Select(ur => ur.Role.Name).ToListAsync();
            var newAccessTokenNormal = await GenerateAccessTokenAsync(user, userRolesNormal);
            var responseNormal = RefreshTokenResponse.Create(newAccessTokenNormal, user.RefreshToken);
            return APIResponse<RefreshTokenResponse>.Success(responseNormal, "Access token refreshed");
        }
    }
}
