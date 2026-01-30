using Habit.Domain.Entities;

namespace Habit.Application.Abstractions;

public interface IAIResponseRepository
{
    Task AddAsync(AIResponse response, CancellationToken ct = default);
}



