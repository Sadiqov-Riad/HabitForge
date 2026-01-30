import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/shared/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { useState } from "react";
import { login } from "@/features/auth/api/auth.api";
import { getGoogleAuthUrl } from "@/features/auth/api/oauth.api";
import { setCurrentUser } from "@/features/auth/model/auth";
import { decodeJWT } from "@/features/auth/lib/token";
import toast from "react-hot-toast";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { Link } from "react-router-dom";
export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const toastId = toast.loading(t.login.loggingIn);
        try {
            const tokens = await login({ email, password });
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            const decodedToken = decodeJWT(tokens.accessToken);
            if (decodedToken) {
                const tokenEmail = decodedToken.email || decodedToken.sub || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
                const username = decodedToken.username || decodedToken.preferred_username || tokenEmail?.split('@')[0] || email.split('@')[0];
                setCurrentUser({ email: tokenEmail || email, username });
            }
            else {
                setCurrentUser({ email, username: email.split('@')[0] });
            }
            toast.success(t.login.loggedIn);
            window.location.href = '/';
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || t.login.loginFailed);
                toast.error(error.message || t.login.loginFailed);
            }
            else {
                setError(t.login.loginFailed);
                toast.error(t.login.loginFailed);
            }
        }
        finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    }
    async function onGoogle() {
        const url = await getGoogleAuthUrl();
        window.location.href = url;
    }
    return (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t.login.title}</CardTitle>
          <CardDescription>
            {t.login.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">{t.login.email}</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{t.login.password}</FieldLabel>
                  <Link to="/forgot-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    {t.login.forgotPassword}
                  </Link>
                </div>
                <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
              </Field>
              <Field>
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                <Button disabled={loading} type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  {loading ? t.login.loggingIn : t.login.loginButton}
                </Button>
                <Button variant="outline" type="button" onClick={onGoogle}>
                  {t.login.loginWithGoogle}
                </Button>
                <FieldDescription className="text-center">
                  {t.login.dontHaveAccount} <a href="/signup">{t.login.signUp}</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>);
}
