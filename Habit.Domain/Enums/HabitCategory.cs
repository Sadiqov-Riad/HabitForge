namespace Habit.Domain.Enums;
public static class HabitCategory
{
    public const string Health = "Health";
    public const string Fitness = "Fitness";
    public const string Nutrition = "Nutrition";
    public const string Productivity = "Productivity";
    public const string Learning = "Learning";
    public const string Finance = "Finance";
    public const string Relationships = "Relationships";
    public const string Hobby = "Hobby";
    public const string SelfCare = "Self-care";
    public const string Work = "Work";
    public const string Creativity = "Creativity";
    public const string Environment = "Environment";
    public static readonly string[] All = new[]
    {
        Health,
        Fitness,
        Nutrition,
        Productivity,
        Learning,
        Finance,
        Relationships,
        Hobby,
        SelfCare,
        Work,
        Creativity
    };
    public static bool IsValid(string? category)
    {
        if (string.IsNullOrWhiteSpace(category))
            return false;
        return All.Contains(category, StringComparer.OrdinalIgnoreCase);
    }
}
