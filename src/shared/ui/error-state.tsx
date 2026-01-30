import { motion } from "framer-motion";
import { AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/shared/ui/dialog";
interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
    compact?: boolean;
}
export function ErrorState({ title = "Something went wrong", message, onRetry, className, compact = false }: ErrorStateProps) {
    if (compact) {
        return (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={cn("bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2", className)}>
        <AlertCircle className="w-4 h-4 shrink-0"/>
        <span className="flex-1">{message}</span>
        {onRetry && (<Button variant="ghost" size="icon-sm" onClick={onRetry} className="h-6 w-6 hover:bg-destructive/20 text-destructive">
            <RefreshCw className="w-3 h-3"/>
          </Button>)}
      </motion.div>);
    }
    return (<div className={cn("flex flex-col items-center justify-center min-h-[300px] w-full p-8 text-center", className)}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="relative mb-6">
        <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full"/>
        <div className="relative bg-card p-4 rounded-full shadow-lg border border-destructive/20">
          <XCircle className="w-10 h-10 text-destructive"/>
        </div>
      </motion.div>
      
      <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl font-semibold mb-2">
        {title}
      </motion.h3>
      
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-md mb-6">
        {message}
      </motion.p>

      {onRetry && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4"/>
            Try Again
          </Button>
        </motion.div>)}
    </div>);
}
interface ErrorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    message: string;
    onRetry?: () => void;
}
export function ErrorDialog({ open, onOpenChange, title = "Error", message, onRetry }: ErrorDialogProps) {
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-destructive/20">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="w-5 h-5"/>
            <DialogTitle className="text-foreground">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onRetry && (<Button onClick={() => {
                onRetry();
                onOpenChange(false);
            }}>
              Retry
            </Button>)}
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
