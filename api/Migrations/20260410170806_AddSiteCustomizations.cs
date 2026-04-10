using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Bizim.pk.API.Migrations
{
    /// <inheritdoc />
    public partial class AddSiteCustomizations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SiteCustomizations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HeroVideoWebm = table.Column<string>(type: "text", nullable: false),
                    HeroVideoMp4 = table.Column<string>(type: "text", nullable: false),
                    HeroImageLeft = table.Column<string>(type: "text", nullable: false),
                    HeroImageTopRight = table.Column<string>(type: "text", nullable: false),
                    HeroImageBottomRight = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteCustomizations", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SiteCustomizations");
        }
    }
}
