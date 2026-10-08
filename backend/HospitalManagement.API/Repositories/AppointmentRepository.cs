using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _context;

    public AppointmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Appointment>> GetAllAsync()
    {
        return await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .ToListAsync();
    }

    public async Task<Appointment?> GetByIdAsync(int id)
    {
        return await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Appointment> CreateAsync(Appointment appointment)
    {
        _context.Appointments.Add(appointment);

        await _context.SaveChangesAsync();

        return appointment;
    }

    public async Task<Appointment?> UpdateAsync(
        int id,
        Appointment appointment)
    {
        var existingAppointment =
            await _context.Appointments.FindAsync(id);

        if (existingAppointment == null)
            return null;

        existingAppointment.PatientId = appointment.PatientId;
        existingAppointment.DoctorId = appointment.DoctorId;
        existingAppointment.AppointmentDate =
            appointment.AppointmentDate;
        existingAppointment.Status = appointment.Status;

        await _context.SaveChangesAsync();

        return existingAppointment;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var appointment =
            await _context.Appointments.FindAsync(id);

        if (appointment == null)
            return false;

        _context.Appointments.Remove(appointment);

        await _context.SaveChangesAsync();

        return true;
    }
}