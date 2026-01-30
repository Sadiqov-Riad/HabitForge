import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/shared/ui/accordion";
import { Sparkles, Play, Rocket, Lightbulb, Target, Brain, TrendingUp, Check, Clock, User, Heart, CheckCircle, X, UserCheck } from "lucide-react";
import { habits as habitsData, features as featuresData } from "@/features/landing/data/home";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { DemoModal } from "@/features/landing/components/DemoModal";
import type { HabitItem, FeatureItem, TimelineItem, FaqItem } from "@/features/landing/types/home";
export default function HeroPage() {
    const { t } = useLanguage();
    const [overlayOpen, setOverlayOpen] = useState(false);
    const [isDemoOpen, setIsDemoOpen] = useState(false);
    const [activeFloatingCard, setActiveFloatingCard] = useState<"suggestion" | "motivation" | "advice" | null>(null);
    const navigate = useNavigate();
    const habits: HabitItem[] = [
        { id: 1, name: t.landing.habits.morningWorkout, time: "7:00 AM", icon: habitsData[0].icon, completed: true },
        { id: 2, name: t.landing.habits.read30min, time: "8:30 AM", icon: habitsData[1].icon, completed: true },
        { id: 3, name: t.landing.habits.healthyLunch, time: "12:00 PM", icon: habitsData[2].icon, completed: false },
        { id: 4, name: t.landing.habits.earlySleep, time: "10:00 PM", icon: habitsData[3].icon, completed: false },
    ];
    const features: FeatureItem[] = [
        {
            icon: featuresData[0].icon,
            title: t.landing.features.autoTextToHabit.title,
            description: t.landing.features.autoTextToHabit.description,
        },
        {
            icon: featuresData[1].icon,
            title: t.landing.features.smartRecommendations.title,
            description: t.landing.features.smartRecommendations.description,
        },
        {
            icon: featuresData[2].icon,
            title: t.landing.features.motivationalMessages.title,
            description: t.landing.features.motivationalMessages.description,
        },
        {
            icon: featuresData[3].icon,
            title: t.landing.features.progressAnalytics.title,
            description: t.landing.features.progressAnalytics.description,
        },
    ];
    const timeline: TimelineItem[] = [
        {
            step: t.landing.timeline.step1.step,
            title: t.landing.timeline.step1.title,
            subtitle: t.landing.timeline.step1.subtitle,
            description: t.landing.timeline.step1.description,
            example: t.landing.timeline.step1.example,
        },
        {
            step: t.landing.timeline.step2.step,
            title: t.landing.timeline.step2.title,
            subtitle: t.landing.timeline.step2.subtitle,
            description: t.landing.timeline.step2.description,
            badges: [
                t.landing.timeline.step2.badges.morningRun,
                t.landing.timeline.step2.badges.time,
                t.landing.timeline.step2.badges.daily,
            ],
        },
        {
            step: t.landing.timeline.step3.step,
            title: t.landing.timeline.step3.title,
            subtitle: t.landing.timeline.step3.subtitle,
            description: t.landing.timeline.step3.description,
            stats: [
                { number: "15", text: t.landing.timeline.step3.stats.dayStreak },
                { number: "85%", text: t.landing.timeline.step3.stats.successRate },
            ],
        },
    ];
    const faqs: FaqItem[] = [
        { question: t.landing.faqs.q1.question, answer: t.landing.faqs.q1.answer },
        { question: t.landing.faqs.q2.question, answer: t.landing.faqs.q2.answer },
        { question: t.landing.faqs.q3.question, answer: t.landing.faqs.q3.answer },
        { question: t.landing.faqs.q4.question, answer: t.landing.faqs.q4.answer },
        { question: t.landing.faqs.q5.question, answer: t.landing.faqs.q5.answer },
    ];
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const openOverlay = (type: "suggestion" | "motivation" | "advice") => {
        setActiveFloatingCard(type);
        setOverlayOpen(true);
    };
    return (<>
      
      <section className=" pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8 text-center lg:text-left">
              
              <div className="flex justify-center lg:justify-start">
                <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-900/50 dark:hover:bg-indigo-950/60">
                  <Sparkles className="w-4 h-4"/>
                  {t.hero.badge}
                </Badge>
              </div>

              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                {t.hero.title}{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t.hero.titleHighlight}
                </span>
              </h1>

              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t.hero.description}
              </p>

              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30" onClick={() => navigate("/add-habit")}>
                  <Rocket className="mr-2 w-5 h-5"/>
                  {t.hero.startJourney}
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-border hover:bg-accent" onClick={() => setIsDemoOpen(true)}>
                  <Play className="mr-2 w-5 h-5"/>
                  {t.hero.watchDemo}
                </Button>
              </div>

              
              <div className="grid grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto lg:mx-0">
                {[
            { number: "#1", label: t.hero.firstTracker },
            { number: "100%", label: t.hero.personalization },
            { number: "50+", label: t.hero.habitsTracked },
        ].map((stat, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }} className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </motion.div>))}
              </div>
            </motion.div>

            
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative flex justify-center lg:justify-start">
              <Card className="w-full max-w-lg mx-auto shadow-2xl border-border overflow-visible">
                <div className="p-6">
                  
                  <div className="flex items-center gap-4 pb-4 mb-6 border-b border-border">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white"/>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{t.hero.dailyHabits}</h3>
                      <p className="text-sm text-muted-foreground">{t.hero.todayProgress}</p>
                    </div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-3 h-3 bg-green-500 rounded-full"/>
                  </div>

                  
                  <div className="space-y-3 mb-6">
                    {habits.map((habit, index) => (<motion.div key={habit.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-accent/60 ${habit.completed ? "opacity-100" : "opacity-60"}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${habit.completed ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
                          <habit.icon className="w-5 h-5"/>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{habit.name}</div>
                          <div className="text-xs text-muted-foreground">{habit.time}</div>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${habit.completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                          {habit.completed ? <Check className="w-4 h-4"/> : <Clock className="w-4 h-4"/>}
                        </div>
                      </motion.div>))}
                  </div>

                  
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "50%" }} transition={{ delay: 0.5, duration: 1 }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"/>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">{t.hero.habitsCompleted}</p>
                  </div>
                </div>
              </Card>

              
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="absolute -right-3 top-[12%] cursor-pointer z-10" onClick={() => openOverlay("suggestion")}>
                <div className="bg-card text-card-foreground px-4 py-3 rounded-xl shadow-lg border border-indigo-200/50 dark:border-indigo-900/40 flex items-center gap-2 hover:bg-accent transition-colors">
                  <Lightbulb className="w-5 h-5 text-indigo-600"/>
                  <span className="font-semibold text-sm text-foreground">{t.hero.aiSuggestion}</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute -left-3 bottom-[30%] cursor-pointer z-10" onClick={() => openOverlay("motivation")}>
                <div className="bg-card text-card-foreground px-4 py-3 rounded-xl shadow-lg border border-pink-200/50 dark:border-pink-900/40 flex items-center gap-2 hover:bg-accent transition-colors">
                  <Heart className="w-5 h-5 text-pink-600"/>
                  <span className="font-semibold text-sm text-foreground">{t.hero.doingGreat}</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="absolute -right-3 top-[55%] cursor-pointer z-10" onClick={() => openOverlay("advice")}>
                <div className="bg-card text-card-foreground px-4 py-3 rounded-xl shadow-lg border border-green-200/50 dark:border-green-900/40 flex items-center gap-2 hover:bg-accent transition-colors">
                  <UserCheck className="w-5 h-5 text-green-600"/>
                  <span className="font-semibold text-sm text-foreground">{t.hero.personalAdvice}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      
      <section id="features" className="py-20 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t.hero.featuresTitle}</h2>
            <p className="text-xl text-muted-foreground">{t.hero.featuresSubtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
                <Card className="h-full p-6 text-center border-2 border-border hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-xl transition-all">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-10 h-10 text-white"/>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>))}
          </div>
        </div>
      </section>

      
      <section id="how-it-works" className="py-20 bg-muted/20">
        <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t.hero.howItWorksTitle}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t.hero.howItWorksSubtitle}</p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 lg:transform lg:-translate-x-1/2"/>

            <div className="space-y-24">
              {timeline.map((item, index) => (<motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }} className="relative">
                  
                  <div className="lg:hidden flex gap-8">
                    
                    <div className="flex flex-col items-center">
                      <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                        {index === 0 && <Target className="w-8 h-8 text-white"/>}
                        {index === 1 && <Brain className="w-8 h-8 text-white"/>}
                        {index === 2 && <TrendingUp className="w-8 h-8 text-white"/>}
                      </div>
                      <Badge className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
                        {item.step}
                      </Badge>
                    </div>

                    
                    <div className="flex-1">
                      <Card className="p-6 shadow-lg border-2 border-border hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-xl transition-all">
                        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                        <p className="text-indigo-600 font-semibold text-sm mb-4">{item.subtitle}</p>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>

                        {item.example && (<div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 rounded-lg p-4 text-center">
                            <span className="text-indigo-700 dark:text-indigo-200 font-semibold italic">{item.example}</span>
                          </div>)}

                        {item.badges && (<div className="flex flex-wrap gap-2 mt-4">
                            {item.badges.map((badge, i) => (<div key={i} className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                                {badge}
                              </div>))}
                          </div>)}

                        {item.stats && (<div className="grid grid-cols-2 gap-3 mt-4">
                            {item.stats.map((stat, i) => (<div key={i} className="bg-muted/30 border border-border rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-indigo-600">{stat.number}</div>
                                <div className="text-xs text-muted-foreground mt-1">{stat.text}</div>
                              </div>))}
                          </div>)}
                      </Card>
                    </div>
                  </div>

                  
                  <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
                    
                    <div className={index % 2 === 0 ? "" : "flex justify-center"}>
                      {index % 2 === 0 ? (<div className="relative">
                          <Badge className="absolute -top-3 -left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-lg z-10">
                            {item.step}
                          </Badge>
                          <Card className="p-8 shadow-xl border-2 border-border hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-2xl transition-all">
                            <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                            <p className="text-indigo-600 font-semibold text-base mb-4">{item.subtitle}</p>
                            <p className="text-muted-foreground mb-6 leading-relaxed text-lg">{item.description}</p>

                            {item.example && (<div className="bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-900/40 rounded-xl p-5 text-center">
                                <span className="text-indigo-700 dark:text-indigo-200 font-semibold italic text-lg">{item.example}</span>
                              </div>)}

                            {item.badges && (<div className="flex flex-wrap gap-3 mt-6">
                                {item.badges.map((badge, i) => (<div key={i} className="inline-flex items-center gap-2 px-4 py-3 bg-card border-2 border-border rounded-xl text-base font-medium shadow-sm hover:shadow-md hover:bg-accent transition-colors">
                                    {badge}
                                  </div>))}
                              </div>)}

                            {item.stats && (<div className="grid grid-cols-2 gap-4 mt-6">
                                {item.stats.map((stat, i) => (<div key={i} className="bg-muted/30 border-2 border-border rounded-xl p-5 text-center hover:bg-accent hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all">
                                    <div className="text-3xl font-bold text-indigo-600">{stat.number}</div>
                                    <div className="text-sm text-muted-foreground mt-2">{stat.text}</div>
                                  </div>))}
                              </div>)}
                          </Card>
                        </div>) : (<div className="flex flex-col items-center gap-4">
                          <div className="relative z-10 w-40 h-40 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <Brain className="w-20 h-20 text-white"/>
                          </div>
                          <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-lg text-base px-6 py-2">
                            {item.step}
                          </Badge>
                        </div>)}
                    </div>

                    
                    <div className="absolute left-1/2 top-20 transform -translate-x-1/2 z-20">
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + index * 0.2 }} className="w-8 h-8 bg-background border-4 border-indigo-600 rounded-full shadow-lg"/>
                    </div>

                    
                    <div className={index % 2 === 1 ? "" : "flex justify-center"}>
                      {index % 2 === 1 ? (<div className="relative">
                          <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-lg z-10">
                            {item.step}
                          </Badge>
                          <Card className="p-8 shadow-xl border-2 border-border hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-2xl transition-all">
                            <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                            <p className="text-indigo-600 font-semibold text-base mb-4">{item.subtitle}</p>
                            <p className="text-muted-foreground mb-6 leading-relaxed text-lg">{item.description}</p>

                            {item.example && (<div className="bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-900/40 rounded-xl p-5 text-center">
                                <span className="text-indigo-700 dark:text-indigo-200 font-semibold italic text-lg">{item.example}</span>
                              </div>)}

                            {item.badges && (<div className="flex flex-wrap gap-3 mt-6">
                                {item.badges.map((badge, i) => (<div key={i} className="inline-flex items-center gap-2 px-4 py-3 bg-card border-2 border-border rounded-xl text-base font-medium shadow-sm hover:shadow-md hover:bg-accent transition-colors">
                                    {badge}
                                  </div>))}
                              </div>)}

                            {item.stats && (<div className="grid grid-cols-2 gap-4 mt-6">
                                {item.stats.map((stat, i) => (<div key={i} className="bg-muted/30 border-2 border-border rounded-xl p-5 text-center hover:bg-accent hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all">
                                    <div className="text-3xl font-bold text-indigo-600">{stat.number}</div>
                                    <div className="text-sm text-muted-foreground mt-2">{stat.text}</div>
                                  </div>))}
                              </div>)}
                          </Card>
                        </div>) : (<div className="flex flex-col items-center gap-4">
                          <div className="relative z-10 w-40 h-40 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            {index === 0 && <Target className="w-20 h-20 text-white"/>}
                            {index === 2 && <TrendingUp className="w-20 h-20 text-white"/>}
                          </div>
                          <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-lg text-base px-6 py-2">
                            {item.step}
                          </Badge>
                        </div>)}
                    </div>
                  </div>
                </motion.div>))}
            </div>
          </div>
        </div>
      </section>

      
      <section id="faq" className="py-20 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t.hero.faqTitle}</h2>
            <p className="text-xl text-muted-foreground">{t.hero.faqSubtitle}</p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <AccordionItem value={`item-${index}`} className="border-2 border-border bg-card/60 rounded-xl px-6 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all">
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-indigo-600 dark:hover:text-indigo-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>))}
          </Accordion>
        </div>
      </section>

      

      
      <AnimatePresence>
        {overlayOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOverlayOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-card text-card-foreground rounded-2xl max-w-2xl w-full max-h=[80vh] overflow-auto shadow-2xl border border-border">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-2xl font-bold">
                  {activeFloatingCard === "suggestion" && t.hero.aiSuggestions}
                  {activeFloatingCard === "motivation" && t.hero.motivationalMessage}
                  {activeFloatingCard === "advice" && t.hero.personalAdviceTitle}
                </h3>
                <button onClick={() => setOverlayOpen(false)} className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="p-6">
                {activeFloatingCard === "suggestion" && (<div className="space-y-4">
                    <p className="text-muted-foreground mb-6">
                      {t.hero.suggestionsBasedOn}
                    </p>
                    {[
                    {
                        title: t.landing.overlay.suggestions.meditate.title,
                        time: "7:00 AM",
                        desc: t.landing.overlay.suggestions.meditate.desc,
                        category: t.landing.overlay.suggestions.meditate.category,
                    },
                    {
                        title: t.landing.overlay.suggestions.hydrate.title,
                        time: "Throughout day",
                        desc: t.landing.overlay.suggestions.hydrate.desc,
                        category: t.landing.overlay.suggestions.hydrate.category,
                    },
                    {
                        title: t.landing.overlay.suggestions.planDay.title,
                        time: "9:00 AM",
                        desc: t.landing.overlay.suggestions.planDay.desc,
                        category: t.landing.overlay.suggestions.planDay.category,
                    },
                ].map((habit, i) => (<Card key={i} className="p-4 hover:shadow-md transition-shadow border-border">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">{habit.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {habit.time} • {habit.category}
                            </p>
                            <p className="text-muted-foreground">{habit.desc}</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-600"/>
                        </div>
                      </Card>))}
                  </div>)}

                {activeFloatingCard === "motivation" && (<div className="space-y-4">
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/25 dark:to-purple-950/20 border border-pink-200 dark:border-pink-900/40 rounded-xl p-6">
                      <p className="text-lg leading-relaxed text-foreground">
                        {t.landing.overlay.motivation.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Heart className="w-4 h-4 text-pink-600"/>
                      <span>
                        {t.hero.encouragement} • {t.hero.relatedTo}: run, read
                      </span>
                    </div>
                  </div>)}

                {activeFloatingCard === "advice" && (<div className="space-y-4">
                    <p className="text-muted-foreground mb-4">
                      {t.hero.greatConsistency}
                    </p>
                    {[
                    {
                        priority: "High",
                        advice: t.landing.overlay.advice.highPriority,
                        color: "red",
                    },
                    {
                        priority: "Medium",
                        advice: t.landing.overlay.advice.mediumPriority,
                        color: "yellow",
                    },
                    { priority: "Low", advice: t.landing.overlay.advice.lowPriority, color: "green" },
                ].map((item, i) => (<Card key={i} className={`p-4 border-l-4 ${item.color === "red"
                        ? "border-l-red-500"
                        : item.color === "yellow"
                            ? "border-l-yellow-500"
                            : "border-l-green-500"}`}>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary" className={item.color === "red"
                        ? "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-200"
                        : item.color === "yellow"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-200"
                            : "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-200"}>
                            {item.priority} {t.hero.priority}
                          </Badge>
                        </div>
                        <p className="text-foreground font-medium">{item.advice}</p>
                      </Card>))}
                  </div>)}
              </div>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>

      <DemoModal open={isDemoOpen} onOpenChange={setIsDemoOpen}/>
    </>);
}
