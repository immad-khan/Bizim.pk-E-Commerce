using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bizim.pk.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCollectionImagesToCustomizations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CollectionImage1",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CollectionImage2",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CollectionImage3",
                table: "SiteCustomizations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CollectionImage1",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "CollectionImage2",
                table: "SiteCustomizations");

            migrationBuilder.DropColumn(
                name: "CollectionImage3",
                table: "SiteCustomizations");
        }
    }
}
