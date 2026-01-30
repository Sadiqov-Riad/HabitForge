using System.ComponentModel.DataAnnotations;
using Habit.Contracts.Validation;

namespace Habit.Contracts.DTOs.Request
{
    public class SuggestHabitsRequestDTO
    {
        public List<HabitDTO> ExistingHabits { get; set; } = new();

        [MaxLength(HabitFieldLimits.DescriptionMax)]
        public string? UserGoals { get; set; }

        [MaxLength(HabitFieldLimits.DescriptionMax)]
        public string? Preferences { get; set; }

        [MaxLength(HabitFieldLimits.DescriptionMax)]
        public string? TimeAvailability { get; set; }
    }

    public class HabitDayPlanDTO
    {
        public int Day { get; set; }

        [Required]
        [MaxLength(HabitFieldLimits.DayTitleMax)]
        public string Title { get; set; } = null !;
        public List<string> Tasks { get; set; } = new();
    }

    public class HabitDTO
    {
        public string? Id { get; set; }

        [Required]
        [MaxLength(HabitFieldLimits.ActionMax)]
        public string Action { get; set; }

        [Required]
        [MaxLength(HabitFieldLimits.FrequencyMax)]
        public string Frequency { get; set; }

        [MaxLength(HabitFieldLimits.TimeMax)]
        public string? Time { get; set; }

        [MaxLength(HabitFieldLimits.GoalMax)]
        public string? Goal { get; set; }

        [MaxLength(HabitFieldLimits.UnitMax)]
        public string? Unit { get; set; }
        public double? Quantity { get; set; }

        [MaxLength(HabitFieldLimits.CategoryMax)]
        public string? Category { get; set; }

        [MaxLength(HabitFieldLimits.DurationMax)]
        public string? Duration { get; set; }

        [MaxLength(HabitFieldLimits.PriorityMax)]
        public string? Priority { get; set; }

        [MaxLength(HabitFieldLimits.ScheduleDaysMax)]
        public string? ScheduleDays { get; set; }

        [MaxLength(HabitFieldLimits.ScheduleTimesMax)]
        public string? ScheduleTimes { get; set; }

        [Required]
        [MaxLength(HabitFieldLimits.DescriptionMax)]
        public string Description { get; set; }
        public int? ProgramDays { get; set; }
        public List<HabitDayPlanDTO>? DayPlan { get; set; }
        public int CurrentStreak { get; set; }
        public int BestStreak { get; set; }
        public double CompletionRate { get; set; }
        public int TotalCompletions { get; set; }
        public int DaysTracked { get; set; }
    }
}
