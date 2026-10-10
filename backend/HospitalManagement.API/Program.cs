using HospitalManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Repositories;
using HospitalManagement.API.Repositories.Interfaces;
using HospitalManagement.API.Services;
using HospitalManagement.API.Services.Interfaces;
using HospitalManagement.API.Middleware;




var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IAppointmentRepository,AppointmentRepository>();
builder.Services.AddScoped<IAppointmentService,AppointmentService>();
builder.Services.AddScoped<IDoctorRepository,DoctorRepository>();
builder.Services.AddScoped<IDoctorService,DoctorService>();

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors("FrontendPolicy");


// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();