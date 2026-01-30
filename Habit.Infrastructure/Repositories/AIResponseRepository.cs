using Habit.Application.Abstractions;
using Habit.Domain.Entities;
using Habit.Infrastructure.Contexts;

namespace Habit.Infrastructure.Repositories;

public class AIResponseRepository : IAIResponseRepository
{
    private readonly HabitDbContext _db;

    public AIResponseRepository(HabitDbContext db) => _db = db;

    public async Task AddAsync(AIResponse response, CancellationToken ct = default)
        => await _db.AIResponses.AddAsync(response, ct);
}



