namespace HospitalManagement.API.Models;

public class Doctor
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Specialization { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    // One Doctor → Many Appointments
    public ICollection<Appointment> Appointments { get; set; }
        = new List<Appointment>();
}