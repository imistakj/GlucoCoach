import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QATAR_HEALTHY_MEALS } from '../../data/qatarKitchens';
import {
  Sparkles,
  ChefHat,
  ShoppingBag,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Activity,
  History,
  Clock,
  PlusCircle,
  Sliders,
  Utensils,
  ChevronDown,
  Info,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface NextMealRecommendationCardProps {
  onOpenMealLogger: () => void;
}

export const NextMealRecommendationCard: React.FC<NextMealRecommendationCardProps> = ({
  onOpenMealLogger,
}) => {
  const {
    lang,
    t,
    formatGlucose,
    unit,
    recordedMeals,
    recordMeal,
    lastRecordedMeal,
    currentSugarLevel,
    setCurrentSugarLevel,
    nextMealSuggestion,
    openOrderModalForMeal,
  } = useApp();

  const [copiedScript, setCopiedScript] = useState(false);
  const [isEditingGlucose, setIsEditingGlucose] = useState(false);
  const [customGlucoseInput, setCustomGlucoseInput] = useState(String(currentSugarLevel));
  const [justLoggedSuccess, setJustLoggedSuccess] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const matchedKitchenMeal = nextMealSuggestion.kitchenMealId
    ? QATAR_HEALTHY_MEALS.find((m) => m.id === nextMealSuggestion.kitchenMealId)
    : null;

  // Handle quick glucose updates
  const handleQuickGlucoseSelect = (val: number) => {
    setCurrentSugarLevel(val);
    setCustomGlucoseInput(String(val));
    setIsEditingGlucose(false);
  };

  const handleCustomGlucoseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(customGlucoseInput);
    if (val && !isNaN(val) && val > 30 && val < 600) {
      setCurrentSugarLevel(val);
      setIsEditingGlucose(false);
    }
  };

  // 1-Click "I Ate This Meal" (Record suggested meal as taken)
  const handleRecordSuggestedMeal = () => {
    const mealDishName =
      lang === 'ar' ? nextMealSuggestion.dishName.ar : nextMealSuggestion.dishName.en;
    recordMeal({
      name: nextMealSuggestion.dishName.en,
      nameAr: nextMealSuggestion.dishName.ar,
      mealType: nextMealSuggestion.targetMealType,
      sugarGrams: nextMealSuggestion.sugarGrams,
      addedSugarGrams: nextMealSuggestion.addedSugarGrams,
      carbsGrams: nextMealSuggestion.carbsGrams,
      proteinGrams: nextMealSuggestion.proteinGrams,
      calories: nextMealSuggestion.calories,
      spikeRisk: 'LOW',
      imageUrl: nextMealSuggestion.imageUrl,
      source: 'quick_log',
      notes: `Recommended by GlucoCoach adaptive protocol for ${nextMealSuggestion.targetMealType}`,
    });

    setJustLoggedSuccess(true);
    setTimeout(() => {
      setJustLoggedSuccess(false);
    }, 3500);
  };

  const isHighGlucose = currentSugarLevel > 135;
  const isOptimal = currentSugarLevel >= 80 && currentSugarLevel <= 135;
  const isLow = currentSugarLevel < 80;

  const todayMeals = recordedMeals.filter(
    (m) => m.displayDate === 'Today' || m.takenAt.startsWith(new Date().toISOString().slice(0, 10))
  );
  const todayTotalSugar = todayMeals.reduce((acc, m) => acc + (m.sugarGrams || 0), 0);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5">
      {/* CARD HEADER & BADGES */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center ring-2 ring-emerald-500/30 shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-400">
                {lang === 'ar' ? 'الذكاء الاصطناعي السريري التكيفي' : 'Adaptive Clinical AI'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {lang === 'ar' ? 'اقتراح الوجبة القادمة' : 'Next Meal Recommendation'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-tight">
              {lang === 'ar'
                ? 'بناءً على آخر وجبة مسجلة ومستوى السكر الحالي'
                : 'Based on Your Last Meal & Recorded Sugar Level'}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
          <button
            onClick={onOpenMealLogger}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '+ تسجيل وجبة تناولتها' : '+ Record Meal Taken'}</span>
          </button>
        </div>
      </div>

      {/* INPUT CONTEXT: LAST MEAL TAKEN & CURRENT SUGAR LEVEL DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Box 1: Last Meal Taken */}
        <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" />
              {lang === 'ar' ? 'آخر وجبة تناولتها:' : 'Last Recorded Meal:'}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {lastRecordedMeal?.displayDate} • {lastRecordedMeal?.displayTime}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {lastRecordedMeal?.imageUrl && (
              <img
                src={lastRecordedMeal.imageUrl}
                alt={lastRecordedMeal.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-800"
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate">
                {lang === 'ar' && lastRecordedMeal?.nameAr
                  ? lastRecordedMeal.nameAr
                  : lastRecordedMeal?.name || 'No Meal Logged'}
              </h4>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[11px] font-semibold text-emerald-400">
                  {lastRecordedMeal?.sugarGrams ?? 0}g sugar
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400">
                  {lastRecordedMeal?.carbsGrams ?? 0}g carbs
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    lastRecordedMeal?.spikeRisk === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : lastRecordedMeal?.spikeRisk === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {lastRecordedMeal?.spikeRisk === 'HIGH'
                    ? lang === 'ar' ? 'عالي السكر' : 'High Glycemic'
                    : lastRecordedMeal?.spikeRisk === 'MEDIUM'
                    ? lang === 'ar' ? 'متوسط' : 'Medium Glycemic'
                    : lang === 'ar' ? 'منخفض السكر' : 'Low Glycemic'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Current Recorded Sugar Level */}
        <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'ar' ? 'مستوى السكر المسجل حالياً:' : 'Current Recorded Sugar Level:'}
            </span>
            <button
              onClick={() => setIsEditingGlucose(!isEditingGlucose)}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
            >
              <Sliders className="w-3 h-3" />
              <span>{isEditingGlucose ? (lang === 'ar' ? 'إلغاء' : 'Cancel') : (lang === 'ar' ? 'تعديل / اختبار' : 'Update / Test')}</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl sm:text-3xl font-black ${
                  isHighGlucose
                    ? 'text-amber-400'
                    : isLow
                    ? 'text-cyan-400'
                    : 'text-emerald-400'
                }`}
              >
                {formatGlucose(currentSugarLevel)}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isHighGlucose
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : isLow
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {isHighGlucose
                  ? lang === 'ar' ? 'مرتفع (بروتوكول تفريغ)' : 'Elevated (Clearance)'
                  : isLow
                  ? lang === 'ar' ? 'منخفض (بروتوكول ثبات)' : 'Borderline Low (Buffer)'
                  : lang === 'ar' ? 'مثالي (بروتوكول توازن)' : 'Optimal Target'}
              </span>
            </div>
          </div>

          {/* Inline quick selector / test pills */}
          {isEditingGlucose && (
            <div className="pt-2 border-t border-slate-900 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400">{lang === 'ar' ? 'قراءات سريعة:' : 'Quick Test:'}</span>
                <button
                  type="button"
                  onClick={() => handleQuickGlucoseSelect(98)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 font-bold"
                >
                  98 mg/dL (Normal)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickGlucoseSelect(148)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-bold"
                >
                  148 mg/dL (Elevated)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickGlucoseSelect(195)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-rose-300 font-bold"
                >
                  195 mg/dL (Spike)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickGlucoseSelect(72)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-bold"
                >
                  72 mg/dL (Low)
                </button>
              </div>

              <form onSubmit={handleCustomGlucoseSubmit} className="flex gap-2">
                <input
                  type="number"
                  min="40"
                  max="500"
                  value={customGlucoseInput}
                  onChange={(e) => setCustomGlucoseInput(e.target.value)}
                  placeholder="Enter mg/dL..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  {lang === 'ar' ? 'حفظ' : 'Set'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* SUGGESTED NEXT MEAL HERO CARD */}
      <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex gap-3.5 items-start">
            <img
              src={nextMealSuggestion.imageUrl}
              alt={nextMealSuggestion.dishName[lang]}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-800 shadow-md"
            />
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {lang === 'ar'
                    ? `الوجبة القادمة الموصى بها (${
                        nextMealSuggestion.targetMealType === 'breakfast'
                          ? 'فطور'
                          : nextMealSuggestion.targetMealType === 'lunch'
                          ? 'غداء'
                          : nextMealSuggestion.targetMealType === 'dinner'
                          ? 'عشاء'
                          : 'سناك خفيف'
                      })`
                    : `Recommended Next ${
                        nextMealSuggestion.targetMealType.charAt(0).toUpperCase() +
                        nextMealSuggestion.targetMealType.slice(1)
                      }`}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  📍 {nextMealSuggestion.kitchenOrLocation[lang]}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                {nextMealSuggestion.dishName[lang]}
              </h4>

              {/* Macro Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pt-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {nextMealSuggestion.sugarGrams}g Sugar ({nextMealSuggestion.addedSugarGrams}g Added)
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  {nextMealSuggestion.carbsGrams}g Carbs
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  {nextMealSuggestion.proteinGrams}g Protein
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {nextMealSuggestion.calories} kcal
                </span>
              </div>
            </div>
          </div>

          {nextMealSuggestion.priceQAR && (
            <div className="text-left rtl:text-right shrink-0">
              <span className="text-xs font-bold text-slate-400 block">
                {lang === 'ar' ? 'السعر التقديري' : 'Provider Price'}
              </span>
              <span className="text-lg font-black text-emerald-400">
                {nextMealSuggestion.priceQAR} QAR
              </span>
            </div>
          )}
        </div>

        {/* CLINICAL RATIONALE: Linking Last Meal + Sugar Level */}
        <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-white">
              {lang === 'ar'
                ? 'التعليل الطبي للوجبة القادمة بناءً على وجبتك السابقة وقراءتك:'
                : 'Clinical Rationale (Based on Previous Meal & Sugar Level):'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {nextMealSuggestion.clinicalRationale[lang]}
          </p>
        </div>

        {/* SEQUENCING TIP */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
          <Utensils className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-emerald-300 block text-[11px] uppercase tracking-wider">
              {lang === 'ar' ? 'تسلسل تناول الوجبة لتسطيح منحنى الجلوكوز:' : 'Smart Meal Sequencing Strategy:'}
            </span>
            <p className="text-slate-300 text-xs">
              {nextMealSuggestion.actionableSequencingTip[lang]}
            </p>
          </div>
        </div>

        {/* WAITER / CHEF SCRIPT */}
        <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 italic">
              "{nextMealSuggestion.waiterScript[lang]}"
            </span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(nextMealSuggestion.waiterScript[lang]);
              setCopiedScript(true);
              setTimeout(() => setCopiedScript(false), 2000);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] flex items-center gap-1 shrink-0 self-start sm:self-auto transition-colors"
          >
            {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedScript ? t.copied : t.copyScript}</span>
          </button>
        </div>

        {/* ACTION BUTTONS: ORDER OR RECORD */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Button 1: "I Ate This Meal (Log as Taken)" */}
          <button
            type="button"
            onClick={handleRecordSuggestedMeal}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
              justLoggedSuccess
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {justLoggedSuccess
                ? lang === 'ar' ? 'تم تسجيل الوجبة بنجاح!' : 'Meal Recorded to History!'
                : lang === 'ar' ? 'سجل أنني تناولت هذه الوجبة (نقرة واحدة)' : 'I Ate This Meal (Log as Taken)'}
            </span>
          </button>

          {/* Button 2: 2-3 Clicks Food Order from Qatari Partner Kitchen */}
          {matchedKitchenMeal ? (
            <button
              type="button"
              onClick={() => openOrderModalForMeal(matchedKitchenMeal)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? `طلب الوجبة من ${matchedKitchenMeal.deliveryKitchenName.ar.split('(')[0]} (نقرتين)`
                  : `Order from ${matchedKitchenMeal.deliveryKitchenName.en.split('(')[0]} (2 Clicks)`}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenMealLogger}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تسجيل وجبة بديلة' : 'Log Alternative Meal'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
