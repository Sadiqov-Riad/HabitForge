using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Habit.Domain.Entities;

namespace Habit.Infrastructure.Configurations;

public class AIResponseConfiguration : IEntityTypeConfiguration<AIResponse>
{
    public void Configure(EntityTypeBuilder<AIResponse> builder)
    {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).IsRequired();
        builder.Property(r => r.RequestId).IsRequired();
        builder.Property(r => r.RawResponse).IsRequired();
        builder.Property(r => r.ParsedResponse).IsRequired();
        builder.Property(r => r.Success).IsRequired();
        builder.Property(r => r.DurationSeconds).IsRequired();
        builder.Property(r => r.ErrorMessage).HasMaxLength(1000);
        builder.Property(r => r.CreatedAt).IsRequired();

        builder.HasOne(r => r.Request)
            .WithOne(req => req.Response)
            .HasForeignKey<AIResponse>(r => r.RequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(r => r.RequestId).IsUnique();
        builder.HasIndex(r => r.CreatedAt);
    }
}


