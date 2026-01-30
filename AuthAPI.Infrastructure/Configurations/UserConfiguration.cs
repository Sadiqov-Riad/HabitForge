using AuthAPI.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AuthAPI.Infrastructure.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder) { 
            builder.HasKey(x => x.Id);

            var username = builder.Property(x => x.Username);
            username.HasMaxLength(25);

            var name = builder.Property(x => x.Name);
            name.HasMaxLength(50);

            var surname = builder.Property(x => x.Surname);
            surname.HasMaxLength(50);
            
            var email = builder.Property(x => x.Email);
            email.IsRequired();
            email.HasMaxLength(255);

            var password = builder.Property(x => x.Password);

            var createdAt = builder.Property(x => x.CreatedAt);
            createdAt.IsRequired();
            createdAt.HasDefaultValueSql("timezone('utc', now())");
        }
    }
}
