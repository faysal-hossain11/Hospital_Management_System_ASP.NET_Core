namespace HospitalManagement.API.DTOs.Doctor;

public class CreateDoctorDto
{
    public string Name { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}