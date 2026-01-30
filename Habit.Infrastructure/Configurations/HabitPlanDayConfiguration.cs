using Habit.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Habit.Infrastructure.Configurations;

public class HabitPlanDayConfiguration : IEntityTypeConfiguration<HabitPlanDay>
{
    public void Configure(EntityTypeBuilder<HabitPlanDay> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).IsRequired();
        builder.Property(x => x.HabitId).IsRequired();

        builder.Property(x => x.DayNumber).IsRequired();
        builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
        builder.Property(x => x.TasksJson).IsRequired().HasMaxLength(8000);

        builder.Property(x => x.IsCompleted).IsRequired();
        builder.Property(x => x.CompletedAt);

        builder.HasOne(x => x.Habit)
            .WithMany(h => h.PlanDays)
            .HasForeignKey(x => x.HabitId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.HabitId, x.DayNumber }).IsUnique();
        builder.HasIndex(x => x.HabitId);
    }
}


