import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { DaySelector } from "@/features/habits/components/DaySelector";
import { TimeSelector } from "@/features/habits/components/TimeSelector";
import { DurationSelector } from "@/features/habits/components/DurationSelector";
import { PrioritySelector } from "@/features/habits/components/PrioritySelector";
import { createHabit } from "@/features/habits/api/habits.api";
import toast from "react-hot-toast";
export default function AddHabitFromSuggestionPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<string | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [scheduleTimes, setScheduleTimes] = useState<Record<string, string>>({});
    const [duration, setDuration] = useState("");
    const [priority, setPriority] = useState<"High" | "Medium" | "Low" | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const titleParam = searchParams.get("title");
        const descParam = searchParams.get("description");
        const catParam = searchParams.get("category");
        if (titleParam)
            setTitle(titleParam);
        if (descParam)
            setDescription(descParam);
        if (catParam)
            setCategory(catParam);
    }, [searchParams]);
    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        setError(null);
        setIsSaving(true);
        const toastId = toast.loading("Adding habit...");
        try {
            const scheduleDaysJson = selectedDays.length > 0 ? JSON.stringify(selectedDays) : null;
            const scheduleTimesJson = Object.keys(scheduleTimes).length > 0 ? JSON.stringify(scheduleTimes) : null;
            await createHabit({
                action: title,
                frequency: "daily",
                description: description || title,
                category: category,
                priority: priority || null,
                scheduleDays: scheduleDaysJson,
                scheduleTimes: scheduleTimesJson,
                duration: duration || null,
            });
            toast.success("Habit added");
            window.dispatchEvent(new Event("habits:changed"));
            navigate("/add-habit");
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to add habit";
            setError(msg);
            toast.error(msg);
        }
        finally {
            toast.dismiss(toastId);
            setIsSaving(false);
        }
    };
    const handleCancel = () => {
        navigate("/add-habit");
    };
    return (<div className="h-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pt-6 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Add Habit</h1>
          <p className="text-muted-foreground">Configure your habit schedule and details</p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border border-border p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" placeholder="e.g., Morning Exercise" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea id="description" placeholder="Describe your habit..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"/>
          </div>

          {category && (<div className="space-y-2">
              <Label>Category</Label>
              <div className="px-3 py-2 bg-muted/40 rounded-md text-sm text-foreground">
                {category}
              </div>
            </div>)}

          <DaySelector selectedDays={selectedDays} onChange={setSelectedDays}/>
          <TimeSelector selectedDays={selectedDays} scheduleTimes={scheduleTimes} onChange={setScheduleTimes}/>
          <DurationSelector duration={duration} onChange={setDuration}/>
          <PrioritySelector priority={priority} onChange={setPriority}/>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !title.trim()}>
              {isSaving ? "Saving..." : "Add Habit"}
            </Button>
          </div>
        </div>
      </div>
    </div>);
}
