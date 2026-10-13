using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.DTOs.Auth;

public class RegisterDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    [RegularExpression(
        @"^[a-zA-Z0-9_.-]+$",
        ErrorMessage = "Username can contain letters, numbers, _, . and - only."
    )]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
}