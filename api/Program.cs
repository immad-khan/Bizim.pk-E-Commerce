using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using dotenv.net;
using CloudinaryDotNet;
using System.Text.Json.Serialization;
using Bizim.pk.API.Services;

// Load environment variables from .env file
var rootEnvPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
var parentEnvPath = Path.Combine(Directory.GetCurrentDirectory(), "..", ".env");

if (File.Exists(rootEnvPath)) {
    try { DotEnv.Load(new DotEnvOptions(envFilePaths: new[] { rootEnvPath })); } catch { }
} else if (File.Exists(parentEnvPath)) {
    try { DotEnv.Load(new DotEnvOptions(envFilePaths: new[] { parentEnvPath })); } catch { }
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
// NOTE: If Azure Portal CORS is enabled, disable it there — let code-level CORS handle it.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        policy =>
        {
            // SetIsOriginAllowed is used alone (not combined with WithOrigins)
            // to avoid ASP.NET Core AND-ing both checks together.
            policy.SetIsOriginAllowed(origin =>
                {
                    if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri)) return false;
                    var host = uri.Host;
                    return host == "localhost" ||
                           host.EndsWith(".vercel.app") ||
                           origin == "https://bizim.pk" ||
                           origin == "https://www.bizim.pk";
                })
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

// Register PostExService
builder.Services.AddHttpClient<IPostExService, PostExService>();

var app = builder.Build();

// CORS must be first — before HTTPS redirect — so preflight OPTIONS requests
// get the CORS headers before being 301-redirected away.
app.UseCors("AllowNextJs");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

// Add a simple health check at the root
app.MapGet("/", () => "Bizim.pk API is running and successfully connected!");

// Ensure DB schema is up to date with missing columns
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.ExecuteSqlRaw(@"
            ALTER TABLE ""Orders"" ADD COLUMN IF NOT EXISTS ""IsBookedAtPostEx"" boolean DEFAULT false;
            ALTER TABLE ""Orders"" ADD COLUMN IF NOT EXISTS ""TrackingNumber"" text;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""TaxEnabled"" boolean DEFAULT false;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""TaxRate"" numeric DEFAULT 0;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""Image2"" text;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""ImagePublicId2"" text;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""Image3"" text;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""ImagePublicId3"" text;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""Image4"" text;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""ImagePublicId4"" text;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""Tags"" text;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""AvailableColors"" text;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""RelatedProducts"" text;
            ALTER TABLE ""Products"" ADD COLUMN IF NOT EXISTS ""Collection"" text;
        ");
        Console.WriteLine("[INFO] Database schema check completed successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[WARN] Schema check exception: {ex.Message}");
    }
}

app.MapControllers();

app.Run();