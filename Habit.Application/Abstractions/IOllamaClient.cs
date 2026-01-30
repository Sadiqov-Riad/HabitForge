namespace Habit.Application.Abstractions;

public interface IOllamaClient
{
    Task<string> GenerateAsync(string prompt, CancellationToken ct = default);
}



