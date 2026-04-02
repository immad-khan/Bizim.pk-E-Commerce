using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using Bizim.pk.API.Models;

namespace Bizim.pk.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscribersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubscribersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Subscribers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subscriber>>> GetSubscribers()
        {
            return await _context.Subscribers.OrderByDescending(s => s.SubscribedAt).ToListAsync();
        }

        // POST: api/Subscribers
        [HttpPost]
        public async Task<ActionResult<Subscriber>> PostSubscriber(Subscriber subscriber)
        {
            if (await _context.Subscribers.AnyAsync(s => s.Email == subscriber.Email))
            {
                return BadRequest("Email already subscribed.");
            }

            subscriber.SubscribedAt = DateTime.UtcNow;
            _context.Subscribers.Add(subscriber);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubscribers", new { id = subscriber.Id }, subscriber);
        }
    }
}
