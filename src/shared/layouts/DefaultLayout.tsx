import type { PropsWithChildren } from "react";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";
export default function DefaultLayout({ children }: PropsWithChildren) {
    return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground">
      <Navbar />
      <main className="pt-32">{children}</main>
      <Footer />
    </div>);
}
