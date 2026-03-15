using Microsoft.EntityFrameworkCore;
using Bizim.pk.API.Data;
using dotenv.net;
using CloudinaryDotNet;
using System.Text.Json.Serialization;

// Load environment variables from .env file
DotEnv.Load(new DotEnvOptions(probeForEnv: true, probeLevelsToSearch: 5));

var builder = WebApplication.CreateBuilder(args);

// Configure Entity Framework Core with PostgreSQL (Supabase)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

Console.WriteLine($"[DEBUG] Using connection string from config: {(string.IsNullOrEmpty(connectionString) ? "NULL" : connectionString.Substring(0, Math.Min(connectionString.Length, 20)) + "...")}");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

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
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

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

app.MapControllers();

app.Run();
