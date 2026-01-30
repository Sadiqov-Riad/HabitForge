using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Habit.Application.Interfaces;
using Habit.Contracts.DTOs.Request;
using Habit.Contracts.DTOs.Response;

namespace Habit.Presentation.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HabitAIController : ControllerBase
{
    private readonly IHabitAIService _habitAIService;
    public HabitAIController(IHabitAIService habitAIService)
    {
        _habitAIService = habitAIService;
    }

    [HttpPost("extract-habits")]
    public async Task<ActionResult<HabitAIResponseDTO>> ExtractHabits([FromBody] NlpHabitRequestDTO request)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var result = await _habitAIService.ExtractHabitsAsync(userId, request);
        return Ok(result);
    }

    [HttpPost("suggest-habits")]
    public async Task<ActionResult<HabitAIResponseDTO>> SuggestHabits([FromBody] SuggestHabitsRequestDTO request)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var result = await _habitAIService.SuggestHabitsAsync(userId, request);
        return Ok(result);
    }

    [HttpPost("motivational-message")]
    public async Task<ActionResult<HabitAIResponseDTO>> GenerateMotivationalMessage([FromBody] MotivationalMessageRequestDTO request)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var result = await _habitAIService.GenerateMotivationalMessageAsync(userId, request);
        return Ok(result);
    }

    [HttpPost("progress-advice")]
    public async Task<ActionResult<HabitAIResponseDTO>> GetProgressAdvice([FromBody] ProgressAdviceRequestDTO request)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var result = await _habitAIService.GetProgressAdviceAsync(userId, request);
        return Ok(result);
    }

    [HttpPost("complete-habit-fields")]
    public async Task<ActionResult<HabitAIResponseDTO>> CompleteHabitFields([FromBody] CompleteHabitFieldsRequestDTO request)
    {
        var userId = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var result = await _habitAIService.CompleteHabitFieldsAsync(userId, request);
        return Ok(result);
    }

    [HttpPost("generate-daily-plan")]
    public ActionResult<HabitAIResponseDTO> GenerateDailyPlan([FromBody] GenerateDailyPlanRequestDTO request)
    {
        return StatusCode(StatusCodes.Status410Gone, new HabitAIResponseDTO { Success = false, ErrorMessage = "Endpoint 'generate-daily-plan' is deprecated. Use the pre-generated program day_plan instead.", DurationSeconds = 0, RequestId = Guid.NewGuid().ToString(), CreatedAt = DateTime.UtcNow });
    }
}
