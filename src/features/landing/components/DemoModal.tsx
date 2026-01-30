import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Sparkles, MessageSquare, ListChecks, Calendar } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
interface DemoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export function DemoModal({ open, onOpenChange }: DemoModalProps) {
    const { t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);
    const DEMO_SLIDES = [
        {
            id: 1,
            title: t.landing.demo.slide1.title,
            description: t.landing.demo.slide1.description,
            icon: <Sparkles className="w-20 h-20 text-yellow-400"/>,
            color: "bg-yellow-50 dark:bg-yellow-900/20"
        },
        {
            id: 2,
            title: t.landing.demo.slide2.title,
            description: t.landing.demo.slide2.description,
            icon: <MessageSquare className="w-20 h-20 text-blue-500"/>,
            color: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            id: 3,
            title: t.landing.demo.slide3.title,
            description: t.landing.demo.slide3.description,
            icon: <ListChecks className="w-20 h-20 text-green-500"/>,
            color: "bg-green-50 dark:bg-green-900/20"
        },
        {
            id: 4,
            title: t.landing.demo.slide4.title,
            description: t.landing.demo.slide4.description,
            icon: <Calendar className="w-20 h-20 text-purple-500"/>,
            color: "bg-purple-50 dark:bg-purple-900/20"
        }
    ];
    useEffect(() => {
        if (open)
            setCurrentSlide(0);
    }, [open]);
    const nextSlide = () => {
        if (currentSlide < DEMO_SLIDES.length - 1) {
            setCurrentSlide(prev => prev + 1);
        }
        else {
            onOpenChange(false);
        }
    };
    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };
    return (<AnimatePresence>
      {open && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg overflow-hidden bg-card border border-border rounded-2xl shadow-2xl">
            <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground z-10">
              <X className="w-6 h-6"/>
            </button>

            <div className="flex flex-col h-[480px]">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center justify-center flex-1 p-8 text-center">
                  <div className={`flex items-center justify-center w-40 h-40 mb-8 rounded-full ${DEMO_SLIDES[currentSlide].color}`}>
                    {DEMO_SLIDES[currentSlide].icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {DEMO_SLIDES[currentSlide].title}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-xs">
                    {DEMO_SLIDES[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="p-6 border-t border-border bg-muted/30 flex items-center justify-between">
                <div className="flex gap-1">
                  {DEMO_SLIDES.map((_, idx) => (<div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-indigo-600" : "w-2 bg-gray-300 dark:bg-gray-700"}`}/>))}
                </div>

                <div className="flex gap-3">
                  {currentSlide > 0 && (<Button variant="ghost" onClick={prevSlide}>
                      {t.landing.demo.back}
                    </Button>)}
                  <Button onClick={nextSlide} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {currentSlide === DEMO_SLIDES.length - 1 ? t.landing.demo.done : t.landing.demo.next}
                    {currentSlide !== DEMO_SLIDES.length - 1 && <ChevronRight className="w-4 h-4 ml-2"/>}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>)}
    </AnimatePresence>);
}
