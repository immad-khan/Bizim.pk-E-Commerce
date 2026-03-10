using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bizim.pk.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialSupabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    OriginalPrice = table.Column<decimal>(type: "numeric", nullable: true),
                    Rating = table.Column<double>(type: "double precision", nullable: false),
                    Reviews = table.Column<int>(type: "integer", nullable: false),
                    Image = table.Column<string>(type: "text", nullable: true),
                    Badge = table.Column<string>(type: "text", nullable: true),
                    BadgeColor = table.Column<string>(type: "text", nullable: true),
                    OnSale = table.Column<bool>(type: "boolean", nullable: false),
                    SaleDiscount = table.Column<decimal>(type: "numeric", nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<bool>(type: "boolean", nullable: false),
                    Sales = table.Column<int>(type: "integer", nullable: false),
                    Permissions = table.Column<string>(type: "text", nullable: true),
                    ProductId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Badge", "BadgeColor", "Image", "Name", "OnSale", "OriginalPrice", "Permissions", "Price", "ProductId", "Quantity", "Rating", "Reviews", "SaleDiscount", "Sales", "Status" },
                values: new object[,]
                {
                    { "1", "BEST SELLER", "orange", "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", "Premium Leather Handbag", true, 35000m, "Create,Edit,Delete", 25000m, "#PRD-001", 50, 4.7999999999999998, 124, 110m, 125, true },
                    { "2", null, null, "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", "Modern Crossbody Bag", false, null, "Create,Edit,Delete", 18500m, "#PRD-002", 0, 4.5, 89, 0m, 0, false },
                    { "3", "TRENDING", "red", "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", "Classic Tote Bag", true, 28000m, "Create,Edit,Delete", 22000m, "#PRD-003", 120, 4.9000000000000004, 215, 90m, 89, true },
                    { "4", "LIMITED", "orange", "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", "Minimalist Backpack", true, 45000m, "Create,Edit,Delete", 32000m, "#PRD-004", 30, 4.7000000000000002, 156, 100m, 52, true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
