using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.DTOs.Appointment;

public class UpdateAppointmentDto
{
    [Range(1, int.MaxValue)]
    public int PatientId { get; set; }

    [Range(1, int.MaxValue)]
    public int DoctorId { get; set; }

    public DateTime AppointmentDate { get; set; }

    [Required]
    public string Status { get; set; } = "Scheduled";
}