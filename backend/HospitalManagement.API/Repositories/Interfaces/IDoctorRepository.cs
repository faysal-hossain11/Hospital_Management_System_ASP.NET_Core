using HospitalManagement.API.Models;

namespace HospitalManagement.API.Repositories.Interfaces;

public interface IDoctorRepository
{
    Task<List<Doctor>> GetAllAsync();
    Task<Doctor?> GetByIdAsync(int id);
    Task<Doctor> CreateAsync(Doctor doctor);
    Task<Doctor?> UpdateAsync(int id, Doctor doctor);
    Task<bool> DeleteAsync(int id);
}