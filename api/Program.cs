using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using dotenv.net;
using CloudinaryDotNet;

// Load environment variables from .env file
DotEnv.Load(new DotEnvOptions(probeForEnv: true, probeLevelsToSearch: 5));

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
else
{
    // Register a dummy to prevent DI errors in controller
    builder.Services.AddSingleton(new Cloudinary());
}

// Configure Entity Framework Core with SQLite
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

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
