namespace Habit.Domain.Entities;
public class UserPreference
{
    public string UserId { get; set; } = null !;
    public bool EmailNotificationsEnabled { get; set; } = false;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
