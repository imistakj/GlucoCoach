import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MealDish } from '../../types';
import { QATAR_POPULAR_MEALS } from '../../data/qatarMeals';
import { QATAR_HEALTHY_MEALS } from '../../data/qatarKitchens';
import { MealDetailModal } from './MealDetailModal';
import { FoodSugarCalculatorModal } from './FoodSugarCalculatorModal';
import { QatariKitchensBrowser } from './QatariKitchensBrowser';
import { NextMealRecommendationCard } from './NextMealRecommendationCard';
import { RecordedMealsHistoryCard } from './RecordedMealsHistoryCard';
import { MealLoggerModal } from './MealLoggerModal';
import { MissedMealReminderCard } from './MissedMealReminderCard';
import { Type2DiabetesHealthQuestionsCard } from '../HeartGuard/Type2DiabetesHealthQuestionsCard';
import { SugarScienceWorkbenchModal } from './SugarScienceWorkbenchModal';
import {
  Camera,
  UploadCloud,
  Sparkles,
  Utensils,
  Zap,
  ArrowRightLeft,
  Loader2,
  CheckCircle2,
  Flame,
  Search,
  MessageSquare,
  Beaker,
  History,
  Copy,
  Check,
  X,
  ChefHat,
  ShoppingBag,
  Truck,
  Clock,
  PlusCircle,
  HeartPulse,
} from 'lucide-react';

export const MealGuidanceView: React.FC = () => {
  const {
    lang,
    t,
    formatGlucose,
    yesterdayGlucose,
    setYesterdayGlucose,
    openOrderModalForMeal,
    activeKitchenOrder,
    orders,
    isMealLoggerOpen,
    setIsMealLoggerOpen,
  } = useApp();

  const [selectedMeal, setSelectedMeal] = useState<MealDish | null>(null);
  const [isSugarCalculatorOpen, setIsSugarCalculatorOpen] = useState(false);
  const [isScienceWorkbenchOpen, setIsScienceWorkbenchOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [showT2DQuestions, setShowT2DQuestions] = useState(false);

  // Photo analysis state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [dishDescription, setDishDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzePhoto = async () => {
    if (!photoPreview && !dishDescription) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoPreview,
          mealDescription: dishDescription,
          lang,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.data) {
          const aiData = json.data;
          const analyzedDish: MealDish = {
            id: 'custom-' + Date.now(),
            name: {
              en: aiData.dishName || dishDescription || 'Custom Scanned Meal',
              ar: aiData.dishName || dishDescription || 'وجبة ممسوحة مخصصة',
            },
            category: 'traditional',
            imageUrl:
              photoPreview ||
              'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=500&q=80',
            estimatedCarbsRange: aiData.estimatedCarbsRange || '45 - 65g',
            estimatedSugarsRange: aiData.estimatedSugarsRange || '5 - 12g',
            spikeRisk: aiData.spikeRisk || 'MEDIUM',
            actionableMealFit: {
              en: aiData.actionableMealFit || 'Eat half portion of carbs and frontload with vegetables and grilled protein.',
              ar: aiData.actionableMealFit || 'تناول نصف كمية النشويات وابدأ بالخضار والبروتين المشوي لتسطيح المنحنى.',
            },
            swaps: (aiData.swaps || []).map((s: any) => ({
              original: { en: s.original, ar: s.original },
              recommendedSwap: { en: s.recommendedSwap, ar: s.recommendedSwap },
              healthBenefit: { en: s.healthBenefit, ar: s.healthBenefit },
            })),
            majlisTips: {
              en: aiData.majlisTips || 'Savor company, fill individual plate with protein first, drink sparkling water.',
              ar: aiData.majlisTips || 'املأ صحنك بالبروتين والسلطة أولاً واستمتع بالحديث مع الأهل والضيوف.',
            },
            waiterScript: {
              en: aiData.waiterScript?.en || 'Please bring extra salad and put sauce on the side.',
              ar: aiData.waiterScript?.ar || 'لو سمحت سلطة خضراء إضافية والصلصة على جنب من فضلك.',
            },
            caloriesEstimate: 540,
          };

          setIsAnalyzing(false);
          setSelectedMeal(analyzedDish);
          return;
        }
      }
    } catch (e) {
      console.warn('AI meal analysis fallback active:', e);
    }

    // High quality offline fallback
    const fallbackDish: MealDish = {
      id: 'custom-' + Date.now(),
      name: {
        en: dishDescription || 'Scanned Qatari Dining Plate',
        ar: dishDescription || 'طبق مطعم في قطر تم تحليله',
      },
      category: 'traditional',
      imageUrl:
        photoPreview ||
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
      estimatedCarbsRange: '50 - 75g',
      estimatedSugarsRange: '4 - 8g',
      spikeRisk: 'MEDIUM',
      actionableMealFit: {
        en: 'This meal fits your target if you consume 1 small bowl of carbs (rice/bread) and accompany it with double fresh Rocca or Tabbouleh salad and grilled meat.',
        ar: 'تناسب هذه الوجبة ميزانية السكر إذا حصرت النشويات بكوب واحد وأرفقتها بسلطة الجرجير أو التبولة مع البروتين المشوي.',
      },
      swaps: [
        {
          original: { en: 'Deep-fried sides or white flatbread', ar: 'المقليات أو الخبز الأبيض المكرر' },
          recommendedSwap: { en: 'Grilled spiced vegetables or wholewheat pita', ar: 'خضار مشوية متبلة أو خبز بر' },
          healthBenefit: { en: 'Delays glucose surge by 40%', ar: 'يبطئ قفزة سكر الدم بنسبة 40%' },
        },
      ],
      majlisTips: {
        en: 'In communal dining: Fill your individual small plate with protein and cucumber salad first.',
        ar: 'في الولائم المشتركة: ابدأ بملء صحنك الصغير باللحم والسلطة قبل لمس الأرز.',
      },
      waiterScript: {
        en: 'Please serve the sauce on the side and replace fries with green salad.',
        ar: 'لو سمحت الصلصة على جنب واستبدل البطاطس بسلطة خضراء من فضلك.',
      },
      caloriesEstimate: 580,
    };

    setIsAnalyzing(false);
    setSelectedMeal(fallbackDish);
  };

  const filteredMeals = QATAR_POPULAR_MEALS.filter((meal) => {
    const matchesCategory = filterCategory === 'all' || meal.category === filterCategory;
    const matchesSearch =
      meal.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.name.ar.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">
                {lang === 'ar' ? 'المطاعم • المجالس • الكافتيريات' : 'Restaurants • Majlis • Dining Out'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {t.mealTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {t.mealSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => setIsScienceWorkbenchOpen(true)}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-700/60 text-cyan-200 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Beaker className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'كيمياء السكر (PubChem)' : 'Sugar Chemistry (PubChem)'}</span>
            </button>

            <button
              onClick={() => setIsSugarCalculatorOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? 'حساب السكر من الصورة (AI)' : 'Food Photo Sugar Counter (AI)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MISSED MEAL / TIME ELAPSED REMINDER FOR TYPE 2 DIABETES */}
      <MissedMealReminderCard
        onOpenMealLogger={() => setIsMealLoggerOpen(true)}
      />

      {/* QUICK TYPE 2 DIABETES HEALTH QUESTIONS BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white">
                {lang === 'ar'
                  ? 'فحص السكري السريع (٣ أسئلة صحية)'
                  : 'Type 2 Diabetes Check (3 Quick Health Questions)'}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                T2D
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block">
              {lang === 'ar'
                ? '«كيف تشعر اليوم؟» • أعراض هبوط/ارتفاع السكر • متابعة الأدوية اليومية'
                : '"How are you feeling today?" • Blood sugar symptoms • Medication'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowT2DQuestions(!showT2DQuestions)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 ${
            showT2DQuestions
              ? 'bg-slate-800 text-slate-200 border border-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
          }`}
        >
          <span>
            {showT2DQuestions
              ? (lang === 'ar' ? 'إخفاء الأسئلة' : 'Hide Questions')
              : (lang === 'ar' ? 'إجراء الفحص الآن' : 'Take Quick Check')}
          </span>
        </button>
      </div>

      {/* Expanded Type 2 Diabetes Health Questions */}
      {showT2DQuestions && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <Type2DiabetesHealthQuestionsCard />
        </div>
      )}

      {/* NEXT MEAL RECOMMENDATION: BASED ON LAST RECORDED MEAL & SUGAR LEVEL */}
      <div id="next-meal-card-anchor">
        <NextMealRecommendationCard onOpenMealLogger={() => setIsMealLoggerOpen(true)} />
      </div>

      {/* RECORDED MEALS HISTORY & DAILY SUGAR LOG */}
      <RecordedMealsHistoryCard onOpenMealLogger={() => setIsMealLoggerOpen(true)} />

      {/* Active Food Order Status Tracker Banner (if an order was placed) */}
      {activeKitchenOrder && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border-2 border-emerald-500 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <Truck className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {lang === 'ar' ? 'متابعة الطلب المباشر' : 'Live Order Tracker'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeKitchenOrder.status === 'confirmed'
                    ? lang === 'ar' ? 'تم استلام الطلب' : 'Confirmed'
                    : activeKitchenOrder.status === 'preparing'
                    ? lang === 'ar' ? 'قيد التحضير الصحي' : 'Kitchen Preparing'
                    : lang === 'ar' ? 'في الطريق إليك' : 'Out for Delivery'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {activeKitchenOrder.meal.name[lang === 'ar' ? 'ar' : 'en']} (x{activeKitchenOrder.quantity})
              </h4>
              <p className="text-[11px] text-slate-400">
                {activeKitchenOrder.meal.deliveryKitchenName[lang === 'ar' ? 'ar' : 'en']} • {activeKitchenOrder.totalQAR} QAR • {activeKitchenOrder.estimatedDeliveryTime}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openOrderModalForMeal(activeKitchenOrder.meal)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold self-start sm:self-auto border border-slate-700"
          >
            {lang === 'ar' ? 'تفاصيل الطلب' : 'View Order Details'}
          </button>
        </div>
      )}

      {/* Snap Meal / Upload Menu Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {t.snapMealBtn}
          </h3>
          <span className="text-[11px] text-slate-400">
            {lang === 'ar' ? 'مدعوم بنموذج Gemini' : 'Powered by Gemini AI'}
          </span>
        </div>

        {/* Hidden inputs for Camera vs Gallery */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoSelect}
          className="hidden"
        />
        <input
          ref={fileUploadRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />

        {/* Both Options Available: Take Picture (Camera) AND Upload Picture (Gallery) */}
        {photoPreview ? (
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={photoPreview}
                  alt="Selected meal"
                  className="w-36 h-28 sm:w-44 sm:h-32 rounded-xl object-cover border border-slate-800 shadow-md"
                />
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 p-1 rounded-full shadow">
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                </span>
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left rtl:sm:text-right">
                <span className="text-xs font-bold text-emerald-400 flex items-center justify-center sm:justify-start rtl:sm:justify-end gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {lang === 'ar' ? 'تم اختيار صورة الطبق' : 'Plate photo attached and ready'}
                </span>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar'
                    ? 'يمكنك التقاط صورة جديدة بالكاميرا أو رفع صورة أخرى من جهازك'
                    : 'You can retake with camera or upload another image from your device.'}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start rtl:sm:justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ar' ? 'إعادة الالتقاط بالكاميرا' : 'Retake with Camera'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileUploadRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'ar' ? 'رفع صورة أخرى' : 'Upload from Device'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                    title={t.remove}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* OPTION 1: TAKE PICTURE */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border-2 border-slate-800 hover:border-emerald-500/60 transition-all text-left rtl:text-right flex items-center gap-3.5 group shadow-sm"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {lang === 'ar' ? 'التقاط صورة بالكاميرا' : 'Take Picture with Camera'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {lang === 'ar'
                    ? 'التقط صورة لطبقك الآن مباشرة'
                    : 'Snap food plate or menu in real-time'}
                </p>
              </div>
            </button>

            {/* OPTION 2: UPLOAD PICTURE */}
            <button
              type="button"
              onClick={() => fileUploadRef.current?.click()}
              className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border-2 border-slate-800 hover:border-sky-500/60 transition-all text-left rtl:text-right flex items-center gap-3.5 group shadow-sm"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
                  {lang === 'ar' ? 'رفع صورة من الجهاز' : 'Upload Picture from Device'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {lang === 'ar'
                    ? 'اختر صورة من معرض الصور أو الملفات'
                    : 'Select existing photo from device library'}
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Description & Action */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder={
              lang === 'ar'
                ? 'أو اكتب اسم الوجبة (مثلاً: مجبوس دجاج مع دقوس وكرك)...'
                : 'Or type meal name (e.g. Chicken Machboos with Daqoos & Karak)...'
            }
            value={dishDescription}
            onChange={(e) => setDishDescription(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <button
            onClick={handleAnalyzePhoto}
            disabled={isAnalyzing || (!photoPreview && !dishDescription.trim())}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تحليل الوجبة الآن' : 'Analyze Meal Now'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Qatari Local Kitchens & Food Providers Integration (Healthy Meals & 2-3 Clicks Orders) */}
      <QatariKitchensBrowser onSelectMealForOrder={openOrderModalForMeal} />

      {/* Classic Qatari Dishes Catalog */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <h3 className="font-bold text-sm text-slate-200">
            {t.orChoosePopular}
          </h3>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'ابحث عن طبق...' : 'Search dish...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 rtl:pr-9 pr-3 rtl:pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: lang === 'ar' ? 'الكل' : 'All Dishes' },
            { id: 'traditional', label: lang === 'ar' ? 'أطباق شعبية' : 'Traditional' },
            { id: 'street', label: lang === 'ar' ? 'مشاوي وشاورما' : 'Grills & Shawarma' },
            { id: 'breakfast', label: lang === 'ar' ? 'فطور' : 'Breakfast' },
            { id: 'beverage', label: lang === 'ar' ? 'كرك ومشروبات' : 'Karak & Tea' },
            { id: 'dessert', label: lang === 'ar' ? 'حلويات' : 'Desserts' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                filterCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredMeals.map((dish) => {
            const isHigh = dish.spikeRisk === 'HIGH';
            const isLow = dish.spikeRisk === 'LOW';

            return (
              <div
                key={dish.id}
                onClick={() => setSelectedMeal(dish)}
                className="cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all group flex flex-col shadow-md"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <span
                    className={`absolute bottom-2 left-2 rtl:right-2 rtl:left-auto text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isLow
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isHigh
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {dish.spikeRisk === 'LOW'
                      ? t.low
                      : dish.spikeRisk === 'MEDIUM'
                      ? t.medium
                      : t.high}
                  </span>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {dish.name[lang]}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {dish.actionableMealFit[lang]}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {t.carbs}: <strong className="text-slate-200">{dish.estimatedCarbsRange}</strong>
                    </span>
                    <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                      {t.viewDetails}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {selectedMeal && (
        <MealDetailModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}

      {isSugarCalculatorOpen && (
        <FoodSugarCalculatorModal
          onClose={() => setIsSugarCalculatorOpen(false)}
        />
      )}

      {isMealLoggerOpen && (
        <MealLoggerModal
          onClose={() => setIsMealLoggerOpen(false)}
        />
      )}

      {isScienceWorkbenchOpen && (
        <SugarScienceWorkbenchModal
          onClose={() => setIsScienceWorkbenchOpen(false)}
        />
      )}
    </div>
  );
};
