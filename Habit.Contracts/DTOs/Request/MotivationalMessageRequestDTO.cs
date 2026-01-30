namespace Habit.Contracts.DTOs.Request
{
    public class MotivationalMessageRequestDTO
    {
        public List<HabitDTO> UserHabits { get; set; } = new();
    }
}


