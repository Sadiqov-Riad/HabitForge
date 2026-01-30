import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}
interface DialogContentProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}
function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => onOpenChange(false)}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"/>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>);
}
function DialogContent({ className, children, ...props }: DialogContentProps) {
    return (<div className={cn("relative z-50 w-full max-w-lg bg-card text-card-foreground rounded-xl shadow-2xl border border-border", className)} {...props}>
      {children}
    </div>);
}
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (<div className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)} {...props}/>);
}
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (<div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0", className)} {...props}/>);
}
function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
    return (<h2 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}/>);
}
function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (<p className={cn("text-sm text-slate-600", className)} {...props}/>);
}
function DialogClose({ onClose, className, ...props }: React.ComponentProps<"button"> & {
    onClose: () => void;
}) {
    return (<button onClick={onClose} className={cn("absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", className)} {...props}>
      <X className="h-4 w-4"/>
      <span className="sr-only">Close</span>
    </button>);
}
export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose };
