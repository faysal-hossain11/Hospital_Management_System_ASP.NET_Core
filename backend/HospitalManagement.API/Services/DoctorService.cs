using HospitalManagement.API.DTOs.Doctor;
using HospitalManagement.API.Models;
using HospitalManagement.API.Repositories.Interfaces;
using HospitalManagement.API.Services.Interfaces;

namespace HospitalManagement.API.Services;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _repository;

    public DoctorService(IDoctorRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Doctor>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Doctor?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Doctor> CreateAsync(CreateDoctorDto dto)
    {
        var doctor = new Doctor
        {
            Name = dto.Name,
            Specialization = dto.Specialization,
            Phone = dto.Phone
        };

        return await _repository.CreateAsync(doctor);
    }

    public async Task<Doctor?> UpdateAsync(
        int id,
        CreateDoctorDto dto)
    {
        var doctor = new Doctor
        {
            Name = dto.Name,
            Specialization = dto.Specialization,
            Phone = dto.Phone
        };

        return await _repository.UpdateAsync(id, doctor);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    public async Task<Doctor?> UpdateAsync(
    int id,
    UpdateDoctorDto dto)
{
    var doctor = new Doctor
    {
        Name = dto.Name,
        Specialization = dto.Specialization,
        Phone = dto.Phone
    };

    return await _repository.UpdateAsync(id, doctor);
}
}