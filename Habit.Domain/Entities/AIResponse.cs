namespace Habit.Domain.Entities
{
    public class AIResponse
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string RequestId { get; set; } = null !;
        public string RawResponse { get; set; } = null !;
        public string ParsedResponse { get; set; } = null !;
        public bool Success { get; set; }
        public double DurationSeconds { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime CreatedAt { get; set; }
        public AIRequest Request { get; set; } = null !;
    }
}
