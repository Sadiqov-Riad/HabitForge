using AuthAPI.Contracts.DTOs.Request;
using AuthAPI.Data.Models;
using AutoMapper;
using Google.Apis.Auth;
using static BCrypt.Net.BCrypt;


namespace AuthAPI.Infrastructure.MappingConfigurations
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterRequestDTO, User>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => HashPassword(src.Password)))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Surname, opt => opt.MapFrom(src => src.Surname))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.UserRoles, opt => opt.Ignore());

            CreateMap<GoogleJsonWebSignature.Payload, User>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.GivenName))
                .ForMember(dest => dest.Surname, opt => opt.MapFrom(src => src.FamilyName))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.GivenName + " " + src.FamilyName))
                .ForMember(dest => dest.Provider, opt => opt.MapFrom(src => "Google"))
                .ForMember(dest => dest.ProviderId, opt => opt.MapFrom(src => src.Subject))
                .ForMember(dest => dest.IsEmailConfirmed, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.Password, opt => opt.Ignore())
                .ForMember(dest => dest.RefreshToken, opt => opt.Ignore())
                .ForMember(dest => dest.RefreshTokenExpiryTime, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.UserRoles, opt => opt.Ignore());

            CreateMap<GenerateOtpRequestDTO, UserOtp>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.OtpHash, opt => opt.MapFrom(src => BCrypt.Net.BCrypt.HashPassword(src.Otp)))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.ExpiresAt, opt => opt.MapFrom(_ => DateTime.UtcNow.AddMinutes(10)))
                .ForMember(dest => dest.IsUsed, opt => opt.MapFrom(_ => false))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());
        }
    }
}
