namespace Habit.Domain.Entities
{
    public class AIRequest
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = null !;
        public string? HabitId { get; set; }
        public string FunctionType { get; set; } = null !;
        public string InputData { get; set; } = null !;
        public string? ModelName { get; set; }
        public string? Prompt { get; set; }
        public DateTime CreatedAt { get; set; }
        public Habit? Habit { get; set; }
        public AIResponse? Response { get; set; }
    }
}
