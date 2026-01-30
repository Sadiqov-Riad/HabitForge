import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
] as const;
interface DaySelectorProps {
    selectedDays: string[];
    onChange: (days: string[]) => void;
    className?: string;
}
export function DaySelector({ selectedDays, onChange, className }: DaySelectorProps) {
    const { t } = useLanguage();
    const DAY_LABELS: Record<string, string> = {
        Monday: t.selectors.mon,
        Tuesday: t.selectors.tue,
        Wednesday: t.selectors.wed,
        Thursday: t.selectors.thu,
        Friday: t.selectors.fri,
        Saturday: t.selectors.sat,
        Sunday: t.selectors.sun,
    };
    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            onChange(selectedDays.filter((d) => d !== day));
        }
        else {
            onChange([...selectedDays, day]);
        }
    };
    return (<div className={cn("space-y-2", className)}>
      <Label>{t.selectors.selectDays}</Label>
      <div className="flex flex-wrap gap-2">
        {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (<button key={day} type="button" onClick={() => toggleDay(day)} className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", isSelected
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground")}>
              {DAY_LABELS[day]}
            </button>);
        })}
      </div>
    </div>);
}
