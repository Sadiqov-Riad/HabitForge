import { Dumbbell, Book, Utensils, Moon, Wand2, Lightbulb, Quote, BarChart3, } from "lucide-react";
import type { HabitItem, FeatureItem, TimelineItem, FaqItem } from "@/features/landing/types/home";
export const habits: HabitItem[] = [
    { id: 1, name: "Morning Workout", time: "7:00 AM", icon: Dumbbell, completed: true },
    { id: 2, name: "Read 30 min", time: "8:30 AM", icon: Book, completed: true },
    { id: 3, name: "Healthy Lunch", time: "12:00 PM", icon: Utensils, completed: false },
    { id: 4, name: "Early Sleep", time: "10:00 PM", icon: Moon, completed: false },
];
export const features: FeatureItem[] = [
    {
        icon: Wand2,
        title: "Auto Text-to-Habit",
        description: "Write your goal in simple words — we'll turn it into a clear, trackable habit and suggest the best schedule for you.",
    },
    {
        icon: Lightbulb,
        title: "Smart Recommendations",
        description: "Personalized habit suggestions based on your goals, lifestyle, and current routine to accelerate growth.",
    },
    {
        icon: Quote,
        title: "Motivational Messages",
        description: "Encouraging insights and nudges that keep you on track with your habit-building journey.",
    },
    {
        icon: BarChart3,
        title: "Progress Statistics",
        description: "A quick snapshot of your habits done, current streak, best streak, and total days.",
    },
];
export const timeline: TimelineItem[] = [
    {
        step: "Step 1",
        title: "Describe Your Goal",
        subtitle: "(Plain Language)",
        description: "Tell us what you want to achieve in simple words. No forms or templates required.",
        example: '"I want to exercise more"',
    },
    {
        step: "Step 2",
        title: "Get Your Habit Plan",
        subtitle: "(AI Processing)",
        description: "We turn your goal into a clear habit with schedule, duration, and helpful tips.",
        badges: ["🏃‍♂️ Morning Run", "⏰ 7:00 AM", "📅 Daily"],
    },
    {
        step: "Step 3",
        title: "Track & Improve",
        subtitle: "(Success Analytics)",
        description: "Mark completions, keep streaks, and get insights to improve week by week.",
        stats: [
            { number: "15", text: "day streak" },
            { number: "85%", text: "success rate" },
        ],
    },
];
export const faqs: FaqItem[] = [
    {
        question: "How does HabitForge's AI create habits from my goals?",
        answer: "Our AI analyzes your goal description using natural language processing to understand your intent. It then breaks down your goal into specific, measurable actions and suggests optimal timing, frequency, and duration based on your lifestyle patterns and behavioral science principles.",
    },
    {
        question: "Can I track multiple habits at once?",
        answer: "Absolutely! HabitForge is designed to help you build a complete habit ecosystem. You can track unlimited habits simultaneously, and our AI will help you understand how different habits interact and support each other.",
    },
    {
        question: "What if I miss a day or break my streak?",
        answer: "Don't worry! HabitForge understands that building habits is a journey with ups and downs. Our system provides gentle encouragement and helps you get back on track without judgment. We focus on progress over perfection.",
    },
    {
        question: "How do progress statistics work?",
        answer: "We show your key habit stats like habits done, current streak, best streak, and total days to help you quickly understand your progress.",
    },
    {
        question: "Is my data private and secure?",
        answer: "Yes! We take privacy seriously. All your data is encrypted and stored securely. We never share your personal information with third parties, and you have full control over your data with options to export or delete it at any time.",
    },
];
