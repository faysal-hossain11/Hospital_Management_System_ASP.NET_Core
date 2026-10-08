using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.DTOs.Doctor;

public class UpdateDoctorDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Specialization { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string Phone { get; set; } = string.Empty;
}