import { SetPasswordForm } from "@/features/auth/ui/set-password-form";
export default function SetPasswordPage() {
    return (<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground">
      <div className="w-full max-w-sm">
        <SetPasswordForm />
      </div>
    </div>);
}
