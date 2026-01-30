using Habit.Application.Abstractions;
using Habit.Application.Interfaces;
using Habit.Contracts.DTOs.Request;
using Habit.Contracts.DTOs.Response;
using Habit.Domain.Entities;
using System.Net;
using System.Text.Json;

namespace Habit.Application.Services;
public class HabitService : IHabitService
{
    private readonly IHabitRepository _habits;
    private readonly IHabitCompletionRepository _completions;
    private readonly IHabitPlanDayRepository _planDays;
    private readonly IUserPreferenceRepository _prefs;
    private readonly IHabitUnitOfWork _uow;
    private readonly IEmailSender _emailSender;
    public HabitService(IHabitRepository habits, IHabitCompletionRepository completions, IHabitPlanDayRepository planDays, IUserPreferenceRepository prefs, IEmailSender emailSender, IHabitUnitOfWork uow)
    {
        _habits = habits;
        _completions = completions;
        _planDays = planDays;
        _prefs = prefs;
        _emailSender = emailSender;
        _uow = uow;
    }

    public async Task<List<HabitResponseDTO>> GetUserHabitsAsync(string userId)
    {
        var habits = await _habits.GetActiveByUserAsync(userId);
        return habits.Select(MapToDTO).ToList();
    }

    public async Task<HabitResponseDTO?> GetHabitByIdAsync(string userId, string habitId)
    {
        var habit = await _habits.GetActiveByIdAsync(userId, habitId);
        return habit == null ? null : MapToDTO(habit);
    }

    public async Task<HabitResponseDTO> CreateHabitAsync(string userId, HabitDTO habitDto, string? userEmail = null)
    {
        var habit = new Domain.Entities.Habit
        {
            UserId = userId,
            Action = habitDto.Action,
            Frequency = habitDto.Frequency,
            Time = habitDto.Time,
            Goal = habitDto.Goal,
            Unit = habitDto.Unit,
            Quantity = habitDto.Quantity,
            Category = habitDto.Category,
            Duration = habitDto.Duration,
            Priority = habitDto.Priority,
            ScheduleDays = habitDto.ScheduleDays,
            ScheduleTimes = habitDto.ScheduleTimes,
            Description = habitDto.Description,
            ProgramDays = habitDto.ProgramDays,
            CurrentStreak = habitDto.CurrentStreak,
            BestStreak = habitDto.BestStreak,
            CompletionRate = habitDto.CompletionRate,
            TotalCompletions = habitDto.TotalCompletions,
            DaysTracked = habitDto.DaysTracked,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };
        await _habits.AddAsync(habit);
        await _uow.SaveChangesAsync();
        if (habitDto.DayPlan is { Count: > 0 })
        {
            var maxDayFromPlan = habitDto.DayPlan.Max(p => p.Day);
            habit.ProgramDays = maxDayFromPlan > 0 ? maxDayFromPlan : habitDto.DayPlan.Count;
            var planEntities = habitDto.DayPlan.OrderBy(p => p.Day).Select(p => new HabitPlanDay { HabitId = habit.Id, DayNumber = p.Day, Title = p.Title, TasksJson = JsonSerializer.Serialize(p.Tasks ?? new List<string>()), IsCompleted = false, CompletedAt = null }).ToList();
            await _planDays.AddRangeAsync(planEntities);
            await _uow.SaveChangesAsync();
        }

        await TrySendEmailAsync(userId, userEmail, subject: "New habit created", body: BuildHabitCreatedEmailHtml(habit));
        return MapToDTO(habit);
    }

    public async Task<HabitResponseDTO?> UpdateHabitAsync(string userId, string habitId, HabitDTO habitDto)
    {
        var habit = await _habits.GetActiveByIdAsync(userId, habitId);
        if (habit == null)
            return null;
        habit.Action = habitDto.Action;
        habit.Frequency = habitDto.Frequency;
        habit.Time = habitDto.Time;
        habit.Goal = habitDto.Goal;
        habit.Unit = habitDto.Unit;
        habit.Quantity = habitDto.Quantity;
        habit.Category = habitDto.Category;
        habit.Duration = habitDto.Duration;
        habit.Priority = habitDto.Priority;
        habit.ScheduleDays = habitDto.ScheduleDays;
        habit.ScheduleTimes = habitDto.ScheduleTimes;
        habit.Description = habitDto.Description;
        habit.CurrentStreak = habitDto.CurrentStreak;
        habit.BestStreak = habitDto.BestStreak;
        habit.CompletionRate = habitDto.CompletionRate;
        habit.TotalCompletions = habitDto.TotalCompletions;
        habit.DaysTracked = habitDto.DaysTracked;
        habit.UpdatedAt = DateTime.UtcNow;
        await _uow.SaveChangesAsync();
        return MapToDTO(habit);
    }

    public async Task<bool> DeleteHabitAsync(string userId, string habitId)
    {
        var habit = await _habits.GetActiveByIdAsync(userId, habitId);
        if (habit == null)
            return false;
        habit.IsActive = false;
        habit.UpdatedAt = DateTime.UtcNow;
        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CompleteHabitAsync(string userId, string habitId, DateTime? date = null, double? quantity = null, string? notes = null, string? userEmail = null)
    {
        var habit = await _habits.GetActiveByIdAsync(userId, habitId);
        if (habit == null)
            return false;
        var targetDate = date.HasValue ? DateTime.SpecifyKind(date.Value.Date, DateTimeKind.Utc) : DateTime.SpecifyKind(DateTime.UtcNow.Date, DateTimeKind.Utc);
        var existingCompletion = await _completions.GetByHabitIdAndDateAsync(habitId, targetDate);
        if (existingCompletion != null)
        {
            await _completions.DeleteAsync(existingCompletion);
            if (habit.TotalCompletions > 0)
                habit.TotalCompletions--;
            if (habit.DaysTracked > 0)
                habit.DaysTracked--;
            var daysSinceCreationRemove = (DateTime.UtcNow - habit.CreatedAt).Days + 1;
            habit.CompletionRate = daysSinceCreationRemove > 0 ? (habit.TotalCompletions / (double)daysSinceCreationRemove) * 100 : 0;
            var yesterdayRemove = DateTime.SpecifyKind(targetDate.AddDays(-1).Date, DateTimeKind.Utc);
            var hasCompletionYesterdayRemove = await _completions.AnyOnDateAsync(habitId, yesterdayRemove);
            habit.CurrentStreak = hasCompletionYesterdayRemove ? Math.Max(0, habit.CurrentStreak - 1) : 0;
            await SyncPlanDayCompletionAsync(habit, targetDate, false);
            habit.UpdatedAt = DateTime.UtcNow;
            await _uow.SaveChangesAsync();
            return true;
        }

        var completion = new HabitCompletion
        {
            HabitId = habitId,
            CompletedAt = targetDate,
            Quantity = quantity,
            Notes = notes
        };
        await _completions.AddAsync(completion);
        habit.TotalCompletions++;
        habit.DaysTracked++;
        var daysSinceCreation = (DateTime.UtcNow - habit.CreatedAt).Days + 1;
        habit.CompletionRate = (habit.TotalCompletions / (double)daysSinceCreation) * 100;
        var yesterday = DateTime.SpecifyKind(targetDate.AddDays(-1).Date, DateTimeKind.Utc);
        var hasCompletionYesterday = await _completions.AnyOnDateAsync(habitId, yesterday);
        habit.CurrentStreak = hasCompletionYesterday ? habit.CurrentStreak + 1 : 1;
        if (habit.CurrentStreak > habit.BestStreak)
            habit.BestStreak = habit.CurrentStreak;
        await SyncPlanDayCompletionAsync(habit, targetDate, true);
        habit.UpdatedAt = DateTime.UtcNow;
        await _uow.SaveChangesAsync();
        var(allCompleted, totalScheduled) = await AreAllHabitsCompletedForDateAsync(userId, targetDate);
        if (allCompleted)
        {
            await TrySendEmailAsync(userId, userEmail, subject: "Daily habits completed", body: BuildDailyHabitsCompletedEmailHtml(targetDate, totalScheduled));
        }

        return true;
    }

    private async Task TrySendEmailAsync(string userId, string? userEmail, string subject, string body)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(userEmail))
            {
                Console.WriteLine($"[Email] Skip: userEmail is empty. userId={userId}, subject={subject}");
                return;
            }

            var enabled = await _prefs.GetEmailNotificationsEnabledAsync(userId);
            if (!enabled)
            {
                Console.WriteLine($"[Email] Skip: notifications disabled. userId={userId}, email={userEmail}, subject={subject}");
                return;
            }

            await _emailSender.SendAsync(userEmail, subject, body);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Email] Failed to send. userId={userId}, email={userEmail}, subject={subject}, error={ex.Message}");
        }
    }

    private static string BuildHabitCreatedEmailHtml(Domain.Entities.Habit habit)
    {
        var action = WebUtility.HtmlEncode(habit.Action ?? "");
        var frequency = WebUtility.HtmlEncode(habit.Frequency ?? "");
        var created = habit.CreatedAt.ToString("yyyy-MM-dd");
        return $@"
<!doctype html>
<html>
  <head>
    <meta charset=""utf-8"" />
    <meta name=""viewport"" content=""width=device-width, initial-scale=1"" />
  </head>
  <body style=""margin:0;padding:0;background:#F6F7FB;font-family:Inter,Segoe UI,Arial,sans-serif;"">
    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background:#F6F7FB;padding:24px 12px;"">
      <tr>
        <td align=""center"">
          <table role=""presentation"" width=""600"" cellpadding=""0"" cellspacing=""0"" style=""width:100%;max-width:600px;"">
            <tr>
              <td style=""padding:0 0 12px 0;color:#111827;font-weight:800;font-size:18px;"">
                HabitForge
              </td>
            </tr>

            <tr>
              <td style=""background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;padding:22px;"">
                <div style=""font-size:20px;font-weight:800;color:#111827;margin:0 0 10px 0;"">
                  New habit created
                </div>
                <div style=""color:#6B7280;font-size:14px;line-height:20px;margin:0 0 16px 0;"">
                  Your habit is saved and ready to track.
                </div>

                <div style=""border-radius:12px;background:#F9FAFB;border:1px solid #EEF2F7;padding:14px;"">
                  <div style=""font-size:14px;color:#111827;margin:0 0 6px 0;"">
                    <span style=""color:#6B7280;"">Habit:</span> <strong>{action}</strong>
                  </div>
                  <div style=""font-size:14px;color:#111827;margin:0 0 6px 0;"">
                    <span style=""color:#6B7280;"">Frequency:</span> <strong>{frequency}</strong>
                  </div>
                  <div style=""font-size:14px;color:#111827;margin:0;"">
                    <span style=""color:#6B7280;"">Created:</span> <strong>{created}</strong>
                  </div>
                </div>

                <div style=""margin-top:16px;color:#6B7280;font-size:12px;line-height:18px;"">
                  You can manage notification settings in your profile.
                </div>
              </td>
            </tr>

            <tr>
              <td style=""padding:12px 0 0 0;color:#9CA3AF;font-size:12px;line-height:18px;"">
                This is an automated message from HabitForge.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>";
    }

    private static string BuildHabitCompletedEmailHtml(Domain.Entities.Habit habit, DateTime targetDate)
    {
        var action = WebUtility.HtmlEncode(habit.Action ?? "");
        var date = targetDate.ToString("yyyy-MM-dd");
        return $@"
<!doctype html>
<html>
  <head>
    <meta charset=""utf-8"" />
    <meta name=""viewport"" content=""width=device-width, initial-scale=1"" />
  </head>
  <body style=""margin:0;padding:0;background:#F6F7FB;font-family:Inter,Segoe UI,Arial,sans-serif;"">
    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background:#F6F7FB;padding:24px 12px;"">
      <tr>
        <td align=""center"">
          <table role=""presentation"" width=""600"" cellpadding=""0"" cellspacing=""0"" style=""width:100%;max-width:600px;"">
            <tr>
              <td style=""padding:0 0 12px 0;color:#111827;font-weight:800;font-size:18px;"">
                HabitForge
              </td>
            </tr>

            <tr>
              <td style=""background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;padding:22px;"">
                <div style=""font-size:20px;font-weight:800;color:#111827;margin:0 0 10px 0;"">
                  Habit completed
                </div>
                <div style=""color:#6B7280;font-size:14px;line-height:20px;margin:0 0 16px 0;"">
                  Great job — you marked your habit as completed.
                </div>

                <div style=""border-radius:12px;background:#F9FAFB;border:1px solid #EEF2F7;padding:14px;"">
                  <div style=""font-size:14px;color:#111827;margin:0 0 6px 0;"">
                    <span style=""color:#6B7280;"">Habit:</span> <strong>{action}</strong>
                  </div>
                  <div style=""font-size:14px;color:#111827;margin:0;"">
                    <span style=""color:#6B7280;"">Date:</span> <strong>{date}</strong>
                  </div>
                </div>

                <div style=""margin-top:16px;color:#6B7280;font-size:12px;line-height:18px;"">
                  Keep going — consistency beats intensity.
                </div>
              </td>
            </tr>

            <tr>
              <td style=""padding:12px 0 0 0;color:#9CA3AF;font-size:12px;line-height:18px;"">
                This is an automated message from HabitForge.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>";
    }

    private static string BuildDailyHabitsCompletedEmailHtml(DateTime targetDate, int totalHabits)
    {
        var date = targetDate.ToString("yyyy-MM-dd");
        var total = Math.Max(0, totalHabits);
        return $@"
<!doctype html>
<html>
  <head>
    <meta charset=""utf-8"" />
    <meta name=""viewport"" content=""width=device-width, initial-scale=1"" />
  </head>
  <body style=""margin:0;padding:0;background:#F6F7FB;font-family:Inter,Segoe UI,Arial,sans-serif;"">
    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background:#F6F7FB;padding:24px 12px;"">
      <tr>
        <td align=""center"">
          <table role=""presentation"" width=""600"" cellpadding=""0"" cellspacing=""0"" style=""width:100%;max-width:600px;"">
            <tr>
              <td style=""padding:0 0 12px 0;color:#111827;font-weight:800;font-size:18px;"">
                HabitForge
              </td>
            </tr>

            <tr>
              <td style=""background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;padding:22px;"">
                <div style=""font-size:20px;font-weight:800;color:#111827;margin:0 0 10px 0;"">
                  All habits completed
                </div>
                <div style=""color:#6B7280;font-size:14px;line-height:20px;margin:0 0 16px 0;"">
                  Great job — you completed all your habits for the day.
                </div>

                <div style=""border-radius:12px;background:#F9FAFB;border:1px solid #EEF2F7;padding:14px;"">
                  <div style=""font-size:14px;color:#111827;margin:0 0 6px 0;"">
                    <span style=""color:#6B7280;"">Date:</span> <strong>{date}</strong>
                  </div>
                  <div style=""font-size:14px;color:#111827;margin:0;"">
                    <span style=""color:#6B7280;"">Habits completed:</span> <strong>{total}</strong>
                  </div>
                </div>

                <div style=""margin-top:16px;color:#6B7280;font-size:12px;line-height:18px;"">
                  Keep going — consistency beats intensity.
                </div>
              </td>
            </tr>

            <tr>
              <td style=""padding:12px 0 0 0;color:#9CA3AF;font-size:12px;line-height:18px;"">
                This is an automated message from HabitForge.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>";
    }

    private async Task SyncPlanDayCompletionAsync(Domain.Entities.Habit habit, DateTime targetDate, bool isCompleted)
    {
        var dayNumber = TryGetOccurrenceDayNumber(habit, targetDate);
        if (dayNumber is null || dayNumber <= 0)
            return;
        var planDay = await _planDays.GetByHabitIdAndDayAsync(habit.Id, dayNumber.Value);
        if (planDay == null)
            return;
        planDay.IsCompleted = isCompleted;
        planDay.CompletedAt = isCompleted ? DateTime.UtcNow : null;
    }

    private static int? TryGetOccurrenceDayNumber(Domain.Entities.Habit habit, DateTime targetDate)
    {
        var start = DateTime.SpecifyKind(habit.CreatedAt.Date, DateTimeKind.Utc);
        var date = targetDate.Kind == DateTimeKind.Utc ? targetDate.Date : DateTime.SpecifyKind(targetDate.Date, DateTimeKind.Utc);
        var diffDays = (date - start).Days;
        if (diffDays < 0)
            return null;
        var freq = (habit.Frequency ?? "daily").Trim().ToLowerInvariant();
        var windowDays = freq == "weekly" ? 7 : freq == "monthly" ? 30 : (int? )null;
        if (windowDays.HasValue && diffDays >= windowDays.Value)
            return null;
        HashSet<DayOfWeek>? schedule = null;
        if (!string.IsNullOrWhiteSpace(habit.ScheduleDays))
        {
            try
            {
                var list = JsonSerializer.Deserialize<List<string>>(habit.ScheduleDays);
                if (list is { Count: > 0 })
                {
                    schedule = new HashSet<DayOfWeek>();
                    foreach (var s in list)
                    {
                        if (Enum.TryParse<DayOfWeek>(s, ignoreCase: true, out var dow))
                        {
                            schedule.Add(dow);
                        }
                    }

                    if (schedule.Count == 0)
                        schedule = null;
                }
            }
            catch
            {
                schedule = null;
            }
        }

        if (schedule != null && !schedule.Contains(date.DayOfWeek))
            return null;
        var count = 0;
        for (var i = 0; i <= diffDays; i++)
        {
            var d = start.AddDays(i);
            if (schedule == null || schedule.Contains(d.DayOfWeek))
            {
                count++;
            }
        }

        if (count <= 0)
            return null;
        if (habit.ProgramDays is> 0 && count > habit.ProgramDays.Value)
            return null;
        return count;
    }

    private static HabitResponseDTO MapToDTO(Domain.Entities.Habit habit)
    {
        var dayPlan = new List<HabitDayPlanResponseDTO>();
        if (habit.PlanDays is { Count: > 0 })
        {
            foreach (var p in habit.PlanDays.OrderBy(x => x.DayNumber))
            {
                List<string>? tasks = null;
                try
                {
                    tasks = JsonSerializer.Deserialize<List<string>>(p.TasksJson);
                }
                catch
                {
                    tasks = new List<string>();
                }

                dayPlan.Add(new HabitDayPlanResponseDTO { Day = p.DayNumber, Title = p.Title, Tasks = tasks ?? new List<string>(), IsCompleted = p.IsCompleted, CompletedAt = p.CompletedAt });
            }
        }

        return new HabitResponseDTO
        {
            Id = habit.Id,
            Action = habit.Action,
            Frequency = habit.Frequency,
            Time = habit.Time,
            Goal = habit.Goal,
            Unit = habit.Unit,
            Quantity = habit.Quantity,
            Category = habit.Category,
            Duration = habit.Duration,
            Priority = habit.Priority,
            ScheduleDays = habit.ScheduleDays,
            ScheduleTimes = habit.ScheduleTimes,
            Description = habit.Description,
            ProgramDays = habit.ProgramDays,
            DayPlan = dayPlan,
            CurrentStreak = habit.CurrentStreak,
            BestStreak = habit.BestStreak,
            CompletionRate = habit.CompletionRate,
            TotalCompletions = habit.TotalCompletions,
            DaysTracked = habit.DaysTracked,
            CreatedAt = habit.CreatedAt,
            IsActive = habit.IsActive
        };
    }

    public async Task<HabitDayPlanResponseDTO?> SetPlanDayCompletedAsync(string userId, string habitId, int dayNumber, bool isCompleted)
    {
        var habit = await _habits.GetActiveByIdAsync(userId, habitId);
        if (habit == null)
            return null;
        var day = await _planDays.GetByHabitIdAndDayAsync(habitId, dayNumber);
        if (day == null)
        {
            day = new Habit.Domain.Entities.HabitPlanDay
            {
                HabitId = habitId,
                DayNumber = dayNumber,
                Title = $"Day {dayNumber}",
                TasksJson = "[]",
                IsCompleted = false
            };
            await _planDays.AddRangeAsync(new[] { day });
        }

        day.IsCompleted = isCompleted;
        day.CompletedAt = isCompleted ? DateTime.UtcNow : null;
        await _uow.SaveChangesAsync();
        List<string>? tasks;
        try
        {
            tasks = JsonSerializer.Deserialize<List<string>>(day.TasksJson);
        }
        catch
        {
            tasks = new List<string>();
        }

        return new HabitDayPlanResponseDTO
        {
            Day = day.DayNumber,
            Title = day.Title,
            Tasks = tasks ?? new List<string>(),
            IsCompleted = day.IsCompleted,
            CompletedAt = day.CompletedAt
        };
    }

    public async Task<HabitDayPlanResponseDTO?> UpdateHabitDayPlanAsync(string userId, string habitId, int dayNumber, string title, List<string> tasks)
    {
        var habit = await _habits.GetActiveByIdAsync(userId, habitId);
        if (habit == null)
            return null;
        var day = await _planDays.GetByHabitIdAndDayAsync(habitId, dayNumber);
        if (day == null)
        {
            day = new Habit.Domain.Entities.HabitPlanDay
            {
                HabitId = habitId,
                DayNumber = dayNumber,
                Title = title,
                TasksJson = JsonSerializer.Serialize(tasks ?? new List<string>()),
                IsCompleted = false
            };
            await _planDays.AddRangeAsync(new[] { day });
            await _uow.SaveChangesAsync();
        }
        else
        {
            day.Title = title;
            day.TasksJson = JsonSerializer.Serialize(tasks ?? new List<string>());
            await _uow.SaveChangesAsync();
        }

        List<string>? deserializedTasks;
        try
        {
            deserializedTasks = JsonSerializer.Deserialize<List<string>>(day.TasksJson);
        }
        catch
        {
            deserializedTasks = new List<string>();
        }

        return new HabitDayPlanResponseDTO
        {
            Day = day.DayNumber,
            Title = day.Title,
            Tasks = deserializedTasks ?? new List<string>(),
            IsCompleted = day.IsCompleted,
            CompletedAt = day.CompletedAt
        };
    }

    public async Task<List<HabitResponseDTO>> GetHabitsForDateAsync(string userId, DateTime date)
    {
        var dateUtc = date.Kind == DateTimeKind.Utc ? date : DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
        var allHabits = await _habits.GetActiveByUserAsync(userId);
        var dayOfWeek = dateUtc.DayOfWeek.ToString();
        var filteredHabits = new List<Domain.Entities.Habit>();
        foreach (var habit in allHabits)
        {
            if (string.IsNullOrEmpty(habit.ScheduleDays))
            {
                filteredHabits.Add(habit);
                continue;
            }

            try
            {
                var scheduleDays = JsonSerializer.Deserialize<List<string>>(habit.ScheduleDays);
                if (scheduleDays != null && scheduleDays.Contains(dayOfWeek))
                {
                    filteredHabits.Add(habit);
                }
            }
            catch
            {
                filteredHabits.Add(habit);
            }
        }

        var result = new List<HabitResponseDTO>();
        foreach (var habit in filteredHabits)
        {
            try
            {
                var dto = MapToDTO(habit);
                dto.IsCompletedForDate = await _completions.ExistsOnDateAsync(habit.Id, dateUtc);
                result.Add(dto);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        return result;
    }

    private async Task<(bool allCompleted, int totalScheduled)> AreAllHabitsCompletedForDateAsync(string userId, DateTime dateUtc)
    {
        var allHabits = await _habits.GetActiveByUserAsync(userId);
        var scheduledHabits = allHabits.Where(h => IsHabitScheduledForDate(h, dateUtc)).ToList();
        if (scheduledHabits.Count == 0)
            return (false, 0);
        foreach (var habit in scheduledHabits)
        {
            var completed = await _completions.ExistsOnDateAsync(habit.Id, dateUtc);
            if (!completed)
                return (false, scheduledHabits.Count);
        }

        return (true, scheduledHabits.Count);
    }

    private static bool IsHabitScheduledForDate(Domain.Entities.Habit habit, DateTime dateUtc)
    {
        if (string.IsNullOrEmpty(habit.ScheduleDays))
        {
            return true;
        }

        try
        {
            var scheduleDays = JsonSerializer.Deserialize<List<string>>(habit.ScheduleDays);
            if (scheduleDays == null || scheduleDays.Count == 0)
            {
                return true;
            }

            var dayOfWeek = dateUtc.DayOfWeek.ToString();
            return scheduleDays.Contains(dayOfWeek);
        }
        catch
        {
            return true;
        }
    }
}
