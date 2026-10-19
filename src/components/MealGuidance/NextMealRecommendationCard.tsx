import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QATAR_HEALTHY_MEALS, DUMMY_QATAR_FOOD_PROVIDERS } from '../../data/qatarKitchens';
import { NextMealSuggestion, QatarFoodProvider, KitchenMealItem } from '../../types';
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
  ChevronUp,
  Info,
  Calendar,
  AlertCircle,
  Layers,
  Flame,
  Beaker,
  ShieldCheck,
  Truck,
  Repeat,
  Store,
  AlertTriangle,
  PhoneCall,
  Zap,
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
    openOrderModalForMeal,
    todaySugarIntake,
    remainingSugarBudget,
    userProfile,
    foodProviders,
    autoMealOrderConfig,
    updateAutoMealOrderConfig,
    triggerAutoMealOrderNow,
    isHighSugarAlarmOpen,
    setIsHighSugarAlarmOpen,
  } = useApp();

  const l = lang === 'ar' ? 'ar' : 'en';

  const [copiedScript, setCopiedScript] = useState(false);
  const [isEditingGlucose, setIsEditingGlucose] = useState(false);
  const [customGlucoseInput, setCustomGlucoseInput] = useState(String(currentSugarLevel));
  const [justLoggedSuccess, setJustLoggedSuccess] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [showAutoSettings, setShowAutoSettings] = useState(false);
  const [justTriggeredAutoOrder, setJustTriggeredAutoOrder] = useState(false);

  // Combine primary suggestion + alternatives into a selectable list
  const allMealOptions: NextMealSuggestion[] = [
    nextMealPlan.primarySuggestion,
    ...(nextMealPlan.alternativeSuggestions || []),
  ];

  const activeSuggestion = allMealOptions[selectedOptionIndex] || nextMealPlan.primarySuggestion;

  // Best matching partner kitchen dish for 1-click ordering
  const matchedKitchenMeal: KitchenMealItem = (activeSuggestion.kitchenMealId
    ? QATAR_HEALTHY_MEALS.find((m) => m.id === activeSuggestion.kitchenMealId)
    : undefined) || QATAR_HEALTHY_MEALS.find((m) => m.sugarGrams <= 2) || QATAR_HEALTHY_MEALS[0];

  // Quick glucose updates
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

  // 1-Click "I Ate This Meal"
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

  // Trigger test auto-order
  const handleTestAutoOrder = () => {
    triggerAutoMealOrderNow(activeSuggestion.targetMealType);
    setJustTriggeredAutoOrder(true);
    setTimeout(() => setJustTriggeredAutoOrder(false), 4000);
  };

  const isHighGlucose = currentSugarLevel >= 180;
  const isModerateHigh = currentSugarLevel > 135 && currentSugarLevel < 180;
  const isOptimal = currentSugarLevel >= 80 && currentSugarLevel <= 135;
  const isLow = currentSugarLevel < 80;

  const analysis = nextMealPlan.historicalAnalysis;

  // Meal timing estimate
  const currentHour = new Date().getHours();
  const mealSlotName =
    currentHour >= 5 && currentHour < 11
      ? lang === 'ar' ? 'وجبة الإفطار (7:00 - 10:00 ص)' : 'Breakfast Window (7:00 - 10:00 AM)'
      : currentHour >= 11 && currentHour < 16
      ? lang === 'ar' ? 'وجبة الغداء (12:30 - 2:30 م)' : 'Lunch Window (12:30 - 2:30 PM)'
      : currentHour >= 16 && currentHour < 21
      ? lang === 'ar' ? 'وجبة العشاء (7:00 - 9:00 م)' : 'Dinner Window (7:00 - 9:00 PM)'
      : lang === 'ar' ? 'وجبة خفيفة منخفضة السكر' : 'Low-Sugar Snack Window';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5">
      
      {/* 1. HEALTH MONITOR: PERSISTENT HIGH SUGAR ALARM TO CLINIC / DOCTOR */}
      {isHighGlucose && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/90 via-rose-900/80 to-slate-950 border-2 border-rose-500 shadow-xl shadow-rose-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-950">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                  {lang === 'ar' ? 'إنذار طبي: السكر مرتفع ومستمر' : 'HIGH GLUCOSE CLINICAL ALARM'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500 text-white">
                  {formatGlucose(currentSugarLevel)}
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium mt-0.5">
                {lang === 'ar'
                  ? `سكر الدم مرتفع (${formatGlucose(currentSugarLevel)}). راجع عيادتك المسجلة (${userProfile.healthCenter || 'مركز السد الصحي'}) وتناول وجبة منخفضة السكر في موعدها.`
                  : `Blood sugar is persistently high (${formatGlucose(currentSugarLevel)}). Contact your clinic doctor and consume on-time low-sugar meals.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHighSugarAlarmOpen(true)}
            className="px-4 py-2 rounded-xl bg-white text-rose-950 font-black text-xs hover:bg-rose-100 shadow-md active:scale-95 transition-all shrink-0 flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-700" />
            <span>{lang === 'ar' ? 'عرض العيادة والطبيب' : 'View Clinic & Doctor'}</span>
          </button>
        </div>
      )}

      {/* 2. ON-TIME MEAL SCHEDULE & TIMING STRIP */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-white">
            {lang === 'ar' ? 'موعد الوجبة القادمة:' : 'On-Time Meal Schedule:'}
          </span>
          <span className="text-emerald-400 font-semibold">{mealSlotName}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            {lang === 'ar' ? 'وجبة منخفضة السكر (0-3غ)' : 'Low-Sugar Guarantee (0-3g)'}
          </span>
          <span className="text-slate-400 text-[11px]">
            {lang === 'ar' ? 'تصل في ~25 دقيقة' : 'Arrives in ~25m'}
          </span>
        </div>
      </div>

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
            onClick={() => setShowAutoSettings(!showAutoSettings)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border ${
              autoMealOrderConfig.enabled
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {autoMealOrderConfig.enabled
                ? lang === 'ar' ? 'الأتمتة مفعلة ✓' : 'Auto-Order Active ✓'
                : lang === 'ar' ? 'أتمتة طلب الوجبة' : 'Automate Orders'}
            </span>
            {showAutoSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={onOpenMealLogger}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '📸 صور أو سجل وجبة' : '📸 Snap / Log Meal'}</span>
          </button>
        </div>
      </div>

      {/* 3. AUTOMATION SETTINGS ACCORDION */}
      {showAutoSettings && (
        <div className="p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Repeat className="w-4 h-4 text-emerald-400" />
                {lang === 'ar' ? 'أتمتة طلب الوجبات الصحية في موعدها' : 'Automate On-Time Low-Sugar Deliveries'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar'
                  ? 'يضمن وصول وجبتك المنخفضة السكر في الموعد المحدد دون تأخير أو نسيان'
                  : 'Ensures recommended diabetic-friendly meals arrive right on time for your meal schedule'}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoMealOrderConfig.enabled}
                onChange={(e) => updateAutoMealOrderConfig({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Provider selector for automated orders */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-300 block">
              {lang === 'ar' ? 'مزود التوصيل المفضل في قطر:' : 'Preferred Qatar Food Provider:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {foodProviders.map((provider) => {
                const isSelected = autoMealOrderConfig.preferredProviderId === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => updateAutoMealOrderConfig({ preferredProviderId: provider.id })}
                    className={`p-2 rounded-xl border text-xs text-left rtl:text-right flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 font-bold text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{provider.name[l]}</span>
                    {isSelected && <span className="text-emerald-400 text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <span className="text-slate-400 block mb-1">
                {lang === 'ar' ? 'موعد الغداء اليومي:' : 'Daily Lunch Schedule:'}
              </span>
              <input
                type="time"
                value={autoMealOrderConfig.lunchTime}
                onChange={(e) => updateAutoMealOrderConfig({ lunchTime: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">
                {lang === 'ar' ? 'موعد العشاء اليومي:' : 'Daily Dinner Schedule:'}
              </span>
              <input
                type="time"
                value={autoMealOrderConfig.dinnerTime}
                onChange={(e) => updateAutoMealOrderConfig({ dinnerTime: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">
              {autoMealOrderConfig.lastAutoOrderedAt
                ? `${lang === 'ar' ? 'آخر طلب آلي:' : 'Last auto-order:'} ${new Date(autoMealOrderConfig.lastAutoOrderedAt).toLocaleTimeString()}`
                : lang === 'ar' ? 'جاهز لجدولة الوجبات في موعدها' : 'Ready for scheduled on-time delivery'}
            </span>

            <button
              onClick={handleTestAutoOrder}
              disabled={justTriggeredAutoOrder}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shadow-md"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                {justTriggeredAutoOrder
                  ? lang === 'ar' ? 'تم إرسال الطلب الآلي!' : 'Auto-Order Sent!'
                  : lang === 'ar' ? 'اختبار الطلب الآلي الآن' : 'Trigger Automated Order Now'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* HISTORICAL CLINICAL DATA SYNTHESIS STRIP */}
      <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-300">
              {lang === 'ar' ? 'تحليل التاريخ السريري لليوم:' : 'Today’s Clinical Context:'}
            </span>
            <span className="text-slate-400">
              {analysis.todayMealsCount} {lang === 'ar' ? 'وجبات مسجلة' : 'meals logged'} • {todaySugarIntake}g {lang === 'ar' ? 'سكر مستهلك' : 'sugar taken'}
            </span>
          </div>

          {/* Blood Glucose Badge with Quick Edit */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">{lang === 'ar' ? 'آخر سكر دم:' : 'Last Glucose:'}</span>
            {isEditingGlucose ? (
              <form onSubmit={handleCustomGlucoseSubmit} className="flex items-center gap-1">
                <input
                  type="number"
                  value={customGlucoseInput}
                  onChange={(e) => setCustomGlucoseInput(e.target.value)}
                  className="w-16 px-1.5 py-0.5 rounded bg-slate-900 border border-emerald-500 text-white text-xs font-mono font-bold"
                  autoFocus
                />
                <button type="submit" className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                  ✓
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingGlucose(true)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-mono transition-transform active:scale-95 ${
                  isHighGlucose
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : isModerateHigh
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : isLow
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
                title="Click to modify your last blood sugar reading"
              >
                {formatGlucose(currentSugarLevel)} ✏️
              </button>
            )}
          </div>
        </div>

        {/* Quick glucose simulation chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-900 text-[11px]">
          <span className="text-slate-400">{lang === 'ar' ? 'جرّب سيناريو سكر الدم:' : 'Simulate Glucose:'}</span>
          {[
            { val: 195, label: lang === 'ar' ? 'مرتفع جداً (195 إنذار)' : 'High (195 Alarm)', color: 'text-rose-400 hover:bg-rose-950/40' },
            { val: 165, label: lang === 'ar' ? 'مرتفع (165)' : 'High (165)', color: 'text-amber-400 hover:bg-amber-950/40' },
            { val: 110, label: lang === 'ar' ? 'مثالي (110)' : 'Optimal (110)', color: 'text-emerald-400 hover:bg-emerald-950/40' },
            { val: 72, label: lang === 'ar' ? 'هبوط (72)' : 'Low (72)', color: 'text-blue-400 hover:bg-blue-950/40' },
          ].map((chip) => (
            <button
              key={chip.val}
              type="button"
              onClick={() => handleQuickGlucoseSelect(chip.val)}
              className={`px-2 py-0.5 rounded border border-slate-800 font-mono text-[10px] transition-colors ${chip.color}`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MULTI-OPTION MEAL SELECTOR TABS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            {lang === 'ar' ? 'الخيارات الصحية المقترحة لوجبتك القادمة:' : 'Select Your Personalized Next-Meal Option:'}
          </span>
          <span className="text-[11px] text-emerald-400 font-mono font-bold">
            {selectedOptionIndex + 1} / {allMealOptions.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {allMealOptions.map((opt, idx) => {
            const isSelected = idx === selectedOptionIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedOptionIndex(idx)}
                className={`p-3 rounded-2xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-500 shadow-lg ring-2 ring-emerald-500/20'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {opt.optionLabel?.[l] || opt.badge?.[l] || (lang === 'ar' ? `الخيار ${idx + 1}` : `Option ${idx + 1}`)}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {opt.sugarGrams}g sugar
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">
                    {opt.dishName[l]}
                  </h4>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{opt.targetMealType.toUpperCase()}</span>
                  <span className="font-bold text-emerald-400">{opt.calories} kcal</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. ACTIVE SELECTED MEAL CARD DETAILS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        
        {/* DISH HERO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
          <div className="flex items-center gap-3">
            <img
              src={activeSuggestion.imageUrl}
              alt={activeSuggestion.dishName[l]}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-800 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  {activeSuggestion.targetMealType.toUpperCase()} RECOMMENDATION
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  Low-GI
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white mt-0.5">
                {activeSuggestion.dishName[l]}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeSuggestion.sugarGrams}g Total Sugar • {activeSuggestion.addedSugarGrams}g Added
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
                {lang === 'ar' ? 'السعر التقديري' : 'Estimated Price'}
              </span>
              <span className="text-lg font-black text-emerald-400">
                {activeSuggestion.priceQAR} QAR
              </span>
            </div>
          )}
        </div>

        {/* CLINICAL RATIONALE */}
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

        {/* 6. PRIMARY ACTION BUTTONS: ORDER RECOMMENDED FOOD OR LOG */}
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

          {/* Button 2: Option to Order the Recommended Food on Time via Qatar Food Providers */}
          {matchedKitchenMeal && (
            <button
              type="button"
              onClick={() => openOrderModalForMeal(matchedKitchenMeal)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? `طلب الوجبة الموصى بها في موعدها (${matchedKitchenMeal.deliveryKitchenName.ar.split('(')[0]})`
                  : `Order Recommended Food on Time (${matchedKitchenMeal.deliveryKitchenName.en.split('(')[0]})`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
