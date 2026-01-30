export const HABIT_CATEGORIES = [
    'Health',
    'Fitness',
    'Nutrition',
    'Productivity',
    'Learning',
    'Finance',
    'Relationships',
    'Hobby',
    'Self-care',
    'Work',
    'Creativity',
] as const;
export type HabitCategory = typeof HABIT_CATEGORIES[number];
export const CATEGORY_ICONS: Record<string, string> = {
    Health: 'https://res.cloudinary.com/dalwpkd3s/image/upload/healthcare_erfhqo.png',
    Fitness: 'https://res.cloudinary.com/dalwpkd3s/image/upload/weight_nxrgax.png',
    Nutrition: 'https://res.cloudinary.com/dalwpkd3s/image/upload/nutrition_j2qqu2.png',
    Productivity: 'https://res.cloudinary.com/dalwpkd3s/image/upload/productivity_jscqgt.png',
    Learning: 'https://res.cloudinary.com/dalwpkd3s/image/upload/idea_ovwrca.png',
    Finance: 'https://res.cloudinary.com/dalwpkd3s/image/upload/hand_t2cmgy.png',
    Relationships: 'https://res.cloudinary.com/dalwpkd3s/image/upload/relationship_vtgqjr.png',
    Hobby: 'https://res.cloudinary.com/dalwpkd3s/image/upload/hobbies_f6iqgv.png',
    'Self-care': 'https://res.cloudinary.com/dalwpkd3s/image/upload/v1768413311/meditate_ghfxyh.png',
    Work: 'https://res.cloudinary.com/dalwpkd3s/image/upload/briefcase_kf8rbo.png',
    Creativity: 'https://res.cloudinary.com/dalwpkd3s/image/upload/creativity_ebt1jk.png',
};
const CATEGORY_ALIASES: Record<string, string> = {
    'Personal Development': 'Self-care',
    'Education': 'Learning',
    'Mental Health': 'Self-care',
};
export function getCategoryIconUrl(category: string | null | undefined): string | null {
    if (!category)
        return null;
    const normalizedCategory = CATEGORY_ALIASES[category] || category;
    return CATEGORY_ICONS[normalizedCategory] || null;
}
export function isValidCategory(category: string | null | undefined): boolean {
    if (!category)
        return false;
    return HABIT_CATEGORIES.includes(category as HabitCategory);
}
