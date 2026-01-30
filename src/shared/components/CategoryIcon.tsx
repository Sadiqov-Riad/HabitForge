import React from 'react';
import { getCategoryIconUrl } from '@/shared/config/categoryIcons';
import { cn } from '@/shared/lib/utils';
import { Heart, Dumbbell, Apple, Moon, Briefcase, BookOpen, DollarSign, Users, Palette, Sparkles, Briefcase as WorkIcon, Lightbulb, Leaf, Sparkles as SpiritualityIcon } from 'lucide-react';
interface CategoryIconProps {
    category: string | null | undefined;
    className?: string;
    size?: number;
}
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{
    className?: string;
    size?: number;
}>> = {
    Health: Heart,
    Fitness: Dumbbell,
    Nutrition: Apple,
    Sleep: Moon,
    Productivity: Briefcase,
    Learning: BookOpen,
    Finance: DollarSign,
    Relationships: Users,
    Hobby: Palette,
    'Self-care': Sparkles,
    Work: WorkIcon,
    Creativity: Lightbulb,
    Environment: Leaf,
    Spirituality: SpiritualityIcon,
    'Personal Development': Sparkles,
    'Education': BookOpen,
    'Mental Health': Sparkles,
};
export function CategoryIcon({ category, className, size = 24 }: CategoryIconProps) {
    const [imageError, setImageError] = React.useState(false);
    const iconUrl = getCategoryIconUrl(category);
    const IconComponent = category ? CATEGORY_ICON_MAP[category] : null;
    const useCloudIcon = iconUrl &&
        iconUrl.startsWith('http') &&
        !imageError;
    React.useEffect(() => {
        setImageError(false);
    }, [iconUrl]);
    if (useCloudIcon) {
        return (<img src={iconUrl} alt={category || 'Category icon'} className={cn("object-contain dark:invert dark:brightness-200", className)} style={{ width: size, height: size }} title={category || undefined} onError={() => {
                setImageError(true);
            }}/>);
    }
    if (IconComponent) {
        return (<IconComponent className={cn('text-slate-600 dark:text-white', className)} size={size}/>);
    }
    return (<div className={cn('rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center', className)} style={{ width: size, height: size }} title={category || 'No category'}>
      <span className="text-xs text-slate-500 dark:text-white">?</span>
    </div>);
}
