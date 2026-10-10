using System.Text.Json;

namespace HospitalManagement.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found");

            context.Response.StatusCode = StatusCodes.Status404NotFound;
            context.Response.ContentType = "application/json";

            var response = new
            {
                message = ex.Message
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response)
            );
        }
        catch (ArgumentException ex)
        {
            context.Response.StatusCode =
                StatusCodes.Status400BadRequest;

            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(new
                {
                    message = ex.Message
                })
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred");

            context.Response.StatusCode =
                StatusCodes.Status500InternalServerError;

            context.Response.ContentType = "application/json";

            var response = new
            {
                message = "An unexpected error occurred."
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response)
            );
        }
    }
}