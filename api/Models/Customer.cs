using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Bizim.pk.API.Models
{
    public class Customer
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        public string? EmergencyPhone { get; set; }

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string FullAddress { get; set; } = string.Empty;

        public string Gender { get; set; } = string.Empty; // Male, Female, Other

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property for orders
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}