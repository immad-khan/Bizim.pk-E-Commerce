using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bizim.pk.API.Migrations
{
    /// <inheritdoc />
    public partial class AddContactInfoToCustomizations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactAddress",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactImage",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactAddress",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "ContactImage",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "ContactPhone",
                table: "SiteCustomizations");
        }
    }
}
