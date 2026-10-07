namespace HospitalManagement.API.Models;

public class Appointment
{
    public int Id { get; set; }

    public DateTime AppointmentDate { get; set; }

    public string Status { get; set; } = "Scheduled";

    // Foreign Key
    public int PatientId { get; set; }

    // Navigation Property
    public Patient Patient { get; set; } = null!;

    // Foreign Key
    public int DoctorId { get; set; }

    // Navigation Property
    public Doctor Doctor { get; set; } = null!;
}