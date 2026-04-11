using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bizim.pk.API.Migrations
{
    /// <inheritdoc />
    public partial class AddImageTexts2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeroImageBottomRightSubtitle",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroImageBottomRightTitle",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroImageLeftButtonText",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroImageLeftSubtitle",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroImageLeftTitle",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroImageTopRightButtonText",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroImageTopRightTitle",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeroImageBottomRightSubtitle",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "HeroImageBottomRightTitle",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "HeroImageLeftButtonText",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "HeroImageLeftSubtitle",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "HeroImageLeftTitle",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "HeroImageTopRightButtonText",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "HeroImageTopRightTitle",
                table: "SiteCustomizations");
        }
    }
}
