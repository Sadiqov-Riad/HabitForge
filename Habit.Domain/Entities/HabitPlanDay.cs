namespace Habit.Domain.Entities;
public class HabitPlanDay
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string HabitId { get; set; } = null !;
    public int DayNumber { get; set; }
    public string Title { get; set; } = null !;
    public string TasksJson { get; set; } = "[]";
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public Habit Habit { get; set; } = null !;
}
