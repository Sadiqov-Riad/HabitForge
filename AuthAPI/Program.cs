using AuthAPI.Application.Services.Classes;
using AuthAPI.Application.Services.Interfaces;
using AuthAPI.Application.Services.Utils;
using AuthAPI.Infrastructure.Contexts;
using AuthAPI.Infrastructure.MappingConfigurations;
using AuthAPI.Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IO;
using System.Text.RegularExpressions;
using Scalar.AspNetCore;
using DotNetEnv;
using Habit.Infrastructure.DependencyInjection;
using Habit.Presentation.Controllers;
using Habit.Infrastructure.Contexts;

var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
if (File.Exists(envPath))
{
    Env.Load(envPath);
}
else
{
    var parentEnvPath = Path.Combine(Directory.GetCurrentDirectory(), "..", ".env");
    if (File.Exists(parentEnvPath))
    {
        Env.Load(parentEnvPath);
    }
}

var builder = WebApplication.CreateBuilder(args);

var railwayPort = Environment.GetEnvironmentVariable("PORT");
var aspnetcoreUrls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
if (!string.IsNullOrWhiteSpace(railwayPort)
    && string.IsNullOrWhiteSpace(aspnetcoreUrls)
    && int.TryParse(railwayPort, out var port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var safeConnectionString = connectionString is null
    ? null
    : Regex.Replace(connectionString, @"Password=[^;]*", "Password=***", RegexOptions.IgnoreCase);
Console.WriteLine($"[DEBUG] DefaultConnection: {safeConnectionString}");
builder.Services.AddCors(options =>
{
    static string NormalizeOrigin(string origin)
    {
        var trimmed = origin.Trim();
        if (trimmed.Length >= 2)
        {
            var first = trimmed[0];
            var last = trimmed[^1];
            var isQuoted = (first == '"' && last == '"') || (first == '\'' && last == '\'');
            if (isQuoted)
            {
                trimmed = trimmed[1..^1].Trim();
            }
        }
        while (trimmed.EndsWith("/", StringComparison.Ordinal))
        {
            trimmed = trimmed[..^1];
        }
        return trimmed;
    }

    var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
        ?.Where(o => !string.IsNullOrWhiteSpace(o))
        .Select(NormalizeOrigin)
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray()
        ?? Array.Empty<string>();

    if (configuredOrigins.Length > 0)
    {
        Console.WriteLine($"[INFO] CORS allowed origins: {string.Join(", ", configuredOrigins)}");
    }

    var allowAnyOrigin = builder.Configuration.GetValue<bool>("Cors:AllowAnyOrigin");
    var defaultDevOrigins = new[]
    {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    };

    options.AddPolicy("DefaultCors", policy =>
    {
        if (allowAnyOrigin)
        {
            Console.WriteLine("[WARN] Cors:AllowAnyOrigin=true. This is not recommended for production.");
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
            return;
        }

        var allowedOrigins = configuredOrigins.Length > 0
            ? configuredOrigins
            : (builder.Environment.IsDevelopment() ? defaultDevOrigins : Array.Empty<string>());

        if (allowedOrigins.Length == 0)
        {
            Console.WriteLine("[WARN] No CORS origins configured. Set Cors__AllowedOrigins__0=https://<frontend-domain> in environment variables.");
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed(_ => false);
            return;
        }

        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddCookie().AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
{
    options.ClientId = builder.Configuration.GetSection("GoogleKeys:ClientId").Value;
    options.ClientSecret = builder.Configuration.GetSection("GoogleKeys:ClientSecret").Value;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]))
    };
});
builder.Services.AddControllers().AddApplicationPart(typeof(HabitController).Assembly);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IOAuthService, OAuthService>();
builder.Services.AddScoped<IUserLogoService, S3UserLogoService>();
builder.Services.AddScoped<TokenManager>();
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
builder.Services.Configure<S3Settings>(builder.Configuration.GetSection("AWS:S3"));
builder.Services.AddSingleton<EmailSender>();
builder.Services.AddDbContext<UserDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddHttpClient();
builder.Services.AddHabitModule(builder.Configuration);
var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var userDb = services.GetRequiredService<UserDbContext>();
        userDb.Database.Migrate();
        var habitDb = services.GetRequiredService<HabitDbContext>();
        habitDb.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[WARN] Failed to apply migrations: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference();
    }
}
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseCors("DefaultCors");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
