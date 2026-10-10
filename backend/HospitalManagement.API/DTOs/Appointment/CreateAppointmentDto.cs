using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.DTOs.Appointment;

public class CreateAppointmentDto
{
    [Range(1, int.MaxValue)]
    public int PatientId { get; set; }

    [Range(1, int.MaxValue)]
    public int DoctorId { get; set; }

    public DateTime AppointmentDate { get; set; }

    [Required]
    [RegularExpression(
        "^(Scheduled|Completed|Cancelled)$",
        ErrorMessage = "Status must be Scheduled, Completed, or Cancelled."
    )]
    public string Status { get; set; } = "Scheduled";
}