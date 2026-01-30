import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
interface DurationSelectorProps {
    duration: string;
    onChange: (duration: string) => void;
    className?: string;
}
export function DurationSelector({ duration, onChange, className }: DurationSelectorProps) {
    const { t } = useLanguage();
    return (<div className={cn("space-y-2", className)}>
      <Label htmlFor="duration">{t.selectors.duration}</Label>
      <Input id="duration" placeholder={t.selectors.durationPlaceholder} value={duration} onChange={(e) => onChange(e.target.value)}/>
      <p className="text-xs text-muted-foreground">
        {t.selectors.durationHint}
      </p>
    </div>);
}
