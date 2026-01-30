using Habit.Application.Abstractions;
using Habit.Infrastructure.Contexts;

namespace Habit.Infrastructure.Repositories;

public class HabitUnitOfWork : IHabitUnitOfWork
{
    private readonly HabitDbContext _db;

    public HabitUnitOfWork(HabitDbContext db) => _db = db;

    public Task<int> SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
}



