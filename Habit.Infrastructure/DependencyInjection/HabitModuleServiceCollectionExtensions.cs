using Habit.Application.Abstractions;
using Habit.Application.Interfaces;
using Habit.Application.Services;
using Habit.Infrastructure.Contexts;
using Habit.Infrastructure.Email;
using Habit.Infrastructure.HuggingFace;
using Habit.Infrastructure.Ollama;
using Habit.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Habit.Infrastructure.DependencyInjection;
public static class HabitModuleServiceCollectionExtensions
{
    public static IServiceCollection AddHabitModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<OllamaOptions>(configuration.GetSection("Ollama"));
        services.Configure<HuggingFaceOptions>(configuration.GetSection("HuggingFace"));
        services.Configure<SmtpEmailOptions>(configuration.GetSection("Email"));
        services.AddDbContext<HabitDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("HabitConnection")));
        services.AddScoped<IHabitRepository, HabitRepository>();
        services.AddScoped<IHabitCompletionRepository, HabitCompletionRepository>();
        services.AddScoped<IHabitPlanDayRepository, HabitPlanDayRepository>();
        services.AddScoped<IAIRequestRepository, AIRequestRepository>();
        services.AddScoped<IAIResponseRepository, AIResponseRepository>();
        services.AddScoped<IUserPreferenceRepository, UserPreferenceRepository>();
        services.AddScoped<IHabitUnitOfWork, HabitUnitOfWork>();
        services.AddHttpClient();
        services.AddScoped<IOllamaClient, HuggingFaceClient>();
        services.AddScoped<IEmailSender, SmtpEmailSender>();
        services.AddScoped<IHabitService, HabitService>();
        services.AddScoped<IHabitAIService, HabitAIService>();
        return services;
    }
}
