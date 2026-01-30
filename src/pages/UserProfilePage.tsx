import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Mail, Calendar, Settings, User, Shield, Home, Menu, X, LogOut, Upload, Trash2, } from "lucide-react";
import { getCurrentUser, logout, setCurrentUser, type UserInfo } from "@/features/auth/model/auth";
import { getHabits, getEmailNotificationsPreference, setEmailNotificationsPreference } from "@/features/habits/api/habits.api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/shared/ui/input-otp";
import { sendOtp, updateUsername, changePasswordWithOtp, deleteAccountWithOtp, getMe, uploadLogo, deleteLogo, updateProfile } from "@/features/auth/api/account.api";
import toast from "react-hot-toast";
import { useTheme } from "@/shared/theme/ThemeProvider";
import type { ThemePreference } from "@/shared/theme/theme";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import type { Language } from "@/shared/i18n/translations";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, } from "@/shared/ui/dropdown-menu";
import Cropper from "react-easy-crop";
import { getCroppedFile } from "@/shared/lib/cropImage";
import { formatDateBaku } from "@/shared/lib/date";
export default function UserProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(null);
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    const [profileField, setProfileField] = useState<"name" | "surname">("name");
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [otpDialogOpen, setOtpDialogOpen] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newName, setNewName] = useState("");
    const [newSurname, setNewSurname] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [pendingAction, setPendingAction] = useState<"changePassword" | "deleteAccount" | null>(null);
    const [pendingPasswords, setPendingPasswords] = useState<{
        newPassword: string;
        confirmPassword: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
    const [emailNotificationsLoading, setEmailNotificationsLoading] = useState(false);
    const [emailNotificationsLoadError, setEmailNotificationsLoadError] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoUploading, setLogoUploading] = useState(false);
    const [logoCropOpen, setLogoCropOpen] = useState(false);
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [logoCrop, setLogoCrop] = useState({ x: 0, y: 0 });
    const [logoZoom, setLogoZoom] = useState(1);
    const [logoCroppedPixels, setLogoCroppedPixels] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);
    const [stats, setStats] = useState({
        habitsDone: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalDays: 0,
    });
    useEffect(() => {
        const current = getCurrentUser();
        if (!current) {
            navigate("/login");
            return;
        }
        setUser(current);
        void (async () => {
            try {
                const me = await getMe();
                const next = { email: me.email, username: me.username, name: me.name ?? null, surname: me.surname ?? null, createdAt: me.createdAt, logoUrl: me.logoUrl ?? null } satisfies UserInfo;
                setCurrentUser(next);
                setUser(next);
                setNewName(me.name ?? "");
                setNewSurname(me.surname ?? "");
            }
            catch {
            }
        })();
    }, [navigate]);
    const maxLogoBytes = 5 * 1024 * 1024;
    const logoMimeType = useMemo<"image/png" | "image/jpeg" | "image/webp">(() => {
        const t = logoFile?.type;
        if (t === "image/png" || t === "image/jpeg" || t === "image/webp")
            return t;
        return "image/jpeg";
    }, [logoFile]);
    const handleUploadLogo = useCallback(async (fileToUpload: File) => {
        if (fileToUpload.size > maxLogoBytes) {
            toast.error(t.profile.logoTooLarge);
            return;
        }
        setLogoUploading(true);
        try {
            const { logoUrl } = await uploadLogo(fileToUpload);
            const next = { ...(user ?? { email: "", username: "user" }), logoUrl } satisfies UserInfo;
            setCurrentUser(next);
            setUser(next);
            setLogoFile(null);
            setLogoSrc(null);
            toast.success(t.profile.logoUpdated);
        }
        catch (e: any) {
            toast.error(e?.message ?? t.profile.failedToUploadLogo);
        }
        finally {
            setLogoUploading(false);
        }
    }, [maxLogoBytes, user, t]);
    const handleDeleteLogo = useCallback(async () => {
        if (!user?.logoUrl)
            return;
        try {
            await deleteLogo();
            const next = { ...(user ?? { email: "", username: "user" }), logoUrl: null } satisfies UserInfo;
            setCurrentUser(next);
            setUser(next);
            toast.success(t.profile.logoRemoved);
        }
        catch (e: any) {
            toast.error(e?.message ?? t.profile.failedToRemoveLogo);
        }
    }, [user, t]);
    const onSelectLogoFile = useCallback((file: File | null) => {
        setLogoFile(file);
        if (!file) {
            setLogoSrc(null);
            setLogoCropOpen(false);
            return;
        }
        if (file.size > maxLogoBytes) {
            toast.error(t.profile.logoTooLarge);
            setLogoFile(null);
            return;
        }
        const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
        if (!allowed.includes(file.type)) {
            toast.error(t.profile.logoOnlyFormats);
            setLogoFile(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setLogoSrc(url);
        setLogoCrop({ x: 0, y: 0 });
        setLogoZoom(1);
        setLogoCroppedPixels(null);
        setLogoCropOpen(true);
    }, [maxLogoBytes, t]);
    useEffect(() => {
        return () => {
            if (logoSrc)
                URL.revokeObjectURL(logoSrc);
        };
    }, [logoSrc]);
    const loadStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const habits = await getHabits();
            const habitsDone = habits.filter((h) => (h.totalCompletions ?? 0) > 0).length;
            const currentStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak ?? 0), 0);
            const bestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak ?? 0), 0);
            let totalDays = 0;
            if (habits.length > 0) {
                const earliestCreatedAt = habits.reduce((earliest, h) => {
                    if (!h.createdAt)
                        return earliest;
                    const habitDate = new Date(h.createdAt);
                    if (!earliest)
                        return habitDate;
                    return habitDate < earliest ? habitDate : earliest;
                }, null as Date | null);
                if (earliestCreatedAt) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const firstDay = new Date(earliestCreatedAt);
                    firstDay.setHours(0, 0, 0, 0);
                    const diffTime = today.getTime() - firstDay.getTime();
                    totalDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
                }
            }
            setStats({ habitsDone, currentStreak, bestStreak, totalDays });
        }
        catch {
        }
        finally {
            setStatsLoading(false);
        }
    }, []);
    useEffect(() => {
        void loadStats();
        const handleChanged = () => {
            void loadStats();
        };
        window.addEventListener("habits:changed", handleChanged);
        return () => window.removeEventListener("habits:changed", handleChanged);
    }, [loadStats]);
    useEffect(() => {
        void (async () => {
            setEmailNotificationsLoading(true);
            try {
                const pref = await getEmailNotificationsPreference();
                setEmailNotificationsEnabled(!!pref.enabled);
                setEmailNotificationsLoadError(false);
            }
            catch {
                setEmailNotificationsLoadError(true);
            }
            finally {
                setEmailNotificationsLoading(false);
            }
        })();
    }, []);
    useEffect(() => {
        setNewUsername(user?.username ?? "");
    }, [user?.username]);
    const initials = (user?.username ?? "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Dialog open={logoCropOpen} onOpenChange={(open) => !logoUploading && setLogoCropOpen(open)}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogClose onClose={() => !logoUploading && setLogoCropOpen(false)}/>
          <DialogHeader>
            <DialogTitle>{t.profile.logoPreviewTitle}</DialogTitle>
            <DialogDescription>
              {logoFile?.type === "image/gif"
            ? t.profile.logoPreviewDescGif
            : t.profile.logoPreviewDescCrop}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border bg-black/10">
                {logoSrc ? (<>
                    {logoFile?.type === "image/gif" ? (<img src={logoSrc} alt="gif" className="absolute inset-0 w-full h-full object-contain"/>) : (<Cropper image={logoSrc} crop={logoCrop} zoom={logoZoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setLogoCrop} onZoomChange={setLogoZoom} onCropComplete={(_, croppedAreaPixels) => setLogoCroppedPixels(croppedAreaPixels)}/>)}
                  </>) : (<div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    {t.profile.noImageSelected}
                  </div>)}
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground">{t.profile.logoPreview}</div>
                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
                    {logoSrc ? (<img src={logoSrc} alt="preview" className="w-full h-full object-cover"/>) : (<User className="w-5 h-5 text-muted-foreground"/>)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{user?.username ?? "user"}</div>
                    <div className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</div>
                  </div>
                </div>

                {logoFile?.type !== "image/gif" && (<div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">{t.profile.logoZoom}</div>
                    <input type="range" min={1} max={3} step={0.01} value={logoZoom} onChange={(e) => setLogoZoom(Number(e.target.value))} className="w-full"/>
                  </div>)}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setLogoCropOpen(false)} disabled={logoUploading}>
              {t.common.cancel}
            </Button>
            <Button disabled={logoUploading || !logoFile || !logoSrc || (logoFile.type === "image/gif" ? false : !logoCroppedPixels)} onClick={async () => {
            if (!logoFile || !logoSrc)
                return;
            try {
                const fileToUpload = logoFile.type === "image/gif"
                    ? logoFile
                    : await getCroppedFile({
                        imageSrc: logoSrc,
                        crop: logoCroppedPixels!,
                        fileName: logoFile.name,
                        mimeType: logoMimeType,
                        quality: 0.92,
                    });
                setLogoCropOpen(false);
                await handleUploadLogo(fileToUpload);
            }
            catch (e: any) {
                toast.error(e?.message ?? t.profile.failedToCropLogo);
            }
        }}>
              {logoUploading ? t.profile.logoUploading : logoFile?.type === "image/gif" ? t.profile.logoUploadGif : t.profile.logoSaveUpload}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={otpDialogOpen} onOpenChange={(open) => !loading && setOtpDialogOpen(open)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogClose onClose={() => !loading && setOtpDialogOpen(false)}/>
          <DialogHeader>
            <DialogTitle>{t.otp.confirmationTitle}</DialogTitle>
            <DialogDescription>
              {t.otp.confirmationDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6 pb-6">
            {error && <div className="text-sm text-red-600">{error}</div>}
            {message && <div className="text-sm text-green-700">{message}</div>}

            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">{t.otp.codeLabel}</div>
              <div className="flex w-full justify-center">
                <InputOTP maxLength={6} value={otp} onChange={(v) => setOtp(v)}>
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
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setOtpDialogOpen(false)} disabled={loading}>
              {t.common.cancel}
            </Button>
            <Button variant={pendingAction === "deleteAccount" ? "destructive" : "default"} onClick={async () => {
            if (!pendingAction)
                return;
            setError(null);
            setMessage(null);
            setLoading(true);
            const toastId = toast.loading(pendingAction === "deleteAccount" ? t.profile.deleteAccount : t.settings.changePassword);
            try {
                if (pendingAction === "changePassword") {
                    if (!pendingPasswords)
                        throw new Error(t.otp.failed);
                    await changePasswordWithOtp({
                        otp,
                        newPassword: pendingPasswords.newPassword,
                        confirmPassword: pendingPasswords.confirmPassword,
                    });
                    setOtpDialogOpen(false);
                    setPasswordDialogOpen(false);
                    setOtp("");
                    setPendingAction(null);
                    setPendingPasswords(null);
                    setNewPassword("");
                    setConfirmPassword("");
                    toast.success(t.settings.update);
                    return;
                }
                if (pendingAction === "deleteAccount") {
                    await deleteAccountWithOtp({ otp });
                    toast.success(t.profile.deleteAccount);
                    logout();
                    return;
                }
            }
            catch (e) {
                const msg = e instanceof Error ? e.message : t.otp.failed;
                setError(msg);
                toast.error(msg);
            }
            finally {
                toast.dismiss(toastId);
                setLoading(false);
            }
        }} disabled={loading || otp.length !== 6 || !pendingAction}>
              {loading ? t.otp.confirming : t.otp.confirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={usernameDialogOpen} onOpenChange={(open) => !loading && setUsernameDialogOpen(open)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogClose onClose={() => !loading && setUsernameDialogOpen(false)}/>
          <DialogHeader>
            <DialogTitle>{t.profile.changeUsernameTitle}</DialogTitle>
            <DialogDescription>{t.profile.changeUsernameDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6 pb-6">
            {error && <div className="text-sm text-red-600">{error}</div>}
            {message && <div className="text-sm text-green-700">{message}</div>}
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">{t.profile.username}</div>
              <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)}/>
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setUsernameDialogOpen(false)} disabled={loading}>
              {t.common.cancel}
            </Button>
            <Button onClick={async () => {
            if (!user)
                return;
            setError(null);
            setMessage(null);
            setLoading(true);
            const toastId = toast.loading(t.profile.savingUsername);
            try {
                const res = await updateUsername({ username: newUsername });
                setCurrentUser({ email: res.email, username: res.username });
                setUser({ email: res.email, username: res.username });
                toast.success(t.profile.usernameUpdated);
                setUsernameDialogOpen(false);
            }
            catch (e) {
                const msg = e instanceof Error ? e.message : t.profile.failedToUpdateUsername;
                setError(msg);
                toast.error(msg);
            }
            finally {
                toast.dismiss(toastId);
                setLoading(false);
            }
        }} disabled={loading || !newUsername.trim()}>
              {loading ? t.common.loading : t.common.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={profileDialogOpen} onOpenChange={(open) => !loading && setProfileDialogOpen(open)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogClose onClose={() => !loading && setProfileDialogOpen(false)}/>
          <DialogHeader>
            <DialogTitle>{profileField === "name" ? t.profile.updateName : t.profile.updateSurname}</DialogTitle>
            <DialogDescription>
              {profileField === "name" ? t.profile.changeYourName : t.profile.changeYourSurname}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6 pb-6">
            {error && <div className="text-sm text-red-600">{error}</div>}
            {message && <div className="text-sm text-green-700">{message}</div>}
            {profileField === "name" ? (<div className="space-y-2">
                <div className="text-sm font-medium text-foreground">{t.profile.name}</div>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)}/>
              </div>) : (<div className="space-y-2">
                <div className="text-sm font-medium text-foreground">{t.profile.surname}</div>
                <Input value={newSurname} onChange={(e) => setNewSurname(e.target.value)}/>
              </div>)}
          </div>
          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setProfileDialogOpen(false)} disabled={loading}>
              {t.common.cancel}
            </Button>
            <Button onClick={async () => {
            if (!user)
                return;
            setError(null);
            setMessage(null);
            setLoading(true);
            const toastId = toast.loading(t.common.save);
            try {
                const req: {
                    name?: string | null;
                    surname?: string | null;
                } = {};
                if (profileField === "name")
                    req.name = newName;
                else
                    req.surname = newSurname;
                const me = await updateProfile(req);
                const next = {
                    email: me.email,
                    username: me.username,
                    name: me.name ?? null,
                    surname: me.surname ?? null,
                    createdAt: me.createdAt,
                    logoUrl: me.logoUrl ?? null,
                } satisfies UserInfo;
                setCurrentUser(next);
                setUser(next);
                toast.success(t.profile.profileUpdated);
                setProfileDialogOpen(false);
            }
            catch (e) {
                const msg = e instanceof Error ? e.message : t.profile.failedToUpdateProfile;
                setError(msg);
                toast.error(msg);
            }
            finally {
                toast.dismiss(toastId);
                setLoading(false);
            }
        }} disabled={loading || (profileField === "name" ? !newName.trim() : !newSurname.trim())}>
              {loading ? t.common.loading : t.common.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordDialogOpen} onOpenChange={(open) => !loading && setPasswordDialogOpen(open)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogClose onClose={() => !loading && setPasswordDialogOpen(false)}/>
          <DialogHeader>
            <DialogTitle>{t.settings.changePassword}</DialogTitle>
            <DialogDescription>{t.settings.changePasswordDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6 pb-6">
            {error && <div className="text-sm text-red-600">{error}</div>}
            {message && <div className="text-sm text-green-700">{message}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">{t.setPassword.newPassword}</div>
                <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">{t.setPassword.confirmPassword}</div>
                <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)} disabled={loading}>
              {t.common.cancel}
            </Button>
            <Button onClick={async () => {
            setError(null);
            setMessage(null);
            setLoading(true);
            const toastId = toast.loading(t.otp.sending);
            try {
                if (newPassword !== confirmPassword)
                    throw new Error(t.setPassword.passwordsNotMatch);
                if (newPassword.length < 8)
                    throw new Error(t.setPassword.passwordTooShort);
                await sendOtp();
                setPendingAction("changePassword");
                setPendingPasswords({ newPassword, confirmPassword });
                setOtp("");
                setPasswordDialogOpen(false);
                setOtpDialogOpen(true);
                toast.success(t.otp.sent);
            }
            catch (e) {
                const msg = e instanceof Error ? e.message : t.otp.failed;
                setError(msg);
                toast.error(msg);
            }
            finally {
                toast.dismiss(toastId);
                setLoading(false);
            }
        }} disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}>
              {loading ? t.otp.sending : t.common.continue}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={(open) => !loading && setDeleteDialogOpen(open)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogClose onClose={() => !loading && setDeleteDialogOpen(false)}/>
          <DialogHeader>
            <DialogTitle>{t.profile.deleteAccount}</DialogTitle>
            <DialogDescription>{t.profile.dangerZoneDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6 pb-6">
            {error && <div className="text-sm text-red-600">{error}</div>}
            {message && <div className="text-sm text-green-700">{message}</div>}

            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {t.profile.deleteAccountConfirm}
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
              {t.common.cancel}
            </Button>
            <Button variant="destructive" onClick={async () => {
            setError(null);
            setMessage(null);
            setLoading(true);
            const toastId = toast.loading(t.otp.sending);
            try {
                await sendOtp();
                setPendingAction("deleteAccount");
                setPendingPasswords(null);
                setOtp("");
                setOtpDialogOpen(true);
                setDeleteDialogOpen(false);
                toast.success(t.otp.sent);
            }
            catch (e) {
                const msg = e instanceof Error ? e.message : t.otp.failed;
                setError(msg);
                toast.error(msg);
            }
            finally {
                toast.dismiss(toastId);
                setLoading(false);
            }
        }} disabled={loading}>
              {loading ? t.otp.sending : t.common.continue}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex">
        {!sidebarOpen && (<button onClick={() => setSidebarOpen(true)} className="lg:hidden fixed top-3 left-3 sm:top-4 sm:left-4 z-50 p-2 sm:p-2.5 bg-card text-card-foreground rounded-lg shadow-lg border border-border hover:bg-accent transition-all duration-300" aria-label={t.common.open}>
            <Menu className="h-5 w-5 sm:h-6 sm:w-6"/>
          </button>)}

        <aside className={`
            fixed lg:sticky top-0 left-0 h-screen bg-background text-foreground border-r border-border transition-transform duration-300 z-40
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            w-64 sm:w-72 flex-shrink-0
          `}>
          <div className="p-4 sm:p-6 h-full flex flex-col overflow-y-auto">
            <div className="mb-6 sm:mb-8 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    HabitForge
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t.profile.dashboard}</p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-accent rounded-lg transition-colors" aria-label={t.common.close}>
                  <X className="h-5 w-5 text-muted-foreground"/>
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-1.5 sm:space-y-2 flex-shrink-0">
              <Button asChild variant="ghost" className="w-full justify-start gap-2 sm:gap-3 hover:bg-accent text-sm sm:text-base h-9 sm:h-10 text-muted-foreground hover:text-foreground">
                <Link to="/">
                  <Home className="h-4 w-4 sm:h-5 sm:w-5"/>
                  {t.nav.backToHome}
                </Link>
              </Button>

              <Separator className="my-3 sm:my-4"/>

              <button onClick={() => {
            setActiveTab("profile");
            setSidebarOpen(false);
        }} className={`
                  w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-left text-sm sm:text-base
                  ${activeTab === "profile"
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            : "hover:bg-accent text-muted-foreground hover:text-foreground"}
                `}>
                <User className="h-4 w-4 sm:h-5 sm:w-5"/>
                {t.profile.profileTab}
              </button>

              <button onClick={() => {
            setActiveTab("settings");
            setSidebarOpen(false);
        }} className={`
                  w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-left text-sm sm:text-base
                  ${activeTab === "settings"
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            : "hover:bg-accent text-muted-foreground hover:text-foreground"}
                `}>
                <Settings className="h-4 w-4 sm:h-5 sm:w-5"/>
                {t.profile.settingsTab}
              </button>
            </nav>

            <div className="pt-3 sm:pt-4 mt-auto border-t border-border flex-shrink-0">
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.logoUrl ?? ""} alt={user?.username ?? "User avatar"}/>
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.username ?? "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email ?? ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (<div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)}/>)}

        <div className="flex-1 overflow-y-auto h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl pb-12">
            <div className={`mb-6 sm:mb-8 ${!sidebarOpen ? 'mt-14 lg:mt-0' : 'mt-0'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    {activeTab === "profile" ? t.profile.title : t.profile.settingsTitle}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    {activeTab === "profile"
            ? t.profile.subtitle
            : t.profile.settingsSubtitle}
                  </p>
                </div>
              </div>
            </div>

            {activeTab === "profile" && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 mb-3 sm:mb-4 ring-4 ring-border">
                  <AvatarImage src={user?.logoUrl ?? ""} alt={user?.username ?? "User avatar"}/>
                  <AvatarFallback className="text-2xl sm:text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {user?.username ?? "User"}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  {user?.email ?? ""}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 justify-center">
                  <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
                    <Shield className="h-3 w-3"/>
                    {t.profile.member}
                  </Badge>
                </div>

                <div className="w-full mt-4 flex gap-2">
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => onSelectLogoFile(e.target.files?.[0] ?? null)} className="hidden" id="logo-file-input"/>
                  <Button className="flex-1 gap-2" variant="default" disabled={logoUploading} onClick={() => document.getElementById('logo-file-input')?.click()}>
                    <Upload className="h-4 w-4"/>
                    {logoUploading ? t.profile.logoUploading : t.profile.logoUpload}
                  </Button>
                  <Button variant="destructive" size="icon" disabled={logoUploading || !user?.logoUrl} onClick={() => void handleDeleteLogo()} title={t.profile.logoRemove}>
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              </div>

              <Separator className="my-4 sm:my-6"/>

              <div className="space-y-4">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t.profile.profileCardHelp}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">{t.profile.statistics}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t.profile.statisticsDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center p-2.5 sm:p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {statsLoading ? "…" : stats.habitsDone}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{t.profile.habitsDone}</div>
                </div>
                <div className="text-center p-2.5 sm:p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {statsLoading ? "…" : stats.currentStreak}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{t.profile.currentStreak}</div>
                </div>
                <div className="text-center p-2.5 sm:p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">
                    {statsLoading ? "…" : stats.bestStreak}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{t.profile.bestStreak}</div>
                </div>
                <div className="text-center p-2.5 sm:p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">
                    {statsLoading ? "…" : stats.totalDays}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{t.profile.totalDays}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">{t.profile.contactInfo}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t.profile.contactInfoDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 sm:gap-4 p-2.5 sm:p-3 hover:bg-accent rounded-lg transition-colors">
                  <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg flex-shrink-0">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-foreground">{t.profile.email}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">
                      {user?.email ?? t.common.notSet}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">{t.profile.accountDetails}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t.profile.accountDetailsDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-border">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0"/>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-foreground">{t.profile.username}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                        @{user?.username ?? "user"}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm flex-shrink-0" onClick={() => {
                setError(null);
                setMessage(null);
                setUsernameDialogOpen(true);
            }}>
                    {t.profile.change}
                  </Button>
                </div>

                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-border">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0"/>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-foreground">{t.profile.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                        {user?.name ?? t.common.notSet}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm flex-shrink-0" onClick={() => {
                setError(null);
                setMessage(null);
                setProfileField("name");
                setProfileDialogOpen(true);
            }}>
                    {t.profile.change}
                  </Button>
                </div>

                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-border">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0"/>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-foreground">{t.profile.surname}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                        {user?.surname ?? t.common.notSet}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm flex-shrink-0" onClick={() => {
                setError(null);
                setMessage(null);
                setProfileField("surname");
                setProfileDialogOpen(true);
            }}>
                    {t.profile.change}
                  </Button>
                </div>

                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-border">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0"/>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-foreground">{t.profile.memberSince}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {formatDateBaku(user?.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-border">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0"/>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-foreground">{t.profile.accountType}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                        {t.profile.member}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm flex-shrink-0" onClick={() => navigate('/subscription')}>
                    {t.settings.configure}
                  </Button>
                </div>


              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-900/40">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-red-600">{t.profile.dangerZone}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{t.profile.dangerZoneDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-red-200 dark:border-red-900/40 rounded-lg bg-red-50/50 dark:bg-red-950/20">
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-foreground">{t.common.logout}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{t.profile.logoutDesc}</div>
                  </div>
                  <Button variant="outline" size="sm" className="sm:shrink-0 text-xs sm:text-sm w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/40 dark:hover:bg-red-950/30" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2"/>
                    {t.common.logout}
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-red-200 dark:border-red-900/40 rounded-lg bg-red-50/50 dark:bg-red-950/20">
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-foreground">{t.profile.deleteAccount}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{t.profile.deleteAccountDesc}</div>
                  </div>
                  <Button variant="destructive" size="sm" className="sm:shrink-0 text-xs sm:text-sm w-full sm:w-auto" onClick={() => {
                setError(null);
                setMessage(null);
                setOtp("");
                setPendingAction(null);
                setPendingPasswords(null);
                setDeleteDialogOpen(true);
            }}>
                    {t.profile.deleteAccount}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
              </div>)}

            {activeTab === "settings" && (<div className="max-w-4xl">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">{t.settings.generalSettings}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{t.settings.generalSettingsDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 py-2 sm:py-3 border-b border-border">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-sm font-medium text-foreground">{t.settings.emailNotifications}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">{t.settings.emailNotificationsDesc}</p>
                        </div>
                        <label className="flex items-center justify-between gap-3 w-full sm:w-auto sm:shrink-0">
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {emailNotificationsLoading
                ? t.common.loading
                : emailNotificationsLoadError
                    ? t.common.error
                    : emailNotificationsEnabled
                        ? t.common.on
                        : t.common.off}
                          </span>
                          <button type="button" disabled={emailNotificationsLoading} onClick={async () => {
                if (emailNotificationsLoading)
                    return;
                const next = !emailNotificationsEnabled;
                setEmailNotificationsLoading(true);
                try {
                    await setEmailNotificationsPreference(next);
                    setEmailNotificationsEnabled(next);
                    setEmailNotificationsLoadError(false);
                    toast.success(t.common.success);
                }
                catch (e) {
                    setEmailNotificationsLoadError(true);
                    toast.error(e instanceof Error ? e.message : t.common.error);
                }
                finally {
                    setEmailNotificationsLoading(false);
                }
            }} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotificationsEnabled ? "bg-indigo-600" : "bg-muted"} ${emailNotificationsLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`} aria-label={t.settings.emailNotifications}>
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${emailNotificationsEnabled ? "translate-x-5" : "translate-x-1"}`}/>
                          </button>
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 py-2 sm:py-3 border-b border-border">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-sm font-medium text-foreground">{t.settings.language}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">{t.settings.languageDesc}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto sm:shrink-0">
                              {language === "en"
                ? t.language.english
                : language === "ru"
                    ? t.language.russian
                    : t.language.azerbaijani}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuRadioGroup value={language} onValueChange={(v) => setLanguage(v as Language)}>
                              <DropdownMenuRadioItem value="en">{t.language.english}</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="ru">{t.language.russian}</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="az">{t.language.azerbaijani}</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 py-2 sm:py-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-sm font-medium text-foreground">{t.settings.theme}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">{t.settings.themeDesc}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto sm:shrink-0">
                              {theme === "system" ? t.settings.system : theme === "dark" ? t.settings.dark : t.settings.light}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as ThemePreference)}>
                              <DropdownMenuRadioItem value="system">{t.settings.system}</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="light">{t.settings.light}</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="dark">{t.settings.dark}</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4 sm:mt-6">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">{t.settings.security}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{t.settings.securityDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 py-2 sm:py-3 border-b border-border">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm font-medium text-foreground">{t.settings.changePassword}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{t.settings.changePasswordDesc}</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto sm:shrink-0" onClick={() => {
                setError(null);
                setMessage(null);
                setOtp("");
                setPendingAction(null);
                setPendingPasswords(null);
                setNewPassword("");
                setConfirmPassword("");
                setPasswordDialogOpen(true);
            }}>
                        {t.settings.update}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>)}
          </div>
        </div>
      </div>
    </div>);
}
