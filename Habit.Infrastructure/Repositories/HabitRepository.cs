using Habit.Application.Abstractions;
using Habit.Domain.Entities;
using Habit.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Habit.Infrastructure.Repositories;

public class HabitRepository : IHabitRepository
{
    private readonly HabitDbContext _db;

    public HabitRepository(HabitDbContext db) => _db = db;

    public Task<List<Domain.Entities.Habit>> GetActiveByUserAsync(string userId, CancellationToken ct = default)
        => _db.Habits
            .Where(h => h.UserId == userId && h.IsActive)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync(ct);

    public Task<Domain.Entities.Habit?> GetActiveByIdAsync(string userId, string habitId, CancellationToken ct = default)
        => _db.Habits
            .Include(h => h.PlanDays)
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId && h.IsActive, ct);

    public async Task AddAsync(Domain.Entities.Habit habit, CancellationToken ct = default)
        => await _db.Habits.AddAsync(habit, ct);
}


