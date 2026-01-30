using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable
namespace AuthAPI.Infrastructure.Migrations
{
    public partial class InitialUserDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(name: "Roles", columns: table => new { Id = table.Column<string>(type: "text", nullable: false), Name = table.Column<string>(type: "text", nullable: false) }, constraints: table =>
            {
                table.PrimaryKey("PK_Roles", x => x.Id);
            });
            migrationBuilder.CreateTable(name: "Users", columns: table => new { Id = table.Column<string>(type: "text", nullable: false), Username = table.Column<string>(type: "character varying(25)", maxLength: 25, nullable: true), Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true), Surname = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true), Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false), Password = table.Column<string>(type: "text", nullable: true), CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"), IsEmailConfirmed = table.Column<bool>(type: "boolean", nullable: false), RefreshToken = table.Column<string>(type: "text", nullable: true), RefreshTokenExpiryTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true), Provider = table.Column<string>(type: "text", nullable: true), ProviderId = table.Column<string>(type: "text", nullable: true) }, constraints: table =>
            {
                table.PrimaryKey("PK_Users", x => x.Id);
            });
            migrationBuilder.CreateTable(name: "UserOtps", columns: table => new { Id = table.Column<string>(type: "text", nullable: false), UserId = table.Column<string>(type: "text", nullable: false), OtpHash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false), CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false), ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false), IsUsed = table.Column<bool>(type: "boolean", nullable: false) }, constraints: table =>
            {
                table.PrimaryKey("PK_UserOtps", x => x.Id);
                table.ForeignKey(name: "FK_UserOtps_Users_UserId", column: x => x.UserId, principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            });
            migrationBuilder.CreateTable(name: "UserRoles", columns: table => new { UserId = table.Column<string>(type: "text", nullable: false), RoleId = table.Column<string>(type: "text", nullable: false) }, constraints: table =>
            {
                table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                table.ForeignKey(name: "FK_UserRoles_Roles_RoleId", column: x => x.RoleId, principalTable: "Roles", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                table.ForeignKey(name: "FK_UserRoles_Users_UserId", column: x => x.UserId, principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            });
            migrationBuilder.CreateIndex(name: "IX_UserOtps_UserId_IsUsed_ExpiresAt", table: "UserOtps", columns: new[] { "UserId", "IsUsed", "ExpiresAt" });
            migrationBuilder.CreateIndex(name: "IX_UserRoles_RoleId", table: "UserRoles", column: "RoleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "UserOtps");
            migrationBuilder.DropTable(name: "UserRoles");
            migrationBuilder.DropTable(name: "Roles");
            migrationBuilder.DropTable(name: "Users");
        }
    }
}
