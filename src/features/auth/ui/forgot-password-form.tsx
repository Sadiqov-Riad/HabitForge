import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/shared/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/shared/ui/input-otp";
import toast from "react-hot-toast";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { isPasswordValid, isValidEmail } from "@/shared/lib/validation";
import { forgotPassword, resetPasswordWithOtp, verifyForgotPasswordOtp, } from "@/features/auth/api/account.api";
export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
    const { t } = useLanguage();
    const [step, setStep] = useState<"request" | "otp" | "reset">("request");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    async function onRequestSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const emailValue = email.trim();
        if (!emailValue) {
            setError(t.common.emailRequired);
            return;
        }
        if (!isValidEmail(emailValue)) {
            setError(t.common.invalidEmail);
            return;
        }
        setLoading(true);
        const toastId = toast.loading(t.forgotPassword.sending);
        try {
            await forgotPassword({ email: emailValue });
            setStep("otp");
            toast.success(t.forgotPassword.otpSent);
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                toast.error(err.message);
            }
            else {
                setError(t.forgotPassword.requestFailed);
                toast.error(t.forgotPassword.requestFailed);
            }
        }
        finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    }
    async function onVerifySubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const emailValue = email.trim();
        if (!emailValue) {
            setError(t.common.emailRequired);
            return;
        }
        if (!isValidEmail(emailValue)) {
            setError(t.common.invalidEmail);
            return;
        }
        if (otp.length !== 6) {
            setError(t.forgotPassword.verifyFailed);
            return;
        }
        setLoading(true);
        const toastId = toast.loading(t.forgotPassword.verifying);
        try {
            await verifyForgotPasswordOtp({ email: emailValue, otp });
            setStep("reset");
            toast.success(t.forgotPassword.otpVerified);
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                toast.error(err.message);
            }
            else {
                setError(t.forgotPassword.verifyFailed);
                toast.error(t.forgotPassword.verifyFailed);
            }
        }
        finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    }
    async function onResetSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const emailValue = email.trim();
        if (!emailValue) {
            setError(t.common.emailRequired);
            return;
        }
        if (!isValidEmail(emailValue)) {
            setError(t.common.invalidEmail);
            return;
        }
        if (!newPassword || !confirmPassword) {
            setError(t.common.passwordRequired);
            return;
        }
        if (!isPasswordValid(newPassword)) {
            setError(t.common.passwordRequirements);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError(t.setPassword.passwordsNotMatch);
            return;
        }
        setLoading(true);
        const toastId = toast.loading(t.forgotPassword.resetting);
        try {
            await resetPasswordWithOtp({ email: emailValue, otp, newPassword, confirmPassword });
            toast.success(t.forgotPassword.passwordReset);
            window.location.href = "/login";
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                toast.error(err.message);
            }
            else {
                setError(t.forgotPassword.resetFailed);
                toast.error(t.forgotPassword.resetFailed);
            }
        }
        finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    }
    async function onResend() {
        const emailValue = email.trim();
        if (!emailValue) {
            setError(t.common.emailRequired);
            return;
        }
        if (!isValidEmail(emailValue)) {
            setError(t.common.invalidEmail);
            return;
        }
        setError(null);
        setLoading(true);
        const toastId = toast.loading(t.forgotPassword.sending);
        try {
            await forgotPassword({ email: emailValue });
            toast.success(t.forgotPassword.otpSent);
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                toast.error(err.message);
            }
            else {
                setError(t.forgotPassword.requestFailed);
                toast.error(t.forgotPassword.requestFailed);
            }
        }
        finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    }
    if (step === "otp") {
        return (<div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t.forgotPassword.verifyTitle}</CardTitle>
            <CardDescription>{t.forgotPassword.verifySubtitle}</CardDescription>
          </CardHeader>
          <CardContent> 
            <form onSubmit={onVerifySubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="otp" className="sr-only">
                    {t.forgotPassword.otpLabel}
                  </FieldLabel>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} id="otp" value={otp} onChange={(value) => setOtp(value)} required>
                      <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                        <InputOTPSlot index={0}/>
                        <InputOTPSlot index={1}/>
                        <InputOTPSlot index={2}/>
                        <InputOTPSlot index={3}/>
                        <InputOTPSlot index={4}/>
                        <InputOTPSlot index={5}/>
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </Field>
                {error && <p className="text-sm text-red-600 mb-2 text-center">{error}</p>}
                <Button disabled={loading || otp.length !== 6} type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  {loading ? t.forgotPassword.verifying : t.forgotPassword.verifyOtp}
                </Button>
                <FieldDescription className="text-center">
                  <button type="button" onClick={onResend} className="underline-offset-4 hover:underline">
                    {t.forgotPassword.resend}
                  </button>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>);
    }
    if (step === "reset") {
        return (<div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t.forgotPassword.resetTitle}</CardTitle>
            <CardDescription>{t.forgotPassword.resetSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onResetSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="new-password">{t.forgotPassword.newPassword}</FieldLabel>
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    {t.forgotPassword.confirmPassword}
                  </FieldLabel>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                </Field>
                {error && <p className="text-sm text-red-600 mb-2 text-center">{error}</p>}
                <Button disabled={loading} type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  {loading ? t.forgotPassword.resetting : t.forgotPassword.resetPassword}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>);
    }
    return (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t.forgotPassword.title}</CardTitle>
          <CardDescription>{t.forgotPassword.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onRequestSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">{t.forgotPassword.email}</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
              </Field>
              {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
              <Button disabled={loading} type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                {loading ? t.forgotPassword.sending : t.forgotPassword.sendCode}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>);
}
