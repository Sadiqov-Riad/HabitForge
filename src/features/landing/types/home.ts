import type { LucideIcon } from "lucide-react";
export interface HabitItem {
    id: number;
    name: string;
    time: string;
    icon: LucideIcon;
    completed: boolean;
}
export interface FeatureItem {
    icon: LucideIcon;
    title: string;
    description: string;
}
export interface TimelineStat {
    number: string;
    text: string;
}
export interface TimelineItem {
    step: string;
    title: string;
    subtitle: string;
    description: string;
    example?: string;
    badges?: string[];
    stats?: TimelineStat[];
}
export interface FaqItem {
    question: string;
    answer: string;
}
