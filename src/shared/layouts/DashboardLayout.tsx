import type { PropsWithChildren } from "react";
import { useState } from "react";
import { Sidebar } from "@/shared/components/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";
export default function DashboardLayout({ children }: PropsWithChildren) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    return (<div className="min-h-screen bg-background text-foreground">
      <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)}/>
      <div className="md:ml-64 min-h-screen">
        
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white"/>
              </div>
              <span className="text-lg font-bold text-foreground">HabitForge</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(true)} className="md:hidden" aria-label="Open menu">
              <Menu className="w-5 h-5"/>
            </Button>
          </div>
        </div>
        <main className="p-4 sm:p-6 lg:p-8 md:pt-6 pt-20">
            {children}
        </main>
      </div>
    </div>);
}
