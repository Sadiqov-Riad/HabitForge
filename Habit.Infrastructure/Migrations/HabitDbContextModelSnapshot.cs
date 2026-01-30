using System;
using Habit.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable
namespace Habit.Infrastructure.Migrations
{
    [DbContext(typeof(HabitDbContext))]
    partial class HabitDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.9").HasAnnotation("Relational:MaxIdentifierLength", 63);
            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);
            modelBuilder.Entity("Habit.Domain.Entities.AIRequest", b =>
            {
                b.Property<string>("Id").HasColumnType("text");
                b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
                b.Property<string>("FunctionType").IsRequired().HasMaxLength(50).HasColumnType("character varying(50)");
                b.Property<string>("HabitId").HasColumnType("text");
                b.Property<string>("InputData").IsRequired().HasColumnType("text");
                b.Property<string>("ModelName").HasMaxLength(100).HasColumnType("character varying(100)");
                b.Property<string>("Prompt").HasMaxLength(10000).HasColumnType("character varying(10000)");
                b.Property<string>("UserId").IsRequired().HasColumnType("text");
                b.HasKey("Id");
                b.HasIndex("CreatedAt");
                b.HasIndex("FunctionType");
                b.HasIndex("HabitId");
                b.HasIndex("UserId");
                b.ToTable("AIRequests");
            });
            modelBuilder.Entity("Habit.Domain.Entities.AIResponse", b =>
            {
                b.Property<string>("Id").HasColumnType("text");
                b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
                b.Property<double>("DurationSeconds").HasColumnType("double precision");
                b.Property<string>("ErrorMessage").HasMaxLength(1000).HasColumnType("character varying(1000)");
                b.Property<string>("ParsedResponse").IsRequired().HasColumnType("text");
                b.Property<string>("RawResponse").IsRequired().HasColumnType("text");
                b.Property<string>("RequestId").IsRequired().HasColumnType("text");
                b.Property<bool>("Success").HasColumnType("boolean");
                b.HasKey("Id");
                b.HasIndex("CreatedAt");
                b.HasIndex("RequestId").IsUnique();
                b.ToTable("AIResponses");
            });
            modelBuilder.Entity("Habit.Domain.Entities.Habit", b =>
            {
                b.Property<string>("Id").HasColumnType("text");
                b.Property<string>("Action").IsRequired().HasMaxLength(200).HasColumnType("character varying(200)");
                b.Property<int>("BestStreak").HasColumnType("integer");
                b.Property<string>("Category").HasMaxLength(50).HasColumnType("character varying(50)");
                b.Property<double>("CompletionRate").HasColumnType("double precision");
                b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
                b.Property<int>("CurrentStreak").HasColumnType("integer");
                b.Property<int>("DaysTracked").HasColumnType("integer");
                b.Property<string>("Description").IsRequired().HasMaxLength(4000).HasColumnType("character varying(4000)");
                b.Property<string>("Duration").HasMaxLength(100).HasColumnType("character varying(100)");
                b.Property<string>("Frequency").IsRequired().HasMaxLength(100).HasColumnType("character varying(100)");
                b.Property<string>("Goal").HasMaxLength(300).HasColumnType("character varying(300)");
                b.Property<bool>("IsActive").HasColumnType("boolean");
                b.Property<string>("Priority").HasMaxLength(20).HasColumnType("character varying(20)");
                b.Property<int?>("ProgramDays").HasColumnType("integer");
                b.Property<double?>("Quantity").HasColumnType("double precision");
                b.Property<string>("ScheduleDays").HasColumnType("text");
                b.Property<string>("ScheduleTimes").HasColumnType("text");
                b.Property<string>("Time").HasMaxLength(100).HasColumnType("character varying(100)");
                b.Property<int>("TotalCompletions").HasColumnType("integer");
                b.Property<string>("Unit").HasMaxLength(50).HasColumnType("character varying(50)");
                b.Property<DateTime?>("UpdatedAt").HasColumnType("timestamp with time zone");
                b.Property<string>("UserId").IsRequired().HasColumnType("text");
                b.HasKey("Id");
                b.HasIndex("UserId");
                b.HasIndex("UserId", "IsActive");
                b.ToTable("Habits");
            });
            modelBuilder.Entity("Habit.Domain.Entities.HabitCompletion", b =>
            {
                b.Property<string>("Id").HasColumnType("text");
                b.Property<DateTime>("CompletedAt").HasColumnType("timestamp with time zone");
                b.Property<string>("HabitId").IsRequired().HasColumnType("text");
                b.Property<string>("Notes").HasMaxLength(1000).HasColumnType("character varying(1000)");
                b.Property<double?>("Quantity").HasColumnType("double precision");
                b.HasKey("Id");
                b.HasIndex("CompletedAt");
                b.HasIndex("HabitId");
                b.ToTable("HabitCompletions");
            });
            modelBuilder.Entity("Habit.Domain.Entities.HabitPlanDay", b =>
            {
                b.Property<string>("Id").HasColumnType("text");
                b.Property<DateTime?>("CompletedAt").HasColumnType("timestamp with time zone");
                b.Property<int>("DayNumber").HasColumnType("integer");
                b.Property<string>("HabitId").IsRequired().HasColumnType("text");
                b.Property<bool>("IsCompleted").HasColumnType("boolean");
                b.Property<string>("TasksJson").IsRequired().HasMaxLength(8000).HasColumnType("character varying(8000)");
                b.Property<string>("Title").IsRequired().HasMaxLength(200).HasColumnType("character varying(200)");
                b.HasKey("Id");
                b.HasIndex("HabitId");
                b.HasIndex("HabitId", "DayNumber").IsUnique();
                b.ToTable("HabitPlanDays");
            });
            modelBuilder.Entity("Habit.Domain.Entities.UserPreference", b =>
            {
                b.Property<string>("UserId").HasColumnType("text");
                b.Property<bool>("EmailNotificationsEnabled").HasColumnType("boolean");
                b.Property<DateTime>("UpdatedAt").HasColumnType("timestamp with time zone");
                b.HasKey("UserId");
                b.ToTable("UserPreferences");
            });
            modelBuilder.Entity("Habit.Domain.Entities.AIRequest", b =>
            {
                b.HasOne("Habit.Domain.Entities.Habit", "Habit").WithMany("AIRequests").HasForeignKey("HabitId").OnDelete(DeleteBehavior.SetNull);
                b.Navigation("Habit");
            });
            modelBuilder.Entity("Habit.Domain.Entities.AIResponse", b =>
            {
                b.HasOne("Habit.Domain.Entities.AIRequest", "Request").WithOne("Response").HasForeignKey("Habit.Domain.Entities.AIResponse", "RequestId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.Navigation("Request");
            });
            modelBuilder.Entity("Habit.Domain.Entities.HabitCompletion", b =>
            {
                b.HasOne("Habit.Domain.Entities.Habit", "Habit").WithMany("Completions").HasForeignKey("HabitId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.Navigation("Habit");
            });
            modelBuilder.Entity("Habit.Domain.Entities.HabitPlanDay", b =>
            {
                b.HasOne("Habit.Domain.Entities.Habit", "Habit").WithMany("PlanDays").HasForeignKey("HabitId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.Navigation("Habit");
            });
            modelBuilder.Entity("Habit.Domain.Entities.AIRequest", b =>
            {
                b.Navigation("Response");
            });
            modelBuilder.Entity("Habit.Domain.Entities.Habit", b =>
            {
                b.Navigation("AIRequests");
                b.Navigation("Completions");
                b.Navigation("PlanDays");
            });
#pragma warning restore 612, 618
        }
    }
}
