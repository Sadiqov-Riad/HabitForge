using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Habit.Domain.Entities;

namespace Habit.Infrastructure.Configurations;

public class AIRequestConfiguration : IEntityTypeConfiguration<AIRequest>
{
    public void Configure(EntityTypeBuilder<AIRequest> builder)
    {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).IsRequired();
        builder.Property(r => r.UserId).IsRequired();
        builder.Property(r => r.FunctionType).IsRequired().HasMaxLength(50);
        builder.Property(r => r.InputData).IsRequired();
        builder.Property(r => r.ModelName).HasMaxLength(100);
        builder.Property(r => r.Prompt).HasMaxLength(10000);
        builder.Property(r => r.CreatedAt).IsRequired();

        builder.HasOne(r => r.Habit)
            .WithMany(h => h.AIRequests)
            .HasForeignKey(r => r.HabitId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(r => r.Response)
            .WithOne(res => res.Request)
            .HasForeignKey<AIResponse>(res => res.RequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(r => r.UserId);
        builder.HasIndex(r => r.HabitId);
        builder.HasIndex(r => r.FunctionType);
        builder.HasIndex(r => r.CreatedAt);
    }
}


