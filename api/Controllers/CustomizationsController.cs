using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using Bizim.pk.API.Models;
using System.Threading.Tasks;
using System;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace Bizim.pk.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomizationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly Cloudinary _cloudinary;

        public CustomizationsController(AppDbContext context, Cloudinary cloudinary = null)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        // GET: api/Customizations
        [HttpGet]
        public async Task<ActionResult<SiteCustomization>> GetCustomizations()
        {
            var customization = await _context.SiteCustomizations.FirstOrDefaultAsync();
            if (customization == null)
            {
                customization = new SiteCustomization
                {
                    Id = 1,
                    HeroVideoWebm = "/videos/Smoothly_transition_from_202604100021.webm",
                    HeroVideoMp4 = "/videos/Smoothly_transition_from_202604100021.mp4",
                    HeroImageLeft = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048",
                    HeroImageTopRight = "https://i.pinimg.com/webp/1200x/7a/c4/45/7ac445a42df2b1fafd6fef58b895c983.webp",
                    HeroImageBottomRight = "https://i.pinimg.com/1200x/82/6e/80/826e8083a923ebc39e8ce2d65a206f6d.jpg",
                    CollectionImage1 = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048",
                    CollectionImage2 = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048",
                    CollectionImage3 = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048",
                    ContactEmail = "info@bizim.pk",
                    ContactPhone = "+92 (321) 111-1111",
                    ContactAddress = "Karachi, Pakistan",
                    ContactImage = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048",
                    AboutImage = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048",
                    AboutDescription = "bizim.pk was founded with a simple vision: to bring the world's most exquisite luxury bags to customers in Pakistan. We believe that everyone deserves to own pieces that reflect their style, sophistication, and personality.\n\nOur curated collection features hand-picked pieces from renowned brands and emerging designers. Each bag in our collection represents the pinnacle of craftsmanship, design, and luxury.",
                    AboutYearsExperience = "15+",
                    AboutProductsCurated = "1000+",
                    AboutHappyCustomers = "5000+",
                    AboutBrandPartners = "50+",
                    UpdatedAt = DateTime.UtcNow
                };
                _context.SiteCustomizations.Add(customization);
                await _context.SaveChangesAsync();
            }
            return customization;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadMedia(IFormFile file)
        {
            if (_cloudinary == null) return StatusCode(503, "Cloudinary is not configured");
            if (file == null || file.Length == 0) return BadRequest("No file uploaded.");

            var isVideo = file.ContentType.StartsWith("video/");
            using var stream = file.OpenReadStream();

            if (isVideo) {
                 var uploadParams = new VideoUploadParams() { File = new FileDescription(file.FileName, stream), Folder = "customizations" };
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
                return Ok(new { url = uploadResult.SecureUrl.ToString() });
            } else {
                 var uploadParams = new ImageUploadParams() { File = new FileDescription(file.FileName, stream), Folder = "customizations" };
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
                return Ok(new { url = uploadResult.SecureUrl.ToString() });
            }
        }

        // POST/PUT: api/Customizations
        [HttpPost]
        [HttpPut]
        public async Task<IActionResult> UpdateCustomizations([FromBody] SiteCustomization updateRequest)
        {
            var customization = await _context.SiteCustomizations.FirstOrDefaultAsync();

            if (customization == null)
            {
                customization = new SiteCustomization { Id = 1 };
                _context.SiteCustomizations.Add(customization);
            }

            customization.HeroVideoWebm = updateRequest.HeroVideoWebm;
            customization.HeroVideoMp4 = updateRequest.HeroVideoMp4;
            customization.HeroImageLeft = updateRequest.HeroImageLeft;
            customization.HeroImageTopRight = updateRequest.HeroImageTopRight;
            customization.HeroImageBottomRight = updateRequest.HeroImageBottomRight;
            
            customization.HeroImageLeftTitle = updateRequest.HeroImageLeftTitle;
            customization.HeroImageLeftSubtitle = updateRequest.HeroImageLeftSubtitle;
            customization.HeroImageLeftButtonText = updateRequest.HeroImageLeftButtonText;
            
            customization.HeroImageTopRightTitle = updateRequest.HeroImageTopRightTitle;
            customization.HeroImageTopRightButtonText = updateRequest.HeroImageTopRightButtonText;
            
            customization.HeroImageBottomRightTitle = updateRequest.HeroImageBottomRightTitle;
            customization.HeroImageBottomRightSubtitle = updateRequest.HeroImageBottomRightSubtitle;
            
            customization.CollectionImage1 = updateRequest.CollectionImage1;
            customization.CollectionImage2 = updateRequest.CollectionImage2;
            customization.CollectionImage3 = updateRequest.CollectionImage3;

            customization.ContactEmail = updateRequest.ContactEmail;
            customization.ContactPhone = updateRequest.ContactPhone;
            customization.ContactAddress = updateRequest.ContactAddress;
            customization.ContactImage = updateRequest.ContactImage;

            customization.AboutImage = updateRequest.AboutImage;
            customization.AboutDescription = updateRequest.AboutDescription;
            customization.AboutYearsExperience = updateRequest.AboutYearsExperience;
            customization.AboutProductsCurated = updateRequest.AboutProductsCurated;
            customization.AboutHappyCustomers = updateRequest.AboutHappyCustomers;
            customization.AboutBrandPartners = updateRequest.AboutBrandPartners;
            
            customization.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(customization);
        }
    }
}
