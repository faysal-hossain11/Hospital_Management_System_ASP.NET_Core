using HospitalManagement.API.DTOs.Appointment;
using HospitalManagement.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _service;

    public AppointmentsController(IAppointmentService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var appointments = await _service.GetAllAsync();

        return Ok(appointments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var appointment = await _service.GetByIdAsync(id);

        if (appointment == null)
            return NotFound(new
            {
                message = "Appointment not found"
            });

        return Ok(appointment);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateAppointmentDto dto)
    {
        var appointment = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = appointment.Id },
            appointment
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateAppointmentDto dto)
    {
        var appointment =
            await _service.UpdateAsync(id, dto);

        if (appointment == null)
            return NotFound(new
            {
                message = "Appointment not found"
            });

        return Ok(appointment);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound(new
            {
                message = "Appointment not found"
            });

        return Ok(new
        {
            message = "Appointment deleted successfully"
        });
    }
}