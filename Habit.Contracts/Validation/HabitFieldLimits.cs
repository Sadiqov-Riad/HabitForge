namespace Habit.Contracts.Validation;
public static class HabitFieldLimits
{
    public const int ActionMax = 80;
    public const int DescriptionMax = 300;
    public const int FrequencyMax = 32;
    public const int TimeMax = 32;
    public const int GoalMax = 80;
    public const int UnitMax = 32;
    public const int CategoryMax = 32;
    public const int DurationMax = 50;
    public const int PriorityMax = 16;
    public const int ScheduleDaysMax = 512;
    public const int ScheduleTimesMax = 2048;
    public const int DayTitleMax = 80;
    public const int TaskMax = 160;
    public const int InputTextMax = 1000;
    public const int NotesMax = 500;
}
