using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using dotenv.net;
using CloudinaryDotNet;

// Load environment variables from .env file
DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Cloudinary
var cloudinaryUrl = Environment.GetEnvironmentVariable("CLOUDINARY_URL");
if (!string.IsNullOrEmpty(cloudinaryUrl))
{
    var cloudinary = new Cloudinary(cloudinaryUrl);
    cloudinary.Api.Client.Timeout = TimeSpan.FromSeconds(30);
    builder.Services.AddSingleton(cloudinary);
}

// Configure Entity Framework Core with PostgreSQL (Supabase)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
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

app.UseAuthorization();

app.MapControllers();

app.Run();
