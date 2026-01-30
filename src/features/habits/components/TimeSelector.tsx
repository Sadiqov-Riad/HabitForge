import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
interface TimeSelectorProps {
    selectedDays: string[];
    scheduleTimes: Record<string, string>;
    onChange: (times: Record<string, string>) => void;
    className?: string;
}
export function TimeSelector({ selectedDays, scheduleTimes, onChange, className }: TimeSelectorProps) {
    const { t } = useLanguage();
    const DAY_NAMES: Record<string, string> = {
        Monday: t.selectors.monday,
        Tuesday: t.selectors.tuesday,
        Wednesday: t.selectors.wednesday,
        Thursday: t.selectors.thursday,
        Friday: t.selectors.friday,
        Saturday: t.selectors.saturday,
        Sunday: t.selectors.sunday,
    };
    const handleTimeChange = (day: string, time: string) => {
        onChange({
            ...scheduleTimes,
            [day]: time,
        });
    };
    if (selectedDays.length === 0) {
        return (<div className={cn("space-y-2", className)}>
        <Label>{t.selectors.time}</Label>
        <p className="text-sm text-muted-foreground">{t.selectors.selectDaysFirst}</p>
      </div>);
    }
    return (<div className={cn("space-y-2", className)}>
      <Label>{t.selectors.timeForEachDay}</Label>
      <div className="space-y-3">
        {selectedDays.map((day) => (<div key={day} className="flex items-center gap-3">
            <Label htmlFor={`time-${day}`} className="w-24 text-sm font-normal">
              {DAY_NAMES[day] ?? day}:
            </Label>
            <Input id={`time-${day}`} type="time" value={scheduleTimes[day] || ""} onChange={(e) => handleTimeChange(day, e.target.value)} className="flex-1"/>
          </div>))}
      </div>
    </div>);
}
