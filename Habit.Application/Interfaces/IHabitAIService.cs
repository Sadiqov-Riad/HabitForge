using Habit.Contracts.DTOs.Request;
using Habit.Contracts.DTOs.Response;

namespace Habit.Application.Interfaces
{
    public interface IHabitAIService
    {
        Task<HabitAIResponseDTO> ExtractHabitsAsync(string userId, NlpHabitRequestDTO request);
        Task<HabitAIResponseDTO> SuggestHabitsAsync(string userId, SuggestHabitsRequestDTO request);
        Task<HabitAIResponseDTO> GenerateMotivationalMessageAsync(string userId, MotivationalMessageRequestDTO request);
        Task<HabitAIResponseDTO> GetProgressAdviceAsync(string userId, ProgressAdviceRequestDTO request);
        Task<HabitAIResponseDTO> CompleteHabitFieldsAsync(string userId, CompleteHabitFieldsRequestDTO request);
        Task<HabitAIResponseDTO> GenerateDailyPlanAsync(string userId, GenerateDailyPlanRequestDTO request);
    }
}


