using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Habit.Domain.Entities;

namespace Habit.Infrastructure.Configurations;

public class HabitCompletionConfiguration : IEntityTypeConfiguration<HabitCompletion>
{
    public void Configure(EntityTypeBuilder<HabitCompletion> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).IsRequired();
        builder.Property(c => c.HabitId).IsRequired();
        builder.Property(c => c.CompletedAt).IsRequired();
        builder.Property(c => c.Quantity);
        builder.Property(c => c.Notes).HasMaxLength(1000);

        builder.HasOne(c => c.Habit)
            .WithMany(h => h.Completions)
            .HasForeignKey(c => c.HabitId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => c.HabitId);
        builder.HasIndex(c => c.CompletedAt);
    }
}


