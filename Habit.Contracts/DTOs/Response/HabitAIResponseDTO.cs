namespace Habit.Contracts.DTOs.Response
{
    public class HabitAIResponseDTO
    {
        public bool Success { get; set; }
        public object? ParsedResponse { get; set; }
        public string? RawResponse { get; set; }
        public double DurationSeconds { get; set; }
        public string? ErrorMessage { get; set; }
        public string RequestId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}


