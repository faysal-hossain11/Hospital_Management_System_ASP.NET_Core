using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Repositories;

public class DoctorRepository : IDoctorRepository
{
    private readonly AppDbContext _context;

    public DoctorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Doctor>> GetAllAsync()
    {
        return await _context.Doctors.ToListAsync();
    }

    public async Task<Doctor?> GetByIdAsync(int id)
    {
        return await _context.Doctors.FindAsync(id);
    }

    public async Task<Doctor> CreateAsync(Doctor doctor)
    {
        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();

        return doctor;
    }

    public async Task<Doctor?> UpdateAsync(
        int id,
        Doctor doctor)
    {
        var existingDoctor =
            await _context.Doctors.FindAsync(id);

        if (existingDoctor == null)
            return null;

        existingDoctor.Name = doctor.Name;
        existingDoctor.Specialization = doctor.Specialization;
        existingDoctor.Phone = doctor.Phone;

        await _context.SaveChangesAsync();

        return existingDoctor;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var doctor =
            await _context.Doctors.FindAsync(id);

        if (doctor == null)
            return false;

        _context.Doctors.Remove(doctor);
        await _context.SaveChangesAsync();

        return true;
    }
}