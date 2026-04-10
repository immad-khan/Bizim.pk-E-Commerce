using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using dotenv.net;
using CloudinaryDotNet;
using System.Text.Json.Serialization;

// Load environment variables from .env file
var envPath = Path.Combine(Directory.GetCurrentDirectory(), "..", ".env");
if (File.Exists(envPath)) {
    try
    {
        DotEnv.Load(new DotEnvOptions(envFilePaths: new[] { envPath }));
    }
    catch { /* Ignore dotenv load errors */ }
}

var builder = WebApplication.CreateBuilder(args);

// Configure Entity Framework Core with PostgreSQL (Supabase)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

Console.WriteLine($"[DEBUG] Using connection string from config: {(string.IsNullOrEmpty(connectionString) ? "NULL" : connectionString.Substring(0, Math.Min(connectionString.Length, 20)) + "...")}");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorCodesToAdd: null
        );
        npgsqlOptions.CommandTimeout(60);
    })
);

// Configure Cloudinary
var cloudinaryUrl = builder.Configuration["CLOUDINARY_URL"] ?? Environment.GetEnvironmentVariable("CLOUDINARY_URL");
if (!string.IsNullOrEmpty(cloudinaryUrl))
{
    var cloudinary = new Cloudinary(cloudinaryUrl);
    builder.Services.AddSingleton(cloudinary);
}

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://bizim.pk", "https://www.bizim.pk")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowNextJs");

// Add a simple health check at the root
app.MapGet("/", () => "Bizim.pk API is running and successfully connected!");

app.MapControllers();

app.Run();