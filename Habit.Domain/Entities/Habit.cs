namespace Habit.Domain.Entities
{
    public class Habit
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = null !;
        public string Action { get; set; } = null !;
        public string Frequency { get; set; } = null !;
        public string Description { get; set; } = null !;
        public int? ProgramDays { get; set; }
        public string? Time { get; set; }
        public string? Goal { get; set; }
        public string? Unit { get; set; }
        public double? Quantity { get; set; }
        public string? Category { get; set; }
        public string? Duration { get; set; }
        public string? Priority { get; set; }
        public string? ScheduleDays { get; set; }
        public string? ScheduleTimes { get; set; }
        public int CurrentStreak { get; set; } = 0;
        public int BestStreak { get; set; } = 0;
        public double CompletionRate { get; set; } = 0.0;
        public int TotalCompletions { get; set; } = 0;
        public int DaysTracked { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public List<HabitCompletion> Completions { get; set; } = new();
        public List<HabitPlanDay> PlanDays { get; set; } = new();
        public List<AIRequest> AIRequests { get; set; } = new();
    }
}
