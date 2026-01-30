import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
type Priority = "High" | "Medium" | "Low";
interface PrioritySelectorProps {
    priority: Priority | null;
    onChange: (priority: Priority | null) => void;
    className?: string;
}
const PRIORITY_OPTIONS: Array<{
    value: Priority;
    color: string;
    bgColor: string;
    textColor: string;
}> = [
    {
        value: "High",
        color: "red",
        bgColor: "bg-red-100 dark:bg-red-950/30",
        textColor: "text-red-700 dark:text-red-200",
    },
    {
        value: "Medium",
        color: "yellow",
        bgColor: "bg-yellow-100 dark:bg-yellow-950/30",
        textColor: "text-yellow-700 dark:text-yellow-200",
    },
    {
        value: "Low",
        color: "green",
        bgColor: "bg-green-100 dark:bg-green-950/30",
        textColor: "text-green-700 dark:text-green-200",
    },
];
export function PrioritySelector({ priority, onChange, className }: PrioritySelectorProps) {
    const { t } = useLanguage();
    const labels: Record<Priority, string> = {
        High: t.priority.high,
        Medium: t.priority.medium,
        Low: t.priority.low,
    };
    return (<div className={cn("space-y-2", className)}>
      <Label>{t.priority.label}</Label>
      <div className="flex gap-2">
        {PRIORITY_OPTIONS.map((option) => {
            const isSelected = priority === option.value;
            return (<button key={option.value} type="button" onClick={() => onChange(isSelected ? null : option.value)} className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors border-2", isSelected
                    ? `${option.bgColor} ${option.textColor} ${option.color === "red"
                        ? "border-red-500 dark:border-red-700/60"
                        : option.color === "yellow"
                            ? "border-yellow-500 dark:border-yellow-700/60"
                            : "border-green-500 dark:border-green-700/60"}`
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground border-transparent")}>
              {labels[option.value]}
            </button>);
        })}
      </div>
    </div>);
}
