import { Link, useLocation, useNavigate } from "react-router-dom";
import { Flame, PlusCircle, User, LogOut, ChevronDown, Trash2, Calendar, MoreHorizontal, Pencil, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { logout, getCurrentUser } from "@/features/auth/model/auth";
import type { UserInfo } from "@/features/auth/model/auth";
import { useCallback, useEffect, useState } from "react";
import { deleteHabit, getHabits, updateHabit } from "@/features/habits/api/habits.api";
import type { HabitResponseDTO } from "@/features/habits/api/habits.api";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { CategoryIcon } from "@/shared/components/CategoryIcon";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { HABIT_LIMITS } from "@/shared/constants/habitLimits";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/shared/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
interface SidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}
export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps = {}) {
    const { t } = useLanguage();
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [habits, setHabits] = useState<HabitResponseDTO[]>([]);
    const [habitsLoading, setHabitsLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState<HabitResponseDTO | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<HabitResponseDTO | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const loadHabits = useCallback(async () => {
        setHabitsLoading(true);
        try {
            const list = await getHabits();
            setHabits(list);
        }
        catch {
            setHabits([]);
        }
        finally {
            setHabitsLoading(false);
        }
    }, []);
    useEffect(() => {
        setUser(getCurrentUser());
        void loadHabits();
        const onChanged = () => void loadHabits();
        window.addEventListener("habits:changed", onChanged);
        return () => window.removeEventListener("habits:changed", onChanged);
    }, [loadHabits]);
    const items = [
        {
            title: t.sidebar.todaysPlan,
            url: "/today-plan",
            icon: Calendar,
        },
        {
            title: t.sidebar.addHabit,
            url: "/add-habit",
            icon: PlusCircle,
        },
    ];
    const handleLinkClick = () => {
        if (onMobileClose) {
            onMobileClose();
        }
    };
    const sidebarContent = (<>
      <ConfirmDialog open={deleteDialogOpen} onOpenChange={(open) => {
            if (!open)
                setHabitToDelete(null);
            setDeleteDialogOpen(open);
        }} title={t.sidebar.deleteConfirmTitle} description={habitToDelete
            ? `"${habitToDelete.action}" ${t.sidebar.deleteConfirmDesc}`
            : t.sidebar.deleteConfirmDesc} confirmText={t.common.delete} cancelText={t.common.cancel} loading={isDeleting} onConfirm={async () => {
            if (!habitToDelete)
                return;
            setIsDeleting(true);
            try {
                const url = `/habits/${habitToDelete.id}`;
                const active = pathname === url;
                await deleteHabit(habitToDelete.id);
                await loadHabits();
                setDeleteDialogOpen(false);
                setHabitToDelete(null);
                if (active)
                    navigate("/add-habit");
            }
            finally {
                setIsDeleting(false);
            }
        }}/>
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
            if (!open) {
                setHabitToEdit(null);
                setEditTitle("");
                setEditDescription("");
            }
            setEditDialogOpen(open);
        }}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <DialogClose onClose={() => {
            if (!isSavingEdit)
                setEditDialogOpen(false);
        }}/>
          <DialogHeader>
            <DialogTitle>{t.sidebar.editHabit}</DialogTitle>
            <DialogDescription>{t.sidebar.editHabitDesc}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 pb-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="habit-title">{t.sidebar.title}</Label>
                <span className="text-xs text-muted-foreground">
                  {editTitle.length}/{HABIT_LIMITS.titleMax}
                </span>
              </div>
              <Input id="habit-title" value={editTitle} maxLength={HABIT_LIMITS.titleMax} onChange={(e) => setEditTitle(e.target.value.slice(0, HABIT_LIMITS.titleMax))} placeholder={t.sidebar.titlePlaceholder}/>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="habit-description">{t.sidebar.description}</Label>
                <span className="text-xs text-muted-foreground">
                  {editDescription.length}/{HABIT_LIMITS.descriptionMax}
                </span>
              </div>
              <textarea id="habit-description" value={editDescription} maxLength={HABIT_LIMITS.descriptionMax} onChange={(e) => setEditDescription(e.target.value.slice(0, HABIT_LIMITS.descriptionMax))} rows={6} className="flex min-h-[140px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder={t.sidebar.descriptionPlaceholder}/>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isSavingEdit}>
              {t.common.cancel}
            </Button>
            <Button onClick={async () => {
            if (!habitToEdit)
                return;
            const nextTitle = editTitle.trim();
            const nextDesc = editDescription.trim();
            if (!nextTitle)
                return;
            setIsSavingEdit(true);
            try {
                await updateHabit(habitToEdit.id, {
                    id: habitToEdit.id,
                    action: nextTitle,
                    frequency: habitToEdit.frequency,
                    time: habitToEdit.time ?? null,
                    goal: habitToEdit.goal ?? null,
                    unit: habitToEdit.unit ?? null,
                    quantity: habitToEdit.quantity ?? null,
                    category: habitToEdit.category ?? null,
                    duration: habitToEdit.duration ?? null,
                    priority: habitToEdit.priority ?? null,
                    scheduleDays: habitToEdit.scheduleDays ?? null,
                    scheduleTimes: habitToEdit.scheduleTimes ?? null,
                    description: nextDesc || nextTitle,
                    programDays: habitToEdit.programDays ?? null,
                    dayPlan: habitToEdit.dayPlan?.map((d) => ({
                        day: d.day,
                        title: d.title,
                        tasks: d.tasks,
                    })) ?? null,
                    currentStreak: habitToEdit.currentStreak ?? 0,
                    bestStreak: habitToEdit.bestStreak ?? 0,
                    completionRate: habitToEdit.completionRate ?? 0,
                    totalCompletions: habitToEdit.totalCompletions ?? 0,
                    daysTracked: habitToEdit.daysTracked ?? 0,
                });
                await loadHabits();
                window.dispatchEvent(new Event("habits:changed"));
                setEditDialogOpen(false);
            }
            finally {
                setIsSavingEdit(false);
            }
        }} disabled={isSavingEdit || !editTitle.trim()}>
              {isSavingEdit ? t.sidebar.saving : t.common.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Link to="/" onClick={handleLinkClick} className="p-6 flex items-center gap-2 border-b border-border hover:bg-accent/60 transition-colors">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Flame className="w-5 h-5 text-white"/>
        </div>
        <span className="text-xl font-bold text-foreground">HabitForge</span>
      </Link>

      <div className="flex-1 px-3 py-4 space-y-4 overflow-auto">
        <div className="space-y-1">
          {items.map((item) => (<Link key={item.url} to={item.url} onClick={handleLinkClick} className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", pathname === item.url
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60")}>
              <item.icon className="w-4 h-4"/>
              {item.title}
            </Link>))}
        </div>

        <div>
          <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t.sidebar.habits}
          </div>

          <div className="mt-2 space-y-1">
            {habitsLoading && (<div className="px-3 py-2 text-sm text-muted-foreground">{t.sidebar.loading}</div>)}

            {!habitsLoading && habits.length === 0 && (<div className="px-3 py-2 text-sm text-muted-foreground">{t.sidebar.noHabits}</div>)}

            {habits.map((h) => {
            const url = `/habits/${h.id}`;
            const active = pathname === url;
            return (<div key={h.id} className={cn("flex items-center rounded-lg transition-colors", active ? "bg-accent" : "hover:bg-accent/60")}>
                  <Link to={url} onClick={handleLinkClick} className={cn("flex-1 px-3 py-2 text-sm font-medium transition-colors min-w-0 flex items-center gap-2", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")} title={h.action}>
                    <CategoryIcon category={h.category} size={20} className="shrink-0"/>
                    <span className="truncate">{h.action}</span>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="mx-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent" title="Actions" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}>
                        <MoreHorizontal className="h-4 w-4"/>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
                        {h.action}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={() => {
                    setHabitToEdit(h);
                    setEditTitle(h.action);
                    setEditDescription(h.description);
                    setEditDialogOpen(true);
                }}>
                        <Pencil className="w-4 h-4"/>
                        {t.sidebar.edit}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={() => {
                    setHabitToDelete(h);
                    setDeleteDialogOpen(true);
                }}>
                        <Trash2 className="w-4 h-4"/>
                        {t.sidebar.delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>);
        })}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        {user ? (<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-accent transition-colors cursor-pointer">
                {user.logoUrl ? (<img src={user.logoUrl} alt={user.username} className="w-9 h-9 rounded-full object-cover border border-border shrink-0" referrerPolicy="no-referrer"/>) : (<div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-white"/>
                  </div>)}
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-sm font-medium text-foreground truncate">
                    {user.username}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto"/>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" onClick={handleLinkClick} className="flex items-center cursor-pointer">
                  <User className="w-4 h-4 mr-2"/>
                  {t.sidebar.profile}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2"/>
                {t.sidebar.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>) : (<div className="px-3 py-2">
                <Link to="/login" className="text-sm font-medium text-indigo-600 hover:underline">
                    {t.sidebar.signIn}
                </Link>
            </div>)}
      </div>
    </>);
    return (<>
      
      <div className="h-screen w-64 bg-background text-foreground border-r border-border flex-col fixed left-0 top-0 z-50 hidden md:flex">
        <div className="h-full flex flex-col">
          {sidebarContent}
        </div>
      </div>

      
      <AnimatePresence>
        {mobileOpen && (<>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onMobileClose} className="fixed inset-0 bg-black/50 z-40 md:hidden"/>
            
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed left-0 top-0 h-screen w-64 bg-background text-foreground border-r border-border flex-col z-50 md:hidden shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-bold text-foreground">{t.sidebar.habits}</span>
                <button onClick={onMobileClose} className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Close menu">
                  <X className="w-5 h-5"/>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col">
                {sidebarContent}
              </div>
            </motion.div>
          </>)}
      </AnimatePresence>
    </>);
}
