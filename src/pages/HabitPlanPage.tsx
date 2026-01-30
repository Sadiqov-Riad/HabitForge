import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHabitById, updateHabit } from "@/features/habits/api/habits.api";
import type { HabitResponseDTO } from "@/features/habits/api/habits.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { CategoryIcon } from "@/shared/components/CategoryIcon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Button } from "@/shared/ui/button";
import toast from "react-hot-toast";
import { HABIT_LIMITS } from "@/shared/constants/habitLimits";
export default function HabitPlanPage() {
    const { id } = useParams<{
        id: string;
    }>();
    const [habit, setHabit] = useState<HabitResponseDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [editDescription, setEditDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        if (!id)
            return;
        setLoading(true);
        setError(null);
        getHabitById(id)
            .then((h) => {
            setHabit(h);
            setEditDescription(h.description);
        })
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load habit"))
            .finally(() => setLoading(false));
    }, [id]);
    const totalDays = habit?.programDays ?? habit?.dayPlan?.length ?? 0;
    if (loading)
        return <div className="text-muted-foreground">Loading…</div>;
    if (error)
        return <div className="text-red-600">{error}</div>;
    if (!habit)
        return <div className="text-muted-foreground">Not found</div>;
    return (<div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CategoryIcon category={habit.category} size={32} className="shrink-0"/>
            <div className="flex-1">
              <CardTitle>{habit.action}</CardTitle>
              <CardDescription>
                {habit.frequency}
                {habit.category ? ` • ${habit.category}` : ""}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="whitespace-pre-wrap text-foreground">
                {habit.description}
              </div>
            </TabsContent>
            <TabsContent value="edit" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <div className="flex items-center justify-end">
                    <span className="text-xs text-muted-foreground">
                      {editDescription.length}/{HABIT_LIMITS.descriptionMax}
                    </span>
                  </div>
                  <textarea id="description" value={editDescription} maxLength={HABIT_LIMITS.descriptionMax} onChange={(e) => setEditDescription(e.target.value.slice(0, HABIT_LIMITS.descriptionMax))} rows={10} className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="Enter detailed description of the habit..."/>
                </div>
                <div className="flex gap-2">
                  <Button onClick={async () => {
            if (!id || !habit)
                return;
            setIsSaving(true);
            try {
                const updated = await updateHabit(id, {
                    action: habit.action,
                    frequency: habit.frequency,
                    time: habit.time,
                    goal: habit.goal,
                    unit: habit.unit,
                    quantity: habit.quantity,
                    category: habit.category,
                    duration: habit.duration,
                    priority: habit.priority,
                    scheduleDays: habit.scheduleDays,
                    scheduleTimes: habit.scheduleTimes,
                    description: editDescription,
                    programDays: habit.programDays,
                    currentStreak: habit.currentStreak,
                    bestStreak: habit.bestStreak,
                    completionRate: habit.completionRate,
                    totalCompletions: habit.totalCompletions,
                    daysTracked: habit.daysTracked,
                });
                setHabit(updated);
                toast.success("Description updated successfully");
                setActiveTab("overview");
                window.dispatchEvent(new Event("habits:changed"));
            }
            catch (e) {
                toast.error(e instanceof Error ? e.message : "Failed to update description");
            }
            finally {
                setIsSaving(false);
            }
        }} disabled={isSaving || editDescription === habit.description || !editDescription.trim()}>
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => {
            setEditDescription(habit.description);
            setActiveTab("overview");
        }} disabled={isSaving}>
                    Cancel
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{totalDays > 0 ? `${totalDays}-Day Plan` : "Plan"}</CardTitle>
          <CardDescription>
            {totalDays > 0 ? `View and edit your ${totalDays}-day plan` : "No plan available"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {habit.dayPlan && habit.dayPlan.length > 0 ? (habit.dayPlan.map((p) => (<div key={p.day} className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground">
                      Day {p.day}: {p.title}
                    </div>
                    <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      {p.tasks.map((t, i) => (<li key={`${p.day}-${i}`}>{t}</li>))}
                    </ul>
                  </div>
                </div>))) : (<div className="text-sm text-muted-foreground">
                This habit doesn't have a day-by-day plan yet.
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>);
}
