import { ForgotPasswordForm } from "@/features/auth/ui/forgot-password-form";
import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
export default function ForgotPasswordPage() {
    return (<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground">
      <div className="w-full max-w-sm">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/login">
            <ArrowLeft className="mr-2 h-4 w-4"/>
            Back to Login
          </Link>
        </Button>
        <ForgotPasswordForm />
      </div>
    </div>);
}
