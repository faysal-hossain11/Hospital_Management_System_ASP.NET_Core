using HospitalManagement.API.Models;

namespace HospitalManagement.API.Repositories.Interfaces;

public interface IPatientRepository
{
    Task<List<Patient>> GetAllAsync();

    Task<Patient?> GetByIdAsync(int id);

    Task<Patient> CreateAsync(Patient patient);

    Task<Patient?> UpdateAsync(int id, Patient patient);

    Task<bool> DeleteAsync(int id);
}