using System;
using AuthAPI.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable
namespace AuthAPI.Infrastructure.Migrations
{
    [DbContext(typeof(UserDbContext))]
    [Migration("20260125030726_AddUserLogoFields")]
    partial class AddUserLogoFields
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.9").HasAnnotation("Relational:MaxIdentifierLength", 63);
            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);
            modelBuilder.Entity("AuthAPI.Data.Models.Role", b =>
            {
                b.Property<string>("Id").HasColumnType("text");
                b.Property<string>("Name").IsRequired().HasColumnType("text");
                b.HasKey("Id");
                b.ToTable("Roles");
            });
            modelBuilder.Entity("AuthAPI.Data.Models.User", b =>
            {
                b.Property<string>("Id").HasColumnType("text");
                b.Property<DateTime>("CreatedAt").ValueGeneratedOnAdd().HasColumnType("timestamp with time zone").HasDefaultValueSql("timezone('utc', now())");
                b.Property<string>("Email").IsRequired().HasMaxLength(255).HasColumnType("character varying(255)");
                b.Property<bool>("IsEmailConfirmed").HasColumnType("boolean");
                b.Property<string>("LogoKey").HasColumnType("text");
                b.Property<string>("LogoUrl").HasColumnType("text");
                b.Property<string>("Name").HasMaxLength(50).HasColumnType("character varying(50)");
                b.Property<string>("Password").HasColumnType("text");
                b.Property<string>("Provider").HasColumnType("text");
                b.Property<string>("ProviderId").HasColumnType("text");
                b.Property<string>("RefreshToken").HasColumnType("text");
                b.Property<DateTime?>("RefreshTokenExpiryTime").HasColumnType("timestamp with time zone");
                b.Property<string>("Surname").HasMaxLength(50).HasColumnType("character varying(50)");
                b.Property<string>("Username").HasMaxLength(25).HasColumnType("character varying(25)");
                b.HasKey("Id");
                b.ToTable("Users");
            });
            modelBuilder.Entity("AuthAPI.Data.Models.UserOtp", b =>
            {
                b.Property<string>("Id").HasColumnType("text");
                b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
                b.Property<DateTime>("ExpiresAt").HasColumnType("timestamp with time zone");
                b.Property<bool>("IsUsed").HasColumnType("boolean");
                b.Property<string>("OtpHash").IsRequired().HasMaxLength(64).HasColumnType("character varying(64)");
                b.Property<string>("UserId").IsRequired().HasColumnType("text");
                b.HasKey("Id");
                b.HasIndex("UserId", "IsUsed", "ExpiresAt");
                b.ToTable("UserOtps");
            });
            modelBuilder.Entity("AuthAPI.Data.Models.UserRole", b =>
            {
                b.Property<string>("UserId").HasColumnType("text");
                b.Property<string>("RoleId").HasColumnType("text");
                b.HasKey("UserId", "RoleId");
                b.HasIndex("RoleId");
                b.ToTable("UserRoles");
            });
            modelBuilder.Entity("AuthAPI.Data.Models.UserOtp", b =>
            {
                b.HasOne("AuthAPI.Data.Models.User", "User").WithMany("UserOtps").HasForeignKey("UserId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.Navigation("User");
            });
            modelBuilder.Entity("AuthAPI.Data.Models.UserRole", b =>
            {
                b.HasOne("AuthAPI.Data.Models.Role", "Role").WithMany("UserRoles").HasForeignKey("RoleId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.HasOne("AuthAPI.Data.Models.User", "User").WithMany("UserRoles").HasForeignKey("UserId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.Navigation("Role");
                b.Navigation("User");
            });
            modelBuilder.Entity("AuthAPI.Data.Models.Role", b =>
            {
                b.Navigation("UserRoles");
            });
            modelBuilder.Entity("AuthAPI.Data.Models.User", b =>
            {
                b.Navigation("UserOtps");
                b.Navigation("UserRoles");
            });
#pragma warning restore 612, 618
        }
    }
}
