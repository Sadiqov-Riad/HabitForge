import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/shared/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/shared/ui/input-otp";
import { useState } from "react";
import { register } from "@/features/auth/api/auth.api";
import { verifyOtp } from "@/features/auth/api/otp.api";
import { setCurrentUser } from "@/features/auth/model/auth";
import toast from "react-hot-toast";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
    const { t } = useLanguage();
    const [step, setStep] = useState<'register' | 'verify'>('register');
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    async function onRegisterSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError(t.signup.passwordsNotMatch);
            return;
        }
        if (password.length < 8) {
            setError(t.signup.passwordTooShort);
            return;
        }
        setLoading(true);
        const toastId = toast.loading(t.signup.creatingAccount);
        try {
            const response = await register({ username, email, name, surname, password, confirmPassword });
            setUserId(response.id);
            setStep('verify');
            setError(null);
            toast.success(t.signup.accountCreated);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || t.signup.registrationFailed);
                toast.error(error.message || t.signup.registrationFailed);
            }
            else {
                setError(t.signup.registrationFailed);
                toast.error(t.signup.registrationFailed);
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
        setLoading(true);
        const toastId = toast.loading(t.signup.verifying);
        try {
            await verifyOtp({ userId, otp });
            setCurrentUser({ email, username });
            toast.success(t.signup.emailVerified);
            window.location.href = '/login';
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || t.signup.otpVerificationFailed);
                toast.error(error.message || t.signup.otpVerificationFailed);
            }
            else {
                setError(t.signup.otpVerificationFailed);
                toast.error(t.signup.otpVerificationFailed);
            }
        }
        finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    }
    if (step === 'verify') {
        return (<div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t.signup.verifyEmail}</CardTitle>
            <CardDescription>
              {t.signup.verifySubtitle} {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onVerifySubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="otp" className="sr-only">
                    {t.signup.verificationCode}
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
                  <FieldDescription className="text-center">
                    {t.signup.enterCode}
                  </FieldDescription>
                </Field>
                {error && <p className="text-sm text-red-600 mb-2 text-center">{error}</p>}
                <Button disabled={loading || otp.length !== 6} type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  {loading ? t.signup.verifying : t.signup.verifyButton}
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
          <CardTitle className="text-xl">{t.signup.title}</CardTitle>
          <CardDescription>
            {t.signup.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onRegisterSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">{t.signup.username}</FieldLabel>
                <Input id="username" type="text" placeholder="johndoe" value={username} onChange={(e) => setUsername(e.target.value)} required/>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">{t.signup.email}</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
              </Field>
              <Field>
                <FieldLabel htmlFor="name">{t.signup.name}</FieldLabel>
                <Input id="name" type="text" placeholder="John" value={name} onChange={(e) => setName(e.target.value)} required/>
              </Field>
              <Field>
                <FieldLabel htmlFor="surname">{t.signup.surname}</FieldLabel>
                <Input id="surname" type="text" placeholder="Doe" value={surname} onChange={(e) => setSurname(e.target.value)} required/>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      {t.signup.confirmPassword}
                    </FieldLabel>
                    <PasswordInput id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                  </Field>
                </Field>
                <FieldDescription>
                  {t.signup.passwordHint}
                </FieldDescription>
              </Field>
              <Field>
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                <Button disabled={loading} type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  {loading ? t.signup.creatingAccount : t.signup.createAccount}
                </Button>
                <FieldDescription className="text-center">
                  {t.signup.alreadyHaveAccount} <a href="/login">{t.signup.signIn}</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {t.signup.termsAndPrivacy}
      </FieldDescription>
    </div>);
}
