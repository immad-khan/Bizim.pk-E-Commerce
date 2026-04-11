using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using Bizim.pk.API.Models;

namespace Bizim.pk.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Reviews/{productId}
        [HttpGet("{productId}")]
        public async Task<ActionResult<IEnumerable<ProductReview>>> GetReviewsForProduct(string productId)
        {
            return await _context.ProductReviews
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // POST: api/Reviews
        [HttpPost]
        public async Task<ActionResult<ProductReview>> PostReview(ProductReview review)
        {
            review.CreatedAt = DateTime.UtcNow;
            review.IsVerifiedPurchase = true; // Hardcoded for this iteration based on order verification on frontend
            _context.ProductReviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReviewsForProduct", new { productId = review.ProductId }, review);
        }
    }
}
