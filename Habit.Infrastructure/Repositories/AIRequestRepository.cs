using Habit.Application.Abstractions;
using Habit.Domain.Entities;
using Habit.Infrastructure.Contexts;

namespace Habit.Infrastructure.Repositories;

public class AIRequestRepository : IAIRequestRepository
{
    private readonly HabitDbContext _db;

    public AIRequestRepository(HabitDbContext db) => _db = db;

    public async Task AddAsync(AIRequest request, CancellationToken ct = default)
        => await _db.AIRequests.AddAsync(request, ct);
}



