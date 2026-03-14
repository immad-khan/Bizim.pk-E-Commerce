using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bizim.pk.API.Models
{
    public class Order
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string OrderId { get; set; } = string.Empty; // Human-readable order ID for UI

        [Required]
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Processing, Shipped, Delivered, Cancelled

        public DateTime PlacedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Shipping { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Tax { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        public string PaymentMethod { get; set; } = "Cash On Delivery";

        // Foreign Key to Customer (set by EF Core from Customer navigation property)
        public string? CustomerId { get; set; }
        
        [ForeignKey("CustomerId")]
        public Customer? Customer { get; set; }

        // Navigation property for order items
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

    public class OrderItem
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string ProductId { get; set; } = string.Empty;

        [Required]
        public string ProductName { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PriceAtOrderTime { get; set; } // Snapped price to maintain historical integrity

        [Required]
        public int Quantity { get; set; }

        // Foreign Key to Order (assigned by controller before saving)
        public string? OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
    }
}