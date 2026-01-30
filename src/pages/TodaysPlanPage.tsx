import { formatDateBaku } from "@/shared/lib/date";
import { useState, useEffect, useMemo } from "react";
import { Check, Calendar, User, Sparkles } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { getHabitsForDate, completeHabit, getHabitById, getHabits, generateMotivationalMessage } from "@/features/habits/api/habits.api";
import type { HabitResponseDTO } from "@/features/habits/api/habits.api";
import { CategoryIcon } from "@/shared/components/CategoryIcon";
import { HabitPlanModal } from "@/features/habits/components/HabitPlanModal";
import toast from "react-hot-toast";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { calculateOccurrenceDay } from "@/features/habits/lib/schedule";
import { PageLoader } from "@/shared/ui/loading";
import { ErrorState, ErrorDialog } from "@/shared/ui/error-state";
const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };
function getPriorityValue(priority: string | null | undefined): number {
    if (!priority)
        return 999;
    return PRIORITY_ORDER[priority as keyof typeof PRIORITY_ORDER] || 999;
}
function getTimeValue(scheduleTimes: string | null | undefined, dayOfWeek: string): string {
    if (!scheduleTimes)
        return "23:59";
    try {
        const times = JSON.parse(scheduleTimes);
        return times[dayOfWeek] || "23:59";
    }
    catch {
        return "23:59";
    }
}
function formatTime(time: string): string {
    if (!time || time === "23:59")
        return "";
    try {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }
    catch {
        return time;
    }
}
function getDayOfWeek(date: Date): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}
function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}
function calculateCurrentDay(habit: HabitResponseDTO, baseDate: Date = new Date()): number | null {
    return calculateOccurrenceDay({
        createdAt: habit.createdAt ?? null,
        baseDate,
        frequency: habit.frequency ?? "daily",
        scheduleDays: habit.scheduleDays ?? null,
        programDays: habit.programDays ?? null,
    });
}
export default function TodaysPlanPage() {
    const { t } = useLanguage();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [habits, setHabits] = useState<HabitResponseDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [completingHabits, setCompletingHabits] = useState<Set<string>>(new Set());
    const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set());
    const [selectedHabit, setSelectedHabit] = useState<HabitResponseDTO | null>(null);
    const [planModalOpen, setPlanModalOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState("");
    const [motivationalMessage, setMotivationalMessage] = useState<{
        message: string;
        messageType: string;
        callToAction?: string;
    } | null>(null);
    const [isGeneratingMotivation, setIsGeneratingMotivation] = useState(false);
    const dayOfWeek = getDayOfWeek(selectedDate);
    const dateString = formatDate(selectedDate);
    const isToday = formatDate(new Date()) === dateString;
    useEffect(() => {
        const cachedKey = `motivation-${dateString}`;
        const cached = localStorage.getItem(cachedKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (parsed && parsed.message) {
                    setMotivationalMessage(parsed);
                }
            }
            catch {
            }
        }
    }, [dateString]);
    useEffect(() => {
        loadHabits();
    }, [dateString]);
    const loadHabits = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getHabitsForDate(dateString);
            setHabits(data);
            const completed = new Set<string>();
            data.forEach(habit => {
                if (habit.isCompletedForDate === true) {
                    completed.add(habit.id);
                }
            });
            setCompletedHabits(completed);
            if (isToday) {
                const todayKey = dateString;
                const motivationCacheKey = `motivation-${todayKey}`;
                const cachedMessage = localStorage.getItem(motivationCacheKey);
                const isCached = cachedMessage !== null;
                if (!isCached && data.length > 0) {
                    setIsGeneratingMotivation(true);
                    void (async () => {
                        try {
                            console.log('[Motivational Message] Generating message...');
                            const allHabits = await getHabits();
                            if (allHabits.length === 0) {
                                console.log('[Motivational Message] No habits found, skipping generation');
                                setIsGeneratingMotivation(false);
                                return;
                            }
                            const message = await generateMotivationalMessage(allHabits);
                            if (message) {
                                console.log('[Motivational Message] Successfully generated:', message.messageType);
                                setMotivationalMessage(message);
                                localStorage.setItem(motivationCacheKey, JSON.stringify(message));
                            }
                            else {
                                console.warn('[Motivational Message] No message returned from API');
                            }
                        }
                        catch (e: any) {
                            console.error('[Motivational Message] Failed to generate:', e);
                            if (e?.response?.data) {
                                console.error('[Motivational Message] Error response:', JSON.stringify(e.response.data, null, 2));
                            }
                        }
                        finally {
                            setIsGeneratingMotivation(false);
                        }
                    })();
                }
                else if (isCached) {
                    console.log('[Motivational Message] Using cached message');
                }
                else if (data.length === 0) {
                    console.log('[Motivational Message] No habits for today, skipping generation');
                }
            }
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to load habits";
            setError(msg);
        }
        finally {
            setLoading(false);
        }
    };
    const sortedHabits = useMemo(() => {
        return [...habits].sort((a, b) => {
            const priorityA = getPriorityValue(a.priority);
            const priorityB = getPriorityValue(b.priority);
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            const timeA = getTimeValue(a.scheduleTimes, dayOfWeek);
            const timeB = getTimeValue(b.scheduleTimes, dayOfWeek);
            return timeA.localeCompare(timeB);
        });
    }, [habits, dayOfWeek]);
    const handleToggleComplete = async (habitId: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        const isCompleted = completedHabits.has(habitId);
        setCompletingHabits((prev) => new Set(prev).add(habitId));
        try {
            await completeHabit(habitId, dateString);
            if (isCompleted) {
                setCompletedHabits((prev) => {
                    const next = new Set(prev);
                    next.delete(habitId);
                    return next;
                });
                toast.success(t.todayPlan.habitUnmarked);
            }
            else {
                setCompletedHabits((prev) => new Set(prev).add(habitId));
                toast.success(t.todayPlan.habitCompleted);
            }
            window.dispatchEvent(new Event("habits:changed"));
        }
        catch (e) {
            toast.error(e instanceof Error ? e.message : t.todayPlan.failedToUpdate);
        }
        finally {
            setCompletingHabits((prev) => {
                const next = new Set(prev);
                next.delete(habitId);
                return next;
            });
        }
    };
    const handleHabitClick = async (habit: HabitResponseDTO) => {
        try {
            const fullHabit = await getHabitById(habit.id);
            setSelectedHabit(fullHabit);
            setPlanModalOpen(true);
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : t.todayPlan.failedToLoadDetails;
            setErrorDialogMessage(msg);
            setErrorDialogOpen(true);
        }
    };
    const completedCount = completedHabits.size;
    const totalCount = sortedHabits.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const getPriorityColor = (priority: string | null | undefined) => {
        switch (priority) {
            case "High":
                return "border-l-red-500";
            case "Medium":
                return "border-l-yellow-500";
            case "Low":
                return "border-l-green-500";
            default:
                return "border-l-border";
        }
    };
    const getPriorityBadgeColor = (priority: string | null | undefined) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-200";
            case "Medium":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-200";
            case "Low":
                return "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-200";
            default:
                return "bg-muted text-muted-foreground";
        }
    };
    return (<div className="h-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-6 pb-12">
        <Card className="w-full shadow-2xl border-border">
          <div className="p-6">
            
            <div className="pb-4 mb-6 border-b border-border relative">
              
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white"/>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{t.todayPlan.dailyHabits}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isToday ? t.todayPlan.todayProgress : `${formatDateBaku(selectedDate)} ${t.todayPlan.dateProgress}`}
                  </p>
                </div>
                
                <div className="hidden md:flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground"/>
                  <Input type="date" value={dateString} onChange={(e) => {
            if (e.target.value) {
                setSelectedDate(new Date(e.target.value));
            }
        }} className="w-auto"/>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:hidden">
                <Calendar className="w-4 h-4 text-muted-foreground"/>
                <Input type="date" value={dateString} onChange={(e) => {
            if (e.target.value) {
                setSelectedDate(new Date(e.target.value));
            }
        }} className="flex-1"/>
              </div>
            </div>

            {loading ? (<PageLoader text={t.todayPlan.loading}/>) : error ? (<ErrorState message={error} onRetry={loadHabits} title={t.todayPlan.failedToLoad}/>) : sortedHabits.length === 0 ? (<div className="text-center py-8 text-muted-foreground">{t.todayPlan.noHabits}</div>) : (<>
                
                {isToday && (<>
                    
                    {isGeneratingMotivation && !motivationalMessage && (<div className="mb-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/40 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 p-4 shadow-sm animate-pulse">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-950/60 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-indigo-400 dark:text-indigo-600"/>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-indigo-200 dark:bg-indigo-900/40 rounded w-full"/>
                            <div className="h-4 bg-indigo-200 dark:bg-indigo-900/40 rounded w-5/6"/>
                            <div className="h-3 bg-indigo-200 dark:bg-indigo-900/40 rounded w-4/6 mt-3"/>
                          </div>
                        </div>
                      </div>)}
                    
                    {motivationalMessage && (<div className="mb-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/40 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-indigo-600"/>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground leading-relaxed mb-1">
                              {motivationalMessage.message}
                            </p>
                            {motivationalMessage.callToAction && (<p className="text-xs text-indigo-700 dark:text-indigo-200 font-medium mt-2">
                                💪 {motivationalMessage.callToAction}
                              </p>)}
                          </div>
                        </div>
                      </div>)}
                  </>)}

                
                <div className="space-y-3 mb-6">
                  {sortedHabits.map((habit) => {
                const isCompleted = completedHabits.has(habit.id);
                const isCompleting = completingHabits.has(habit.id);
                const time = getTimeValue(habit.scheduleTimes, dayOfWeek);
                const displayTime = formatTime(time);
                return (<div key={habit.id} onClick={() => handleHabitClick(habit)} className={`flex items-center gap-3 p-3 rounded-xl transition-all border-l-4 cursor-pointer ${getPriorityColor(habit.priority)} ${isCompleted ? "opacity-75 bg-muted/40" : "bg-card hover:bg-accent/60"}`}>
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={habit.category} size={40} className="rounded-lg"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-semibold text-sm truncate">{habit.action}</div>
                            {habit.priority && (<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(habit.priority)}`}>
                                {habit.priority === "High"
                            ? t.priority.high
                            : habit.priority === "Medium"
                                ? t.priority.medium
                                : t.priority.low}
                              </span>)}
                          </div>
                          {displayTime && <div className="text-xs text-muted-foreground">{displayTime}</div>}
                          {habit.duration && (<div className="text-xs text-muted-foreground mt-1">
                              {t.todayPlan.duration}: {habit.duration}
                            </div>)}
                        </div>
                        <button onClick={(e) => handleToggleComplete(habit.id, e)} disabled={isCompleting || !isToday} className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isCompleted
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"} ${isCompleting || !isToday ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} title={!isToday ? t.todayPlan.onlyToday : undefined}>
                          {isCompleted && <Check className="w-4 h-4"/>}
                        </button>
                      </div>);
            })}
                </div>

                
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}/>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {completedCount} {t.common.of} {totalCount} {t.todayPlan.habitsCompleted}
                  </p>
                </div>
              </>)}
          </div>
        </Card>
      </div>

      
      {selectedHabit && (<HabitPlanModal open={planModalOpen} onOpenChange={setPlanModalOpen} habit={selectedHabit} currentDay={calculateCurrentDay(selectedHabit, selectedDate) ?? undefined} onHabitUpdated={(updatedHabit) => {
                setSelectedHabit(updatedHabit);
                setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
            }}/>)}

      
      <ErrorDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen} message={errorDialogMessage} title={t.common.error}/>
    </div>);
}
