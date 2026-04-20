using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using Bizim.pk.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

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
        private readonly IConfiguration _configuration;

        public OrdersController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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

    // Retry logic for Supabase free tier cold starts
    const int maxRetries = 3;
    for (int attempt = 1; attempt <= maxRetries; attempt++)
    {
        try
        {
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
                existingCustomer.FullName = customer.FullName;
                existingCustomer.Phone = customer.Phone;
                existingCustomer.City = customer.City;
                existingCustomer.FullAddress = customer.FullAddress;
            }

            var order = new Order
            {
                OrderId = string.IsNullOrWhiteSpace(request.OrderId) 
                    ? $"ORD-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}" 
                    : request.OrderId,
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
                PaymentMethod = string.IsNullOrWhiteSpace(request.PaymentMethod) 
                    ? "Cash On Delivery" 
                    : request.PaymentMethod,
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

            await _context.SaveChangesAsync();

            var savedOrder = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            // Send Email Asynchronously (fire and forget so it doesn't slow down the order placement)
            _ = Task.Run(() => SendOrderConfirmationEmail(savedOrder));

            Console.WriteLine($"[SUCCESS] Order {order.OrderId} placed on attempt {attempt}");
            return CreatedAtAction("GetOrder", new { id = order.Id }, savedOrder);
        }
        catch (Exception ex) when (
            ex.InnerException is ObjectDisposedException || 
            ex.InnerException is System.IO.IOException ||
            ex.Message.Contains("disposed") ||
            ex.Message.Contains("connection"))
        {
            Console.WriteLine($"[WARN] Order attempt {attempt}/{maxRetries} failed: {ex.InnerException?.Message ?? ex.Message}");
            
            if (attempt == maxRetries)
            {
                Console.WriteLine($"[ERROR] All {maxRetries} attempts failed: {ex}");
                return StatusCode(503, new { 
                    message = "Database temporarily unavailable. Please try again in a moment.",
                    detail = ex.InnerException?.Message ?? ex.Message
                });
            }

            // Clear the change tracker so we don't get duplicate key errors on retry
            _context.ChangeTracker.Clear();
            
            // Wait before retrying (increases with each attempt)
            await Task.Delay(1000 * attempt);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERROR] Unexpected error: {ex}");
            return StatusCode(500, new { 
                message = "An unexpected error occurred.", 
                detail = ex.InnerException?.Message ?? ex.Message 
            });
        }
    }

    return StatusCode(500, new { message = "Failed to place order after retries." });
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

        private async Task SendOrderConfirmationEmail(Order order)
        {
            if (string.IsNullOrEmpty(order?.Customer?.Email)) return;
            
            try
            {
                var host = _configuration["SMTP_HOST"] ?? Environment.GetEnvironmentVariable("SMTP_HOST");
                var portStr = _configuration["SMTP_PORT"] ?? Environment.GetEnvironmentVariable("SMTP_PORT");
                var username = _configuration["SMTP_USERNAME"] ?? Environment.GetEnvironmentVariable("SMTP_USERNAME");
                var password = _configuration["SMTP_PASSWORD"] ?? Environment.GetEnvironmentVariable("SMTP_PASSWORD");

                if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                {
                    Console.WriteLine("[WARN] SMTP credentials not fully configured. Email was skipped.");
                    return;
                }

                int port = string.IsNullOrEmpty(portStr) ? 587 : int.Parse(portStr);

                var itemsHtml = "";
                foreach (var item in order.Items)
                {
                    itemsHtml += $@"
                    <tr>
                        <td style='padding: 10px; border-bottom: 1px solid #eee;'>{item.ProductName} x {item.Quantity}</td>
                        <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>Rs. {item.PriceAtOrderTime * item.Quantity:N0}</td>
                    </tr>";
                }

                var body = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;'>
                        <h2 style='color: #ea580c; text-align: center;'>Order Confirmation</h2>
                        <p>Hi <strong>{order.Customer.FullName}</strong>,</p>
                        <p>Thank you for choosing Bizim.pk! Your order <strong>#{order.OrderId}</strong> has been successfully placed and is now being processed.</p>
                        
                        <table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>
                            <thead>
                                <tr style='background-color: #f8fafc;'>
                                    <th style='padding: 10px; text-align: left; border-bottom: 2px solid #ddd;'>Item</th>
                                    <th style='padding: 10px; text-align: right; border-bottom: 2px solid #ddd;'>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td style='padding: 10px; font-weight: bold; text-align: right;'>Subtotal:</td>
                                    <td style='padding: 10px; font-weight: bold; text-align: right;'>Rs. {order.Subtotal:N0}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 10px; text-align: right;'>Shipping:</td>
                                    <td style='padding: 10px; text-align: right;'>Rs. {order.Shipping:N0}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 10px; font-weight: bold; text-align: right; color: #ea580c; font-size: 18px;'>Total:</td>
                                    <td style='padding: 10px; font-weight: bold; text-align: right; color: #ea580c; font-size: 18px;'>Rs. {order.Total:N0}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <p style='margin-top: 30px; text-align: center; color: #64748b; font-size: 12px;'>
                            If you have any questions, reply to this email to contact our support team.<br/>
                            &copy; {DateTime.Now.Year} Bizim.pk
                        </p>
                    </div>";

                using (var client = new SmtpClient(host, port))
                {
                    client.Credentials = new System.Net.NetworkCredential(username, password);
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(username, "Bizim.pk Orders"),
                        Subject = $"Order Confirmation #{order.OrderId}",
                        Body = body,
                        IsBodyHtml = true
                    };

                    mailMessage.To.Add(order.Customer.Email);

                    await client.SendMailAsync(mailMessage);
                    Console.WriteLine($"[SUCCESS] Confirmation email sent successfully to {order.Customer.Email}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Failed to send order confirmation email: {ex.Message}");
            }
        }

        [HttpGet("track/{orderId}")]
        public async Task<IActionResult> TrackOrder(string orderId)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            var trackingData = new
            {
                orderId = order.OrderId,
                status = order.Status,
                placedAt = order.PlacedAt,
                total = order.Total,
                customerName = order.Customer.FullName,
                items = order.Items.Select(i => new { name = i.ProductName, quantity = i.Quantity, price = i.PriceAtOrderTime, image = i.ProductId /* optional mapping */ })
            };

            return Ok(trackingData);
        }
    }
}