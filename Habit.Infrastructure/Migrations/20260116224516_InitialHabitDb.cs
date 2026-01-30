using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable
namespace Habit.Infrastructure.Migrations
{
    public partial class InitialHabitDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(name: "Habits", columns: table => new { Id = table.Column<string>(type: "text", nullable: false), UserId = table.Column<string>(type: "text", nullable: false), Action = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false), Frequency = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false), Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false), ProgramDays = table.Column<int>(type: "integer", nullable: true), Time = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true), Goal = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true), Unit = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true), Quantity = table.Column<double>(type: "double precision", nullable: true), Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true), Duration = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true), Priority = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true), ScheduleDays = table.Column<string>(type: "text", nullable: true), ScheduleTimes = table.Column<string>(type: "text", nullable: true), CurrentStreak = table.Column<int>(type: "integer", nullable: false), BestStreak = table.Column<int>(type: "integer", nullable: false), CompletionRate = table.Column<double>(type: "double precision", nullable: false), TotalCompletions = table.Column<int>(type: "integer", nullable: false), DaysTracked = table.Column<int>(type: "integer", nullable: false), IsActive = table.Column<bool>(type: "boolean", nullable: false), CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false), UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true) }, constraints: table =>
            {
                table.PrimaryKey("PK_Habits", x => x.Id);
            });
            migrationBuilder.CreateTable(name: "AIRequests", columns: table => new { Id = table.Column<string>(type: "text", nullable: false), UserId = table.Column<string>(type: "text", nullable: false), HabitId = table.Column<string>(type: "text", nullable: true), FunctionType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false), InputData = table.Column<string>(type: "text", nullable: false), ModelName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true), Prompt = table.Column<string>(type: "character varying(10000)", maxLength: 10000, nullable: true), CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false) }, constraints: table =>
            {
                table.PrimaryKey("PK_AIRequests", x => x.Id);
                table.ForeignKey(name: "FK_AIRequests_Habits_HabitId", column: x => x.HabitId, principalTable: "Habits", principalColumn: "Id", onDelete: ReferentialAction.SetNull);
            });
            migrationBuilder.CreateTable(name: "HabitCompletions", columns: table => new { Id = table.Column<string>(type: "text", nullable: false), HabitId = table.Column<string>(type: "text", nullable: false), CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false), Quantity = table.Column<double>(type: "double precision", nullable: true), Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true) }, constraints: table =>
            {
                table.PrimaryKey("PK_HabitCompletions", x => x.Id);
                table.ForeignKey(name: "FK_HabitCompletions_Habits_HabitId", column: x => x.HabitId, principalTable: "Habits", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            });
            migrationBuilder.CreateTable(name: "HabitPlanDays", columns: table => new { Id = table.Column<string>(type: "text", nullable: false), HabitId = table.Column<string>(type: "text", nullable: false), DayNumber = table.Column<int>(type: "integer", nullable: false), Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false), TasksJson = table.Column<string>(type: "character varying(8000)", maxLength: 8000, nullable: false), IsCompleted = table.Column<bool>(type: "boolean", nullable: false), CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true) }, constraints: table =>
            {
                table.PrimaryKey("PK_HabitPlanDays", x => x.Id);
                table.ForeignKey(name: "FK_HabitPlanDays_Habits_HabitId", column: x => x.HabitId, principalTable: "Habits", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            });
            migrationBuilder.CreateTable(name: "AIResponses", columns: table => new { Id = table.Column<string>(type: "text", nullable: false), RequestId = table.Column<string>(type: "text", nullable: false), RawResponse = table.Column<string>(type: "text", nullable: false), ParsedResponse = table.Column<string>(type: "text", nullable: false), Success = table.Column<bool>(type: "boolean", nullable: false), DurationSeconds = table.Column<double>(type: "double precision", nullable: false), ErrorMessage = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true), CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false) }, constraints: table =>
            {
                table.PrimaryKey("PK_AIResponses", x => x.Id);
                table.ForeignKey(name: "FK_AIResponses_AIRequests_RequestId", column: x => x.RequestId, principalTable: "AIRequests", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            });
            migrationBuilder.CreateIndex(name: "IX_AIRequests_CreatedAt", table: "AIRequests", column: "CreatedAt");
            migrationBuilder.CreateIndex(name: "IX_AIRequests_FunctionType", table: "AIRequests", column: "FunctionType");
            migrationBuilder.CreateIndex(name: "IX_AIRequests_HabitId", table: "AIRequests", column: "HabitId");
            migrationBuilder.CreateIndex(name: "IX_AIRequests_UserId", table: "AIRequests", column: "UserId");
            migrationBuilder.CreateIndex(name: "IX_AIResponses_CreatedAt", table: "AIResponses", column: "CreatedAt");
            migrationBuilder.CreateIndex(name: "IX_AIResponses_RequestId", table: "AIResponses", column: "RequestId", unique: true);
            migrationBuilder.CreateIndex(name: "IX_HabitCompletions_CompletedAt", table: "HabitCompletions", column: "CompletedAt");
            migrationBuilder.CreateIndex(name: "IX_HabitCompletions_HabitId", table: "HabitCompletions", column: "HabitId");
            migrationBuilder.CreateIndex(name: "IX_HabitPlanDays_HabitId", table: "HabitPlanDays", column: "HabitId");
            migrationBuilder.CreateIndex(name: "IX_HabitPlanDays_HabitId_DayNumber", table: "HabitPlanDays", columns: new[] { "HabitId", "DayNumber" }, unique: true);
            migrationBuilder.CreateIndex(name: "IX_Habits_UserId", table: "Habits", column: "UserId");
            migrationBuilder.CreateIndex(name: "IX_Habits_UserId_IsActive", table: "Habits", columns: new[] { "UserId", "IsActive" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "AIResponses");
            migrationBuilder.DropTable(name: "HabitCompletions");
            migrationBuilder.DropTable(name: "HabitPlanDays");
            migrationBuilder.DropTable(name: "AIRequests");
            migrationBuilder.DropTable(name: "Habits");
        }
    }
}
