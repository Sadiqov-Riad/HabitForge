using Habit.Application.Abstractions;
using Habit.Domain.Entities;
using Habit.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Habit.Infrastructure.Repositories;

public class HabitPlanDayRepository : IHabitPlanDayRepository
{
    private readonly HabitDbContext _db;

    public HabitPlanDayRepository(HabitDbContext db) => _db = db;

    public Task<List<HabitPlanDay>> GetByHabitIdAsync(string habitId, CancellationToken ct = default)
        => _db.HabitPlanDays
            .Where(x => x.HabitId == habitId)
            .OrderBy(x => x.DayNumber)
            .ToListAsync(ct);

    public Task<HabitPlanDay?> GetByHabitIdAndDayAsync(string habitId, int dayNumber, CancellationToken ct = default)
        => _db.HabitPlanDays.FirstOrDefaultAsync(x => x.HabitId == habitId && x.DayNumber == dayNumber, ct);

    public async Task AddRangeAsync(IEnumerable<HabitPlanDay> items, CancellationToken ct = default)
        => await _db.HabitPlanDays.AddRangeAsync(items, ct);
}


