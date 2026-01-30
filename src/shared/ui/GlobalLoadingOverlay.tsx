import { useSyncExternalStore } from "react";
import { LoadingSpinner } from "@/shared/ui/loading";
import { globalLoadingGetCount, globalLoadingSubscribe } from "@/shared/lib/globalLoading";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
export function GlobalLoadingOverlay() {
    const { t } = useLanguage();
    const count = useSyncExternalStore(globalLoadingSubscribe, globalLoadingGetCount, globalLoadingGetCount);
    const visible = count > 0;
    if (!visible)
        return null;
    return (<div className="fixed right-4 top-4 z-[9999] pointer-events-none">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-2 shadow-md">
        <LoadingSpinner className="h-4 w-4"/>
        <div className="text-xs font-medium text-foreground">{t.common.loading}</div>
      </div>
    </div>);
}
