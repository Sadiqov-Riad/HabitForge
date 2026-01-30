import { useState } from 'react';
import { Check, ArrowLeft, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { useNavigate } from 'react-router-dom';
function SimpleSwitch({ checked, onCheckedChange }: {
    checked: boolean;
    onCheckedChange: (c: boolean) => void;
}) {
    const { t } = useLanguage();
    return (<div className="bg-muted p-1 rounded-lg flex items-center justify-center relative isolate">
      <motion.div className="absolute inset-y-1 rounded-md bg-background shadow" layoutId="active-pill" transition={{ type: "spring", stiffness: 300, damping: 30 }} initial={false} animate={{
            left: checked ? '50%' : '4px',
            right: checked ? '4px' : '50%',
        }}/>
      <button onClick={() => onCheckedChange(false)} className={`relative z-10 px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 w-24 ${!checked ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
        {t.subscription.monthly}
      </button>
      <button onClick={() => onCheckedChange(true)} className={`relative z-10 px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 w-24 ${checked ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
        {t.subscription.yearly}
      </button>
    </div>);
}
export default function SubscriptionPlanPage() {
    const [isYearly, setIsYearly] = useState(false);
    const { t } = useLanguage();
    const navigate = useNavigate();
    const plans = [
        {
            name: t.subscription.basic.name,
            price: t.subscription.basic.price,
            period: t.subscription.basic.period,
            description: t.subscription.basic.description,
            features: [
                t.subscription.feat.limited,
                t.subscription.feat.basicSupport,
                t.subscription.feat.weeklyBlogs,
                t.subscription.feat.drive,
                t.subscription.feat.allFramework,
            ],
            buttonText: t.subscription.basic.button,
            popular: false,
            locked: false,
        },
        {
            name: t.subscription.standard.name,
            price: isYearly ? "$200" : t.subscription.standard.price,
            period: isYearly ? t.subscription.yearly.toLowerCase() : t.subscription.standard.period,
            description: t.subscription.standard.description,
            features: [
                t.subscription.feat.limited,
                t.subscription.feat.basicSupport,
                t.subscription.feat.weeklyBlogs,
                t.subscription.feat.drive,
                t.subscription.feat.allFramework,
            ],
            buttonText: t.subscription.standard.button,
            popular: true,
            locked: true,
        },
        {
            name: t.subscription.premium.name,
            price: t.subscription.premium.price,
            period: t.subscription.premium.period,
            description: t.subscription.premium.description,
            features: [
                t.subscription.feat.limited,
                t.subscription.feat.basicSupport,
                t.subscription.feat.weeklyBlogs,
                t.subscription.feat.drive,
                t.subscription.feat.allFramework,
            ],
            buttonText: t.subscription.premium.button,
            popular: false,
            locked: true,
        },
    ];
    return (<div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
       
       <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse"/>
       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"/>

       <Button variant="ghost" size="icon" className="absolute top-4 left-4 sm:top-8 sm:left-8 hover:bg-muted/50" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-6 w-6"/>
      </Button>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8 text-center tracking-tight">
          {t.subscription.title}
        </h1>
        
        <div className="flex items-center justify-center gap-4 mt-6">
          <SimpleSwitch checked={isYearly} onCheckedChange={setIsYearly}/>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full relative z-10">
        {plans.map((plan, index) => (<motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }} whileHover={plan.locked ? {} : { y: -5 }} className="flex relative">
            {plan.locked && (<div className="absolute inset-0 z-20 overflow-hidden rounded-xl">
                    <div className="w-full h-full bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-muted-foreground/30 rounded-xl">
                        <div className="bg-muted rounded-full p-4 mb-4 shadow-sm">
                            <Lock className="h-8 w-8 text-muted-foreground"/>
                        </div>
                        <p className="font-semibold text-lg text-foreground">Coming Soon</p>
                        <p className="text-sm text-muted-foreground mt-2">This plan is currently unavailable.</p>
                    </div>
                </div>)}
            <Card className={`h-full flex flex-col w-full relative transition-all duration-300 ${plan.popular
                ? 'border-purple-500/50 ring-1 ring-purple-500/20 shadow-lg shadow-purple-500/10'
                : 'hover:border-purple-200 dark:hover:border-purple-900'} ${plan.locked ? 'opacity-40 select-none grayscale-[0.5]' : ''}`}>
              <CardHeader>
                <CardTitle className="text-xl font-normal text-muted-foreground mb-2 flex justify-between items-center">
                  {plan.name}
                  {plan.popular && (<span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                        Most Popular
                      </span>)}
                </CardTitle>
                <div className="mt-4 flex items-baseline gap-1">
                  <AnimatePresence mode="wait">
                      <motion.span key={plan.price} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="text-5xl font-bold text-foreground tracking-tight">
                        {plan.price}
                      </motion.span>
                  </AnimatePresence>
                  {plan.price !== "Free" && (<span className="text-muted-foreground ml-1">/{plan.period === t.subscription.yearly.toLowerCase() ? 'year' : 'mo'}</span>)}
                </div>
                <CardDescription className="text-sm mt-1 mb-4">
                  
                  {plan.period === t.subscription.yearly.toLowerCase() && plan.price !== "Free" ? "Billed yearly" : "Billed monthly"}
                </CardDescription>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 min-h-[48px]">
                  {plan.description}
                </p>
                <Button disabled={plan.locked} className={`w-full transition-all duration-300 ${plan.popular
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-md shadow-indigo-500/20'
                : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                   {plan.locked ? (<span className="flex items-center gap-2"><Lock className="w-4 h-4"/> Locked</span>) : plan.buttonText}
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="relative">
                    <div className="absolute inset-x-0 top-0 flex items-center justify-center">
                        <span className="bg-background px-2 text-xs text-muted-foreground uppercase tracking-wider">{t.subscription.features}</span>
                    </div>
                    <div className="border-t border-border mt-3 mb-6"></div>
                </div>

                <ul className="space-y-4 mt-6">
                  {plan.features.map((feature, i) => (<li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className={`rounded-full border p-0.5 mt-0.5 ${plan.popular ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20' : 'border-zinc-300 dark:border-zinc-700'}`}>
                        <Check className={`h-3 w-3 ${plan.popular ? 'text-purple-600 dark:text-purple-400' : 'text-foreground'}`}/>
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </li>))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>))}
      </div>
    </div>);
}
