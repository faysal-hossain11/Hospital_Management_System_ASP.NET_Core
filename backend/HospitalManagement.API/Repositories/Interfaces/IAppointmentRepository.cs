using HospitalManagement.API.Models;

namespace HospitalManagement.API.Repositories.Interfaces;

public interface IAppointmentRepository
{
    Task<List<Appointment>> GetAllAsync();
    Task<Appointment?> GetByIdAsync(int id);
    Task<Appointment> CreateAsync(Appointment appointment);
    Task<Appointment?> UpdateAsync(int id, Appointment appointment);
    Task<bool> DeleteAsync(int id);
}