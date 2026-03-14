using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using Bizim.pk.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bizim.pk.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders.Include(o => o.Items).ToListAsync();
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            // If the order has a customer object, EF will try to add it.
            // Ensure child items have a link if not handled by EF
            if (order.Items != null)
            {
                foreach (var item in order.Items)
                {
                    item.OrderId = order.Id;
                }
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Load the full order to return properly
            var savedOrder = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            return CreatedAtAction("GetOrder", new { id = order.Id }, savedOrder);
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(string id)
        {
            var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(string id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool OrderExists(string id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}