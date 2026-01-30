using Habit.Domain.Entities;

namespace Habit.Application.Abstractions;

public interface IAIRequestRepository
{
    Task AddAsync(AIRequest request, CancellationToken ct = default);
}



