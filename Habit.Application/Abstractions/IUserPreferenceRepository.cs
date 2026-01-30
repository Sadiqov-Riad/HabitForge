using Habit.Domain.Entities;

namespace Habit.Application.Abstractions;

public interface IUserPreferenceRepository
{
    Task<UserPreference?> GetByUserIdAsync(string userId, CancellationToken ct = default);
    Task<bool> GetEmailNotificationsEnabledAsync(string userId, CancellationToken ct = default);
    Task UpsertEmailNotificationsEnabledAsync(string userId, bool enabled, CancellationToken ct = default);
}

