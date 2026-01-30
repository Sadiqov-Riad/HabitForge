using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Habit.Domain.Entities;

namespace Habit.Infrastructure.Configurations;
public class HabitConfiguration : IEntityTypeConfiguration<Domain.Entities.Habit>
{
    public void Configure(EntityTypeBuilder<Domain.Entities.Habit> builder)
    {
        builder.HasKey(h => h.Id);
        builder.Property(h => h.Id).IsRequired();
        builder.Property(h => h.UserId).IsRequired();
        builder.Property(h => h.Action).IsRequired().HasMaxLength(200);
        builder.Property(h => h.Frequency).IsRequired().HasMaxLength(100);
        builder.Property(h => h.Description).IsRequired().HasMaxLength(4000);
        builder.Property(h => h.ProgramDays);
        builder.Property(h => h.Time).HasMaxLength(100);
        builder.Property(h => h.Goal).HasMaxLength(300);
        builder.Property(h => h.Unit).HasMaxLength(50);
        builder.Property(h => h.Quantity);
        builder.Property(h => h.Category).HasMaxLength(50);
        builder.Property(h => h.Duration).HasMaxLength(100);
        builder.Property(h => h.Priority).HasMaxLength(20);
        builder.Property(h => h.ScheduleDays);
        builder.Property(h => h.ScheduleTimes);
        builder.Property(h => h.CurrentStreak).IsRequired();
        builder.Property(h => h.BestStreak).IsRequired();
        builder.Property(h => h.CompletionRate).IsRequired();
        builder.Property(h => h.TotalCompletions).IsRequired();
        builder.Property(h => h.DaysTracked).IsRequired();
        builder.Property(h => h.IsActive).IsRequired();
        builder.Property(h => h.CreatedAt).IsRequired();
        builder.HasMany(h => h.Completions).WithOne(c => c.Habit).HasForeignKey(c => c.HabitId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(h => h.AIRequests).WithOne(r => r.Habit).HasForeignKey(r => r.HabitId).OnDelete(DeleteBehavior.SetNull);
        builder.HasMany(h => h.PlanDays).WithOne(p => p.Habit).HasForeignKey(p => p.HabitId).OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(h => h.UserId);
        builder.HasIndex(h => new { h.UserId, h.IsActive });
    }
}
