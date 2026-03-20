using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Models;

namespace Bizim.pk.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; } = default!;
        public DbSet<Customer> Customers { get; set; } = default!;
        public DbSet<Order> Orders { get; set; } = default!;
        public DbSet<OrderItem> OrderItems { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany(c => c.Orders)
                .HasForeignKey(o => o.CustomerId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId);

            // Seeding default products to test
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = "1", Name = "Premium Leather Handbag", Price = 25000m, OriginalPrice = 35000m, Rating = 4.8, Reviews = 124, Image = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", Badge = "BEST SELLER", BadgeColor = "orange", ProductId = "#PRD-001", Status = true, Sales = 125, OnSale = true, SaleDiscount = 110m, Quantity = 50 },
                new Product { Id = "2", Name = "Modern Crossbody Bag", Price = 18500m, Rating = 4.5, Reviews = 89, Image = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", ProductId = "#PRD-002", Status = false, Sales = 0, OnSale = false, SaleDiscount = 0m, Quantity = 0 },
                new Product { Id = "3", Name = "Classic Tote Bag", Price = 22000m, OriginalPrice = 28000m, Rating = 4.9, Reviews = 215, Image = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", Badge = "TRENDING", BadgeColor = "red", ProductId = "#PRD-003", Status = true, Sales = 89, OnSale = true, SaleDiscount = 90m, Quantity = 120 },
                new Product { Id = "4", Name = "Minimalist Backpack", Price = 32000m, OriginalPrice = 45000m, Rating = 4.7, Reviews = 156, Image = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", Badge = "LIMITED", BadgeColor = "orange", ProductId = "#PRD-004", Status = true, Sales = 52, OnSale = true, SaleDiscount = 100m, Quantity = 30 }
            );
        }
    }
}
