import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import type { HabitResponseDTO } from "@/features/habits/api/habits.api";
import { CheckCircle, Lightbulb } from "lucide-react";
import { calculateOccurrenceDay } from "@/features/habits/lib/schedule";
import { CategoryIcon } from "@/shared/components/CategoryIcon";
interface HabitPlanModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    habit: HabitResponseDTO | null;
    currentDay?: number;
    onHabitUpdated?: (habit: HabitResponseDTO) => void;
}
export function HabitPlanModal({ open, onOpenChange, habit, currentDay, onHabitUpdated }: HabitPlanModalProps) {
    void onHabitUpdated;
    const [generatedPlan] = useState<{
        title: string;
        tasks: string[];
        tips?: string[];
        motivation?: string;
    } | null>(null);
    if (!habit)
        return null;
    const [activeDay, setActiveDay] = useState<number | null>(currentDay ?? null);
    useEffect(() => {
        setActiveDay(currentDay ?? null);
    }, [currentDay, habit.id]);
    const calculatedDay = currentDay ?? (() => {
        return calculateOccurrenceDay({
            createdAt: habit.createdAt ?? null,
            baseDate: new Date(),
            frequency: habit.frequency ?? "daily",
            scheduleDays: habit.scheduleDays ?? null,
            programDays: habit.programDays ?? null,
        });
    })();
    const displayDay = activeDay ?? calculatedDay;
    const currentDayPlan = displayDay
        ? habit.dayPlan.find((p) => p.day === displayDay)
        : null;
    const displayPlan = generatedPlan || (currentDayPlan ? {
        title: currentDayPlan.title,
        tasks: currentDayPlan.tasks,
        tips: undefined,
        motivation: undefined,
    } : null);
    const completedDays = habit.dayPlan.filter((p) => p.isCompleted).length;
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(96vw,900px)] max-h-[90vh] overflow-y-auto">
        <DialogClose onClose={() => onOpenChange(false)}/>
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-2xl mb-2 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
              <CategoryIcon category={habit.category ?? null} size={22}/>
            </span>
            <span className="min-w-0 truncate">{habit.action}</span>
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            {habit.description}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6 space-y-8">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Progress
              </h3>
              <span className="text-sm font-semibold text-foreground">
                {displayDay ? `Day ${displayDay}` : "Not started"}
              </span>
            </div>
            {displayDay && (<div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Completed days: {completedDays}</span>
                  <span>Current streak: {habit.currentStreak} days</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${displayDay > 0 ? (completedDays / displayDay) * 100 : 0}%` }}/>
                </div>
              </div>)}
          </div>

          
          <div className="border-t border-border"/>

          
          {displayDay ? (<div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Day {displayDay} Plan
                </h3>
                {(currentDayPlan?.isCompleted || (generatedPlan && currentDayPlan?.isCompleted)) && (<div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-200 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5"/>
                    <span>Completed</span>
                  </div>)}
              </div>

              {displayPlan ? (<div className="rounded-xl border-2 border-border bg-card p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 text-base">{displayPlan.title}</h4>
                    
                    
                    <ul className="space-y-2.5 mb-4">
                      {displayPlan.tasks.map((task, idx) => (<li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="flex-1 leading-relaxed">{task}</span>
                        </li>))}
                    </ul>

                    
                    {displayPlan.motivation && (<div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 rounded-lg">
                        <p className="text-sm text-indigo-900 dark:text-indigo-100 leading-relaxed italic">
                          {displayPlan.motivation}
                        </p>
                      </div>)}

                    
                    {displayPlan.tips && displayPlan.tips.length > 0 && (<div className="pt-3 border-t border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-amber-500"/>
                          <h5 className="text-sm font-semibold text-foreground">Tips for Today</h5>
                        </div>
                        <ul className="space-y-1.5">
                          {displayPlan.tips.map((tip, idx) => (<li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="text-amber-500 mt-0.5">💡</span>
                              <span className="flex-1 leading-relaxed">{tip}</span>
                            </li>))}
                        </ul>
                      </div>)}
                  </div>
                </div>) : (<div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      No plan available for day {displayDay}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Generate a plan to get started with your daily tasks
                    </p>
                  </div>
                </div>)}

              
            </div>) : (<div className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground mb-1">
                    Program Not Started
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This habit doesn't have a creation date. Please recreate the habit to start tracking.
                  </p>
                </div>
              </div>
            </div>)}

          
          {habit.dayPlan.length > 0 && (<>
              <div className="border-t border-border"/>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  All Days Overview
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                  {habit.dayPlan.map((plan) => (<button type="button" key={plan.day} onClick={() => setActiveDay(plan.day)} className={`flex items-center justify-between p-3 rounded-lg text-sm transition-all w-full text-left ${plan.day === displayDay
                    ? "bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-900/40 shadow-sm"
                    : "bg-card border border-border hover:bg-accent/60"}`}>
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${plan.day === displayDay ? "text-indigo-700 dark:text-indigo-200" : "text-foreground"}`}>
                          Day {plan.day}
                        </span>
                        <span className="text-muted-foreground">{plan.title}</span>
                      </div>
                      {plan.isCompleted && (<CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0"/>)}
                    </button>))}
                </div>
              </div>
            </>)}
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-border bg-background">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-w-[100px]">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>);
}
