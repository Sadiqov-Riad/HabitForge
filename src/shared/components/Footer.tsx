import { Button } from "@/shared/ui/button";
import { Flame, Twitter, Facebook, Instagram, Linkedin, Send } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
export default function Footer() {
    const { t } = useLanguage();
    return (<footer className="bg-slate-900 text-white py-16">
      <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-12">
          
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white"/>
              </div>
              <span className="text-2xl font-bold">HabitForge</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (<button key={i} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 flex items-center justify-center transition-all">
                  <Icon className="w-5 h-5"/>
                </button>))}
            </div>
          </div>

          
          <div>
            <h4 className="font-semibold mb-4">{t.footer.product}</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  {t.footer.features}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  {t.footer.howItWorks}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.pricing}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.demo}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.company}</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.aboutUs}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.blog}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.careers}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">{t.footer.copyright}</p>
          <div className="flex items-center gap-3">
            <input type="email" placeholder={t.footer.enterEmail} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500"/>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4 mr-2"/>
              {t.footer.subscribe}
            </Button>
          </div>
        </div>
      </div>
    </footer>);
}
