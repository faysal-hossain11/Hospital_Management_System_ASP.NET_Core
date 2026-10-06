using HospitalManagement.API.DTOs.Patient;
using HospitalManagement.API.Models;
using HospitalManagement.API.Repositories.Interfaces;
using HospitalManagement.API.Services.Interfaces;

namespace HospitalManagement.API.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _repository;

    public PatientService(IPatientRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Patient>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Patient?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Patient> CreateAsync(CreatePatientDto dto)
    {
        var patient = new Patient
        {
            Name = dto.Name,
            Age = dto.Age,
            Gender = dto.Gender,
            Phone = dto.Phone,
            Address = dto.Address
        };

        return await _repository.CreateAsync(patient);
    }

    public async Task<Patient?> UpdateAsync(int id, UpdatePatientDto dto)
    {
        var patient = new Patient
        {
            Name = dto.Name,
            Age = dto.Age,
            Gender = dto.Gender,
            Phone = dto.Phone,
            Address = dto.Address
        };

        return await _repository.UpdateAsync(id, patient);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }
}