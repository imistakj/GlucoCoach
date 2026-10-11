import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealDish } from '../../types';
import {
  X,
  Flame,
  ArrowRightLeft,
  Copy,
  Check,
  Compass,
  MessageSquare,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Utensils,
} from 'lucide-react';

interface MealDetailModalProps {
  meal: MealDish | null;
  onClose: () => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({ meal, onClose }) => {
  const { lang, t, recordMeal, currentSugarLevel } = useApp();
  const [copiedScript, setCopiedScript] = useState(false);
  const [logged, setLogged] = useState(false);

  if (!meal) return null;

  const handleRecordThisMeal = () => {
    recordMeal({
      name: meal.name.en,
      nameAr: meal.name.ar,
      mealType: meal.category === 'breakfast' ? 'breakfast' : 'lunch',
      sugarGrams: 3.5,
      carbsGrams: 35,
      proteinGrams: 28,
      calories: meal.caloriesEstimate || 450,
      glucoseAtMeal: currentSugarLevel,
      glucoseTiming: 'post_meal',
      imageUrl: meal.imageUrl,
      source: 'catalog',
      notes: `Catalog dish: ${meal.actionableMealFit[lang]}`,
    });
    setLogged(true);
    setTimeout(() => setLogged(false), 3000);
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const getSpikeBadge = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'HIGH':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header Image & Title */}
        <div className="relative">
          <img
            src={meal.imageUrl}
            alt={meal.name[lang]}
            className="w-full h-44 sm:h-52 object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSpikeBadge(
                meal.spikeRisk
              )} uppercase tracking-wider`}
            >
              {meal.spikeRisk === 'LOW'
                ? t.low
                : meal.spikeRisk === 'MEDIUM'
                ? t.medium
                : t.high}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
              {meal.name[lang]}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block">{t.carbs}</span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {meal.estimatedCarbsRange}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{t.sugar}</span>
              <span className="text-xs sm:text-sm font-bold text-rose-400">
                {meal.estimatedSugarsRange}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Est. Calories</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400">
                ~{meal.caloriesEstimate} kcal
              </span>
            </div>
          </div>

          {/* Actionable Meal-Fit Guidance */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3.5 space-y-1.5">
            <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {t.actionableFitTitle}
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              {meal.actionableMealFit[lang]}
            </p>
          </div>

          {/* Culturally Tailored Swaps */}
          {meal.swaps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4" />
                {t.culturalSwapsTitle}
              </h3>
              <div className="space-y-2">
                {meal.swaps.map((swap, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-start justify-between text-xs gap-2">
                      <span className="text-slate-400 line-through">
                        {swap.original[lang]}
                      </span>
                      <span className="text-emerald-400 font-bold shrink-0">
                        → {swap.recommendedSwap[lang]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {swap.healthBenefit[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Majlis & Family Gathering Tip */}
          <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-3.5 space-y-1.5">
            <h3 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              {t.majlisNavigatorTitle}
            </h3>
            <p className="text-xs text-sky-200/90 leading-relaxed">
              {meal.majlisTips[lang]}
            </p>
          </div>

          {/* Waiter Script / Order Words */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                {t.waiterScriptTitle}
              </h3>
              <button
                onClick={() => handleCopyScript(meal.waiterScript[lang])}
                className="text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t.copyScript}</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-medium text-xs text-slate-200 italic leading-relaxed">
              "{meal.waiterScript[lang]}"
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleRecordThisMeal}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              logged
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {logged
                ? lang === 'ar' ? 'تم تسجيل الوجبة!' : 'Meal Recorded!'
                : lang === 'ar' ? 'سجل أنني تناولت هذا الطبق' : 'Record as Meal Taken'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
