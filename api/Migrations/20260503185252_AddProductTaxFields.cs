using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bizim.pk.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProductTaxFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Customers",
                columns: new[] { "Id", "City", "CreatedAt", "Email", "EmergencyPhone", "FullAddress", "FullName", "Gender", "Phone" },
                values: new object[] { "CUST-001", "Karachi", new DateTime(2026, 5, 3, 18, 52, 44, 976, DateTimeKind.Utc).AddTicks(2786), "ahmed@example.com", "03009876543", "123 Main Street, Karachi, Pakistan", "Ahmed Khan", "Male", "03001234567" });

            migrationBuilder.InsertData(
                table: "Orders",
                columns: new[] { "Id", "CustomerId", "OrderId", "PaymentMethod", "PlacedAt", "Shipping", "Status", "Subtotal", "Tax", "Total" },
                values: new object[,]
                {
                    { "659102bb-1455-4a4a-8ec3-90140ac9af71", "CUST-001", "ORD-001", "Credit Card", new DateTime(2026, 4, 28, 18, 52, 44, 978, DateTimeKind.Utc).AddTicks(5083), 500m, "Pending", 25000m, 2550m, 28050m },
                    { "8aa14821-cdcc-41ea-9e4e-01bf8bb6d67d", "CUST-001", "ORD-002", "Bank Transfer", new DateTime(2026, 4, 23, 18, 52, 44, 979, DateTimeKind.Utc).AddTicks(3455), 500m, "Completed", 18500m, 1900m, 20900m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: "659102bb-1455-4a4a-8ec3-90140ac9af71");

            migrationBuilder.DeleteData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: "8aa14821-cdcc-41ea-9e4e-01bf8bb6d67d");

            migrationBuilder.DeleteData(
                table: "Customers",
                keyColumn: "Id",
                keyValue: "CUST-001");
        }
    }
}
