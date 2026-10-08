namespace HospitalManagement.API.DTOs.Appointment;

public class AppointmentResponseDto
{
    public int Id { get; set; }

    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;

    public int DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;

    public DateTime AppointmentDate { get; set; }

    public string Status { get; set; } = string.Empty;
}