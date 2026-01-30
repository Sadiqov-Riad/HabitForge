import React from "react";
import type { Language, Translations } from "./translations";
import { translations as allTranslations } from "./translations";
type LanguageContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: Translations;
};
const LanguageContext = React.createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "language";
function getStoredLanguage(): Language {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "en" || raw === "ru" || raw === "az")
        return raw;
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "ru")
        return "ru";
    if (browserLang === "az")
        return "az";
    return "en";
}
function setStoredLanguage(language: Language) {
    localStorage.setItem(STORAGE_KEY, language);
}
export function LanguageProvider({ children }: {
    children: React.ReactNode;
}) {
    const [language, setLanguageState] = React.useState<Language>(() => getStoredLanguage());
    React.useEffect(() => {
        setStoredLanguage(language);
    }, [language]);
    const setLanguage = React.useCallback((next: Language) => {
        setLanguageState(next);
    }, []);
    const t = React.useMemo(() => {
        return allTranslations[language];
    }, [language]);
    return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
    const ctx = React.useContext(LanguageContext);
    if (!ctx)
        throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
}
