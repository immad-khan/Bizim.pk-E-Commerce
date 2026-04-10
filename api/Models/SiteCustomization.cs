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
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
