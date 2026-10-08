using HospitalManagement.API.DTOs.Appointment;
using HospitalManagement.API.Models;
using HospitalManagement.API.Repositories.Interfaces;
using HospitalManagement.API.Services.Interfaces;

namespace HospitalManagement.API.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _repository;

    public AppointmentService(IAppointmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AppointmentResponseDto>> GetAllAsync()
    {
        var appointments = await _repository.GetAllAsync();

        return appointments.Select(a => new AppointmentResponseDto
        {
            Id = a.Id,

            PatientId = a.PatientId,
            PatientName = a.Patient.Name,

            DoctorId = a.DoctorId,
            DoctorName = a.Doctor.Name,
            Specialization = a.Doctor.Specialization,

            AppointmentDate = a.AppointmentDate,
            Status = a.Status

        }).ToList();
    }

    public async Task<AppointmentResponseDto?> GetByIdAsync(int id)
    {
        var appointment = await _repository.GetByIdAsync(id);

        if (appointment == null)
            return null;

        return new AppointmentResponseDto
        {
            Id = appointment.Id,

            PatientId = appointment.PatientId,
            PatientName = appointment.Patient.Name,

            DoctorId = appointment.DoctorId,
            DoctorName = appointment.Doctor.Name,
            Specialization = appointment.Doctor.Specialization,

            AppointmentDate = appointment.AppointmentDate,
            Status = appointment.Status
        };
    }

    public async Task<AppointmentResponseDto> CreateAsync(
        CreateAppointmentDto dto)
    {
        var appointment = new Appointment
        {
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            AppointmentDate = DateTime.SpecifyKind(
                dto.AppointmentDate,
                DateTimeKind.Utc
            ),
            Status = dto.Status
        };

        var createdAppointment =
            await _repository.CreateAsync(appointment);

        var result =
            await _repository.GetByIdAsync(createdAppointment.Id);

        return new AppointmentResponseDto
        {
            Id = result!.Id,

            PatientId = result.PatientId,
            PatientName = result.Patient.Name,

            DoctorId = result.DoctorId,
            DoctorName = result.Doctor.Name,
            Specialization = result.Doctor.Specialization,

            AppointmentDate = result.AppointmentDate,
            Status = result.Status
        };
    }

    public async Task<AppointmentResponseDto?> UpdateAsync(
        int id,
        UpdateAppointmentDto dto)
    {
        var appointment = new Appointment
        {
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            AppointmentDate = DateTime.SpecifyKind(
                dto.AppointmentDate,
                DateTimeKind.Utc
            ),
            Status = dto.Status
        };

        var updatedAppointment =
            await _repository.UpdateAsync(id, appointment);

        if (updatedAppointment == null)
            return null;

        var result =
            await _repository.GetByIdAsync(id);

        return new AppointmentResponseDto
        {
            Id = result!.Id,

            PatientId = result.PatientId,
            PatientName = result.Patient.Name,

            DoctorId = result.DoctorId,
            DoctorName = result.Doctor.Name,
            Specialization = result.Doctor.Specialization,

            AppointmentDate = result.AppointmentDate,
            Status = result.Status
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }
}