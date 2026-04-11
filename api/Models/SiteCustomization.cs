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

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}