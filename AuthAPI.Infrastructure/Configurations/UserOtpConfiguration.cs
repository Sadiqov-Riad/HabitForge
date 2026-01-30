using AuthAPI.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace AuthAPI.Infrastructure.Configurations
{
    public class UserOtpConfiguration : IEntityTypeConfiguration<UserOtp>
    {
        public void Configure(EntityTypeBuilder<UserOtp> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.UserId).IsRequired();
            builder.Property(x => x.OtpHash).IsRequired().HasMaxLength(64);
            builder.Property(x => x.CreatedAt).IsRequired();
            builder.Property(x => x.ExpiresAt).IsRequired();
            builder.Property(x => x.IsUsed).IsRequired();

            builder.HasOne(x => x.User)
                   .WithMany(u => u.UserOtps)
                   .HasForeignKey(x => x.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => new { x.UserId, x.IsUsed, x.ExpiresAt });
        }
    }
}
