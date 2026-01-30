import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import { Flame, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { isAuthenticated, getCurrentUser, logout } from "@/features/auth/model/auth";
import type { UserInfo } from "@/features/auth/model/auth";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/shared/ui/dropdown-menu";
export default function Navbar() {
    const { t } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
        setIsAuth(isAuthenticated());
        if (isAuthenticated()) {
            setUser(getCurrentUser());
        }
    }, []);
    return (<motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-xl bg-background/80">
      <div className="px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-[70px]">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white"/>
            </div>
            <span className="text-2xl font-extrabold text-foreground">HabitForge</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
              {t.nav.features}
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
              {t.nav.howItWorks}
            </a>
            <Link to="/subscription" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
              {t.nav.pricing}
            </Link>
            <a href="#faq" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
              {t.nav.faq}
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuth && user ? (<DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 px-4 py-2.5 bg-card rounded-xl border border-border hover:bg-accent hover:shadow-sm transition-all cursor-pointer">
                    {user.logoUrl ? (<img src={user.logoUrl} alt={user.username} className="w-8 h-8 rounded-full object-cover border border-border" referrerPolicy="no-referrer"/>) : (<div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white"/>
                      </div>)}
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium text-foreground">{user.username}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground ml-1"/>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2"/>
                      {t.nav.profile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2"/>
                    {t.nav.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>) : (<>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <Link to="/login">{t.common.login}</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  <Link to="/signup">{t.common.signup}</Link>
                </Button>
              </>)}
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-3 text-center">
              <a href="#features" className="block py-2 text-muted-foreground hover:text-foreground">
                {t.nav.features}
              </a>
              <a href="#how-it-works" className="block py-2 text-muted-foreground hover:text-foreground">
                {t.nav.howItWorks}
              </a>
              <Link to="/subscription" className="block py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                {t.nav.pricing}
              </Link>
              <a href="#faq" className="block py-2 text-muted-foreground hover:text-foreground">
                {t.nav.faq}
              </a>
              <div className="pt-2 space-y-2">
                {isAuth && user ? (<>
                    <div className="flex items-center justify-center gap-3 px-4 py-3 bg-card rounded-xl border border-border mb-2">
                      {user.logoUrl ? (<img src={user.logoUrl} alt={user.username} className="w-10 h-10 rounded-full object-cover border border-border" referrerPolicy="no-referrer"/>) : (<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white"/>
                        </div>)}
                      <div className="flex flex-col text-center">
                        <span className="text-sm font-medium text-foreground">{user.username}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/profile" className="flex items-center justify-center">
                        <User className="w-4 h-4 mr-2"/>
                        {t.nav.profile}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30" onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2"/>
                      {t.nav.logout}
                    </Button>
                  </>) : (<>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/login">{t.common.login}</Link>
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                      <Link to="/signup">{t.common.signup}</Link>
                    </Button>
                  </>)}
              </div>
            </div>
          </motion.div>)}
      </AnimatePresence>
    </motion.nav>);
}
