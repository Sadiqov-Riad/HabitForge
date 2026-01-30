using Habit.Application.Abstractions;
using Habit.Application.Interfaces;
using Habit.Contracts.DTOs.Request;
using Habit.Contracts.DTOs.Response;
using Habit.Contracts.Validation;
using Habit.Domain.Entities;
using Habit.Domain.Enums;
using System.IO;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace Habit.Application.Services;
public class HabitAIService : IHabitAIService
{
    private readonly IAIRequestRepository _requests;
    private readonly IAIResponseRepository _responses;
    private readonly IHabitUnitOfWork _uow;
    private readonly IOllamaClient _ollamaClient;
    public HabitAIService(IAIRequestRepository requests, IAIResponseRepository responses, IHabitUnitOfWork uow, IOllamaClient ollamaClient)
    {
        _requests = requests;
        _responses = responses;
        _uow = uow;
        _ollamaClient = ollamaClient;
    }

    public async Task<HabitAIResponseDTO> ExtractHabitsAsync(string userId, NlpHabitRequestDTO request)
    {
        var startTime = DateTime.UtcNow;
        var functionType = "nlp_habit";
        var instructions = GetNlpHabitInstructions();
        var prompt = $"Extract habit from text: '{request.InputText}'\n\n{instructions}";
        var aiRequest = new AIRequest
        {
            UserId = userId,
            FunctionType = functionType,
            InputData = JsonSerializer.Serialize(request),
            Prompt = prompt,
            CreatedAt = DateTime.UtcNow
        };
        await _requests.AddAsync(aiRequest);
        await _uow.SaveChangesAsync();
        try
        {
            var response = await _ollamaClient.GenerateAsync(prompt);
            var parsedResponse = ExtractJsonFromResponse(response, functionType);
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var success = parsedResponse != null && !parsedResponse.ToString()!.Contains("error");
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest.Id,
                RawResponse = response,
                ParsedResponse = JsonSerializer.Serialize(parsedResponse),
                Success = success,
                DurationSeconds = duration,
                ErrorMessage = success ? null : "AI response did not contain a valid habits array",
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = success,
                ParsedResponse = parsedResponse,
                RawResponse = response,
                DurationSeconds = duration,
                ErrorMessage = aiResponse.ErrorMessage,
                RequestId = aiRequest.Id,
                CreatedAt = aiRequest.CreatedAt
            };
        }
        catch (Exception ex)
        {
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest.Id,
                RawResponse = ex.Message,
                ParsedResponse = "{}",
                Success = false,
                DurationSeconds = duration,
                ErrorMessage = ex.Message,
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = false,
                ErrorMessage = ex.Message,
                RequestId = aiRequest.Id,
                CreatedAt = aiRequest.CreatedAt,
                DurationSeconds = duration
            };
        }
    }

    public async Task<HabitAIResponseDTO> SuggestHabitsAsync(string userId, SuggestHabitsRequestDTO request)
    {
        var startTime = DateTime.UtcNow;
        var functionType = "suggest_habits";
        var habitsStr = string.Join("\n", request.ExistingHabits.Select(h => $"- {h.Action} ({h.Frequency})"));
        var instructions = GetSuggestHabitsInstructions();
        var prompt = $@"Existing habits:
{habitsStr}

User goals: {request.UserGoals ?? "Not specified"}
Preferences: {request.Preferences ?? "Not specified"}
Time availability: {request.TimeAvailability ?? "Not specified"}

{instructions}";
        var aiRequest = new AIRequest
        {
            UserId = userId,
            FunctionType = functionType,
            InputData = JsonSerializer.Serialize(request),
            Prompt = prompt,
            CreatedAt = DateTime.UtcNow
        };
        await _requests.AddAsync(aiRequest);
        await _uow.SaveChangesAsync();
        try
        {
            var response = await _ollamaClient.GenerateAsync(prompt);
            var parsedResponse = ExtractJsonFromResponse(response, functionType);
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var success = parsedResponse != null && !parsedResponse.ToString()!.Contains("error");
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest.Id,
                RawResponse = response,
                ParsedResponse = JsonSerializer.Serialize(parsedResponse),
                Success = success,
                DurationSeconds = duration,
                ErrorMessage = success ? null : "Failed to parse response",
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = success,
                ParsedResponse = parsedResponse,
                RawResponse = response,
                DurationSeconds = duration,
                ErrorMessage = aiResponse.ErrorMessage,
                RequestId = aiRequest.Id,
                CreatedAt = aiRequest.CreatedAt
            };
        }
        catch (Exception ex)
        {
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest.Id,
                RawResponse = ex.Message,
                ParsedResponse = "{}",
                Success = false,
                DurationSeconds = duration,
                ErrorMessage = ex.Message,
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = false,
                ErrorMessage = ex.Message,
                RequestId = aiRequest.Id,
                CreatedAt = aiRequest.CreatedAt,
                DurationSeconds = duration
            };
        }
    }

    public async Task<HabitAIResponseDTO> GenerateMotivationalMessageAsync(string userId, MotivationalMessageRequestDTO request)
    {
        var startTime = DateTime.UtcNow;
        var functionType = "motivational_message";
        var habitsStr = string.Join("\n", request.UserHabits.Select(h => $"- {h.Action}: {h.CurrentStreak} day streak, {h.CompletionRate}% completion"));
        var instructions = GetMotivationalMessageInstructions();
        var prompt = $@"User habits:
{habitsStr}

{instructions}";
        var aiRequest = new AIRequest
        {
            UserId = userId,
            FunctionType = functionType,
            InputData = JsonSerializer.Serialize(request),
            Prompt = prompt,
            CreatedAt = DateTime.UtcNow
        };
        await _requests.AddAsync(aiRequest);
        await _uow.SaveChangesAsync();
        try
        {
            var response = await _ollamaClient.GenerateAsync(prompt);
            var parsedResponse = ExtractJsonFromResponse(response, functionType);
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var success = parsedResponse != null && !parsedResponse.ToString()!.Contains("error");
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest.Id,
                RawResponse = response,
                ParsedResponse = JsonSerializer.Serialize(parsedResponse),
                Success = success,
                DurationSeconds = duration,
                ErrorMessage = success ? null : "Failed to parse response",
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = success,
                ParsedResponse = parsedResponse,
                RawResponse = response,
                DurationSeconds = duration,
                ErrorMessage = aiResponse.ErrorMessage,
                RequestId = aiRequest.Id,
                CreatedAt = aiRequest.CreatedAt
            };
        }
        catch (Exception ex)
        {
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest.Id,
                RawResponse = ex.Message,
                ParsedResponse = "{}",
                Success = false,
                DurationSeconds = duration,
                ErrorMessage = ex.Message,
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = false,
                ErrorMessage = ex.Message,
                RequestId = aiRequest.Id,
                CreatedAt = aiRequest.CreatedAt,
                DurationSeconds = duration
            };
        }
    }

    public async Task<HabitAIResponseDTO> CompleteHabitFieldsAsync(string userId, CompleteHabitFieldsRequestDTO request)
    {
        var startTime = DateTime.UtcNow;
        var functionType = "complete_habit_fields";
        var habit = request.Habit;
        var instructions = GetCompleteHabitFieldsInstructions();
        var existingFields = new List<string>();
        if (!string.IsNullOrWhiteSpace(habit.Action))
            existingFields.Add($"action: {habit.Action}");
        if (!string.IsNullOrWhiteSpace(habit.Frequency))
            existingFields.Add($"frequency: {habit.Frequency}");
        if (!string.IsNullOrWhiteSpace(habit.Description))
            existingFields.Add($"description: {habit.Description}");
        if (!string.IsNullOrWhiteSpace(habit.Time))
            existingFields.Add($"time: {habit.Time}");
        if (!string.IsNullOrWhiteSpace(habit.Goal))
            existingFields.Add($"goal: {habit.Goal}");
        if (!string.IsNullOrWhiteSpace(habit.Unit))
            existingFields.Add($"unit: {habit.Unit}");
        if (habit.Quantity.HasValue)
            existingFields.Add($"quantity: {habit.Quantity}");
        if (!string.IsNullOrWhiteSpace(habit.Category))
            existingFields.Add($"category: {habit.Category}");
        if (!string.IsNullOrWhiteSpace(habit.Duration))
            existingFields.Add($"duration: {habit.Duration}");
        var prompt = $@"Complete the missing fields for this habit based on the provided information.

Existing habit data:
{string.Join("\n", existingFields.Count > 0 ? existingFields : new[] { "No fields provided" })}

{instructions}";
        var aiRequest = new AIRequest
        {
            UserId = userId,
            FunctionType = functionType,
            InputData = JsonSerializer.Serialize(request),
            Prompt = prompt,
            CreatedAt = DateTime.UtcNow
        };
        await _requests.AddAsync(aiRequest);
        await _uow.SaveChangesAsync();
        try
        {
            var desiredProgramDays = habit.ProgramDays ?? 7;
            if (desiredProgramDays <= 0)
                desiredProgramDays = 7;
            var response1 = await _ollamaClient.GenerateAsync(prompt);
            var normalized1 = TryExtractAndNormalizeJson(response1, functionType);
            var errors1 = ValidateCompleteHabitPlan(normalized1, desiredProgramDays);
            string responseFinal = response1;
            string normalizedFinal = normalized1 ?? "{}";
            var errorsFinal = errors1;
            if (errors1.Count > 0)
            {
                var repairPrompt = $@"You previously produced an invalid or incomplete habit plan JSON.
Validation errors:
- {string.Join("\n- ", errors1)}

Required: program_days MUST equal {desiredProgramDays}, and day_plan MUST contain EXACTLY {desiredProgramDays} items for days 1..{desiredProgramDays}. Each day must have 1-3 non-empty tasks. No placeholders like ""Day 2"" with empty tasks.
Return STRICT JSON only, with the exact shape: {{ ""habit"": {{ ... }} }}. No markdown.

Original habit data (keep non-empty fields exactly):
{string.Join("\n", existingFields.Count > 0 ? existingFields : new[] { "No fields provided" })}

Your previous output:
{(normalized1 ?? response1)}";
                var response2 = await _ollamaClient.GenerateAsync(repairPrompt);
                var normalized2 = TryExtractAndNormalizeJson(response2, functionType);
                var errors2 = ValidateCompleteHabitPlan(normalized2, desiredProgramDays);
                responseFinal = response2;
                normalizedFinal = normalized2 ?? "{}";
                errorsFinal = errors2;
            }

            if (errorsFinal.Count > 0)
            {
                DebugLogNdjson(new { sessionId = "debug-session", runId = "pre-fix", hypothesisId = "H5", location = "HabitAIService.cs:CompleteHabitFieldsAsync", message = "plan_invalid_before_postprocess", data = new { requestId = aiRequest.Id, desiredProgramDays, errorCount = errorsFinal.Count, hasEmptyTasks = errorsFinal.Any(e => e.Contains("must have at least 1 task", StringComparison.OrdinalIgnoreCase)) }, timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() });
                var(patchedJson, changed) = PatchIncompleteDayPlanJson(normalizedFinal, desiredProgramDays, fallbackAction: habit.Action);
                if (changed)
                {
                    var patchedErrors = ValidateCompleteHabitPlan(patchedJson, desiredProgramDays);
                    DebugLogNdjson(new { sessionId = "debug-session", runId = "pre-fix", hypothesisId = "H5", location = "HabitAIService.cs:CompleteHabitFieldsAsync", message = "plan_postprocess_result", data = new { requestId = aiRequest.Id, changed = true, patchedErrorCount = patchedErrors.Count }, timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() });
                    if (patchedErrors.Count == 0)
                    {
                        normalizedFinal = patchedJson;
                        errorsFinal = patchedErrors;
                    }
                }
            }

            if (errorsFinal.Count > 0)
            {
                var fallbackJson = BuildFallbackCompletePlanJson(habit, desiredProgramDays);
                normalizedFinal = fallbackJson;
                responseFinal = fallbackJson;
                errorsFinal = new List<string>();
            }

            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var success = errorsFinal.Count == 0;
            var errorMessage = success ? null : $"Invalid or incomplete day_plan: {string.Join("; ", errorsFinal.Take(5))}";
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest.Id,
                RawResponse = responseFinal,
                ParsedResponse = normalizedFinal,
                Success = success,
                DurationSeconds = duration,
                ErrorMessage = errorMessage,
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            object? parsedObj = null;
            try
            {
                parsedObj = JsonSerializer.Deserialize<object>(normalizedFinal);
            }
            catch
            {
            }

            return new HabitAIResponseDTO
            {
                Success = success,
                ParsedResponse = parsedObj,
                RawResponse = responseFinal,
                DurationSeconds = duration,
                ErrorMessage = errorMessage,
                RequestId = aiRequest.Id,
                CreatedAt = aiRequest.CreatedAt
            };
        }
        catch (Exception ex)
        {
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest.Id,
                RawResponse = ex.Message,
                ParsedResponse = "{}",
                Success = false,
                DurationSeconds = duration,
                ErrorMessage = ex.Message,
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = false,
                ErrorMessage = ex.Message,
                RequestId = aiRequest.Id,
                CreatedAt = aiRequest.CreatedAt,
                DurationSeconds = duration
            };
        }
    }

    private static void DebugLogNdjson(object payload)
    {
        try
        {
            var line = JsonSerializer.Serialize(payload) + "\n";
            File.AppendAllText(@"c:\Project\.cursor\debug.log", line);
        }
        catch
        {
        }
    }

    private static (string patchedJson, bool changed) PatchIncompleteDayPlanJson(string normalizedJson, int desiredProgramDays, string? fallbackAction)
    {
        try
        {
            var root = JsonNode.Parse(normalizedJson);
            if (root is null)
                return (normalizedJson, false);
            if (root["habit"] is not JsonObject habitObj)
                return (normalizedJson, false);
            var actionRaw = (habitObj["action"] ?? habitObj["Action"])?.ToString() ?? "";
            if (!string.IsNullOrWhiteSpace(actionRaw))
            {
                var clampedAction = actionRaw.Trim();
                if (clampedAction.Length > HabitFieldLimits.ActionMax)
                    clampedAction = clampedAction[..HabitFieldLimits.ActionMax];
                habitObj["action"] = clampedAction;
            }

            var descRaw = (habitObj["description"] ?? habitObj["Description"])?.ToString() ?? "";
            if (!string.IsNullOrWhiteSpace(descRaw))
            {
                var clampedDesc = descRaw.Trim();
                if (clampedDesc.Length > HabitFieldLimits.DescriptionMax)
                    clampedDesc = clampedDesc[..HabitFieldLimits.DescriptionMax];
                habitObj["description"] = clampedDesc;
            }

            habitObj["program_days"] = desiredProgramDays;
            var dayPlanNode = habitObj["day_plan"] ?? habitObj["dayPlan"];
            if (dayPlanNode is not JsonArray dayPlanArr)
                return (normalizedJson, false);
            var byDay = new Dictionary<int, JsonObject>();
            foreach (var item in dayPlanArr)
            {
                if (item is not JsonObject d)
                    continue;
                if (!int.TryParse((d["day"] ?? d["Day"])?.ToString(), out var day) || day <= 0)
                    continue;
                byDay[day] = d;
            }

            var changed = false;
            var rebuilt = new JsonArray();
            for (var day = 1; day <= desiredProgramDays; day++)
            {
                if (!byDay.TryGetValue(day, out var d))
                {
                    d = new JsonObject();
                    d["day"] = day;
                    changed = true;
                }

                var title = (d["title"] ?? d["Title"])?.ToString();
                if (string.IsNullOrWhiteSpace(title))
                {
                    title = !string.IsNullOrWhiteSpace(fallbackAction) ? $"{fallbackAction} (Day {day})" : $"Day {day}";
                    d["title"] = title;
                    changed = true;
                }
                else
                {
                    d["title"] = title;
                }

                var titleClamped = (d["title"]?.ToString() ?? "").Trim();
                if (titleClamped.Length > HabitFieldLimits.DayTitleMax)
                {
                    titleClamped = titleClamped[..HabitFieldLimits.DayTitleMax];
                    d["title"] = titleClamped;
                    changed = true;
                }

                var tasksNode = d["tasks"] ?? d["Tasks"];
                JsonArray tasksArr;
                if (tasksNode is not JsonArray existingTasksArr)
                {
                    tasksArr = new JsonArray();
                    changed = true;
                }
                else
                {
                    tasksArr = new JsonArray(existingTasksArr.Select(t => (t?.ToString() ?? "").Trim()).Where(s => !string.IsNullOrWhiteSpace(s)).Select(s => s.Length > HabitFieldLimits.TaskMax ? s[..HabitFieldLimits.TaskMax] : s).Distinct().Take(3).Select(s => (JsonNode? )s).ToArray());
                    if (tasksArr.Count != existingTasksArr.Count)
                        changed = true;
                }

                if (tasksArr.Count < 1)
                {
                    var fallbackTask = titleClamped;
                    if (fallbackTask.Length > HabitFieldLimits.TaskMax)
                        fallbackTask = fallbackTask[..HabitFieldLimits.TaskMax];
                    tasksArr.Add(fallbackTask);
                    changed = true;
                }

                d["tasks"] = tasksArr;
                rebuilt.Add(d);
            }

            habitObj["day_plan"] = rebuilt;
            var patched = root.ToJsonString(new JsonSerializerOptions { WriteIndented = false });
            return (patched, changed);
        }
        catch
        {
            return (normalizedJson, false);
        }
    }

    private static string BuildFallbackCompletePlanJson(HabitDTO habit, int desiredProgramDays)
    {
        var actionRaw = string.IsNullOrWhiteSpace(habit.Action) ? "Daily habit" : habit.Action.Trim();
        if (actionRaw.Length > HabitFieldLimits.ActionMax)
            actionRaw = actionRaw[..HabitFieldLimits.ActionMax];
        var frequencyRaw = string.IsNullOrWhiteSpace(habit.Frequency) ? "daily" : habit.Frequency.Trim();
        if (frequencyRaw.Length > HabitFieldLimits.FrequencyMax)
            frequencyRaw = frequencyRaw[..HabitFieldLimits.FrequencyMax];
        var descRaw = !string.IsNullOrWhiteSpace(habit.Description) ? habit.Description.Trim() : $"Build the habit of {actionRaw} with small daily steps.";
        descRaw = descRaw.Replace("\r", " ").Replace("\n", " ").Replace("*", "");
        if (descRaw.Length > HabitFieldLimits.DescriptionMax)
            descRaw = descRaw[..HabitFieldLimits.DescriptionMax];
        var habitObj = new JsonObject
        {
            ["action"] = actionRaw,
            ["frequency"] = frequencyRaw,
            ["description"] = descRaw,
            ["program_days"] = desiredProgramDays
        };
        if (!string.IsNullOrWhiteSpace(habit.Category))
        {
            var category = habit.Category.Trim();
            if (category.Length > HabitFieldLimits.CategoryMax)
                category = category[..HabitFieldLimits.CategoryMax];
            habitObj["category"] = category;
        }

        if (!string.IsNullOrWhiteSpace(habit.Duration))
        {
            var duration = habit.Duration.Trim();
            if (duration.Length > HabitFieldLimits.DurationMax)
                duration = duration[..HabitFieldLimits.DurationMax];
            habitObj["duration"] = duration;
        }

        var dayPlan = new JsonArray();
        for (var day = 1; day <= desiredProgramDays; day++)
        {
            var title = $"{actionRaw} (Day {day})";
            if (title.Length > HabitFieldLimits.DayTitleMax)
                title = title[..HabitFieldLimits.DayTitleMax];
            var task = $"Do {actionRaw}";
            if (task.Length > HabitFieldLimits.TaskMax)
                task = task[..HabitFieldLimits.TaskMax];
            dayPlan.Add(new JsonObject { ["day"] = day, ["title"] = title, ["tasks"] = new JsonArray(task) });
        }

        habitObj["day_plan"] = dayPlan;
        var root = new JsonObject
        {
            ["habit"] = habitObj
        };
        return root.ToJsonString(new JsonSerializerOptions { WriteIndented = false });
    }

    private static string? TryExtractAndNormalizeJson(string response, string functionType)
    {
        try
        {
            var jsonPatterns = new[]
            {
                @"```json\s*(\{.*?\})\s*```",
                @"```\s*(\{.*?\})\s*```",
                @"(\{.*\})"
            };
            foreach (var pattern in jsonPatterns)
            {
                var matches = Regex.Matches(response, pattern, RegexOptions.Singleline);
                foreach (Match match in matches)
                {
                    var cleaned = match.Groups[1].Value.Trim();
                    if (cleaned.StartsWith('{') && cleaned.EndsWith('}'))
                    {
                        return NormalizeAiJson(cleaned, functionType);
                    }
                }
            }

            var responseClean = response.Trim();
            if (responseClean.StartsWith('{') && responseClean.EndsWith('}'))
            {
                return NormalizeAiJson(responseClean, functionType);
            }

            var jsonStart = response.IndexOf('{');
            var jsonEnd = response.LastIndexOf('}');
            if (jsonStart != -1 && jsonEnd != -1 && jsonEnd > jsonStart)
            {
                var jsonStr = response.Substring(jsonStart, jsonEnd - jsonStart + 1);
                return NormalizeAiJson(jsonStr, functionType);
            }
        }
        catch
        {
        }

        return null;
    }

    private static List<string> ValidateCompleteHabitPlan(string? normalizedJson, int desiredProgramDays)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(normalizedJson))
        {
            errors.Add("No JSON found in AI response");
            return errors;
        }

        JsonNode? root;
        try
        {
            root = JsonNode.Parse(normalizedJson);
        }
        catch
        {
            errors.Add("Invalid JSON");
            return errors;
        }

        var habitNode = root?["habit"];
        if (habitNode is not JsonObject habitObj)
        {
            errors.Add("Missing 'habit' object");
            return errors;
        }

        var programDaysNode = habitObj["program_days"] ?? habitObj["programDays"];
        if (programDaysNode is null || !int.TryParse(programDaysNode.ToString(), out var programDays) || programDays <= 0)
        {
            errors.Add("Missing/invalid program_days");
            return errors;
        }

        if (programDays != desiredProgramDays)
        {
            errors.Add($"program_days must equal {desiredProgramDays} (got {programDays})");
        }

        var desc = (habitObj["description"] ?? habitObj["Description"])?.ToString() ?? "";
        if (string.IsNullOrWhiteSpace(desc))
            errors.Add("Missing description");
        if (desc.Contains("**") || desc.Contains("What to do") || desc.Contains("When to do") || desc.Contains("\n-") || desc.Contains("\n*"))
        {
            errors.Add("Description contains markdown/sections (must be short plain text)");
        }

        var dayPlanNode = habitObj["day_plan"] ?? habitObj["dayPlan"];
        if (dayPlanNode is not JsonArray dayPlanArr)
        {
            errors.Add("Missing/invalid day_plan array");
            return errors;
        }

        if (dayPlanArr.Count != programDays)
        {
            errors.Add($"day_plan must have exactly {programDays} items (got {dayPlanArr.Count})");
        }

        var seen = new HashSet<int>();
        foreach (var item in dayPlanArr)
        {
            if (item is not JsonObject d)
            {
                errors.Add("day_plan contains non-object item");
                continue;
            }

            if (!int.TryParse((d["day"] ?? d["Day"])?.ToString(), out var day) || day <= 0)
            {
                errors.Add("day_plan item has invalid day");
                continue;
            }

            if (!seen.Add(day))
                errors.Add($"day_plan has duplicate day {day}");
            var title = (d["title"] ?? d["Title"])?.ToString() ?? "";
            if (string.IsNullOrWhiteSpace(title))
                errors.Add($"day {day}: missing title");
            var tasksNode = d["tasks"] ?? d["Tasks"];
            if (tasksNode is not JsonArray tasksArr)
            {
                errors.Add($"day {day}: tasks must be array");
                continue;
            }

            var tasks = tasksArr.Select(t => t?.ToString() ?? "").Where(s => !string.IsNullOrWhiteSpace(s)).ToList();
            if (tasks.Count < 1)
                errors.Add($"day {day}: must have at least 1 task");
            if (tasks.Count > 3)
                errors.Add($"day {day}: must have at most 3 tasks");
        }

        for (var i = 1; i <= programDays; i++)
        {
            if (!seen.Contains(i))
                errors.Add($"Missing day {i} in day_plan");
        }

        return errors;
    }

    public async Task<HabitAIResponseDTO> GetProgressAdviceAsync(string userId, ProgressAdviceRequestDTO request)
    {
        var startTime = DateTime.UtcNow;
        var functionType = "progress_advice";
        var habitsStr = string.Join("\n", request.UserHabits.Select(h => $"- {h.Action}: {h.CompletionRate}% completion, {h.CurrentStreak} day streak"));
        var instructions = GetProgressAdviceInstructions();
        var prompt = $@"User habits performance:
{habitsStr}

{instructions}";
        var aiRequest = new AIRequest
        {
            UserId = userId,
            FunctionType = functionType,
            InputData = JsonSerializer.Serialize(request),
            Prompt = prompt,
            CreatedAt = DateTime.UtcNow
        };
        await _requests.AddAsync(aiRequest);
        await _uow.SaveChangesAsync();
        try
        {
            var response = await _ollamaClient.GenerateAsync(prompt);
            var parsedResponse = ExtractJsonFromResponse(response, functionType);
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var success = parsedResponse != null && !parsedResponse.ToString()!.Contains("error");
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest.Id,
                RawResponse = response,
                ParsedResponse = JsonSerializer.Serialize(parsedResponse),
                Success = success,
                DurationSeconds = duration,
                ErrorMessage = success ? null : "Failed to parse response",
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = success,
                ParsedResponse = parsedResponse,
                RawResponse = response,
                DurationSeconds = duration,
                ErrorMessage = aiResponse.ErrorMessage,
                RequestId = aiRequest.Id,
                CreatedAt = aiRequest.CreatedAt
            };
        }
        catch (Exception ex)
        {
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest.Id,
                RawResponse = ex.Message,
                ParsedResponse = "{}",
                Success = false,
                DurationSeconds = duration,
                ErrorMessage = ex.Message,
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = false,
                ErrorMessage = ex.Message,
                RequestId = aiRequest.Id,
                CreatedAt = aiRequest.CreatedAt,
                DurationSeconds = duration
            };
        }
    }

    public async Task<HabitAIResponseDTO> GenerateDailyPlanAsync(string userId, GenerateDailyPlanRequestDTO request)
    {
        var startTime = DateTime.UtcNow;
        var functionType = "generate_daily_plan";
        if (request.CompletionRate.HasValue && (double.IsNaN(request.CompletionRate.Value) || double.IsInfinity(request.CompletionRate.Value)))
        {
            request.CompletionRate = null;
        }

        var habit = request.HabitInfo;
        var completedDaysStr = request.CompletedDays != null && request.CompletedDays.Count > 0 ? string.Join("\n", request.CompletedDays.Select(d => $"Day {d.Day}: {d.Title} - {(d.IsCompleted ? "Completed" : "Not completed")}\n  Tasks: {string.Join(", ", d.Tasks)}")) : "No previous days completed";
        var progressInfo = $"Current streak: {request.CurrentStreak ?? 0} days\nCompletion rate: {request.CompletionRate ?? 0:F1}%";
        var instructions = GetDailyPlanInstructions();
        var prompt = $@"Generate a detailed daily plan for Day {request.DayNumber} of the habit program.

Habit Information:
- Action: {habit?.Action ?? "Not specified"}
- Frequency: {habit?.Frequency ?? "Not specified"}
- Goal: {habit?.Goal ?? "Not specified"}
- Category: {habit?.Category ?? "Not specified"}
- Duration: {habit?.Duration ?? "Not specified"}
- Description: {habit?.Description ?? "Not specified"}

User Progress:
{progressInfo}

Previous Days:
{completedDaysStr}

{instructions}";
        AIRequest? aiRequest = null;
        try
        {
            aiRequest = new AIRequest
            {
                UserId = userId,
                FunctionType = functionType,
                InputData = JsonSerializer.Serialize(request),
                Prompt = prompt,
                CreatedAt = DateTime.UtcNow
            };
            await _requests.AddAsync(aiRequest);
            await _uow.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            return new HabitAIResponseDTO
            {
                Success = false,
                ErrorMessage = $"Failed to persist AI request: {ex.Message}",
                RequestId = aiRequest?.Id ?? Guid.NewGuid().ToString(),
                CreatedAt = aiRequest?.CreatedAt ?? DateTime.UtcNow,
                DurationSeconds = duration
            };
        }

        try
        {
            var response = await _ollamaClient.GenerateAsync(prompt);
            var parsedResponse = ExtractJsonFromResponse(response, functionType);
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var success = parsedResponse != null && !parsedResponse.ToString()!.Contains("error");
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest!.Id,
                RawResponse = response,
                ParsedResponse = JsonSerializer.Serialize(parsedResponse),
                Success = success,
                DurationSeconds = duration,
                ErrorMessage = success ? null : "Failed to parse response",
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = success,
                ParsedResponse = parsedResponse,
                RawResponse = response,
                DurationSeconds = duration,
                ErrorMessage = aiResponse.ErrorMessage,
                RequestId = aiRequest!.Id,
                CreatedAt = aiRequest!.CreatedAt
            };
        }
        catch (Exception ex)
        {
            var duration = (DateTime.UtcNow - startTime).TotalSeconds;
            var aiResponse = new AIResponse
            {
                RequestId = aiRequest!.Id,
                RawResponse = ex.Message,
                ParsedResponse = "{}",
                Success = false,
                DurationSeconds = duration,
                ErrorMessage = ex.Message,
                CreatedAt = DateTime.UtcNow
            };
            await _responses.AddAsync(aiResponse);
            await _uow.SaveChangesAsync();
            return new HabitAIResponseDTO
            {
                Success = false,
                ErrorMessage = ex.Message,
                RequestId = aiRequest!.Id,
                CreatedAt = aiRequest!.CreatedAt,
                DurationSeconds = duration
            };
        }
    }

    private object? ExtractJsonFromResponse(string response, string? functionType = null)
    {
        try
        {
            var jsonPatterns = new[]
            {
                @"```json\s*(\{.*?\})\s*```",
                @"```\s*(\{.*?\})\s*```",
                @"(\{.*\})"
            };
            foreach (var pattern in jsonPatterns)
            {
                var matches = Regex.Matches(response, pattern, RegexOptions.Singleline);
                foreach (Match match in matches)
                {
                    try
                    {
                        var cleaned = match.Groups[1].Value.Trim();
                        if (cleaned.StartsWith('{') && cleaned.EndsWith('}'))
                        {
                            var normalized = NormalizeAiJson(cleaned, functionType);
                            return JsonSerializer.Deserialize<object>(normalized);
                        }
                    }
                    catch
                    {
                    }
                }
            }

            var responseClean = response.Trim();
            if (responseClean.StartsWith('{') && responseClean.EndsWith('}'))
            {
                var normalized = NormalizeAiJson(responseClean, functionType);
                return JsonSerializer.Deserialize<object>(normalized);
            }

            var jsonStart = response.IndexOf('{');
            var jsonEnd = response.LastIndexOf('}');
            if (jsonStart != -1 && jsonEnd != -1 && jsonEnd > jsonStart)
            {
                var jsonStr = response.Substring(jsonStart, jsonEnd - jsonStart + 1);
                var normalized = NormalizeAiJson(jsonStr, functionType);
                return JsonSerializer.Deserialize<object>(normalized);
            }
        }
        catch
        {
        }

        return new
        {
            error = $"Failed to parse JSON. Raw response: {response[..Math.Min(500, response.Length)]}..."};
    }

    private static string NormalizeAiJson(string json, string? functionType)
    {
        var node = JsonNode.Parse(json);
        if (node is null)
            return json;
        static string ClampPlainText(string? value, int max)
        {
            if (string.IsNullOrWhiteSpace(value))
                return value?.Trim() ?? string.Empty;
            var cleaned = value.Trim().Replace("\r", " ").Replace("\n", " ");
            return cleaned.Length > max ? cleaned[..max] : cleaned;
        }

        static void ClampDayPlan(JsonObject habitObj)
        {
            var dayPlanNode = habitObj["day_plan"] ?? habitObj["dayPlan"];
            if (dayPlanNode is not JsonArray dayPlanArr)
                return;
            foreach (var item in dayPlanArr)
            {
                if (item is not JsonObject dayObj)
                    continue;
                var titleRaw = (dayObj["title"] ?? dayObj["Title"])?.ToString();
                if (!string.IsNullOrWhiteSpace(titleRaw))
                {
                    dayObj["title"] = ClampPlainText(titleRaw, HabitFieldLimits.DayTitleMax);
                }

                var tasksNode = dayObj["tasks"] ?? dayObj["Tasks"];
                if (tasksNode is not JsonArray tasksArr)
                    continue;
                var normalizedTasks = tasksArr.Select(t => ClampPlainText(t?.ToString(), HabitFieldLimits.TaskMax)).Where(s => !string.IsNullOrWhiteSpace(s)).Distinct().Take(3).Select(s => (JsonNode? )s).ToArray();
                dayObj["tasks"] = new JsonArray(normalizedTasks);
            }
        }

        static void ClampHabitObject(JsonObject habitObj)
        {
            var actionRaw = (habitObj["action"] ?? habitObj["Action"])?.ToString();
            if (!string.IsNullOrWhiteSpace(actionRaw))
            {
                habitObj["action"] = ClampPlainText(actionRaw, HabitFieldLimits.ActionMax);
            }

            var descRaw = (habitObj["description"] ?? habitObj["Description"])?.ToString();
            if (!string.IsNullOrWhiteSpace(descRaw))
            {
                habitObj["description"] = ClampPlainText(descRaw, HabitFieldLimits.DescriptionMax);
            }

            ClampDayPlan(habitObj);
        }

        static void ClampHabitArray(JsonArray arr)
        {
            foreach (var item in arr)
            {
                if (item is JsonObject habitObj)
                {
                    ClampHabitObject(habitObj);
                }
            }
        }

        if (node is JsonArray arr)
        {
            if (functionType is "nlp_habit")
            {
                node = new JsonObject
                {
                    ["habits"] = arr
                };
            }
            else if (functionType is "suggest_habits")
            {
                node = new JsonObject
                {
                    ["suggested_habits"] = arr
                };
            }
            else
            {
                node = new JsonObject
                {
                    ["data"] = arr
                };
            }
        }

        if (node is not JsonObject obj)
            return node.ToJsonString();
        if (functionType is "nlp_habit")
        {
            if (obj["habits"] is null)
            {
                if (obj["suggested_habits"] is JsonArray suggestedArr)
                {
                    obj["habits"] = suggestedArr;
                }
                else if (obj["habit"] is not null)
                {
                    obj["habits"] = new JsonArray(obj["habit"]);
                    obj.Remove("habit");
                }
            }

            if (obj["habits"] is JsonObject habitObj)
            {
                obj["habits"] = new JsonArray(habitObj);
            }
            else if (obj["habits"] is not JsonArray)
            {
                obj["habits"] = new JsonArray();
                obj["error"] = "Missing or invalid 'habits' array";
            }
            else if (obj["habits"] is JsonArray habitsArr && habitsArr.Count == 0)
            {
                obj["error"] = "Empty 'habits' array";
            }

            if (obj["habits"] is JsonArray habitsArr2)
            {
                ClampHabitArray(habitsArr2);
            }
        }
        else if (functionType is "suggest_habits")
        {
            if (obj["suggested_habits"] is null)
            {
                if (obj["habits"] is JsonArray habitsArr)
                {
                    obj["suggested_habits"] = habitsArr;
                }
                else if (obj["habit"] is not null)
                {
                    obj["suggested_habits"] = new JsonArray(obj["habit"]);
                    obj.Remove("habit");
                }
            }

            if (obj["suggested_habits"] is JsonObject single)
            {
                obj["suggested_habits"] = new JsonArray(single);
            }
            else if (obj["suggested_habits"] is not JsonArray)
            {
                obj["suggested_habits"] = new JsonArray();
                obj["error"] = "Missing or invalid 'suggested_habits' array";
            }
            else if (obj["suggested_habits"] is JsonArray arr2 && arr2.Count == 0)
            {
                obj["error"] = "Empty 'suggested_habits' array";
            }

            if (obj["suggested_habits"] is JsonArray suggestedArr2)
            {
                ClampHabitArray(suggestedArr2);
            }
        }
        else if (functionType is "complete_habit_fields")
        {
            if (obj["habit"] is null)
            {
                obj = new JsonObject
                {
                    ["habit"] = obj
                };
            }

            if (obj["habit"] is JsonObject habitObj)
            {
                ClampHabitObject(habitObj);
            }
        }
        else if (functionType is "generate_daily_plan")
        {
            if (obj["day_plan"] is null && obj["day"] is not null && obj["tasks"] is not null)
            {
                obj = new JsonObject
                {
                    ["day_plan"] = obj
                };
            }
        }

        return obj.ToJsonString();
    }

    private string GetNlpHabitInstructions()
    {
        return @"
Your task is to extract one or more habits from the provided text.
IMPORTANT: Generate ALL output in English only. Do not use any other language.
The output MUST be a JSON object with a single key called 'habits'.
The value of 'habits' MUST be a list of objects.
Each object in the list represents a single habit and MUST contain the following fields:
- action: The core action (e.g., ""lift weights"", ""run"", ""meditate"").
- frequency: (Optional) How often the habit is performed (e.g., ""daily"", ""3 times per week"", ""every morning""). Use null if not specified.
- time: (Optional) The time of day (e.g., ""morning"", ""5pm""). Use null if not specified.
- goal: (Optional) The goal or reason. Use null if not specified.
- unit: (Optional) The unit of measurement (e.g., ""km"", ""minutes"", ""liters""). Use null if not specified.
- quantity: (Optional) The numerical amount (e.g., 2 for ""2 liters"", 5 for ""5 km""). Use null if not specified.
- category: (Optional) MUST be one of: [" + string.Join(", ", HabitCategory.All.Select(c => "\"" + c + "\"")) + @"]. Use null if not specified.
- duration: (Optional) How long the habit lasts (e.g., ""1 hour"", ""30 minutes"", ""10 minutes""). Use null if not specified.
- description: (MANDATORY) A SHORT, clear description of what the user wants (1-2 sentences). Do NOT generate a multi-day plan here. The detailed plan will be generated after the user provides additional settings.

LENGTH LIMITS (CRITICAL):
- action MUST be at most 80 characters
- description MUST be at most 300 characters

CRITICAL EXTRACTION RULES:
1. If the text mentions ""for X minutes/hours"", extract that as duration (e.g., ""for 10 minutes"" → duration: ""10 minutes"")
2. If the text mentions ""X minutes/hours"", extract that as duration (e.g., ""30 minutes"" → duration: ""30 minutes"")
3. Pay attention to each action separately - each action may have its own duration
4. Look for phrases like ""for 10 minutes"", ""30 minutes"", ""1 hour"", ""for 2 hours"", etc.
5. Return STRICT JSON only. No markdown, no backticks, no extra text before/after JSON.";
    }

    private string GetSuggestHabitsInstructions()
    {
        return @"
Your task is to suggest complementary habits based on the user's existing habits and goals.
IMPORTANT: Generate ALL output in English only. Do not use any other language.
The output MUST be a JSON object with the following structure:
{
  ""suggested_habits"": [
    {
      ""action"": ""Core action"",
      ""frequency"": ""How often"",
      ""time"": ""Time of day (or null)"",
      ""goal"": ""Goal or reason (or null)"",
      ""unit"": ""Unit of measurement (or null)"",
      ""quantity"": ""Numerical amount (or null)"",
      ""category"": ""One of the valid categories (or null)"",
      ""duration"": ""Duration (or null)"",
            ""description"": ""SHORT plain-text description (MANDATORY - never null). Explain briefly why this complements existing habits (1-2 sentences, no markdown)."",
      ""program_days"": ""Program length in days (default 7 if not specified)"",
      ""day_plan"": [
        { ""day"": 1, ""title"": ""Short title"", ""tasks"": [""task 1"", ""task 2""] }
      ]
    }
  ],
  ""reasoning"": ""Brief explanation of why these habits were suggested. Be a friendly adviser"",
  ""category_focus"": ""Main category focus for suggestions (or null)""
}

LENGTH LIMITS (CRITICAL):
- action MUST be at most 80 characters
- description MUST be at most 300 characters
- each day_plan.title MUST be at most 80 characters

Guidelines for suggestions:
1. CRITICAL: Analyze each existing habit deeply - understand its category, goal, and purpose. Look at the description, category, and goal fields to fully understand what the user is trying to achieve.
2. Suggest 3-5 habits that are DIRECTLY RELATED to at least ONE existing habit (not necessarily all of them). This allows for more variety. For example: if user has 'working out' or 'качаться', suggest 'pre-workout meal planning', 'post-workout stretching routine', 'tracking workout progress', 'active recovery days' - more specific and interesting habits that directly support the workout routine. Each suggestion must have a clear connection to at least one existing habit.
3. Consider different categories to provide variety, but ensure each suggested habit is still connected to existing ones.
4. Ensure suggestions are realistic and achievable
5. Take into account user goals, preferences, and time availability if provided
6. Each suggested habit MUST be connected to at least one existing habit. Explain the connection clearly in the description field.
7. Include a mix of different habit categories for holistic improvement, but prioritize habits that directly complement existing ones.
8. ALWAYS provide a comprehensive action plan (not just a description) for each suggested habit that weaves together all fields into a motivating narrative
9. ALWAYS include program_days and day_plan for each suggested habit. If user timeframe is unknown, default program_days to 7. day_plan MUST have EXACTLY program_days items.
10. In the description field, ALWAYS start with or include a clear explanation of how this habit complements specific existing habits. Use phrases like 'This habit enhances your [existing habit] by...' or 'To maximize results from your [existing habit], this habit helps by...' or 'This habit supports your [existing habit] because...'. Be specific about which existing habit(s) this suggestion relates to.
11. AVOID generic, overused suggestions like 'drink water', 'hydration', 'meditation' unless they are SPECIFICALLY and DIRECTLY related to existing habits with a unique angle. Instead, think creatively and suggest more specific, interesting habits that are less obvious but highly relevant. For example, instead of generic 'hydration', suggest 'pre-workout hydration timing' or 'post-workout electrolyte balance' if it relates to a workout habit.
12. Ensure VARIETY in suggestions - don't suggest similar habits. If you suggest one nutrition-related habit, suggest different categories for other suggestions. Mix different aspects: recovery, preparation, complementary skills, tracking, optimization, etc. Each suggestion should offer a different angle or benefit.

Valid categories: [" + string.Join(", ", HabitCategory.All.Select(c => "\"" + c + "\"")) + @"]";
    }

    private string GetMotivationalMessageInstructions()
    {
        return @"
Your task is to generate a personalized motivational message for the user based on their habits, streaks, consistency, and current context.
IMPORTANT: Generate ALL output in English only. Do not use any other language.
The output MUST be a JSON object with the following structure:
{
  ""message"": ""The motivational message text (2-3 sentences, friendly and encouraging)"",
  ""message_type"": ""One of: encouragement, celebration, challenge, reflection, reminder, inspiration, streak_celebration, streak_recovery"",
  ""related_habits"": [""List of habit actions that this message relates to""],
  ""call_to_action"": ""A specific action or mindset suggestion (optional)"",
  ""tone"": ""One of: motivational, gentle, energetic, calm, supportive, inspiring"",
  ""streak_focus"": ""Which habit streak is being highlighted (optional)""
}

Guidelines for message generation:
1. Be personal and specific to their habits, streaks, and consistency
2. Use a warm, encouraging, and supportive tone
3. Acknowledge their efforts, progress, and streak achievements
4. Provide gentle motivation without being overwhelming
5. Consider the time of day and current context
6. Reference specific habits and their performance data
7. Keep messages concise but meaningful (2-3 sentences)
8. Vary the message type based on context and performance";
    }

    private string GetCompleteHabitFieldsInstructions()
    {
        return @"
Your task is to complete ALL missing fields for a habit based on the provided information.
IMPORTANT: Generate ALL output in English only. Do not use any other language.

The output MUST be a JSON object with a single key called 'habit' containing a complete habit object.
The habit object MUST contain ALL of the following fields (fill missing ones, keep existing ones):

REQUIRED FIELDS (must always be filled):
- action: The core action (e.g., ""lift weights"", ""run"", ""meditate""). If not provided, infer from description or other fields.
- frequency: How often the habit is performed (e.g., ""daily"", ""twice a week"", ""every morning"", ""3 times per week""). If not provided, suggest a reasonable frequency based on the habit type.
- description: A SHORT plain-text summary (2-4 sentences) of the habit. NO markdown, NO headings, NO bullet lists. Do NOT include a day-by-day plan here. The day-by-day plan must be in day_plan.

LENGTH LIMITS (CRITICAL):
- action MUST be at most 80 characters
- description MUST be at most 300 characters
- each day_plan.title MUST be at most 80 characters

OPTIONAL BUT RECOMMENDED FIELDS (fill if missing, make intelligent suggestions):
- time: The best time of day for this habit (e.g., ""morning"", ""evening"", ""5pm"", ""before bed""). Suggest based on the habit type and best practices.
- goal: The goal or reason for this habit (e.g., ""Improve cardiovascular health"", ""Build muscle strength"", ""Reduce stress""). Create a meaningful goal based on the habit.
- category: MUST be one of: [" + string.Join(", ", HabitCategory.All.Select(c => "\"" + c + "\"")) + @"]. If not provided, assign the most appropriate category.
- duration: How long the habit typically takes (e.g., ""30 minutes"", ""1 hour"", ""10 minutes""). Suggest based on the habit type and what's realistic.
- unit: The unit of measurement if applicable (e.g., ""km"", ""minutes"", ""liters"", ""pages"", ""glasses""). Only include if the habit involves measurable quantities.
- quantity: The numerical amount if applicable (e.g., 2 for ""2 liters"", 5 for ""5 km"", 10 for ""10 minutes""). Only include if unit is provided.
- program_days: Program length in days. If a timeframe is implied (""30 days"", ""2 weeks"", ""1 month"" or RU equivalents), convert to days. Otherwise default to 7.
- day_plan: A list of EXACTLY program_days items. Each item MUST be:
  { ""day"": 1..program_days, ""title"": ""Short title"", ""tasks"": [""Bullet task 1"", ""Bullet task 2""] }
  Keep tasks practical and short (1-3 tasks/day). Include occasional review days.

CRITICAL RULES:
1. KEEP all existing non-empty fields exactly as provided - do not modify them.
2. FILL all missing or empty fields with intelligent, realistic suggestions based on the habit type.
3. Make suggestions that are practical, achievable, and aligned with best practices for that type of habit.
4. If action is missing or empty, try to infer it from description or other fields. Be creative but realistic.
5. If frequency is missing or empty, suggest a reasonable frequency (e.g., ""daily"" for most habits, ""3 times per week"" for exercise, ""weekly"" for maintenance tasks).
6. DESCRIPTION must be short, plain text, and not include any headings like ""What to do:"" or markdown like **bold**.
7. day_plan MUST be complete: days 1..program_days, no missing days, no placeholders like ""Day 4"" with empty tasks.
8. ALWAYS assign a category - it's important for organization. Choose the most appropriate one from the list.
9. Suggest time, goal, and duration when they make sense for the habit. Be specific and practical.
10. Only include unit and quantity if the habit involves measurable quantities (e.g., running distance, water intake, reading pages).
11. Think like a habit coach - create a complete, inspiring action plan that makes the user excited to start.
12. Return STRICT JSON only. No markdown fences, no extra text.

IMPORTANT RULES FOR DAY PLAN GENERATION:
1. **UNIQUE TITLES**: The 'title' for each day MUST be unique, short, and descriptive (e.g., 'Getting Started', 'Building Momentum', 'Rest & Recovery', 'Increasing Intensity'). DO NOT use 'Day 1', 'Day 2' as titles.
2. **VARIED TASKS**: Ensure tasks vary day by day. Introduce progression (easy -> hard). Do not simply repeat the main habit action every single day. Include preparation tasks, execution tasks, reflection tasks, and rest days if appropriate.
3. **PROGRESSION**: The plan should show a logical progression. Start small, build up, and include maintenance.

Example output format:
{
  ""habit"": {
    ""action"": ""run"",
    ""frequency"": ""3 times per week"",
    ""description"": ""Run three times per week to build a consistent cardio routine and improve fitness. Keep sessions manageable and focus on steady progress. Use a predictable schedule and track each workout to stay motivated. Adjust intensity gradually as your confidence grows."",
    ""time"": ""morning"",
    ""goal"": ""Improve cardiovascular fitness and overall health"",
    ""category"": ""Fitness"",
    ""duration"": ""30 minutes"",
    ""unit"": ""km"",
    ""quantity"": 5,
    ""program_days"": 14,
    ""day_plan"": [
      { ""day"": 1, ""title"": ""Setup"", ""tasks"": [""Pick 3 days this week"", ""Prepare shoes/clothes"", ""Do a short easy run""] }
    ]
  }
}

IMPORTANT: day_plan must have EXACTLY program_days items and cover EVERY day 1..program_days with real tasks. If you cannot comply, return { ""habit"": null, ""error"": ""cannot_generate_complete_plan"" }.";
    }

    private string GetProgressAdviceInstructions()
    {
        return @"
Your task is to analyze the user's habit performance and provide prioritized, actionable advice.
IMPORTANT: Generate ALL output in English only. Do not use any other language.
Use streaks, completion rates, best streaks, and habit categories to tailor advice.
Return STRICT JSON with the following structure:
{
  ""summary"": ""Short overview of user's progress (1-2 sentences)"",
  ""advice"": [
    {
      ""habit_action"": ""Action this advice relates to (or null for general)"",
      ""category"": ""One of the valid categories (or null)"",
      ""priority"": ""high | medium | low"",
      ""advice"": ""Clear, specific recommendation"",
      ""rationale"": ""Why this matters based on their data"",
      ""suggested_adjustment"": ""Concrete change: schedule, frequency, duration, scaffolding, or reward""
    }
  ],
  ""focus_areas"": [""List of key themes, e.g., Consistency, Sleep, Morning routine""]
}

Guidelines:
1. Celebrate wins: long streaks, high completion rates (>80%).
2. For struggling habits (<50% completion or streak=0), suggest small, specific adjustments.
3. Prefer habit shaping: reduce scope, anchor to existing routine, add cues, add rewards.
4. Limit to 3-6 advice items, ordered by priority.
5. Keep advice phrasing positive and practical.
6. Refer to exact numbers when helpful (e.g., ""15-day streak"").
7. Avoid generic platitudes; be concrete.";
    }

    private string GetDailyPlanInstructions()
    {
        return @"
Your task is to generate a detailed, personalized daily plan for a specific day of a habit program.
IMPORTANT: Generate ALL output in English only. Do not use any other language.

The output MUST be a JSON object with the following structure:
{
  ""day_plan"": {
    ""day"": <day number>,
    ""title"": ""Short, motivating title for this day (e.g., 'Building Momentum', 'Progress Check', 'Level Up')"",
    ""tasks"": [
      ""Specific, actionable task 1"",
      ""Specific, actionable task 2"",
      ""Specific, actionable task 3""
    ],
    ""motivation"": ""A brief motivational message (1-2 sentences) tailored to the user's progress"",
    ""tips"": [
      ""Practical tip 1"",
      ""Practical tip 2""
    ],
    ""adaptation_note"": ""Brief explanation of how this day adapts to user's progress (optional)""
  }
}

CRITICAL GUIDELINES:
1. **Adapt to Progress**: 
   - If completion rate is high (>80%) and streak is strong: Make tasks slightly more challenging or add variety
   - If completion rate is low (<50%) or streak is broken: Simplify tasks, focus on rebuilding consistency
   - If it's early in the program (day 1-3): Focus on setup, preparation, and building the foundation
   - If it's mid-program (day 4-10): Focus on consistency and habit formation
   - If it's late in the program (day 11+): Focus on mastery, refinement, and long-term sustainability

2. **Task Design**:
   - Keep tasks specific, measurable, and achievable (1-3 tasks per day)
   - Each task should be clear and actionable (not vague like ""do your best"")
   - Tasks should build upon previous days if applicable
   - Include variety to prevent boredom (especially for longer streaks)

3. **Motivation**:
   - Acknowledge their progress (streak, completion rate)
   - Celebrate small wins if they're doing well
   - Provide gentle encouragement if they're struggling
   - Make it personal and relevant to their specific habit

4. **Tips**:
   - Provide 1-2 practical tips that help with today's tasks
   - Tips should be specific to the habit type and current progress
   - Include troubleshooting advice if completion rate is low

5. **Title**:
   - Make titles motivating and descriptive
   - Examples: ""Foundation Day"", ""Momentum Builder"", ""Progress Checkpoint"", ""Consistency Challenge"", ""Mastery Day""

6. **Adaptation**:
   - If user has high completion rate: ""Building on your strong consistency, today's tasks add a new challenge to keep you engaged.""
   - If user has low completion rate: ""Let's simplify today to rebuild your momentum. Small, consistent steps lead to lasting change.""
   - If it's a milestone day (e.g., day 7, 14, 21): ""Congratulations on reaching day X! Today we'll celebrate your progress and set you up for continued success.""

7. **Consider Previous Days**:
   - If previous days were completed: Build upon that success
   - If previous days were missed: Provide recovery tasks and encouragement
   - Avoid repeating exact same tasks unless it's intentional (e.g., review days)

8. **Habit-Specific Adaptation**:
   - For fitness habits: Gradually increase intensity or add variety
   - For learning habits: Build on previous knowledge, add new concepts
   - For wellness habits: Deepen the practice, add mindfulness elements
   - For productivity habits: Optimize and refine the process

Example output:
{
  ""day_plan"": {
    ""day"": 5,
    ""title"": ""Building Momentum"",
    ""tasks"": [
      ""Complete your morning routine at the same time as yesterday"",
      ""Track your progress and note one thing that went well"",
      ""Plan tomorrow's session in advance""
    ],
    ""motivation"": ""You're on a 4-day streak! Your consistency is building the foundation for lasting change. Keep up the great work!"",
    ""tips"": [
      ""Set a phone reminder 10 minutes before your scheduled time"",
      ""Keep your equipment ready the night before to reduce friction""
    ],
    ""adaptation_note"": ""Based on your strong completion rate, today's plan adds a planning element to help you maintain momentum.""
  }
}

Remember: The goal is to create a plan that feels personalized, achievable, and motivating based on the user's actual progress and the specific day of their program.";
    }
}
