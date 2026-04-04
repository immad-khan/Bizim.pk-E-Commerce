using System;

namespace Bizim.pk.API.Models
{
    public class Product
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public double Rating { get; set; } = 5.0;
        public int Reviews { get; set; } = 0;
        public string? Description { get; set; }
        public string? Image { get; set; }
        public string? ImagePublicId { get; set; }
        public string? Badge { get; set; }
        public string? BadgeColor { get; set; }
        public bool OnSale { get; set; } = false;
        public decimal? SaleDiscount { get; set; }
        public int Quantity { get; set; } = 0;
        public decimal ShipmentFee { get; set; } = 0;
        public bool Status { get; set; } = true;
        public int Sales { get; set; } = 0;
        
        // Let's use string arrays converted to simple lists 
        // Note: SQLite doesn't directly map Arrays/Lists well with EF Core without conversion. We'll skip Permissions for now or map it to string
public string? Permissions { get; set; } = "Create,Edit,Delete";
        public string? ProductId { get; set; }

        // Additional Images
        public string? Image2 { get; set; }
        public string? ImagePublicId2 { get; set; }
        public string? Image3 { get; set; }
        public string? ImagePublicId3 { get; set; }
        public string? Image4 { get; set; }
        public string? ImagePublicId4 { get; set; }

        // Colors & Variants
        public string? Tags { get; set; }
        public string? AvailableColors { get; set; } 
        public string? RelatedProducts { get; set; }
    }
}
