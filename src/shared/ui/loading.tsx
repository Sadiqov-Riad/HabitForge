import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
interface LoadingSpinnerProps {
    className?: string;
    size?: number;
}
export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
    return (<Loader2 className={cn("animate-spin text-primary", className)} size={size}/>);
}
interface PageLoaderProps {
    text?: string;
    className?: string;
}
export function PageLoader({ text, className }: PageLoaderProps) {
    return (<div className={cn("flex flex-col items-center justify-center min-h-[300px] w-full p-8", className)}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"/>
        <div className="relative bg-card p-4 rounded-2xl shadow-lg border border-border/50">
          <Loader2 className="w-8 h-8 animate-spin text-primary"/>
        </div>
      </motion.div>
      {text && (<motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-muted-foreground font-medium animate-pulse">
          {text}
        </motion.p>)}
    </div>);
}
