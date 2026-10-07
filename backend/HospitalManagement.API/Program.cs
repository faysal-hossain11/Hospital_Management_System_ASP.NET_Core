using HospitalManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Repositories;
using HospitalManagement.API.Repositories.Interfaces;
using HospitalManagement.API.Services;
using HospitalManagement.API.Services.Interfaces;




var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IPatientService, PatientService>();

builder.Services.AddControllers();

// EF Core + PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);


// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();