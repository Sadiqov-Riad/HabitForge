using Habit.Domain.Entities;

namespace Habit.Application.Abstractions;

public interface IHabitPlanDayRepository
{
    Task<List<HabitPlanDay>> GetByHabitIdAsync(string habitId, CancellationToken ct = default);
    Task<HabitPlanDay?> GetByHabitIdAndDayAsync(string habitId, int dayNumber, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<HabitPlanDay> items, CancellationToken ct = default);
}


