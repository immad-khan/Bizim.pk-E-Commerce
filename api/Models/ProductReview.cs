using System;
using System.ComponentModel.DataAnnotations;

namespace Bizim.pk.API.Models
{
    public class ProductReview
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string ProductId { get; set; } = string.Empty;

        [Required]
        public string CustomerName { get; set; } = "Verified Buyer";

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public bool IsVerifiedPurchase { get; set; } = true;

        public string? ImageUrl { get; set; }

        public string? OrderId { get; set; }
    }
}
