using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using Bizim.pk.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bizim.pk.API.Controllers
{
    public class CreateOrderRequest
    {
        public string? OrderId { get; set; }
        public string? Status { get; set; }
        public DateTime? PlacedAt { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Shipping { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
        public string? PaymentMethod { get; set; }
        public string? CustomerId { get; set; }
        public CreateOrderCustomerRequest? Customer { get; set; }
        public List<CreateOrderItemRequest>? Items { get; set; }
    }

    public class CreateOrderCustomerRequest
    {
        public string? Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? EmergencyPhone { get; set; }
        public string City { get; set; } = string.Empty;
        public string FullAddress { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
    }

    public class CreateOrderItemRequest
    {
        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal PriceAtOrderTime { get; set; }
        public int Quantity { get; set; }
    }

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
            try
            {
                return await _context.Orders
                    .Include(o => o.Customer)
                    .Include(o => o.Items)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] GetOrders failed: {ex}");
                return StatusCode(500, ex.Message);
            }
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder([FromBody] CreateOrderRequest request)
        {
            if (request.Customer == null)
            {
                return BadRequest(new { message = "Customer details are required." });
            }

            if (request.Items == null || request.Items.Count == 0)
            {
                return BadRequest(new { message = "At least one order item is required." });
            }

            var customer = new Customer
            {
                Id = request.Customer.Id ?? request.CustomerId ?? Guid.NewGuid().ToString(),
                FullName = request.Customer.FullName,
                Email = request.Customer.Email,
                Phone = request.Customer.Phone,
                EmergencyPhone = request.Customer.EmergencyPhone,
                City = request.Customer.City,
                FullAddress = request.Customer.FullAddress,
                Gender = request.Customer.Gender
            };

            var existingCustomer = await _context.Customers.FindAsync(customer.Id);
            if (existingCustomer == null)
            {
                _context.Customers.Add(customer);
            }
            else
            {
                // Update existing customer details if they are checking out again
                existingCustomer.FullName = customer.FullName;
                existingCustomer.Phone = customer.Phone;
                existingCustomer.City = customer.City;
                existingCustomer.FullAddress = customer.FullAddress;
                // You can update other fields here if needed
            }

            var order = new Order
            {
                OrderId = string.IsNullOrWhiteSpace(request.OrderId) ? $"ORD-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}" : request.OrderId,
                Status = string.IsNullOrWhiteSpace(request.Status) ? "Pending" : request.Status,
                PlacedAt = (request.PlacedAt ?? DateTime.UtcNow).Kind switch
                {
                    DateTimeKind.Utc => request.PlacedAt ?? DateTime.UtcNow,
                    DateTimeKind.Local => (request.PlacedAt ?? DateTime.UtcNow).ToUniversalTime(),
                    _ => DateTime.SpecifyKind(request.PlacedAt ?? DateTime.UtcNow, DateTimeKind.Utc)
                },
                Subtotal = request.Subtotal,
                Shipping = request.Shipping,
                Tax = request.Tax,
                Total = request.Total,
                PaymentMethod = string.IsNullOrWhiteSpace(request.PaymentMethod) ? "Cash On Delivery" : request.PaymentMethod,
                CustomerId = customer.Id
            };

            _context.Orders.Add(order);

            var orderItems = request.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                PriceAtOrderTime = i.PriceAtOrderTime,
                Quantity = i.Quantity,
                OrderId = order.Id
            }).ToList();

            _context.OrderItems.AddRange(orderItems);

            // Save asynchronously
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
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

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