namespace Habit.Application.Abstractions;

public interface IHabitUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}



