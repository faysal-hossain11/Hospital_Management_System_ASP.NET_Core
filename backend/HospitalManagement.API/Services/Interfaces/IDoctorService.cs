using HospitalManagement.API.DTOs.Doctor;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Services.Interfaces;

public interface IDoctorService
{
    Task<List<Doctor>> GetAllAsync();
    Task<Doctor?> GetByIdAsync(int id);
    Task<Doctor> CreateAsync(CreateDoctorDto dto);
    Task<Doctor?> UpdateAsync(int id, CreateDoctorDto dto);
    Task<bool> DeleteAsync(int id);
    Task<Doctor?> UpdateAsync(
    int id,
    UpdateDoctorDto dto);
}