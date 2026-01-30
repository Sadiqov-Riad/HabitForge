namespace Habit.Domain.Entities
{
    public class HabitCompletion
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string HabitId { get; set; } = null !;
        public DateTime CompletedAt { get; set; }
        public double? Quantity { get; set; }
        public string? Notes { get; set; }
        public Habit Habit { get; set; } = null !;
    }
}
