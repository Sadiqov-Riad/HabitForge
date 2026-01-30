import React from 'react';
import type { ThemePreference } from './theme';
import { applyThemeClass, getStoredTheme, resolveTheme, setStoredTheme } from './theme';
type ThemeContextValue = {
    theme: ThemePreference;
    setTheme: (theme: ThemePreference) => void;
    effectiveTheme: 'light' | 'dark';
};
const ThemeContext = React.createContext<ThemeContextValue | null>(null);
export function ThemeProvider({ children }: {
    children: React.ReactNode;
}) {
    const [theme, setThemeState] = React.useState<ThemePreference>(() => getStoredTheme() ?? 'system');
    const [effectiveTheme, setEffectiveTheme] = React.useState<'light' | 'dark'>(() => resolveTheme(getStoredTheme() ?? 'system'));
    React.useEffect(() => {
        const effective = resolveTheme(theme);
        setEffectiveTheme(effective);
        applyThemeClass(effective);
        setStoredTheme(theme);
    }, [theme]);
    React.useEffect(() => {
        const media = window.matchMedia?.('(prefers-color-scheme: dark)');
        if (!media)
            return;
        const handler = () => {
            if (theme !== 'system')
                return;
            const effective = resolveTheme('system');
            setEffectiveTheme(effective);
            applyThemeClass(effective);
        };
        media.addEventListener?.('change', handler);
        media.addListener?.(handler);
        return () => {
            media.removeEventListener?.('change', handler);
            media.removeListener?.(handler);
        };
    }, [theme]);
    const setTheme = React.useCallback((next: ThemePreference) => {
        setThemeState(next);
    }, []);
    return (<ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>);
}
export function useTheme() {
    const ctx = React.useContext(ThemeContext);
    if (!ctx)
        throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
