import { LoginForm } from "@/features/auth/ui/login-form";
import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
export default function LoginPage() {
    return (<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground">
      <div className="w-full max-w-sm">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4"/>
            Back to Home
          </Link>
        </Button>
        <LoginForm />
      </div>
    </div>);
}
