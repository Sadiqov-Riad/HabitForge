using Microsoft.EntityFrameworkCore;
using System.Reflection;

using Habit.Domain.Entities;

namespace Habit.Infrastructure.Contexts;

public class HabitDbContext : DbContext
{
    public DbSet<Domain.Entities.Habit> Habits { get; set; } = null!;
    public DbSet<HabitCompletion> HabitCompletions { get; set; } = null!;
    public DbSet<HabitPlanDay> HabitPlanDays { get; set; } = null!;
    public DbSet<AIRequest> AIRequests { get; set; } = null!;
    public DbSet<AIResponse> AIResponses { get; set; } = null!;
    public DbSet<UserPreference> UserPreferences { get; set; } = null!;

    public HabitDbContext(DbContextOptions<HabitDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
        => modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
}


