import api from '@/shared/lib/axios';
import type { HabitSuggestionData } from '@/shared/components/HabitSuggestion';
export type HabitDTO = {
    id?: string | null;
    action: string;
    frequency: string;
    time?: string | null;
    goal?: string | null;
    unit?: string | null;
    quantity?: number | null;
    category?: string | null;
    duration?: string | null;
    priority?: string | null;
    scheduleDays?: string | null;
    scheduleTimes?: string | null;
    description: string;
    programDays?: number | null;
    dayPlan?: Array<{
        day: number;
        title: string;
        tasks: string[];
    }> | null;
    currentStreak?: number;
    bestStreak?: number;
    completionRate?: number;
    totalCompletions?: number;
    daysTracked?: number;
};
export type HabitResponseDTO = {
    id: string;
    action: string;
    frequency: string;
    time?: string | null;
    goal?: string | null;
    unit?: string | null;
    quantity?: number | null;
    category?: string | null;
    duration?: string | null;
    priority?: string | null;
    scheduleDays?: string | null;
    scheduleTimes?: string | null;
    description: string;
    programDays?: number | null;
    dayPlan: Array<{
        day: number;
        title: string;
        tasks: string[];
        isCompleted: boolean;
        completedAt?: string | null;
    }>;
    currentStreak: number;
    bestStreak: number;
    completionRate: number;
    totalCompletions: number;
    daysTracked: number;
    createdAt: string;
    isActive: boolean;
    isCompletedForDate?: boolean;
};
type HabitAIResponseDTO = {
    success: boolean;
    parsedResponse?: unknown;
    rawResponse?: string;
    durationSeconds: number;
    errorMessage?: string | null;
    requestId: string;
    createdAt: string;
};
function makeId(seed: string, idx: number) {
    const anyCrypto = globalThis.crypto as unknown as {
        randomUUID?: () => string;
    } | undefined;
    const uuid = anyCrypto?.randomUUID?.();
    return uuid ?? `${seed}-${Date.now()}-${idx}`;
}
export async function createHabit(habit: HabitDTO): Promise<HabitResponseDTO> {
    const payload: HabitDTO = {
        ...habit,
        currentStreak: habit.currentStreak ?? 0,
        bestStreak: habit.bestStreak ?? 0,
        completionRate: habit.completionRate ?? 0,
        totalCompletions: habit.totalCompletions ?? 0,
        daysTracked: habit.daysTracked ?? 0,
    };
    const { data } = await api.post<HabitResponseDTO>('/Habit', payload);
    return data;
}
export async function getHabits(): Promise<HabitResponseDTO[]> {
    const { data } = await api.get<HabitResponseDTO[]>('/Habit');
    return data;
}
export async function getHabitById(id: string): Promise<HabitResponseDTO> {
    const { data } = await api.get<HabitResponseDTO>(`/Habit/${id}`);
    return data;
}
export async function updateHabit(habitId: string, updates: Partial<HabitDTO>): Promise<HabitResponseDTO> {
    const { data } = await api.put<HabitResponseDTO>(`/Habit/${habitId}`, updates);
    return data;
}
export async function deleteHabit(habitId: string): Promise<void> {
    await api.delete(`/Habit/${habitId}`);
}
export async function getHabitsForDate(date: string): Promise<HabitResponseDTO[]> {
    try {
        const { data } = await api.get<HabitResponseDTO[]>(`/Habit/for-date/${date}`);
        return data;
    }
    catch (error: any) {
        throw error;
    }
}
export async function completeHabit(habitId: string, date?: string): Promise<void> {
    await api.post(`/Habit/${habitId}/complete`, { date: date || undefined });
}
export async function getEmailNotificationsPreference(): Promise<{
    enabled: boolean;
}> {
    const { data } = await api.get<{
        enabled: boolean;
    }>(`/UserPreferences/email-notifications`);
    return data;
}
export async function setEmailNotificationsPreference(enabled: boolean): Promise<{
    enabled: boolean;
}> {
    const { data } = await api.put<{
        enabled: boolean;
    }>(`/UserPreferences/email-notifications`, { enabled });
    return data;
}
export async function setPlanDayCompleted(habitId: string, dayNumber: number, isCompleted: boolean): Promise<{
    day: number;
    title: string;
    tasks: string[];
    isCompleted: boolean;
    completedAt?: string | null;
}> {
    const { data } = await api.put(`/Habit/${habitId}/plan/${dayNumber}`, { isCompleted });
    return data as {
        day: number;
        title: string;
        tasks: string[];
        isCompleted: boolean;
        completedAt?: string | null;
    };
}
export async function extractHabits(inputText: string): Promise<HabitSuggestionData[]> {
    try {
        const { data } = await api.post<HabitAIResponseDTO>('/HabitAI/extract-habits', { inputText }, { timeout: 60000 });
        if (!data?.success) {
            const details = data?.errorMessage || 'AI failed to generate habits';
            throw new Error(details);
        }
        const parsed = data.parsedResponse as {
            habits?: unknown;
        } | undefined;
        const habits = parsed?.habits;
        if (!Array.isArray(habits)) {
            console.warn('AI parsedResponse.habits is not an array', { parsedResponse: data.parsedResponse, rawResponse: data.rawResponse });
            throw new Error('AI response format invalid (habits is not an array)');
        }
        const mapped = habits
            .map((h, idx): HabitSuggestionData | null => {
            const obj = h as Record<string, unknown>;
            const action = obj.action;
            const description = obj.description;
            const category = obj.category;
            const programDays = obj.program_days;
            const dayPlan = obj.day_plan;
            if (typeof action !== 'string' || typeof description !== 'string')
                return null;
            const parsedProgramDays = typeof programDays === 'number' ? programDays : undefined;
            const parsedDayPlan = Array.isArray(dayPlan)
                ? dayPlan
                    .map((d) => {
                    const dd = d as Record<string, unknown>;
                    const day = dd.day;
                    const title = dd.title;
                    const tasks = dd.tasks;
                    if (typeof day !== 'number' || typeof title !== 'string' || !Array.isArray(tasks))
                        return null;
                    const taskStrings = tasks.filter((t) => typeof t === 'string') as string[];
                    return { day, title, tasks: taskStrings };
                })
                    .filter((x): x is {
                    day: number;
                    title: string;
                    tasks: string[];
                } => x !== null)
                : undefined;
            return {
                id: makeId(action, idx),
                title: action,
                description,
                ...(typeof category === 'string' ? { category } : {}),
                ...(typeof parsedProgramDays === 'number' ? { programDays: parsedProgramDays } : {}),
                ...(parsedDayPlan?.length ? { dayPlan: parsedDayPlan } : {}),
            };
        })
            .filter((x): x is HabitSuggestionData => x !== null);
        if (!mapped.length) {
            console.warn('AI returned habits array but none were usable after validation', { parsedResponse: data.parsedResponse, rawResponse: data.rawResponse });
            throw new Error('AI returned no usable habits. Try a more specific prompt.');
        }
        return mapped;
    }
    catch (e: any) {
        throw e;
    }
}
export async function completeHabitFields(habit: HabitDTO): Promise<HabitDTO> {
    const clampOptional = (value: unknown, max: number): string | null => {
        if (typeof value !== 'string')
            return null;
        const trimmed = value.trim();
        if (!trimmed)
            return null;
        return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
    };
    const clampRequired = (value: unknown, max: number, fieldName: string): string => {
        const v = clampOptional(value, max);
        if (!v)
            throw new Error(`Missing required field: ${fieldName}`);
        return v;
    };
    const safeDayPlan = habit.dayPlan && Array.isArray(habit.dayPlan)
        ? habit.dayPlan
            .map((d) => {
            const day = typeof (d as any)?.day === 'number' ? (d as any).day : null;
            const title = clampOptional((d as any)?.title, 80);
            const tasksRaw = Array.isArray((d as any)?.tasks) ? ((d as any).tasks as unknown[]) : [];
            const tasks = tasksRaw
                .filter((t) => typeof t === 'string')
                .map((t) => clampOptional(t, 160))
                .filter((t): t is string => !!t)
                .slice(0, 3);
            if (!day || !title)
                return null;
            return { day, title, tasks };
        })
            .filter((x): x is {
            day: number;
            title: string;
            tasks: string[];
        } => x !== null)
        : null;
    const safeHabit: HabitDTO = {
        ...habit,
        id: habit.id ?? null,
        action: clampRequired(habit.action, 80, 'action'),
        frequency: clampRequired(habit.frequency, 32, 'frequency'),
        description: clampRequired(habit.description, 300, 'description'),
        time: clampOptional(habit.time, 32),
        goal: clampOptional(habit.goal, 80),
        unit: clampOptional(habit.unit, 32),
        category: clampOptional(habit.category, 32),
        duration: clampOptional(habit.duration, 50),
        priority: clampOptional(habit.priority, 16),
        scheduleDays: clampOptional(habit.scheduleDays, 512),
        scheduleTimes: clampOptional(habit.scheduleTimes, 2048),
        dayPlan: safeDayPlan,
    };
    try {
        const { data } = await api.post<HabitAIResponseDTO>('/HabitAI/complete-habit-fields', { habit: safeHabit }, { timeout: 60000 });
        if (!data?.success) {
            throw new Error(data?.errorMessage || 'AI failed to complete habit fields');
        }
        const parsed = data.parsedResponse as {
            habit?: unknown;
        } | undefined;
        const h = parsed?.habit;
        if (!h || typeof h !== 'object') {
            throw new Error('AI response format invalid (habit is missing)');
        }
        const obj = h as Record<string, unknown>;
        const action = (obj.action ?? obj.Action) as unknown;
        const frequency = (obj.frequency ?? obj.Frequency) as unknown;
        const description = (obj.description ?? obj.Description) as unknown;
        if (typeof action !== 'string' || typeof frequency !== 'string' || typeof description !== 'string') {
            throw new Error('AI completed habit is missing required fields (action/frequency/description)');
        }
        const programDaysRaw = obj.program_days ?? obj.programDays ?? obj.ProgramDays;
        const dayPlanRaw = obj.day_plan ?? obj.dayPlan ?? obj.DayPlan;
        const parsedProgramDays = typeof programDaysRaw === 'number' ? programDaysRaw : undefined;
        const parsedDayPlan = Array.isArray(dayPlanRaw)
            ? dayPlanRaw
                .map((d) => {
                const dd = d as Record<string, unknown>;
                const day = dd.day ?? dd.Day;
                const title = dd.title ?? dd.Title;
                const tasks = dd.tasks ?? dd.Tasks;
                if (typeof day !== 'number' || typeof title !== 'string' || !Array.isArray(tasks))
                    return null;
                const taskStrings = tasks.filter((t) => typeof t === 'string') as string[];
                return { day, title, tasks: taskStrings };
            })
                .filter((x): x is {
                day: number;
                title: string;
                tasks: string[];
            } => x !== null)
            : undefined;
        const time = obj.time ?? obj.Time;
        const goal = obj.goal ?? obj.Goal;
        const unit = obj.unit ?? obj.Unit;
        const quantity = obj.quantity ?? obj.Quantity;
        const category = obj.category ?? obj.Category;
        const duration = obj.duration ?? obj.Duration;
        return {
            id: habit.id ?? null,
            action,
            frequency,
            description,
            time: typeof time === 'string' ? time : null,
            goal: typeof goal === 'string' ? goal : null,
            unit: typeof unit === 'string' ? unit : null,
            quantity: typeof quantity === 'number' ? quantity : null,
            category: typeof category === 'string' ? category : null,
            duration: typeof duration === 'string' ? duration : null,
            priority: habit.priority ?? null,
            scheduleDays: habit.scheduleDays ?? null,
            scheduleTimes: habit.scheduleTimes ?? null,
            programDays: typeof parsedProgramDays === 'number' ? parsedProgramDays : null,
            dayPlan: parsedDayPlan?.length ? parsedDayPlan : null,
            currentStreak: habit.currentStreak ?? 0,
            bestStreak: habit.bestStreak ?? 0,
            completionRate: habit.completionRate ?? 0,
            totalCompletions: habit.totalCompletions ?? 0,
            daysTracked: habit.daysTracked ?? 0,
        };
    }
    catch (e: any) {
        const status = typeof e?.response?.status === 'number' ? e.response.status : null;
        if (status === 400 && e?.response?.data?.errors) {
            const errors = e.response.data.errors as Record<string, string[]>;
            const first = Object.entries(errors)[0];
            const msg = first ? `${first[0]}: ${first[1]?.[0] ?? 'Validation error'}` : 'Validation error';
            throw new Error(msg);
        }
        throw e;
    }
}
export async function suggestHabits(existingHabits: HabitResponseDTO[], userGoals?: string, preferences?: string, timeAvailability?: string): Promise<HabitSuggestionData[]> {
    const clamp = (value: string, max: number) => (value.length > max ? value.slice(0, max) : value);
    const safeExistingHabits = existingHabits
        .map((h) => ({
        action: typeof h.action === 'string' ? clamp(h.action, 80) : '',
        frequency: typeof h.frequency === 'string' ? clamp(h.frequency, 32) : '',
        description: typeof h.description === 'string' ? clamp(h.description, 300) : '',
        category: typeof h.category === 'string' ? clamp(h.category, 32) : null,
    }))
        .filter((h) => h.action && h.frequency && h.description);
    const { data } = await api.post<HabitAIResponseDTO>('/HabitAI/suggest-habits', {
        existingHabits: safeExistingHabits,
        userGoals: userGoals || null,
        preferences: preferences || null,
        timeAvailability: timeAvailability || null,
    }, { timeout: 60000 });
    if (!data?.success)
        return [];
    const parsed = data.parsedResponse as {
        suggested_habits?: unknown;
    } | undefined;
    const habits = parsed?.suggested_habits;
    if (!Array.isArray(habits))
        return [];
    return habits
        .map((h, idx): HabitSuggestionData | null => {
        const obj = h as Record<string, unknown>;
        const action = obj.action;
        const description = obj.description;
        const category = obj.category;
        const programDays = obj.program_days;
        const dayPlan = obj.day_plan;
        if (typeof action !== 'string' || typeof description !== 'string')
            return null;
        const parsedProgramDays = typeof programDays === 'number' ? programDays : undefined;
        const parsedDayPlan = Array.isArray(dayPlan)
            ? dayPlan
                .map((d) => {
                const dd = d as Record<string, unknown>;
                const day = dd.day;
                const title = dd.title;
                const tasks = dd.tasks;
                if (typeof day !== 'number' || typeof title !== 'string' || !Array.isArray(tasks))
                    return null;
                const taskStrings = tasks.filter((t) => typeof t === 'string') as string[];
                return { day, title, tasks: taskStrings };
            })
                .filter((x): x is {
                day: number;
                title: string;
                tasks: string[];
            } => x !== null)
            : undefined;
        return {
            id: makeId(action, idx),
            title: action,
            description,
            ...(typeof category === 'string' ? { category } : {}),
            ...(typeof parsedProgramDays === 'number' ? { programDays: parsedProgramDays } : {}),
            ...(parsedDayPlan?.length ? { dayPlan: parsedDayPlan } : {}),
        };
    })
        .filter((x): x is HabitSuggestionData => x !== null);
}
export async function generateDailyPlan(habitId: string, dayNumber: number, habitInfo: HabitResponseDTO, currentStreak?: number, completionRate?: number, completedDays?: Array<{
    day: number;
    title: string;
    tasks: string[];
    isCompleted: boolean;
}>): Promise<{
    day: number;
    title: string;
    tasks: string[];
    motivation?: string;
    tips?: string[];
} | null> {
    const { data } = await api.post<HabitAIResponseDTO>('/HabitAI/generate-daily-plan', {
        habitId,
        dayNumber,
        currentStreak: currentStreak ?? null,
        completionRate: completionRate ?? null,
        completedDays: completedDays?.map((d) => ({
            day: d.day,
            title: d.title,
            tasks: d.tasks,
            isCompleted: d.isCompleted,
        })) ?? null,
        habitInfo: {
            id: habitInfo.id,
            action: habitInfo.action,
            frequency: habitInfo.frequency,
            time: habitInfo.time,
            goal: habitInfo.goal,
            unit: habitInfo.unit,
            quantity: habitInfo.quantity,
            category: habitInfo.category,
            duration: habitInfo.duration,
            description: habitInfo.description,
            programDays: habitInfo.programDays,
            dayPlan: habitInfo.dayPlan.map((d) => ({
                day: d.day,
                title: d.title,
                tasks: d.tasks,
            })),
            currentStreak: habitInfo.currentStreak,
            bestStreak: habitInfo.bestStreak,
            completionRate: habitInfo.completionRate,
            totalCompletions: habitInfo.totalCompletions,
            daysTracked: habitInfo.daysTracked,
        },
    }, { timeout: 60000 });
    if (!data?.success)
        return null;
    const parsed = data.parsedResponse as {
        day_plan?: unknown;
    } | undefined;
    const dayPlan = parsed?.day_plan;
    if (!dayPlan || typeof dayPlan !== 'object')
        return null;
    const plan = dayPlan as Record<string, unknown>;
    const day = plan.day;
    const title = plan.title;
    const tasks = plan.tasks;
    const motivation = plan.motivation;
    const tips = plan.tips;
    if (typeof day !== 'number' || typeof title !== 'string' || !Array.isArray(tasks))
        return null;
    const taskStrings = tasks.filter((t) => typeof t === 'string') as string[];
    const tipStrings = Array.isArray(tips) ? (tips.filter((t) => typeof t === 'string') as string[]) : undefined;
    return {
        day,
        title,
        tasks: taskStrings,
        ...(typeof motivation === 'string' ? { motivation } : {}),
        ...(tipStrings ? { tips: tipStrings } : {}),
    };
}
export async function updateHabitDayPlan(habitId: string, dayNumber: number, title: string, tasks: string[]): Promise<{
    day: number;
    title: string;
    tasks: string[];
    isCompleted: boolean;
    completedAt?: string | null;
}> {
    const { data } = await api.put(`/Habit/${habitId}/plan/${dayNumber}/update`, { title, tasks });
    return data as {
        day: number;
        title: string;
        tasks: string[];
        isCompleted: boolean;
        completedAt?: string | null;
    };
}
export async function generateMotivationalMessage(userHabits: HabitResponseDTO[]): Promise<{
    message: string;
    messageType: string;
    relatedHabits: string[];
    callToAction?: string;
    tone?: string;
} | null> {
    const validHabits = userHabits
        .filter((h) => {
        return (h.action &&
            h.action.trim().length > 0 &&
            h.frequency &&
            h.frequency.trim().length > 0 &&
            h.description &&
            h.description.trim().length > 0);
    })
        .map((h) => {
        const clamp = (value: string | null | undefined, max: number): string | null => {
            if (!value)
                return null;
            return value.length > max ? value.slice(0, max) : value;
        };
        const action = clamp(h.action, 80) || 'Unknown habit';
        const frequency = clamp(h.frequency, 32) || 'daily';
        const description = clamp(h.description, 300) || h.action || 'No description';
        return {
            id: h.id || null,
            action: action,
            frequency: frequency,
            time: clamp(h.time, 32) || null,
            goal: clamp(h.goal, 80) || null,
            unit: clamp(h.unit, 32) || null,
            quantity: h.quantity ?? null,
            category: clamp(h.category, 32) || null,
            duration: clamp(h.duration, 50) || null,
            description: description,
            programDays: h.programDays ?? null,
            dayPlan: h.dayPlan && Array.isArray(h.dayPlan) && h.dayPlan.length > 0
                ? h.dayPlan.map((d) => ({
                    day: d.day ?? 1,
                    title: clamp(d.title, 100) || 'Day plan',
                    tasks: Array.isArray(d.tasks) ? d.tasks.filter((t) => typeof t === 'string' && t.trim().length > 0) : [],
                }))
                : null,
            currentStreak: h.currentStreak ?? 0,
            bestStreak: h.bestStreak ?? 0,
            completionRate: h.completionRate ?? 0,
            totalCompletions: h.totalCompletions ?? 0,
            daysTracked: h.daysTracked ?? 0,
        };
    });
    if (validHabits.length === 0) {
        console.warn('[Motivational Message] No valid habits to generate message for');
        return null;
    }
    try {
        console.log('[Motivational Message] Sending request with', validHabits.length, 'habits');
        console.log('[Motivational Message] Sample habit data:', JSON.stringify(validHabits[0], null, 2));
        const { data } = await api.post<HabitAIResponseDTO>('/HabitAI/motivational-message', {
            userHabits: validHabits,
        }, { timeout: 60000 });
        if (!data?.success) {
            console.error('[Motivational Message] API returned error:', data.errorMessage || 'Unknown error');
            return null;
        }
        const parsed = data.parsedResponse as {
            message?: string;
            message_type?: string;
            related_habits?: string[];
            call_to_action?: string;
            tone?: string;
        } | undefined;
        if (!parsed?.message) {
            console.warn('[Motivational Message] No message in parsed response');
            return null;
        }
        return {
            message: parsed.message,
            messageType: parsed.message_type || 'encouragement',
            relatedHabits: parsed.related_habits || [],
            callToAction: parsed.call_to_action,
            tone: parsed.tone,
        };
    }
    catch (error: any) {
        console.error('[Motivational Message] Request failed:', error);
        if (error?.response?.data) {
            console.error('[Motivational Message] Error response data:', JSON.stringify(error.response.data, null, 2));
        }
        if (error?.response?.status === 400) {
            console.error('[Motivational Message] Validation error - check required fields');
            console.error('[Motivational Message] Sent data sample:', JSON.stringify(validHabits[0], null, 2));
        }
        throw error;
    }
}
