export type HabitFrequency = "daily" | "weekly" | "monthly" | string;
const DAY_NAMES: Record<number, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
};
function toDateStart(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
export function parseScheduleDaysJson(scheduleDays: string | null | undefined): Set<string> | null {
    if (!scheduleDays)
        return null;
    try {
        const parsed = JSON.parse(scheduleDays);
        if (!Array.isArray(parsed))
            return null;
        const onlyStrings = parsed.filter((x) => typeof x === "string") as string[];
        if (!onlyStrings.length)
            return null;
        return new Set(onlyStrings);
    }
    catch {
        return null;
    }
}
export function isScheduledOnDate(date: Date, schedule: Set<string> | null): boolean {
    if (!schedule)
        return true;
    const dayName = DAY_NAMES[date.getDay()];
    return schedule.has(dayName);
}
export function calculateOccurrenceDay(opts: {
    createdAt?: string | null;
    baseDate?: Date;
    frequency?: HabitFrequency | null;
    scheduleDays?: string | null;
    programDays?: number | null;
}): number | null {
    const { createdAt, baseDate = new Date(), frequency, scheduleDays, programDays } = opts;
    if (!createdAt)
        return null;
    const created = toDateStart(new Date(createdAt));
    const base = toDateStart(baseDate);
    const diffDays = Math.floor((base.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0)
        return null;
    const freq = (frequency ?? "daily").toString().toLowerCase();
    const windowDays = freq === "weekly" ? 7 : freq === "monthly" ? 30 : null;
    if (windowDays !== null && diffDays >= windowDays)
        return null;
    const schedule = parseScheduleDaysJson(scheduleDays);
    if (!isScheduledOnDate(base, schedule))
        return null;
    let count = 0;
    for (let i = 0; i <= diffDays; i++) {
        const d = new Date(created);
        d.setDate(created.getDate() + i);
        if (isScheduledOnDate(d, schedule))
            count++;
    }
    if (count <= 0)
        return null;
    if (typeof programDays === "number" && programDays > 0 && count > programDays)
        return null;
    return count;
}
export function countScheduledDaysInWindow(opts: {
    startDate: Date;
    windowDays: number;
    selectedDays: string[];
}): number {
    const { startDate, windowDays, selectedDays } = opts;
    const schedule = selectedDays.length ? new Set(selectedDays) : null;
    let count = 0;
    const start = toDateStart(startDate);
    for (let i = 0; i < windowDays; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        if (isScheduledOnDate(d, schedule))
            count++;
    }
    return count;
}
