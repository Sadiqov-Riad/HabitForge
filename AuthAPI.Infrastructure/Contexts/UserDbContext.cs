using AuthAPI.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AuthAPI.Infrastructure.Contexts
{
    public class UserDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserOtp> UserOtps { get; set; }
        
        public UserDbContext(DbContextOptions<DbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
