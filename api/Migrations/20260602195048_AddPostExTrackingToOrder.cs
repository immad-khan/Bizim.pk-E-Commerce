using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bizim.pk.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPostExTrackingToOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: "659102bb-1455-4a4a-8ec3-90140ac9af71");

            migrationBuilder.DeleteData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: "8aa14821-cdcc-41ea-9e4e-01bf8bb6d67d");

            migrationBuilder.AddColumn<bool>(
                name: "TaxEnabled",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "TaxRate",
                table: "Products",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsBookedAtPostEx",
                table: "Orders",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TrackingNumber",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Customers",
                keyColumn: "Id",
                keyValue: "CUST-001",
                column: "CreatedAt",
                value: new DateTime(2026, 6, 2, 19, 50, 39, 632, DateTimeKind.Utc).AddTicks(3853));

            migrationBuilder.InsertData(
                table: "Orders",
                columns: new[] { "Id", "CustomerId", "IsBookedAtPostEx", "OrderId", "PaymentMethod", "PlacedAt", "Shipping", "Status", "Subtotal", "Tax", "Total", "TrackingNumber" },
                values: new object[,]
                {
                    { "2d846dc7-f40d-4a47-b341-5ccebfa4dfe9", "CUST-001", false, "ORD-001", "Credit Card", new DateTime(2026, 5, 28, 19, 50, 39, 634, DateTimeKind.Utc).AddTicks(4528), 500m, "Pending", 25000m, 2550m, 28050m, null },
                    { "3ac93dc2-340d-4abd-9ae0-f70a4371b2c4", "CUST-001", false, "ORD-002", "Bank Transfer", new DateTime(2026, 5, 23, 19, 50, 39, 635, DateTimeKind.Utc).AddTicks(3583), 500m, "Completed", 18500m, 1900m, 20900m, null }
                });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "TaxEnabled", "TaxRate" },
                values: new object[] { false, 0m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "2",
                columns: new[] { "TaxEnabled", "TaxRate" },
                values: new object[] { false, 0m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "3",
                columns: new[] { "TaxEnabled", "TaxRate" },
                values: new object[] { false, 0m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "4",
                columns: new[] { "TaxEnabled", "TaxRate" },
                values: new object[] { false, 0m });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: "2d846dc7-f40d-4a47-b341-5ccebfa4dfe9");

            migrationBuilder.DeleteData(
                table: "Orders",
                keyColumn: "Id",
                keyValue: "3ac93dc2-340d-4abd-9ae0-f70a4371b2c4");

            migrationBuilder.DropColumn(
                name: "TaxEnabled",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "TaxRate",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsBookedAtPostEx",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "TrackingNumber",
                table: "Orders");

            migrationBuilder.UpdateData(
                table: "Customers",
                keyColumn: "Id",
                keyValue: "CUST-001",
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 18, 52, 44, 976, DateTimeKind.Utc).AddTicks(2786));

            migrationBuilder.InsertData(
                table: "Orders",
                columns: new[] { "Id", "CustomerId", "OrderId", "PaymentMethod", "PlacedAt", "Shipping", "Status", "Subtotal", "Tax", "Total" },
                values: new object[,]
                {
                    { "659102bb-1455-4a4a-8ec3-90140ac9af71", "CUST-001", "ORD-001", "Credit Card", new DateTime(2026, 4, 28, 18, 52, 44, 978, DateTimeKind.Utc).AddTicks(5083), 500m, "Pending", 25000m, 2550m, 28050m },
                    { "8aa14821-cdcc-41ea-9e4e-01bf8bb6d67d", "CUST-001", "ORD-002", "Bank Transfer", new DateTime(2026, 4, 23, 18, 52, 44, 979, DateTimeKind.Utc).AddTicks(3455), 500m, "Completed", 18500m, 1900m, 20900m }
                });
        }
    }
}
