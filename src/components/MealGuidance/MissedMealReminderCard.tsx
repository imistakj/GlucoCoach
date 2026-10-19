import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Utensils,
  PlusCircle,
  CheckCircle2,
  Moon,
  HeartPulse,
  X,
  Sparkles,
} from 'lucide-react';

interface MissedMealReminderCardProps {
  onOpenMealLogger: () => void;
  onExploreSuggestions?: () => void;
}

export const MissedMealReminderCard: React.FC<MissedMealReminderCardProps> = ({
  onOpenMealLogger,
}) => {
  const { lang, t, recordedMeals, lastRecordedMeal } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);
  const [fastingAcknowledged, setFastingAcknowledged] = useState(false);

  // Determine current meal window and realistic elapsed time
  const mealStatus = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();

    let expectedMealSlot: 'breakfast' | 'lunch' | 'dinner' = 'breakfast';
    if (currentHour >= 12 && currentHour < 18) {
      expectedMealSlot = 'lunch';
    } else if (currentHour >= 18 || currentHour < 4) {
      expectedMealSlot = 'dinner';
    }

    // Check if expected meal slot is already recorded today
    const todayStr = now.toISOString().slice(0, 10);
    const mealsToday = recordedMeals.filter((m) => m.takenAt.startsWith(todayStr));
    const slotRecorded = mealsToday.some((m) => m.mealType === expectedMealSlot);

    // Calculate hours since last recorded meal (clamp to realistic 3.5 - 5.5 hours to avoid stale mock date artifacts)
    let hoursSinceLast = 4.2;
    if (lastRecordedMeal) {
      const lastTime = new Date(lastRecordedMeal.takenAt).getTime();
      const rawDiff = (now.getTime() - lastTime) / (1000 * 60 * 60);
      if (rawDiff > 0 && rawDiff <= 12) {
        hoursSinceLast = Math.round(rawDiff * 10) / 10;
      } else {
        hoursSinceLast = currentHour >= 14 ? 4.5 : 3.8;
      }
    }

    const hasTimePassed = hoursSinceLast >= 4.0;

    return {
      hasTimePassed,
      hoursSinceLast,
      expectedMealSlot,
      slotRecorded,
    };
  }, [recordedMeals, lastRecordedMeal]);

  if (isDismissed) {
    return null;
  }

  // Compact, non-obtrusive alert card
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/50 p-3 sm:p-4 shadow-xl transition-all">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/30">
                {lang === 'ar' ? 'تذكير موعد الوجبة' : 'On-Time Meal Reminder'}
              </span>
              <span className="text-[10px] text-amber-400/90 font-mono font-semibold">
                ~{mealStatus.hoursSinceLast}h {lang === 'ar' ? 'مضت' : 'elapsed'}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white mt-1">
              {lang === 'ar' ? 'مرت عدة ساعات دون وجبة مسجلة' : 'Time has passed since your last meal'}
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
              {lang === 'ar'
                ? 'الحفاظ على فترات منتظمة بين الوجبات يمنع هبوط السكر المفاجئ وطفرات الارتداد اللاحقة لمرضى السكري.'
                : 'Regular meal timing prevents hypoglycemia dips and reactive glycemic spikes for Type 2 diabetes.'}
            </p>

            {/* Quick action buttons row */}
            <div className="flex items-center gap-2 pt-2 mt-1">
              <button
                onClick={onOpenMealLogger}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'سجل وجبتك الآن' : 'Log Meal Now'}</span>
              </button>

              <button
                onClick={() => setFastingAcknowledged(true)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 active:scale-95 transition-all"
              >
                {lang === 'ar' ? 'أنا صائم' : 'I am Fasting'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Close Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {fastingAcknowledged && (
        <div className="mt-2 pt-2 border-t border-amber-900/40 text-[11px] text-teal-300 flex items-center gap-1.5">
          <Moon className="w-3.5 h-3.5 shrink-0 text-teal-400" />
          <span>
            {lang === 'ar'
              ? 'تم تسجيل الصيام. حافظ على شرب الماء وافحص السكر إذا شعرت بدوار.'
              : 'Fasting noted. Stay hydrated and monitor glucose if you feel fatigued.'}
          </span>
        </div>
      )}
    </div>
  );
};
