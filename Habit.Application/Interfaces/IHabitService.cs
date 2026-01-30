using Habit.Contracts.DTOs.Request;
using Habit.Contracts.DTOs.Response;

namespace Habit.Application.Interfaces
{
    public interface IHabitService
    {
        Task<List<HabitResponseDTO>> GetUserHabitsAsync(string userId);
        Task<HabitResponseDTO?> GetHabitByIdAsync(string userId, string habitId);
        Task<HabitResponseDTO> CreateHabitAsync(string userId, HabitDTO habit, string? userEmail = null);
        Task<HabitResponseDTO?> UpdateHabitAsync(string userId, string habitId, HabitDTO habit);
        Task<bool> DeleteHabitAsync(string userId, string habitId);
        Task<bool> CompleteHabitAsync(string userId, string habitId, DateTime? date = null, double? quantity = null, string? notes = null, string? userEmail = null);
        Task<HabitDayPlanResponseDTO?> SetPlanDayCompletedAsync(string userId, string habitId, int dayNumber, bool isCompleted);
        Task<HabitDayPlanResponseDTO?> UpdateHabitDayPlanAsync(string userId, string habitId, int dayNumber, string title, List<string> tasks);
        Task<List<HabitResponseDTO>> GetHabitsForDateAsync(string userId, DateTime date);
    }
}


