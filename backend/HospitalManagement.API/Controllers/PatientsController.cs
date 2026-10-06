using HospitalManagement.API.DTOs.Patient;
using HospitalManagement.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _service;

    public PatientsController(IPatientService service)
    {
        _service = service;
    }

    // GET: api/patients
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var patients = await _service.GetAllAsync();

        return Ok(patients);
    }

    // GET: api/patients/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var patient = await _service.GetByIdAsync(id);

        if (patient == null)
            return NotFound(new { message = "Patient not found" });

        return Ok(patient);
    }

    // POST: api/patients
    [HttpPost]
    public async Task<IActionResult> Create(CreatePatientDto dto)
    {
        var patient = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = patient.Id },
            patient
        );
    }

    // PUT: api/patients/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdatePatientDto dto)
    {
        var patient = await _service.UpdateAsync(id, dto);

        if (patient == null)
            return NotFound(new { message = "Patient not found" });

        return Ok(patient);
    }

    // DELETE: api/patients/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound(new { message = "Patient not found" });

        return Ok(new { message = "Patient deleted successfully" });
    }
}