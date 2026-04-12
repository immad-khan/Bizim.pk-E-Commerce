using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bizim.pk.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAboutInfoToCustomizations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AboutBrandPartners",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AboutDescription",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AboutHappyCustomers",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AboutImage",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AboutProductsCurated",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AboutYearsExperience",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AboutBrandPartners",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "AboutDescription",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "AboutHappyCustomers",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "AboutImage",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "AboutProductsCurated",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "AboutYearsExperience",
                table: "SiteCustomizations");
        }
    }
}
