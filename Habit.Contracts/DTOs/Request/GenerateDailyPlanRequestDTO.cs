namespace Habit.Contracts.DTOs.Request
{
    public class CompletedDayInfo
    {
        public int Day { get; set; }
        public string Title { get; set; } = null!;
        public List<string> Tasks { get; set; } = new();
        public bool IsCompleted { get; set; }
    }

    public class GenerateDailyPlanRequestDTO
    {
        public string HabitId { get; set; } = null!;
        public int DayNumber { get; set; }
        public int? CurrentStreak { get; set; }
        public double? CompletionRate { get; set; }
        public List<CompletedDayInfo>? CompletedDays { get; set; }
        public HabitDTO? HabitInfo { get; set; }
    }
}
