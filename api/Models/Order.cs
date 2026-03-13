using System;
using System.Collections.Generic;

namespace Bizim.pk.API.Models
{
    public class Order
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string OrderId { get; set; } = "";
        public DateTime PlacedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "On Working"; // On Working, Completed, etc.
        
        public string CustomerFullName { get; set; } = "";
        public string CustomerGender { get; set; } = "";
        public string CustomerCity { get; set; } = "";
        public string CustomerFullAddress { get; set; } = "";
        public string CustomerEmail { get; set; } = "";
        public string CustomerPhone { get; set; } = "";
        public string CustomerEmergencyPhone { get; set; } = "";

        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
        
        public decimal Subtotal { get; set; }
        public decimal Shipping { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
    }

    public class OrderItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ProductId { get; set; } = "";
        public string ProductName { get; set; } = "";
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string OrderId { get; set; } = "";
    }
}