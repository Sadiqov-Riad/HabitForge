namespace Habit.Contracts.DTOs.Response
{
    public class HabitDayPlanResponseDTO
    {
        public int Day { get; set; }
        public string Title { get; set; } = null!;
        public List<string> Tasks { get; set; } = new();
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public class HabitResponseDTO
    {
        public string Id { get; set; }
        public string Action { get; set; }
        public string Frequency { get; set; }
        public string? Time { get; set; }
        public string? Goal { get; set; }
        public string? Unit { get; set; }
        public double? Quantity { get; set; }
        public string? Category { get; set; }
        public string? Duration { get; set; }
        public string? Priority { get; set; }
        public string? ScheduleDays { get; set; }
        public string? ScheduleTimes { get; set; }
        public string Description { get; set; }
        public int? ProgramDays { get; set; }
        public List<HabitDayPlanResponseDTO> DayPlan { get; set; } = new();
        public int CurrentStreak { get; set; }
        public int BestStreak { get; set; }
        public double CompletionRate { get; set; }
        public int TotalCompletions { get; set; }
        public int DaysTracked { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        public bool? IsCompletedForDate { get; set; }
    }
}


