import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
interface StartDateSelectorProps {
    startDate: string | null;
    onChange: (date: string | null) => void;
    className?: string;
}
export function StartDateSelector({ startDate, onChange, className }: StartDateSelectorProps) {
    const { t } = useLanguage();
    const today = new Date().toISOString().split("T")[0];
    const defaultDate = startDate || today;
    return (<div className={cn("space-y-2", className)}>
      <Label htmlFor="startDate">{t.selectors.startDate}</Label>
      <Input id="startDate" type="date" value={defaultDate} min={today} onChange={(e) => onChange(e.target.value || null)} className="w-full"/>
      <p className="text-xs text-muted-foreground">
        {t.selectors.startDateHint}
      </p>
    </div>);
}
