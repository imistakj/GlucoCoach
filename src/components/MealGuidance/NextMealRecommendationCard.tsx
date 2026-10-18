import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QATAR_HEALTHY_MEALS } from '../../data/qatarKitchens';
import { NextMealSuggestion } from '../../types';
import {
  Sparkles,
  ChefHat,
  ShoppingBag,
  CheckCircle2,
  Copy,
  Check,
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
  Layers,
  Flame,
  Beaker,
  ShieldCheck,
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
    recordedMeals,
    recordMeal,
    lastRecordedMeal,
    currentSugarLevel,
    setCurrentSugarLevel,
    nextMealPlan,
    nextMealSuggestion,
    openOrderModalForMeal,
    todaySugarIntake,
    remainingSugarBudget,
    userProfile,
  } = useApp();

  const l = lang === 'ar' ? 'ar' : 'en';

  const [copiedScript, setCopiedScript] = useState(false);
  const [isEditingGlucose, setIsEditingGlucose] = useState(false);
  const [customGlucoseInput, setCustomGlucoseInput] = useState(String(currentSugarLevel));
  const [justLoggedSuccess, setJustLoggedSuccess] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);

  // Combine primary suggestion + alternatives into a selectable list
  const allMealOptions: NextMealSuggestion[] = [
    nextMealPlan.primarySuggestion,
    ...(nextMealPlan.alternativeSuggestions || []),
  ];

  const activeSuggestion = allMealOptions[selectedOptionIndex] || nextMealPlan.primarySuggestion;

  const matchedKitchenMeal = activeSuggestion.kitchenMealId
    ? QATAR_HEALTHY_MEALS.find((m) => m.id === activeSuggestion.kitchenMealId)
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
    recordMeal({
      name: activeSuggestion.dishName.en,
      nameAr: activeSuggestion.dishName.ar,
      mealType: activeSuggestion.targetMealType,
      sugarGrams: activeSuggestion.sugarGrams,
      addedSugarGrams: activeSuggestion.addedSugarGrams,
      carbsGrams: activeSuggestion.carbsGrams,
      proteinGrams: activeSuggestion.proteinGrams,
      calories: activeSuggestion.calories,
      spikeRisk: 'LOW',
      imageUrl: activeSuggestion.imageUrl,
      source: 'quick_log',
      notes: `Logged from GlucoCoach adaptive protocol for ${activeSuggestion.targetMealType}`,
    });

    setJustLoggedSuccess(true);
    setTimeout(() => {
      setJustLoggedSuccess(false);
    }, 3500);
  };

  const isHighGlucose = currentSugarLevel > 135;
  const isOptimal = currentSugarLevel >= 80 && currentSugarLevel <= 135;
  const isLow = currentSugarLevel < 80;

  const analysis = nextMealPlan.historicalAnalysis;

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
                {lang === 'ar' ? 'نظام الاقتراح التكيفي القائم على التاريخ السريري' : 'Historical Data & Glycemic AI Engine'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {lang === 'ar' ? 'الخيارات المخصصة للوجبة القادمة' : 'Personalized Next-Meal Options'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-tight">
              {lang === 'ar'
                ? `اقتراح الوجبة القادمة بناءً على آخر قراءة (${formatGlucose(currentSugarLevel)}) وسجل وجباتك`
                : `Next Meal Options Based on Last Blood Sugar (${formatGlucose(currentSugarLevel)}) & Meal History`}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
          <button
            onClick={onOpenMealLogger}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '📸 صور أو سجل وجبة جديدة' : '📸 Snap / Log New Meal'}</span>
          </button>
        </div>
      </div>

      {/* HISTORICAL CLINICAL DATA SYNTHESIS STRIP */}
      <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-300">
              {lang === 'ar' ? 'ملخص تحليلاتك التاريخية اليوم:' : 'Your Historical Synthesis Today:'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              {recordedMeals.length} {lang === 'ar' ? 'وجبات مسجلة' : 'meals logged'}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
              {todaySugarIntake}g {lang === 'ar' ? 'سكر مستهلك' : 'sugar taken'}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              {remainingSugarBudget}g {lang === 'ar' ? 'متبقي من الميزانية' : 'allowance left'}
            </span>
          </div>
        </div>

        {/* Dynamic Clinical Insight linking historical glucose to suggestion */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
          💡 <span className="font-semibold text-white">
            {lang === 'ar' ? analysis.clinicalMessageAr : analysis.clinicalMessageEn}
          </span>
        </p>
      </div>

      {/* INPUT CONTEXT: LAST MEAL TAKEN & CURRENT SUGAR LEVEL DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* Box 1: Last Meal Taken */}
        <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" />
              {lang === 'ar' ? 'آخر وجبة مسجلة:' : 'Last Recorded Meal in History:'}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {lastRecordedMeal?.displayDate || 'Today'} • {lastRecordedMeal?.displayTime || 'Recent'}
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
                  : lastRecordedMeal?.name || 'Chicken Machboos with Yogurt'}
              </h4>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[11px] font-semibold text-emerald-400">
                  {lastRecordedMeal?.sugarGrams ?? 1.5}g sugar
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400">
                  {lastRecordedMeal?.carbsGrams ?? 32}g carbs
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
              {lang === 'ar' ? 'آخر قراءة مسجلة لسكر الدم:' : 'Last Logged Blood Sugar Level:'}
            </span>
            <button
              onClick={() => setIsEditingGlucose(!isEditingGlucose)}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
            >
              <Sliders className="w-3 h-3" />
              <span>{isEditingGlucose ? (lang === 'ar' ? 'إلغاء' : 'Cancel') : (lang === 'ar' ? 'تعديل / اختبار القراءة' : 'Test / Adjust Glucose')}</span>
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
                  ? lang === 'ar' ? 'مرتفع (بروتوكول تفريغ الكبد)' : 'Elevated (Clearance Protocol)'
                  : isLow
                  ? lang === 'ar' ? 'منخفض (بروتوكول ثبات)' : 'Borderline Low (Buffer Protocol)'
                  : lang === 'ar' ? 'مثالي ومتوازن' : 'Optimal Target (Maintenance)'}
              </span>
            </div>
          </div>

          {/* Inline quick selector / test pills */}
          {isEditingGlucose && (
            <div className="pt-2 border-t border-slate-900 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400">{lang === 'ar' ? 'اختبار قراءة سريعة:' : 'Quick Test Values:'}</span>
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

      {/* MULTIPLE PERSONALIZED MEAL OPTIONS SELECTOR (Option 1: Primary, Option 2: Local Kitchen, Option 3: Home Prep) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            {lang === 'ar' ? 'اختر الخيار الأنسب لك الآن:' : 'Select Your Preferred Personalized Option:'}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">
            {allMealOptions.length} {lang === 'ar' ? 'خيارات مخصصة' : 'personalized options generated'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {allMealOptions.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedOptionIndex(idx)}
                className={`p-3 rounded-2xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      isSelected ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      {idx === 0
                        ? (lang === 'ar' ? '⭐ الخيار السريري الأفضل' : '⭐ Clinical Primary')
                        : idx === 1
                        ? (lang === 'ar' ? '🍲 مطبخ قطري معتمد' : '🍲 Qatari Kitchen Partner')
                        : (lang === 'ar' ? '⚡ تحضير منزلي سريع' : '⚡ Quick Home Prep')}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>

                  <h5 className="text-xs font-bold text-white line-clamp-1">
                    {opt.dishName[l]}
                  </h5>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="text-emerald-300 font-semibold">{opt.sugarGrams}g sugar</span>
                  <span>•</span>
                  <span>{opt.carbsGrams}g carbs</span>
                  <span>•</span>
                  <span>{opt.proteinGrams}g protein</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SELECTED MEAL HERO CARD */}
      <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex gap-3.5 items-start">
            <img
              src={activeSuggestion.imageUrl}
              alt={activeSuggestion.dishName[l]}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-800 shadow-md"
            />
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {lang === 'ar'
                    ? `الوجبة القادمة (${
                        activeSuggestion.targetMealType === 'breakfast'
                          ? 'فطور'
                          : activeSuggestion.targetMealType === 'lunch'
                          ? 'غداء'
                          : activeSuggestion.targetMealType === 'dinner'
                          ? 'عشاء'
                          : 'سناك خفيف'
                      })`
                    : `Next ${
                        activeSuggestion.targetMealType.charAt(0).toUpperCase() +
                        activeSuggestion.targetMealType.slice(1)
                      }`}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  📍 {activeSuggestion.kitchenOrLocation[l]}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                {activeSuggestion.dishName[l]}
              </h4>

              {/* Macro Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pt-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {activeSuggestion.sugarGrams}g Sugar ({activeSuggestion.addedSugarGrams}g Added)
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  {activeSuggestion.carbsGrams}g Carbs
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  {activeSuggestion.proteinGrams}g Protein
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {activeSuggestion.calories} kcal
                </span>
              </div>
            </div>
          </div>

          {activeSuggestion.priceQAR && (
            <div className="text-left rtl:text-right shrink-0">
              <span className="text-xs font-bold text-slate-400 block">
                {lang === 'ar' ? 'السعر في قطر' : 'Estimated Price'}
              </span>
              <span className="text-lg font-black text-emerald-400">
                {activeSuggestion.priceQAR} QAR
              </span>
            </div>
          )}
        </div>

        {/* CLINICAL RATIONALE: Linking Historical Meals + Sugar Level */}
        <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-white">
              {lang === 'ar'
                ? `التعليل الطبي للوجبة بناءً على قراءتك (${formatGlucose(currentSugarLevel)}):`
                : `Clinical Rationale for Your Blood Sugar (${formatGlucose(currentSugarLevel)}):`}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeSuggestion.clinicalRationale[l]}
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
              {activeSuggestion.actionableSequencingTip[l]}
            </p>
          </div>
        </div>

        {/* WAITER / CHEF SCRIPT */}
        <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 italic">
              "{activeSuggestion.waiterScript[l]}"
            </span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(activeSuggestion.waiterScript[l]);
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
