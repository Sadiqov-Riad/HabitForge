import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
export type FrequencyType = "daily" | "weekly" | "monthly";
interface FrequencySelectorProps {
    frequency: FrequencyType | null;
    onChange: (frequency: FrequencyType) => void;
    className?: string;
}
export function FrequencySelector({ frequency, onChange, className }: FrequencySelectorProps) {
    const { t } = useLanguage();
    const FREQUENCY_OPTIONS: {
        value: FrequencyType;
        label: string;
        description: string;
    }[] = [
        { value: "daily", label: t.selectors.daily, description: t.selectors.dailyDesc },
        { value: "weekly", label: t.selectors.weekly, description: t.selectors.weeklyDesc },
        { value: "monthly", label: t.selectors.monthly, description: t.selectors.monthlyDesc },
    ];
    return (<div className={cn("space-y-2", className)}>
      <Label>{t.selectors.frequency}</Label>
      <div className="flex flex-wrap gap-2">
        {FREQUENCY_OPTIONS.map((option) => {
            const isSelected = frequency === option.value;
            return (<button key={option.value} type="button" onClick={() => onChange(option.value)} className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors text-left", isSelected
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground")}>
              <div className="font-semibold">{option.label}</div>
              <div className="text-xs opacity-80">{option.description}</div>
            </button>);
        })}
      </div>
    </div>);
}
