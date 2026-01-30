using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable
namespace AuthAPI.Infrastructure.Migrations
{
    public partial class AddUserLogoFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(name: "LogoKey", table: "Users", type: "text", nullable: true);
            migrationBuilder.AddColumn<string>(name: "LogoUrl", table: "Users", type: "text", nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "LogoKey", table: "Users");
            migrationBuilder.DropColumn(name: "LogoUrl", table: "Users");
        }
    }
}
