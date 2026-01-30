using AuthAPI.Application.Services.Interfaces;
using AuthAPI.Contracts.DTOs.Request;
using AuthAPI.Contracts.DTOs.Response;
using AuthAPI.Data.Models;
using AuthAPI.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AuthAPI.Application.Enums;
using AuthAPI.Application.Constants.AuthAPI.Application.Enums;
using AuthAPI.Application.Services.Utils;
using static BCrypt.Net.BCrypt;
using System.Collections.Generic;

namespace AuthAPI.Application.Services.Classes
{
    public class AccountService : IAccountService
    {
        private readonly UserDbContext _context;
        private readonly IMapper _mapper;
        private readonly EmailSender _emailSender;
        private readonly IUserLogoService _userLogoService;
        public AccountService(UserDbContext context, IMapper mapper, EmailSender emailSender, IUserLogoService userLogoService)
        {
            _context = context;
            _mapper = mapper;
            _emailSender = emailSender;
            _userLogoService = userLogoService;
        }

        public async Task<APIResponse<object>> RegisterAsync(RegisterRequestDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                var error = ErrorCode.EmailAndPasswordRequired.GetErrorDetail();
                return APIResponse<object>.Error(error.Message, error.StatusCode);
            }

            if (request.Password != request.ConfirmPassword)
            {
                var error = ErrorCode.PasswordsDoNotMatch.GetErrorDetail();
                return APIResponse<object>.Error(error.Message, error.StatusCode);
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                var error = ErrorCode.UserAlreadyExistsByEmail.GetErrorDetail();
                return APIResponse<object>.Error(error.Message, error.StatusCode);
            }

            var addUser = _mapper.Map<User>(request);
            addUser.CreatedAt = DateTime.UtcNow;
            await _context.Users.AddAsync(addUser);
            await _context.SaveChangesAsync();
            string otp = OTPGenerator.GenerateOtp();
            var otpDto = new GenerateOtpRequestDTO
            {
                UserId = addUser.Id,
                Otp = otp
            };
            var userOtp = _mapper.Map<UserOtp>(otpDto);
            await _context.UserOtps.AddAsync(userOtp);
            await _context.SaveChangesAsync();
            string templatePath = Path.Combine(AppContext.BaseDirectory, "EmailTemplates", "Noreply", "OTPTemplate.html");
            string htmlTemplate = await File.ReadAllTextAsync(templatePath);
            string htmlBody = htmlTemplate.Replace("{OTP}", otp);
            await _emailSender.SendEmailAsync(addUser.Email, "Your OTP Code", htmlBody);
            return APIResponse<object>.Success(new { addUser.Email, addUser.Id, addUser.Username }, "Registration successful. Check your email for the OTP code.");
        }

        public async Task<APIResponse<object>> VerifyOtpAsync(VerifyOtpRequestDTO request)
        {
            var userOtp = await _context.UserOtps.Where(x => x.UserId == request.UserId && !x.IsUsed).OrderByDescending(x => x.CreatedAt).FirstOrDefaultAsync();
            if (userOtp == null)
                return APIResponse<object>.Error("OTP not found", 400);
            if (userOtp.ExpiresAt < DateTime.UtcNow)
                return APIResponse<object>.Error("OTP expired", 400);
            if (!BCrypt.Net.BCrypt.Verify(request.Otp, userOtp.OtpHash))
                return APIResponse<object>.Error("Incorrect OTP", 400);
            userOtp.IsUsed = true;
            var user = await _context.Users.FindAsync(request.UserId);
            if (user != null)
                user.IsEmailConfirmed = true;
            await _context.SaveChangesAsync();
            if (user != null)
            {
                await TrySendTemplateEmailAsync(user.Email, "Email confirmed", "WelcomeTemplate.html", new Dictionary<string, string> { { "{USERNAME}", string.IsNullOrWhiteSpace(user.Username) ? "there" : user.Username } });
            }

            return APIResponse<object>.Success(null, "Email confirmed successfully");
        }

        public async Task<APIResponse<object>> SetPasswordAsync(string userId, SetPasswordRequestDTO request)
        {
            if (request.NewPassword != request.ConfirmPassword)
                return APIResponse<object>.Error("Passwords do not match", 400);
            if (string.IsNullOrWhiteSpace(request.NewPassword))
                return APIResponse<object>.Error("New password is required", 400);
            if (request.NewPassword.Length < 8)
                return APIResponse<object>.Error("Password must be at least 8 characters long", 400);
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return APIResponse<object>.Error("User not found", 404);
            if (!string.IsNullOrWhiteSpace(user.Password) && Verify(request.NewPassword, user.Password))
                return APIResponse<object>.Error("New password must be different from the current password", 400);
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();
            await TrySendTemplateEmailAsync(user.Email, "Your password was set", "PasswordChangedTemplate.html", new Dictionary<string, string> { { "{DATE}", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm 'UTC'") } });
            return APIResponse<object>.Success(null, "Password set successfully");
        }

        public async Task<APIResponse<object>> SendOtpAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return APIResponse<object>.Error("User not found", 404);
            if (string.IsNullOrWhiteSpace(user.Email))
                return APIResponse<object>.Error("User email not found", 400);
            string otp = OTPGenerator.GenerateOtp();
            var otpDto = new GenerateOtpRequestDTO
            {
                UserId = user.Id,
                Otp = otp
            };
            var userOtp = _mapper.Map<UserOtp>(otpDto);
            await _context.UserOtps.AddAsync(userOtp);
            await _context.SaveChangesAsync();
            string templatePath = Path.Combine(AppContext.BaseDirectory, "EmailTemplates", "Noreply", "OTPTemplate.html");
            string htmlTemplate = await File.ReadAllTextAsync(templatePath);
            string htmlBody = htmlTemplate.Replace("{OTP}", otp);
            await _emailSender.SendEmailAsync(user.Email, "Your OTP Code", htmlBody);
            return APIResponse<object>.Success(null, "OTP sent successfully");
        }

        private async Task<APIResponse<UserOtp>> ValidateLatestOtpAsync(string userId, string otp)
        {
            var userOtp = await _context.UserOtps.Where(x => x.UserId == userId && !x.IsUsed).OrderByDescending(x => x.CreatedAt).FirstOrDefaultAsync();
            if (userOtp == null)
                return APIResponse<UserOtp>.Error("OTP not found", 400);
            if (userOtp.ExpiresAt < DateTime.UtcNow)
                return APIResponse<UserOtp>.Error("OTP expired", 400);
            if (!Verify(otp, userOtp.OtpHash))
                return APIResponse<UserOtp>.Error("Incorrect OTP", 400);
            return APIResponse<UserOtp>.Success(userOtp, "OTP verified");
        }

        public async Task<APIResponse<object>> ChangePasswordWithOtpAsync(string userId, ChangePasswordWithOtpRequestDTO request)
        {
            if (request.NewPassword != request.ConfirmPassword)
                return APIResponse<object>.Error("Passwords do not match", 400);
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
                return APIResponse<object>.Error("Password must be at least 8 characters long", 400);
            if (string.IsNullOrWhiteSpace(request.Otp))
                return APIResponse<object>.Error("OTP is required", 400);
            var otpCheck = await ValidateLatestOtpAsync(userId, request.Otp);
            if (!otpCheck.IsSuccess || otpCheck.Data == null)
                return APIResponse<object>.Error(otpCheck.Message, otpCheck.StatusCode);
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return APIResponse<object>.Error("User not found", 404);
            if (!string.IsNullOrWhiteSpace(user.Password) && Verify(request.NewPassword, user.Password))
                return APIResponse<object>.Error("New password must be different from the current password", 400);
            user.Password = HashPassword(request.NewPassword);
            otpCheck.Data.IsUsed = true;
            await _context.SaveChangesAsync();
            await TrySendTemplateEmailAsync(user.Email, "Your password was changed", "PasswordChangedTemplate.html", new Dictionary<string, string> { { "{DATE}", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm 'UTC'") } });
            return APIResponse<object>.Success(null, "Password changed successfully");
        }

        public async Task<APIResponse<object>> SendForgotPasswordOtpAsync(ForgotPasswordRequestDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return APIResponse<object>.Error("Email is required", 400);
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
            if (user == null)
                return APIResponse<object>.Error("User not found", 404);
            return await SendOtpAsync(user.Id);
        }

        public async Task<APIResponse<object>> VerifyForgotPasswordOtpAsync(VerifyForgotPasswordOtpRequestDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return APIResponse<object>.Error("Email is required", 400);
            if (string.IsNullOrWhiteSpace(request.Otp))
                return APIResponse<object>.Error("OTP is required", 400);
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
            if (user == null)
                return APIResponse<object>.Error("User not found", 404);
            var otpCheck = await ValidateLatestOtpAsync(user.Id, request.Otp);
            if (!otpCheck.IsSuccess || otpCheck.Data == null)
                return APIResponse<object>.Error(otpCheck.Message, otpCheck.StatusCode);
            return APIResponse<object>.Success(null, "OTP verified");
        }

        public async Task<APIResponse<object>> ResetPasswordWithOtpAsync(ResetPasswordWithOtpRequestDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return APIResponse<object>.Error("Email is required", 400);
            if (string.IsNullOrWhiteSpace(request.Otp))
                return APIResponse<object>.Error("OTP is required", 400);
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
            if (user == null)
                return APIResponse<object>.Error("User not found", 404);
            var changeRequest = new ChangePasswordWithOtpRequestDTO
            {
                Otp = request.Otp,
                NewPassword = request.NewPassword,
                ConfirmPassword = request.ConfirmPassword
            };
            return await ChangePasswordWithOtpAsync(user.Id, changeRequest);
        }

        public async Task<APIResponse<object>> UpdateUsernameAsync(string userId, UpdateUsernameRequestDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Username))
                return APIResponse<object>.Error("Username is required", 400);
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return APIResponse<object>.Error("User not found", 404);
            user.Username = request.Username.Trim();
            await _context.SaveChangesAsync();
            return APIResponse<object>.Success(new { user.Username, user.Email }, "Username updated successfully");
        }

        public async Task<APIResponse<object>> DeleteAccountWithOtpAsync(string userId, DeleteAccountWithOtpRequestDTO request)
        {
            var otpCheck = await ValidateLatestOtpAsync(userId, request.Otp);
            if (!otpCheck.IsSuccess || otpCheck.Data == null)
                return APIResponse<object>.Error(otpCheck.Message, otpCheck.StatusCode);
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return APIResponse<object>.Error("User not found", 404);
            otpCheck.Data.IsUsed = true;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return APIResponse<object>.Success(null, "Account deleted successfully");
        }

        public async Task<APIResponse<CurrentUserResponseDTO>> GetMeAsync(string userId)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
                return APIResponse<CurrentUserResponseDTO>.Error("User not found", 404);
            var logoUrl = await _userLogoService.GetPresignedReadUrlAsync(user.LogoKey);
            var dto = new CurrentUserResponseDTO
            {
                Email = user.Email,
                Username = user.Username ?? "user",
                Name = user.Name,
                Surname = user.Surname,
                CreatedAt = user.CreatedAt,
                LogoUrl = logoUrl
            };
            return APIResponse<CurrentUserResponseDTO>.Success(dto, "OK");
        }

        public async Task<APIResponse<UploadLogoResponseDTO>> UploadLogoAsync(string userId, Stream content, string contentType, string originalFileName, long contentLength, CancellationToken ct = default)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId, ct);
            if (user == null)
                return APIResponse<UploadLogoResponseDTO>.Error("User not found", 404);
            var oldKey = user.LogoKey;
            var key = await _userLogoService.UploadUserLogoAsync(userId, user.Email, originalFileName, content, contentType, contentLength, ct);
            user.LogoKey = key;
            user.LogoUrl = _userLogoService.BuildS3Uri(key);
            await _context.SaveChangesAsync(ct);
            if (!string.IsNullOrWhiteSpace(oldKey) && oldKey != key)
            {
                await _userLogoService.DeleteAsync(oldKey, ct);
            }

            var presigned = await _userLogoService.GetPresignedReadUrlAsync(key, ct);
            return APIResponse<UploadLogoResponseDTO>.Success(new UploadLogoResponseDTO { LogoUrl = presigned ?? string.Empty }, "Logo updated");
        }

        public async Task<APIResponse<object>> DeleteLogoAsync(string userId, CancellationToken ct = default)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId, ct);
            if (user == null)
                return APIResponse<object>.Error("User not found", 404);
            var oldKey = user.LogoKey;
            user.LogoKey = null;
            user.LogoUrl = null;
            await _context.SaveChangesAsync(ct);
            if (!string.IsNullOrWhiteSpace(oldKey))
                await _userLogoService.DeleteAsync(oldKey, ct);
            return APIResponse<object>.Success(null, "Logo removed");
        }

        public async Task<APIResponse<CurrentUserResponseDTO>> UpdateProfileAsync(string userId, UpdateProfileRequestDTO request, CancellationToken ct = default)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId, ct);
            if (user == null)
                return APIResponse<CurrentUserResponseDTO>.Error("User not found", 404);
            var name = request.Name?.Trim();
            var surname = request.Surname?.Trim();
            if (name != null && name.Length > 50)
                return APIResponse<CurrentUserResponseDTO>.Error("Name is too long (max 50)", 400);
            if (surname != null && surname.Length > 50)
                return APIResponse<CurrentUserResponseDTO>.Error("Surname is too long (max 50)", 400);
            if (request.Name != null)
                user.Name = string.IsNullOrWhiteSpace(name) ? null : name;
            if (request.Surname != null)
                user.Surname = string.IsNullOrWhiteSpace(surname) ? null : surname;
            await _context.SaveChangesAsync(ct);
            var logoUrl = await _userLogoService.GetPresignedReadUrlAsync(user.LogoKey, ct);
            var dto = new CurrentUserResponseDTO
            {
                Email = user.Email,
                Username = user.Username ?? "user",
                Name = user.Name,
                Surname = user.Surname,
                CreatedAt = user.CreatedAt,
                LogoUrl = logoUrl
            };
            return APIResponse<CurrentUserResponseDTO>.Success(dto, "Profile updated");
        }

        private async Task TrySendTemplateEmailAsync(string? toEmail, string subject, string templateFileName, Dictionary<string, string> tokens)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(toEmail))
                    return;
                string templatePath = Path.Combine(AppContext.BaseDirectory, "EmailTemplates", "Noreply", templateFileName);
                string htmlTemplate = await File.ReadAllTextAsync(templatePath);
                foreach (var token in tokens)
                {
                    htmlTemplate = htmlTemplate.Replace(token.Key, token.Value ?? string.Empty);
                }

                await _emailSender.SendEmailAsync(toEmail, subject, htmlTemplate);
            }
            catch
            {
            }
        }
    }
}
