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
                // Create default if none exists
                customization = new SiteCustomization
                {
                    Id = 1,
                    HeroVideoWebm = "/videos/Smoothly_transition_from_202604100021.webm",
                    HeroVideoMp4 = "/videos/Smoothly_transition_from_202604100021.mp4",
                    HeroImageLeft = "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048",
                    HeroImageTopRight = "https://i.pinimg.com/webp/1200x/7a/c4/45/7ac445a42df2b1fafd6fef58b895c983.webp",
                    HeroImageBottomRight = "https://i.pinimg.com/1200x/82/6e/80/826e8083a923ebc39e8ce2d65a206f6d.jpg",
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
            if (_cloudinary == null)
                return StatusCode(503, "Cloudinary is not configured");

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var isVideo = file.ContentType.StartsWith("video/");
            
            using var stream = file.OpenReadStream();
            
            if (isVideo) {
                 var uploadParams = new VideoUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "customizations"
                };
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult.Error != null)
                    return BadRequest(uploadResult.Error.Message);

                return Ok(new { url = uploadResult.SecureUrl.ToString() });
            } else {
                 var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "customizations"
                };
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult.Error != null)
                    return BadRequest(uploadResult.Error.Message);

                return Ok(new { url = uploadResult.SecureUrl.ToString() });
            }
        }

        // PUT: api/Customizations
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
            customization.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(customization);
        }
    }
}