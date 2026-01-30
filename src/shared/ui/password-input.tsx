import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
    defaultVisible?: boolean;
};
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, defaultVisible = false, disabled, ...props }, ref) => {
    const { t } = useLanguage();
    const [visible, setVisible] = React.useState(defaultVisible);
    const toggleLabel = visible ? t.common.hidePassword : t.common.showPassword;
    return (<div className="relative">
        <Input ref={ref} type={visible ? "text" : "password"} disabled={disabled} className={cn("pr-10", className)} {...props}/>
        <Button type="button" variant="ghost" size="icon-sm" disabled={disabled} onClick={() => setVisible((v) => !v)} aria-label={toggleLabel} title={toggleLabel} className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
          {visible ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
        </Button>
      </div>);
});
PasswordInput.displayName = "PasswordInput";
