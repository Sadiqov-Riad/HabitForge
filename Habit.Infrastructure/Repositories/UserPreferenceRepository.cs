using Habit.Application.Abstractions;
using Habit.Domain.Entities;
using Habit.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Habit.Infrastructure.Repositories;

public class UserPreferenceRepository : IUserPreferenceRepository
{
    private readonly HabitDbContext _db;

    public UserPreferenceRepository(HabitDbContext db)
    {
        _db = db;
    }

    public Task<UserPreference?> GetByUserIdAsync(string userId, CancellationToken ct = default)
    {
        return _db.UserPreferences.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId, ct);
    }

    public async Task<bool> GetEmailNotificationsEnabledAsync(string userId, CancellationToken ct = default)
    {
        var pref = await _db.UserPreferences.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId, ct);
        return pref?.EmailNotificationsEnabled ?? false;
    }

    public async Task UpsertEmailNotificationsEnabledAsync(string userId, bool enabled, CancellationToken ct = default)
    {
        var pref = await _db.UserPreferences.FirstOrDefaultAsync(x => x.UserId == userId, ct);
        if (pref == null)
        {
            pref = new UserPreference
            {
                UserId = userId,
                EmailNotificationsEnabled = enabled,
                UpdatedAt = DateTime.UtcNow
            };
            _db.UserPreferences.Add(pref);
            return;
        }

        pref.EmailNotificationsEnabled = enabled;
        pref.UpdatedAt = DateTime.UtcNow;
    }
}

