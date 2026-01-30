using Habit.Application.Abstractions;
using Habit.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Habit.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserPreferencesController : ControllerBase
{
    private readonly IUserPreferenceRepository _prefs;
    private readonly IHabitUnitOfWork _uow;

    public UserPreferencesController(IUserPreferenceRepository prefs, IHabitUnitOfWork uow)
    {
        _prefs = prefs;
        _uow = uow;
    }

    [HttpGet("email-notifications")]
    public async Task<ActionResult<object>> GetEmailNotifications()
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var enabled = await _prefs.GetEmailNotificationsEnabledAsync(userId);
        return Ok(new { enabled });
    }

    public sealed class UpdateEmailNotificationsRequest
    {
        public bool Enabled { get; set; }
    }

    [HttpPut("email-notifications")]
    public async Task<ActionResult<object>> UpdateEmailNotifications([FromBody] UpdateEmailNotificationsRequest request)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await _prefs.UpsertEmailNotificationsEnabledAsync(userId, request.Enabled);
        await _uow.SaveChangesAsync();

        return Ok(new { enabled = request.Enabled });
    }
}

