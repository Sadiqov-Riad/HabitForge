import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChatInput } from "@/shared/components/ChatInput";
import { HabitSuggestionsList } from "@/shared/components/HabitSuggestion";
import type { HabitSuggestionData } from "@/shared/components/HabitSuggestion";
import { AddHabitDialog } from "@/features/habits/components/AddHabitDialog";
import { createHabit, extractHabits, getHabits, suggestHabits, completeHabitFields, type HabitResponseDTO } from "@/features/habits/api/habits.api";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
type GenerationItem = {
    id: string;
    prompt: string;
    status: "loading" | "success" | "error";
    habits: HabitSuggestionData[];
    error?: string;
    createdAt: number;
};
type CachedSuggested = {
    ts: number;
    habits: HabitSuggestionData[];
};
const SUGGESTED_CACHE_KEY = "suggestedHabitsAiCache:v1";
const SUGGESTED_COUNT = 6;
const SUGGESTED_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const SUGGESTED_RETRY_DELAYS_MS = [0, 1500, 4000];
function readSuggestedCache(): CachedSuggested | null {
    try {
        const raw = localStorage.getItem(SUGGESTED_CACHE_KEY);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw) as CachedSuggested;
        if (!parsed?.habits || !Array.isArray(parsed.habits))
            return null;
        if (typeof parsed.ts !== "number")
            return null;
        if (Date.now() - parsed.ts > SUGGESTED_CACHE_TTL_MS)
            return null;
        return parsed;
    }
    catch {
        return null;
    }
}
function writeSuggestedCache(habits: HabitSuggestionData[]) {
    const payload: CachedSuggested = { ts: Date.now(), habits };
    localStorage.setItem(SUGGESTED_CACHE_KEY, JSON.stringify(payload));
}
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function makeClientId() {
    const anyCrypto = globalThis.crypto as unknown as {
        randomUUID?: () => string;
    } | undefined;
    const uuid = anyCrypto?.randomUUID?.();
    return uuid ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
export default function AddHabitPage() {
    const { t } = useLanguage();
    const [suggested, setSuggested] = useState<GenerationItem | null>(null);
    const [generations, setGenerations] = useState<GenerationItem[]>([]);
    const [isPromptGenerating, setIsPromptGenerating] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState<HabitSuggestionData | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    useEffect(() => {
        let isActive = true;
        const loadSuggested = async () => {
            const base: GenerationItem = {
                id: "default",
                prompt: t.addHabit.suggestedForYou,
                status: "loading",
                habits: [],
                createdAt: Date.now(),
            };
            const cached = readSuggestedCache();
            if (cached?.habits?.length) {
                setSuggested({ ...base, status: "success", habits: cached.habits, createdAt: cached.ts });
            }
            else {
                setSuggested(base);
            }
            let existingHabits: HabitResponseDTO[] = [];
            try {
                existingHabits = await getHabits();
            }
            catch {
                existingHabits = [];
            }
            let updated = false;
            for (const delay of SUGGESTED_RETRY_DELAYS_MS) {
                if (!isActive)
                    return;
                if (delay > 0) {
                    await sleep(delay);
                }
                try {
                    const aiHabits = await suggestHabits(existingHabits, "Generate 6 simple daily habits", "Simple, low-effort, beginner-friendly", "5-20 minutes per day");
                    const habits = aiHabits.slice(0, SUGGESTED_COUNT);
                    if (!habits.length) {
                        continue;
                    }
                    writeSuggestedCache(habits);
                    if (!isActive)
                        return;
                    setSuggested({ ...base, status: "success", habits });
                    updated = true;
                    break;
                }
                catch {
                }
            }
            if (!updated && !cached?.habits?.length && isActive) {
                setSuggested(null);
            }
        };
        void loadSuggested();
        return () => {
            isActive = false;
        };
    }, []);
    const handleInputSubmit = async (value: string) => {
        if (!value.trim() || isPromptGenerating)
            return;
        const id = makeClientId();
        const promptText = value.trim();
        setIsPromptGenerating(true);
        setGenerations((prev) => [
            { id, prompt: promptText, status: "loading", habits: [], createdAt: Date.now() },
            ...prev,
        ]);
        try {
            const habits = await extractHabits(promptText);
            setGenerations((prev) => prev.map((x) => x.id === id
                ? { ...x, status: "success", habits: habits.length ? habits : [] }
                : x));
        }
        catch (e) {
            const raw = e instanceof Error ? e.message : t.addHabit.failedToGenerate;
            const msg = raw.includes("timeout") || raw.includes("10000") || raw.includes("60000")
                ? "AI не успел ответить. Попробуйте ещё раз (и проверьте настройки AI / Hugging Face)."
                : raw;
            setGenerations((prev) => prev.map((x) => (x.id === id ? { ...x, status: "error", error: msg } : x)));
        }
        finally {
            setIsPromptGenerating(false);
        }
    };
    const handleHabitClick = (_sourceId: string, habit: HabitSuggestionData) => {
        setSelectedHabit(habit);
        setDialogOpen(true);
    };
    const handleConfirmAdd = async (habit: HabitSuggestionData & {
        priority?: string | null;
        scheduleDays?: string | null;
        scheduleTimes?: string | null;
        duration?: string | null;
        frequency?: "daily" | "weekly" | "monthly" | null;
        startDate?: string | null;
        programDays?: number | null;
    }) => {
        const completed = await completeHabitFields({
            id: null,
            action: habit.title,
            frequency: habit.frequency || "daily",
            description: habit.description || habit.title,
            category: habit.category ?? null,
            duration: habit.duration ?? null,
            priority: habit.priority ?? null,
            scheduleDays: habit.scheduleDays ?? null,
            scheduleTimes: habit.scheduleTimes ?? null,
            programDays: habit.programDays ?? null,
            dayPlan: habit.dayPlan ?? null,
            currentStreak: 0,
            bestStreak: 0,
            completionRate: 0,
            totalCompletions: 0,
            daysTracked: 0,
        });
        const habitData = {
            ...completed,
            frequency: habit.frequency || completed.frequency || "daily",
            priority: habit.priority ?? completed.priority ?? null,
            scheduleDays: habit.scheduleDays ?? completed.scheduleDays ?? null,
            scheduleTimes: habit.scheduleTimes ?? completed.scheduleTimes ?? null,
            duration: habit.duration ?? completed.duration ?? null,
        };
        await createHabit(habitData);
        window.dispatchEvent(new Event("habits:changed"));
        setDialogOpen(false);
        setSelectedHabit(null);
    };
    return (<div className="h-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-6 pb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">
            {t.addHabit.title}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.addHabit.subtitle}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12 sm:mb-16">
          <div className="flex flex-col items-center w-full">
            <ChatInput placeholder={t.addHabit.placeholder} onSubmit={handleInputSubmit} disabled={isPromptGenerating}/>
          </div>
        </motion.div>

        {generations.length > 0 && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                {t.addHabit.prompt}
              </h2>
            </div>

            <div className="space-y-6">
              {generations.map((item) => (<div key={item.id} className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {t.addHabit.prompt}: <span className="font-medium text-foreground">{item.prompt}</span>
                  </div>

                  {item.status === "loading" && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="rounded-xl border border-border bg-card p-4">
                        <div className="h-4 w-2/3 rounded bg-slate-200 animate-pulse"/>
                        <div className="mt-3 h-3 w-full rounded bg-slate-200 animate-pulse"/>
                        <div className="mt-2 h-3 w-5/6 rounded bg-slate-200 animate-pulse"/>
                        <div className="mt-4 h-5 w-20 rounded bg-slate-200 animate-pulse"/>
                      </div>
                    </div>)}

                  {item.status === "error" && (<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {item.error ?? t.addHabit.failedToGenerate}
                    </div>)}

                  {item.status === "success" && (<HabitSuggestionsList habits={item.habits.length ? item.habits : []} onHabitClick={(habit) => handleHabitClick(item.id, habit)}/>)}
                </div>))}
            </div>
          </motion.div>)}

        {suggested && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`space-y-6${generations.length > 0 ? " mt-6" : ""}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                {t.addHabit.suggestedForYou}
              </h2>
            </div>

            <div className="space-y-6">
              {suggested.status === "loading" && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from({ length: 5 }).map((_, idx) => (<div key={`suggested-skeleton-${idx}`} className="rounded-xl border border-border bg-card p-4">
                      <div className="h-4 w-2/3 rounded bg-slate-200 animate-pulse"/>
                      <div className="mt-3 h-3 w-full rounded bg-slate-200 animate-pulse"/>
                      <div className="mt-2 h-3 w-5/6 rounded bg-slate-200 animate-pulse"/>
                      <div className="mt-4 h-5 w-20 rounded bg-slate-200 animate-pulse"/>
                    </div>))}
                </div>)}

              {suggested.status === "success" && (<HabitSuggestionsList habits={suggested.habits.length ? suggested.habits : []} onHabitClick={(habit) => handleHabitClick(suggested.id, habit)}/>)}
            </div>
          </motion.div>)}
        <AddHabitDialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
                setSelectedHabit(null);
            }
        }} habit={selectedHabit} onConfirm={handleConfirmAdd}/>
      </div>
    </div>);
}
