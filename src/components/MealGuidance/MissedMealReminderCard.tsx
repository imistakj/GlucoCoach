import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  AlertCircle,
  Utensils,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Moon,
  ChefHat,
  HeartPulse,
  Info,
} from 'lucide-react';

interface MissedMealReminderCardProps {
  onOpenMealLogger: () => void;
  onExploreSuggestions?: () => void;
}

export const MissedMealReminderCard: React.FC<MissedMealReminderCardProps> = ({
  onOpenMealLogger,
  onExploreSuggestions,
}) => {
  const { lang, t, recordedMeals, lastRecordedMeal } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);
  const [fastingAcknowledged, setFastingAcknowledged] = useState(false);
  const [simulateElapsed, setSimulateElapsed] = useState(false);

  // Determine current meal window and elapsed time
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

    // Calculate hours since last recorded meal
    let hoursSinceLast = 0;
    if (lastRecordedMeal) {
      const lastTime = new Date(lastRecordedMeal.takenAt).getTime();
      hoursSinceLast = Math.max(0, (now.getTime() - lastTime) / (1000 * 60 * 60));
    } else {
      hoursSinceLast = 6; // No meals recorded yet
    }

    if (simulateElapsed) {
      hoursSinceLast = 5.5;
    }

    // Threshold: time has passed if > 4.5 hours or if it is past normal meal time without recording
    const isPastMealTime =
      (expectedMealSlot === 'breakfast' && currentHour >= 10 && !slotRecorded) ||
      (expectedMealSlot === 'lunch' && currentHour >= 14 && !slotRecorded) ||
      (expectedMealSlot === 'dinner' && currentHour >= 21 && !slotRecorded);

    const hasTimePassed = hoursSinceLast >= 4.5 || isPastMealTime || simulateElapsed;

    return {
      hasTimePassed,
      hoursSinceLast: Math.round(hoursSinceLast * 10) / 10,
      expectedMealSlot,
      slotRecorded,
    };
  }, [recordedMeals, lastRecordedMeal, simulateElapsed]);

  if (isDismissed && !simulateElapsed) {
    return null;
  }

  // If time has not passed and not simulating, show a compact reassurance bar with simulation test toggle
  if (!mealStatus.hasTimePassed) {
    return (
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            {lang === 'ar'
              ? `وجبتك الأخيرة مسجلة (${lastRecordedMeal?.name || 'مؤخراً'}) • توقيت التغذية ممتاز`
              : `Last meal logged (${lastRecordedMeal?.name || 'recently'}) • Regular meal timing`}
          </span>
        </div>
        <button
          onClick={() => setSimulateElapsed(true)}
          className="text-[10px] text-slate-400 hover:text-emerald-400 underline font-mono shrink-0"
          title="Simulate 5+ hours without a meal for Type 2 diabetes testing"
        >
          {lang === 'ar' ? 'اختبار تذكير الوجبة المتأخرة' : 'Test Missed Meal Alert'}
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border-2 border-amber-500/60 p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-950">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                {lang === 'ar'
                  ? 'تنبيه توقيت الوجبة • السكري من النوع الثاني'
                  : 'Meal Timing Check • Type 2 Diabetes'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {mealStatus.hoursSinceLast > 0 && `~${mealStatus.hoursSinceLast}h elapsed`}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              {t.missedMealTitle}
            </h3>

            {/* Trilingual Subtitle for high cultural resonance */}
            <p className="text-xs text-amber-200/90 mt-1 max-w-2xl leading-relaxed">
              {t.missedMealDesc}
            </p>
          </div>
        </div>

        {/* Test Reset / Dismiss */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          {simulateElapsed && (
            <button
              onClick={() => setSimulateElapsed(false)}
              className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] font-mono"
            >
              Reset Test
            </button>
          )}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
            title="Dismiss reminder"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Clinical Diabetes Context Alert */}
      <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-900/40 flex items-start gap-2.5 text-xs text-slate-300">
        <HeartPulse className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-white block">
            {lang === 'ar'
              ? 'أهمية انتظام الوجبات لمرضى السكري في قطر:'
              : 'Why Regular Meal Timing Matters for Type 2 Diabetes:'}
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'الامتناع المطول عن الأكل مع أدوية السكري (مثل الميتفورمين أو الإنسولين) قد يؤدي إلى هبوط حاد ومفاجئ، يليه إفراط في النشويات لاحقاً. يفضل تناول وجبة متوازنة غنية بالألياف والبروتين.'
              : 'Skipping meals while on diabetes medications increases the risk of reactive hypoglycemia and subsequent evening overeating. Consistent portions maintain insulin sensitivity.'}
          </p>
        </div>
      </div>

      {/* Fasting Acknowledged State */}
      {fastingAcknowledged ? (
        <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-800/60 text-xs text-teal-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-teal-400" />
            <span>
              {lang === 'ar'
                ? 'تم تسجيل الصيام / تخطي الوجبة. احرص على شرب الماء ومراقبة أعراض الهبوط.'
                : 'Fasting noted. Remember to stay hydrated and monitor blood glucose levels.'}
            </span>
          </div>
          <button
            onClick={() => setFastingAcknowledged(false)}
            className="text-[10px] underline text-teal-300 hover:text-white"
          >
            {lang === 'ar' ? 'تغيير' : 'Change'}
          </button>
        </div>
      ) : (
        /* Action Buttons */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Action 1: Yes, I ate - Record it */}
          <button
            onClick={onOpenMealLogger}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.missedMealYesRecord}</span>
          </button>

          {/* Action 2: Not yet - Suggest Healthy Meal */}
          <button
            onClick={() => {
              if (onExploreSuggestions) onExploreSuggestions();
              // Scroll gently to Next Meal suggestion card
              const el = document.getElementById('next-meal-card-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span>{t.missedMealNotYetSuggest}</span>
          </button>

          {/* Action 3: Fasting / Skipped */}
          <button
            onClick={() => setFastingAcknowledged(true)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Moon className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.missedMealFasting}</span>
          </button>
        </div>
      )}
    </div>
  );
};
