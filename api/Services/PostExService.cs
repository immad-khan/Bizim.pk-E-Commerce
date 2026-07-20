using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Bizim.pk.API.Models;

namespace Bizim.pk.API.Services
{
    public interface IPostExService
    {
        Task<PostExBookingResponse?> BookOrderAsync(Order order);
    }

    public class PostExService : IPostExService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string? _apiToken;
        private readonly string? _pickupAddressCode;

        public PostExService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _apiToken = configuration["PostEx:ApiToken"];
            _pickupAddressCode = configuration["PostEx:PickupAddressCode"];
        }

        public async Task<PostExBookingResponse?> BookOrderAsync(Order order)
        {
            if (string.IsNullOrEmpty(_apiToken))
            {
                throw new InvalidOperationException("PostEx API Token is not configured.");
            }

            try
            {
                // Clean the phone number (remove spaces, ensure it starts with correct format)
                string phone = order.Customer.Phone?.Replace(" ", "").Replace("-", "") ?? "";
                if (phone.StartsWith("03"))
                {
                    // Should be fine
                }
                else if (phone.StartsWith("3"))
                {
                    phone = "0" + phone;
                }
                else if (phone.StartsWith("+92"))
                {
                    phone = "0" + phone.Substring(3);
                }

                // Make sure we have a valid city. PostEx needs exact city names, but we'll pass whatever the user entered and let their API handle it.
                string city = order.Customer.City ?? "Unknown";

                var requestData = new
                {
                    cityName = city,
                    customerName = order.Customer.FullName,
                    customerPhone = phone,
                    deliveryAddress = order.Customer.FullAddress, // Full address
                    invoiceDivision = 1,
                    orderDetail = $"Order {order.OrderId}",
                    orderRefNumber = order.OrderId,
                    orderType = "Normal",
                    pickupAddressCode = _pickupAddressCode ?? "001", // Using default if not provided, client must configure this
                    invoicePayment = order.Total, // COD Amount
                    items = order.Items?.Count ?? 1 // Total items
                };

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("token", _apiToken);

                var response = await _httpClient.PostAsJsonAsync("https://api.postex.pk/services/integration/api/order/v1/create-order", requestData);

                var responseBody = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    try 
                    {
                        var result = JsonSerializer.Deserialize<PostExBookingResponse>(responseBody, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        return result;
                    }
                    catch
                    {
                        // Fallback in case the response structure is unexpected
                        return new PostExBookingResponse 
                        { 
                            StatusCode = "200", 
                            StatusMessage = "Success",
                            Dist = new PostExDist { TrackingNumber = "Unknown" }
                        };
                    }
                }
                else
                {
                    Console.WriteLine($"PostEx API Error: {response.StatusCode} - {responseBody}");
                    throw new Exception($"Failed to book at PostEx: {responseBody}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error booking at PostEx: {ex.Message}");
                throw;
            }
        }
    }

    public class PostExBookingResponse
    {
        public string StatusCode { get; set; } = string.Empty;
        public string StatusMessage { get; set; } = string.Empty;
        public PostExDist? Dist { get; set; }
    }

    public class PostExDist
    {
        public string TrackingNumber { get; set; } = string.Empty;
    }
}
