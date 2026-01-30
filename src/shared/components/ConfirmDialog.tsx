import { motion } from "framer-motion";
import { Dialog, DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => Promise<void> | void;
};
export function ConfirmDialog({ open, onOpenChange, title, description, confirmText, cancelText, loading = false, onConfirm, }: ConfirmDialogProps) {
    const { t } = useLanguage();
    const safeConfirmText = confirmText ?? t.common.delete;
    const safeCancelText = cancelText ?? t.common.cancel;
    async function handleConfirm() {
        await onConfirm();
    }
    return (<Dialog open={open} onOpenChange={(next) => (!loading ? onOpenChange(next) : undefined)}>
      <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.18, ease: "easeOut" }} className="relative z-50 w-full max-w-lg bg-card text-card-foreground rounded-xl shadow-2xl border border-border sm:max-w-[520px]">
        <DialogClose onClose={() => {
            if (!loading)
                onOpenChange(false);
        }}/>
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-border">
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? t.habitPlanModal.deleting : safeConfirmText}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {safeCancelText}
          </Button>
        </div>
      </motion.div>
    </Dialog>);
}
