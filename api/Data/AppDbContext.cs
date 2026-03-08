using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Models;

namespace Bizim.pk.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seeding default products to test
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = "1", Name = "Premium Leather Handbag", Price = 25000, OriginalPrice = 35000, Rating = 4.8, Reviews = 124, Image = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", Badge = "BEST SELLER", BadgeColor = "orange", ProductId = "#PRD-001", Status = true, Sales = 125, OnSale = true, SaleDiscount = 110, Quantity = 50 },
                new Product { Id = "2", Name = "Modern Crossbody Bag", Price = 18500, Rating = 4.5, Reviews = 89, Image = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", ProductId = "#PRD-002", Status = false, Sales = 0, OnSale = false, SaleDiscount = 0, Quantity = 0 },
                new Product { Id = "3", Name = "Classic Tote Bag", Price = 22000, OriginalPrice = 28000, Rating = 4.9, Reviews = 215, Image = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", Badge = "TRENDING", BadgeColor = "red", ProductId = "#PRD-003", Status = true, Sales = 89, OnSale = true, SaleDiscount = 90, Quantity = 120 },
                new Product { Id = "4", Name = "Minimalist Backpack", Price = 32000, OriginalPrice = 45000, Rating = 4.7, Reviews = 156, Image = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048", Badge = "LIMITED", BadgeColor = "orange", ProductId = "#PRD-004", Status = true, Sales = 52, OnSale = true, SaleDiscount = 100, Quantity = 30 }
            );
        }
    }
}
