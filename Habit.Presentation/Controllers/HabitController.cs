using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Habit.Application.Interfaces;
using Habit.Contracts.DTOs.Request;
using Habit.Contracts.DTOs.Response;
using System.Security.Claims;

namespace Habit.Presentation.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HabitController : ControllerBase
{
    private readonly IHabitService _habitService;
    public HabitController(IHabitService habitService)
    {
        _habitService = habitService;
    }

    [HttpGet]
    public async Task<ActionResult<List<HabitResponseDTO>>> GetHabits()
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var habits = await _habitService.GetUserHabitsAsync(userId);
        return Ok(habits);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HabitResponseDTO>> GetHabit(string id)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var habit = await _habitService.GetHabitByIdAsync(userId, id);
        if (habit == null)
            return NotFound();
        return Ok(habit);
    }

    [HttpPost]
    public async Task<ActionResult<HabitResponseDTO>> CreateHabit([FromBody] HabitDTO habit)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? User.FindFirst("email")?.Value;
        var createdHabit = await _habitService.CreateHabitAsync(userId, habit, userEmail);
        return CreatedAtAction(nameof(GetHabit), new { id = createdHabit.Id }, createdHabit);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<HabitResponseDTO>> UpdateHabit(string id, [FromBody] HabitDTO habit)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var updatedHabit = await _habitService.UpdateHabitAsync(userId, id, habit);
        if (updatedHabit == null)
            return NotFound();
        return Ok(updatedHabit);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHabit(string id)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var deleted = await _habitService.DeleteHabitAsync(userId, id);
        if (!deleted)
            return NotFound();
        return NoContent();
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> CompleteHabit(string id, [FromBody] CompleteHabitRequestDTO? request = null)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? User.FindFirst("email")?.Value;
        DateTime? date = null;
        if (!string.IsNullOrEmpty(request?.Date) && DateTime.TryParse(request.Date, out var parsedDate))
        {
            date = parsedDate;
        }

        var completed = await _habitService.CompleteHabitAsync(userId, id, date, request?.Quantity, request?.Notes, userEmail);
        if (!completed)
            return NotFound();
        return Ok(new { message = "Habit completed successfully" });
    }

    [HttpPut("{id}/plan/{dayNumber}")]
    public async Task<ActionResult<HabitDayPlanResponseDTO>> SetPlanDayCompleted(string id, int dayNumber, [FromBody] SetPlanDayCompletionRequestDTO request)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var updated = await _habitService.SetPlanDayCompletedAsync(userId, id, dayNumber, request.IsCompleted);
        if (updated == null)
            return NotFound();
        return Ok(updated);
    }

    [HttpPut("{id}/plan/{dayNumber}/update")]
    public async Task<ActionResult<HabitDayPlanResponseDTO>> UpdateHabitDayPlan(string id, int dayNumber, [FromBody] UpdateHabitDayPlanRequestDTO request)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var updated = await _habitService.UpdateHabitDayPlanAsync(userId, id, dayNumber, request.Title, request.Tasks);
        if (updated == null)
            return NotFound();
        return Ok(updated);
    }

    [HttpGet("for-date/{date}")]
    public async Task<ActionResult<List<HabitResponseDTO>>> GetHabitsForDate(string date)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        if (!DateTime.TryParse(date, out var parsedDate))
        {
            return BadRequest(new { message = "Invalid date format" });
        }

        try
        {
            var dateOnly = DateTime.SpecifyKind(parsedDate.Date, DateTimeKind.Utc);
            var habits = await _habitService.GetHabitsForDateAsync(userId, dateOnly);
            return Ok(habits);
        }
        catch (Exception ex)
        {
            throw;
        }
    }
}

public class CompleteHabitRequestDTO
{
    public string? Date { get; set; }
    public double? Quantity { get; set; }

    [System.ComponentModel.DataAnnotations.MaxLength(Habit.Contracts.Validation.HabitFieldLimits.NotesMax)]
    public string? Notes { get; set; }
}

public class SetPlanDayCompletionRequestDTO
{
    public bool IsCompleted { get; set; }
}

public class UpdateHabitDayPlanRequestDTO
{
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.MaxLength(Habit.Contracts.Validation.HabitFieldLimits.DayTitleMax)]
    public string Title { get; set; } = null !;
    public List<string> Tasks { get; set; } = new();
}
