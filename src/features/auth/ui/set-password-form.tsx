import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/shared/ui/card";
import { Field, FieldGroup, FieldLabel, } from "@/shared/ui/field";
import { PasswordInput } from "@/shared/ui/password-input";
import { useState } from "react";
import { setPassword } from "@/features/auth/api/account.api";
import { setCurrentUser } from "@/features/auth/model/auth";
import { decodeJWT } from "@/features/auth/lib/token";
import toast from "react-hot-toast";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
export function SetPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
    const { t } = useLanguage();
    const [password, setPasswordValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError(t.setPassword.passwordsNotMatch);
            return;
        }
        if (password.length < 8) {
            setError(t.setPassword.passwordTooShort);
            return;
        }
        const tempToken = sessionStorage.getItem('tempAccessToken');
        if (!tempToken) {
            setError(t.setPassword.sessionExpired);
            return;
        }
        setLoading(true);
        const toastId = toast.loading(t.setPassword.settingPassword);
        try {
            await setPassword({ newPassword: password, confirmPassword }, tempToken);
            localStorage.setItem('accessToken', tempToken);
            const tempRefreshToken = sessionStorage.getItem('tempRefreshToken');
            if (tempRefreshToken) {
                localStorage.setItem('refreshToken', tempRefreshToken);
            }
            const decodedToken = decodeJWT(tempToken);
            if (decodedToken) {
                const email = decodedToken.email || decodedToken.sub || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
                const username = decodedToken.username || decodedToken.preferred_username || email?.split('@')[0] || 'user';
                if (email) {
                    setCurrentUser({ email, username });
                }
            }
            sessionStorage.removeItem('tempAccessToken');
            sessionStorage.removeItem('tempRefreshToken');
            toast.success(t.setPassword.passwordSet);
            window.location.href = '/';
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || t.setPassword.failedToSet);
                toast.error(error.message || t.setPassword.failedToSet);
            }
            else {
                setError(t.setPassword.failedToSet);
                toast.error(t.setPassword.failedToSet);
            }
        }
        finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    }
    return (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t.setPassword.title}</CardTitle>
          <CardDescription>
            {t.setPassword.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">{t.setPassword.newPassword}</FieldLabel>
                <PasswordInput id="password" value={password} onChange={(e) => setPasswordValue(e.target.value)} required/>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">{t.setPassword.confirmPassword}</FieldLabel>
                <PasswordInput id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
              </Field>
              <Field>
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                <Button disabled={loading} type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white w-full">
                  {loading ? t.setPassword.settingPassword : t.setPassword.setPassword}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>);
}
