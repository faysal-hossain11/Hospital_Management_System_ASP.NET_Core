using HospitalManagement.API.DTOs.Doctor;
using HospitalManagement.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly IDoctorService _service;

    public DoctorsController(IDoctorService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var doctors = await _service.GetAllAsync();

        return Ok(doctors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var doctor = await _service.GetByIdAsync(id);

        if (doctor == null)
            return NotFound(new
            {
                message = "Doctor not found"
            });

        return Ok(doctor);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateDoctorDto dto)
    {
        var doctor = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = doctor.Id },
            doctor
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateDoctorDto dto)
    {
        var doctor = await _service.UpdateAsync(id, dto);

        if (doctor == null)
            return NotFound(new
            {
                message = "Doctor not found"
            });

        return Ok(doctor);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound(new
            {
                message = "Doctor not found"
            });

        return Ok(new
        {
            message = "Doctor deleted successfully"
        });
    }
}