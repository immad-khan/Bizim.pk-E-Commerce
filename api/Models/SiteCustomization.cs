using System.ComponentModel.DataAnnotations;

namespace Bizim.pk.API.Models
{
    public class SiteCustomization
    {
        [Key]
        public int Id { get; set; } = 1;

        public string HeroVideoWebm { get; set; } = string.Empty;
        public string HeroVideoMp4 { get; set; } = string.Empty;

        public string HeroImageLeft { get; set; } = string.Empty;
        public string HeroImageTopRight { get; set; } = string.Empty;
        public string HeroImageBottomRight { get; set; } = string.Empty;

        public string HeroImageLeftTitle { get; set; } = "Limited Edition Bags";
        public string HeroImageLeftSubtitle { get; set; } = "Discover our exclusive collection";
        public string HeroImageLeftButtonText { get; set; } = "Shop Now";

        public string HeroImageTopRightTitle { get; set; } = "Curated Global Bags";
        public string HeroImageTopRightButtonText { get; set; } = "Shop Collection";

        public string HeroImageBottomRightTitle { get; set; } = "Save Up To 20%";
        public string HeroImageBottomRightSubtitle { get; set; } = "Season Sale";

        public string CollectionImage1 { get; set; } = string.Empty;
        public string CollectionImage2 { get; set; } = string.Empty;
        public string CollectionImage3 { get; set; } = string.Empty;

        public string ContactEmail { get; set; } = "info@bizim.pk";
        public string ContactPhone { get; set; } = "+92 (321) 111-1111";
        public string ContactAddress { get; set; } = "Karachi, Pakistan";
        public string ContactImage { get; set; } = string.Empty;

        public string AboutImage { get; set; } = string.Empty;
        public string AboutDescription { get; set; } = "bizim.pk was founded with a simple vision: to bring the world's most exquisite luxury bags to customers in Pakistan. We believe that everyone deserves to own pieces that reflect their style, sophistication, and personality.\n\nOur curated collection features hand-picked pieces from renowned brands and emerging designers. Each bag in our collection represents the pinnacle of craftsmanship, design, and luxury.";
        public string AboutYearsExperience { get; set; } = "15+";
        public string AboutProductsCurated { get; set; } = "1000+";
        public string AboutHappyCustomers { get; set; } = "5000+";
        public string AboutBrandPartners { get; set; } = "50+";

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}