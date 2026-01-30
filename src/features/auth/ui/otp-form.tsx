import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/shared/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/shared/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/shared/ui/input-otp";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
    const { t } = useLanguage();
    return (<Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t.otp.title}</CardTitle>
        <CardDescription>{t.otp.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp" className="sr-only">
                {t.otp.verificationCode}
              </FieldLabel>
              <div className="flex justify-center">
                <InputOTP maxLength={6} id="otp" required>
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
                {t.otp.enterCode}
              </FieldDescription>
            </Field>
            <Button type="submit">{t.otp.verify}</Button>
            <FieldDescription className="text-center">
              {t.otp.didntReceive} <a href="#">{t.otp.resend}</a>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>);
}
