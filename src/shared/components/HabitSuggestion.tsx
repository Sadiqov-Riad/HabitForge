import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
export type HabitSuggestionData = {
    id: string;
    title: string;
    description: string;
    category?: string;
    programDays?: number;
    dayPlan?: Array<{
        day: number;
        title: string;
        tasks: string[];
    }>;
};
const TITLE_MAX_CHARS = 32;
const DESCRIPTION_MAX_CHARS = 140;
function truncateText(value: string, maxChars: number) {
    const chars = Array.from(value);
    if (chars.length <= maxChars)
        return value;
    return `${chars.slice(0, maxChars).join("")}...`;
}
interface HabitSuggestionProps {
    habit: HabitSuggestionData;
    onClick: (habit: HabitSuggestionData) => void;
    className?: string;
}
export function HabitSuggestion({ habit, onClick, className }: HabitSuggestionProps) {
    return (<motion.button onClick={() => onClick(habit)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={cn("px-4 py-3 rounded-xl", "bg-card text-card-foreground border border-border", "text-left transition-all duration-200", "hover:border-indigo-300 hover:shadow-md", "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", className)}>
      <div className="font-semibold text-foreground mb-1">
        {truncateText(habit.title, TITLE_MAX_CHARS)}
      </div>
      <div className="text-sm text-muted-foreground">
        {truncateText(habit.description, DESCRIPTION_MAX_CHARS)}
      </div>
      {habit.category && (<div className="mt-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200 rounded-md">
            {habit.category}
          </span>
        </div>)}
    </motion.button>);
}
interface HabitSuggestionsListProps {
    habits: HabitSuggestionData[];
    onHabitClick: (habit: HabitSuggestionData) => void;
    className?: string;
}
export function HabitSuggestionsList({ habits, onHabitClick, className }: HabitSuggestionsListProps) {
    const { t } = useLanguage();
    if (habits.length === 0) {
        return (<div className={cn("text-center py-8 text-muted-foreground", className)}>
        {t.habitSuggestion.noSuggestions}
      </div>);
    }
    return (<div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", className)}>
      {habits.map((habit) => (<HabitSuggestion key={habit.id} habit={habit} onClick={onHabitClick}/>))}
    </div>);
}
