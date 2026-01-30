using Habit.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Habit.Infrastructure.Configurations;

public class UserPreferenceConfiguration : IEntityTypeConfiguration<UserPreference>
{
    public void Configure(EntityTypeBuilder<UserPreference> builder)
    {
        builder.HasKey(x => x.UserId);
        builder.Property(x => x.UserId).IsRequired();
        builder.Property(x => x.EmailNotificationsEnabled).IsRequired();
        builder.Property(x => x.UpdatedAt).IsRequired();
    }
}

