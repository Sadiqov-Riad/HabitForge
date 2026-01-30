namespace Habit.Contracts.DTOs.Request
{
    public class ProgressAdviceRequestDTO
    {
        public List<HabitDTO> UserHabits { get; set; } = new();
    }
}


