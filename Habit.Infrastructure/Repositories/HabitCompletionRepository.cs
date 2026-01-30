using Habit.Application.Abstractions;
using Habit.Domain.Entities;
using Habit.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Habit.Infrastructure.Repositories;
public class HabitCompletionRepository : IHabitCompletionRepository
{
    private readonly HabitDbContext _db;
    public HabitCompletionRepository(HabitDbContext db) => _db = db;
    public async Task AddAsync(HabitCompletion completion, CancellationToken ct = default) => await _db.HabitCompletions.AddAsync(completion, ct);
    public Task<bool> AnyOnDateAsync(string habitId, DateTime dateUtc, CancellationToken ct = default)
    {
        var date = DateTime.SpecifyKind(dateUtc.Date, DateTimeKind.Utc);
        var startOfDay = date;
        var endOfDay = date.AddDays(1).AddTicks(-1);
        return _db.HabitCompletions.AnyAsync(c => c.HabitId == habitId && c.CompletedAt >= startOfDay && c.CompletedAt < endOfDay, ct);
    }

    public Task<bool> ExistsOnDateAsync(string habitId, DateTime dateUtc, CancellationToken ct = default)
    {
        var date = DateTime.SpecifyKind(dateUtc.Date, DateTimeKind.Utc);
        var startOfDay = date;
        var endOfDay = date.AddDays(1).AddTicks(-1);
        return _db.HabitCompletions.AnyAsync(c => c.HabitId == habitId && c.CompletedAt >= startOfDay && c.CompletedAt < endOfDay, ct);
    }

    public Task<HabitCompletion?> GetByHabitIdAndDateAsync(string habitId, DateTime dateUtc, CancellationToken ct = default)
    {
        var date = DateTime.SpecifyKind(dateUtc.Date, DateTimeKind.Utc);
        var startOfDay = date;
        var endOfDay = date.AddDays(1).AddTicks(-1);
        return _db.HabitCompletions.FirstOrDefaultAsync(c => c.HabitId == habitId && c.CompletedAt >= startOfDay && c.CompletedAt < endOfDay, ct);
    }

    public Task DeleteAsync(HabitCompletion completion, CancellationToken ct = default)
    {
        _db.HabitCompletions.Remove(completion);
        return Task.CompletedTask;
    }
}
