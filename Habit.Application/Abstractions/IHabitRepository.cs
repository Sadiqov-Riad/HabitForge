using HabitEntity = Habit.Domain.Entities.Habit;

namespace Habit.Application.Abstractions;

public interface IHabitRepository
{
    Task<List<HabitEntity>> GetActiveByUserAsync(string userId, CancellationToken ct = default);
    Task<HabitEntity?> GetActiveByIdAsync(string userId, string habitId, CancellationToken ct = default);
    Task AddAsync(HabitEntity habit, CancellationToken ct = default);
}


