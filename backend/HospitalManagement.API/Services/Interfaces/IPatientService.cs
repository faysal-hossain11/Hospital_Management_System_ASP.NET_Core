using HospitalManagement.API.DTOs.Patient;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Services.Interfaces;

public interface IPatientService
{
    Task<List<Patient>> GetAllAsync();

    Task<Patient?> GetByIdAsync(int id);

    Task<Patient> CreateAsync(CreatePatientDto dto);

    Task<Patient?> UpdateAsync(int id, UpdatePatientDto dto);

    Task<bool> DeleteAsync(int id);
}