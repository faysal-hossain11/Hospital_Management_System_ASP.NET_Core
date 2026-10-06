using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Repositories;

public class PatientRepository : IPatientRepository
{
    private readonly AppDbContext _context;

    public PatientRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Patient>> GetAllAsync()
    {
        return await _context.Patients.ToListAsync();
    }

    public async Task<Patient?> GetByIdAsync(int id)
    {
        return await _context.Patients.FindAsync(id);
    }

    public async Task<Patient> CreateAsync(Patient patient)
    {
        _context.Patients.Add(patient);

        await _context.SaveChangesAsync();

        return patient;
    }

    public async Task<Patient?> UpdateAsync(int id, Patient patient)
    {
        var existingPatient = await _context.Patients.FindAsync(id);

        if (existingPatient == null)
            return null;

        existingPatient.Name = patient.Name;
        existingPatient.Age = patient.Age;
        existingPatient.Gender = patient.Gender;
        existingPatient.Phone = patient.Phone;
        existingPatient.Address = patient.Address;

        await _context.SaveChangesAsync();

        return existingPatient;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var patient = await _context.Patients.FindAsync(id);

        if (patient == null)
            return false;

        _context.Patients.Remove(patient);

        await _context.SaveChangesAsync();

        return true;
    }
}