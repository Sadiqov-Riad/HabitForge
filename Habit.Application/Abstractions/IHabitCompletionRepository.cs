using Habit.Domain.Entities;

namespace Habit.Application.Abstractions;

public interface IHabitCompletionRepository
{
    Task AddAsync(HabitCompletion completion, CancellationToken ct = default);
    Task<bool> AnyOnDateAsync(string habitId, DateTime dateUtc, CancellationToken ct = default);
    Task<bool> ExistsOnDateAsync(string habitId, DateTime dateUtc, CancellationToken ct = default);
    Task<HabitCompletion?> GetByHabitIdAndDateAsync(string habitId, DateTime dateUtc, CancellationToken ct = default);
    Task DeleteAsync(HabitCompletion completion, CancellationToken ct = default);
}



