import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
interface ChatInputProps {
    placeholder?: string;
    onSubmit?: (value: string) => void;
    className?: string;
    disabled?: boolean;
}
export function ChatInput({ placeholder, onSubmit, className, disabled = false, }: ChatInputProps) {
    const { t } = useLanguage();
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [value]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (disabled)
            return;
        if (value.trim() && onSubmit) {
            onSubmit(value.trim());
            setValue("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (disabled)
            return;
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    return (<form onSubmit={handleSubmit} className={cn("w-full relative", className)}>
      <div className="relative flex items-end w-full max-w-3xl mx-auto bg-card text-card-foreground rounded-3xl shadow-sm border border-border focus-within:ring-2 focus-within:ring-indigo-400/30 focus-within:border-indigo-500 transition-all duration-200">
        <textarea ref={textareaRef} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder ?? t.chatInput.placeholder} disabled={disabled} rows={1} className={cn("w-full min-h-[56px] max-h-[200px] py-4 pl-6 pr-14 rounded-3xl", "bg-transparent border-none", "text-base text-foreground placeholder:text-muted-foreground", "resize-none overflow-y-auto", "focus:outline-none focus:ring-0", disabled && "opacity-60 cursor-not-allowed")}/>

        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          <button type="submit" disabled={disabled || !value.trim()} className={cn("p-2.5 rounded-full transition-all duration-200 flex items-center justify-center", disabled || !value.trim()
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transform hover:scale-105")} aria-label={t.chatInput.send}>
            <ArrowUp className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </form>);
}
