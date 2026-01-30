import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { HabitSuggestionData } from "@/shared/components/HabitSuggestion";
import { DaySelector } from "./DaySelector";
import { TimeSelector } from "./TimeSelector";
import { DurationSelector } from "./DurationSelector";
import { PrioritySelector } from "./PrioritySelector";
import { FrequencySelector, type FrequencyType } from "./FrequencySelector";
import { StartDateSelector } from "./StartDateSelector";
import { HABIT_LIMITS } from "@/shared/constants/habitLimits";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { countScheduledDaysInWindow } from "@/features/habits/lib/schedule";
import { ErrorState } from "@/shared/ui/error-state";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);
    return matches;
}
interface AddHabitDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    habit: HabitSuggestionData | null;
    onConfirm: (habit: HabitSuggestionData & {
        priority?: string | null;
        scheduleDays?: string | null;
        scheduleTimes?: string | null;
        duration?: string | null;
        frequency?: FrequencyType | null;
        startDate?: string | null;
        programDays?: number | null;
    }) => Promise<void> | void;
}
export function AddHabitDialog({ open, onOpenChange, habit, onConfirm }: AddHabitDialogProps) {
    const { t } = useLanguage();
    const isDesktop = useMediaQuery("(min-width: 640px)");
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [customTitle, setCustomTitle] = useState("");
    const [customDescription, setCustomDescription] = useState("");
    const [frequency, setFrequency] = useState<FrequencyType | null>("daily");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [scheduleTimes, setScheduleTimes] = useState<Record<string, string>>({});
    const [duration, setDuration] = useState("");
    const [priority, setPriority] = useState<"High" | "Medium" | "Low" | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [dailyPlanDays, setDailyPlanDays] = useState<number>(30);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (open && habit) {
            setCustomTitle("");
            setCustomDescription("");
            setFrequency("daily");
            setSelectedDays([]);
            setScheduleTimes({});
            setDuration("");
            setPriority(null);
            setStartDate(null);
            setDailyPlanDays(30);
            setError(null);
            setStep(1);
            setDirection(0);
        }
    }, [open, habit]);
    useEffect(() => {
        if (frequency !== "weekly" && selectedDays.length > 0) {
            setSelectedDays([]);
            setScheduleTimes({});
        }
    }, [frequency]);
    if (!habit)
        return null;
    const currentTitle = customTitle || habit.title;
    const currentDesc = customDescription || habit.description;
    const handleNext = () => {
        setError(null);
        if (step === 1) {
            if (!currentTitle.trim()) {
                setError("Title is required");
                return;
            }
            setDirection(1);
            setStep(2);
        }
        else if (step === 2) {
            if ((frequency === "weekly" || frequency === "monthly") && selectedDays.length === 0) {
                setError(t.selectors.selectDaysFirst);
                return;
            }
            setDirection(1);
            setStep(3);
        }
    };
    const handleBack = () => {
        setError(null);
        setDirection(-1);
        setStep((s) => Math.max(1, s - 1));
    };
    const handleConfirm = async () => {
        setError(null);
        const effectiveFrequency: FrequencyType = frequency ?? "daily";
        const start = startDate ? new Date(`${startDate}T00:00:00`) : new Date();
        const startValid = !Number.isNaN(start.getTime());
        const startDateObj = startValid ? start : new Date();
        let programDays: number | null = null;
        if (effectiveFrequency === "daily") {
            programDays = Number.isFinite(dailyPlanDays) ? Math.max(1, Math.min(365, Math.floor(dailyPlanDays))) : 30;
        }
        else if (effectiveFrequency === "weekly") {
            if (!selectedDays.length) {
                setError(t.selectors.selectDaysFirst);
                return;
            }
            programDays = countScheduledDaysInWindow({ startDate: startDateObj, windowDays: 7, selectedDays });
            programDays = Math.max(1, programDays);
        }
        else if (effectiveFrequency === "monthly") {
            if (!selectedDays.length) {
                setError(t.selectors.selectDaysFirst);
                return;
            }
            programDays = countScheduledDaysInWindow({ startDate: startDateObj, windowDays: 30, selectedDays });
            programDays = Math.max(1, programDays);
        }
        setIsSaving(true);
        const scheduleDaysJson = effectiveFrequency === "weekly" || effectiveFrequency === "monthly"
            ? selectedDays.length > 0
                ? JSON.stringify(selectedDays)
                : null
            : null;
        const scheduleTimesJson = Object.keys(scheduleTimes).length > 0 ? JSON.stringify(scheduleTimes) : null;
        const habitToAdd = {
            ...habit,
            title: customTitle || habit.title,
            description: customDescription || habit.description,
            priority: priority || null,
            scheduleDays: scheduleDaysJson,
            scheduleTimes: scheduleTimesJson,
            duration: duration || null,
            frequency: effectiveFrequency,
            startDate: startDate || null,
            ...(typeof programDays === "number" ? { programDays } : {}),
        };
        try {
            await onConfirm(habitToAdd);
            setCustomTitle("");
            setCustomDescription("");
            setFrequency("daily");
            setSelectedDays([]);
            setScheduleTimes({});
            setDuration("");
            setPriority(null);
            setStartDate(null);
            onOpenChange(false);
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : t.addHabitDialog.failedToAdd;
            setError(msg);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleCancel = () => {
        if (isSaving)
            return;
        setCustomTitle("");
        setCustomDescription("");
        setFrequency("daily");
        setSelectedDays([]);
        setScheduleTimes({});
        setDuration("");
        setPriority(null);
        setStartDate(null);
        setError(null);
        onOpenChange(false);
    };
    const renderBasicFields = () => (<div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="title">{t.addHabitDialog.titleLabel}</Label>
          <span className="text-xs text-muted-foreground">
            {currentTitle.length}/{HABIT_LIMITS.titleMax}
          </span>
        </div>
        <Input id="title" placeholder={habit.title} value={customTitle} maxLength={HABIT_LIMITS.titleMax} onChange={(e) => setCustomTitle(e.target.value.slice(0, HABIT_LIMITS.titleMax))} disabled={isSaving}/>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">{t.addHabitDialog.descriptionLabel}</Label>
          <span className="text-xs text-muted-foreground">
            {currentDesc.length}/{HABIT_LIMITS.descriptionMax}
          </span>
        </div>
        <textarea id="description" placeholder={habit.description} value={customDescription} maxLength={HABIT_LIMITS.descriptionMax} onChange={(e) => setCustomDescription(e.target.value.slice(0, HABIT_LIMITS.descriptionMax))} rows={3} disabled={isSaving} className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"/>
      </div>
      {habit.category && (<div className="space-y-2">
          <Label>{t.addHabitDialog.category}</Label>
          <div className="px-3 py-2 bg-muted/30 border border-border rounded-md text-sm text-foreground">
            {habit.category}
          </div>
        </div>)}
    </div>);
    const renderScheduleFields = () => (<div className="space-y-5">
      <FrequencySelector frequency={frequency} onChange={setFrequency}/>
      {frequency === "weekly" && (<DaySelector selectedDays={selectedDays} onChange={setSelectedDays}/>)}
      {frequency === "monthly" && (<DaySelector selectedDays={selectedDays} onChange={setSelectedDays}/>)}
      {frequency === "weekly" && selectedDays.length > 0 && (<TimeSelector selectedDays={selectedDays} scheduleTimes={scheduleTimes} onChange={setScheduleTimes}/>)}
      {frequency === "monthly" && selectedDays.length > 0 && (<TimeSelector selectedDays={selectedDays} scheduleTimes={scheduleTimes} onChange={setScheduleTimes}/>)}
      {frequency === "daily" && (<TimeSelector selectedDays={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]} scheduleTimes={scheduleTimes} onChange={setScheduleTimes}/>)}
      {frequency === "daily" && (<div className="space-y-2">
          <Label htmlFor="dailyPlanDays">{t.selectors.planLength}</Label>
          <Input id="dailyPlanDays" type="number" min={1} max={365} value={String(dailyPlanDays)} disabled={isSaving} onChange={(e) => {
                const v = Number(e.target.value);
                setDailyPlanDays(Number.isFinite(v) ? v : 30);
            }}/>
          <p className="text-xs text-muted-foreground">{t.selectors.planLengthHint}</p>
        </div>)}
    </div>);
    const renderDetailFields = () => (<div className="space-y-5">
      <StartDateSelector startDate={startDate} onChange={setStartDate}/>
      <DurationSelector duration={duration} onChange={setDuration}/>
      <PrioritySelector priority={priority} onChange={setPriority}/>
    </div>);
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 20 : -20,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 20 : -20,
            opacity: 0,
        }),
    };
    return (<Dialog open={open} onOpenChange={(nextOpen) => (!isSaving ? onOpenChange(nextOpen) : undefined)}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogClose onClose={handleCancel}/>
        <DialogHeader>
          <DialogTitle>{t.addHabitDialog.title}</DialogTitle>
          <DialogDescription>
            {t.addHabitDialog.subtitle}
          </DialogDescription>
        </DialogHeader>
        
        
        <div className="px-6 pb-6 relative min-h-[300px]">

          
          {isDesktop && (<div className="flex items-center justify-between mb-6 px-4">
              {[1, 2, 3].map((s) => (<div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors shrink-0 ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {s}
                  </div>
                  {s < 3 && (<div className={`flex-1 h-0.5 mx-2 ${step > s ? "bg-primary" : "bg-muted"}`}/>)}
                </div>))}
            </div>)}

          
          {!isDesktop ? (<div className="space-y-5">
              {renderBasicFields()}
              {renderScheduleFields()}
              {renderDetailFields()}
            </div>) : (<AnimatePresence mode="wait" custom={direction}>
              <motion.div key={step} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                {step === 1 && renderBasicFields()}
                {step === 2 && renderScheduleFields()}
                {step === 3 && renderDetailFields()}
              </motion.div>
            </AnimatePresence>)}
        </div>

        {error && (<div className="px-6 pb-4">
            <ErrorState message={error} compact={true} className="bg-destructive/10 border border-destructive/20"/>
          </div>)}

        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
          {!isDesktop ? (<>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                {t.addHabitDialog.cancel}
              </Button>
              <Button onClick={handleConfirm} disabled={isSaving}>
                {isSaving ? t.addHabitDialog.saving : t.addHabitDialog.addHabit}
              </Button>
            </>) : (<>
              {step === 1 ? (<Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  {t.addHabitDialog.cancel}
                </Button>) : (<Button variant="outline" onClick={handleBack} disabled={isSaving}>
                  <ChevronLeft className="w-4 h-4 mr-2"/>
                  {t.common.back}
                </Button>)}
              
              {step < 3 ? (<Button onClick={handleNext} disabled={isSaving}>
                  {t.common.next}
                  <ChevronRight className="w-4 h-4 ml-2"/>
                </Button>) : (<Button onClick={handleConfirm} disabled={isSaving}>
                  {isSaving ? t.addHabitDialog.saving : t.addHabitDialog.addHabit}
                </Button>)}
            </>)}
        </div>
      </DialogContent>
    </Dialog>);
}
