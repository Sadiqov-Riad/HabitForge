export type ThemePreference = 'system' | 'light' | 'dark';
const STORAGE_KEY = 'theme';
export function getStoredTheme(): ThemePreference | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'system' || raw === 'light' || raw === 'dark')
        return raw;
    return null;
}
export function setStoredTheme(theme: ThemePreference) {
    localStorage.setItem(STORAGE_KEY, theme);
}
export function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function applyThemeClass(effectiveTheme: 'light' | 'dark') {
    const root = document.documentElement;
    if (effectiveTheme === 'dark')
        root.classList.add('dark');
    else
        root.classList.remove('dark');
}
export function resolveTheme(pref: ThemePreference): 'light' | 'dark' {
    return pref === 'system' ? getSystemTheme() : pref;
}
