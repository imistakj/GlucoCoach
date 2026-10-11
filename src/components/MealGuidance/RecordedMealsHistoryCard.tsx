import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecordedMeal } from '../../types';
import {
  History,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  Flame,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Truck,
  Camera,
  QrCode,
} from 'lucide-react';

interface RecordedMealsHistoryCardProps {
  onOpenMealLogger: () => void;
}

export const RecordedMealsHistoryCard: React.FC<RecordedMealsHistoryCardProps> = ({
  onOpenMealLogger,
}) => {
  const { lang, t, recordedMeals, deleteRecordedMeal, formatGlucose } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);

  // Group meals today
  const todayMeals = recordedMeals.filter(
    (m) => m.displayDate === 'Today' || m.takenAt.startsWith(new Date().toISOString().slice(0, 10))
  );

  const totalTodaySugar = Math.round(
    todayMeals.reduce((sum, m) => sum + (m.sugarGrams || 0), 0) * 10
  ) / 10;
  const totalTodayCarbs = Math.round(
    todayMeals.reduce((sum, m) => sum + (m.carbsGrams || 0), 0)
  );
  const sugarBudgetLimit = 25; // WHO guideline
  const sugarPercentage = Math.min(Math.round((totalTodaySugar / sugarBudgetLimit) * 100), 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              {lang === 'ar' ? 'سجل الوجبات المتناولة اليوم وسكر الدم' : 'Meals Taken History & Daily Sugar Log'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'ar'
                ? `تم تسجيل ${recordedMeals.length} وجبة • المجموع اليومي ${totalTodaySugar}غ سكر`
                : `${recordedMeals.length} meals recorded • ${totalTodaySugar}g total sugar today`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMealLogger}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تسجيل' : 'Log'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* TODAY'S SUGAR BUDGET METER */}
      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">
            {lang === 'ar' ? 'استهلاك السكر اليومي (الحد الموصى به: 25غ):' : "Today's Sugar Intake (WHO Limit: 25g):"}
          </span>
          <span
            className={`font-black ${
              totalTodaySugar > 25
                ? 'text-rose-400'
                : totalTodaySugar > 18
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {totalTodaySugar}g / 25g ({sugarPercentage}%)
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalTodaySugar > 25
                ? 'bg-rose-500'
                : totalTodaySugar > 18
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${sugarPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span>{todayMeals.length} {lang === 'ar' ? 'وجبات تم تسجيلها اليوم' : 'meals logged today'}</span>
          <span>{totalTodayCarbs}g {lang === 'ar' ? 'إجمالي النشويات' : 'total carbs'}</span>
        </div>
      </div>

      {/* CHRONOLOGICAL MEALS LIST */}
      {isExpanded && (
        <div className="space-y-2.5 pt-1 animate-in fade-in">
          {recordedMeals.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
              {lang === 'ar' ? 'لم يتم تسجيل أي وجبات بعد. اضغط على "+ تسجيل وجبة تناولتها" أعلاه.' : 'No meals recorded yet. Tap "+ Record Meal Taken" to start tracking!'}
            </div>
          ) : (
            recordedMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-slate-950 p-3 sm:p-3.5 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {meal.imageUrl && (
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-800"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-900 text-emerald-400 border border-emerald-500/30">
                        {meal.mealType === 'breakfast'
                          ? lang === 'ar' ? 'فطور' : 'Breakfast'
                          : meal.mealType === 'lunch'
                          ? lang === 'ar' ? 'غداء' : 'Lunch'
                          : meal.mealType === 'dinner'
                          ? lang === 'ar' ? 'عشاء' : 'Dinner'
                          : lang === 'ar' ? 'سناك' : 'Snack'}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meal.displayDate} • {meal.displayTime}
                      </span>
                      {meal.source === 'kitchen_order' && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                          <Truck className="w-3 h-3" />
                          {lang === 'ar' ? 'طلب مطبخ قطري' : 'Kitchen Order'}
                        </span>
                      )}
                      {meal.source === 'ai_photo' && (
                        <span className="text-[10px] text-teal-400 flex items-center gap-0.5">
                          <Camera className="w-3 h-3" />
                          {lang === 'ar' ? 'تحليل صورة AI' : 'AI Scanned'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white mt-1 truncate">
                      {lang === 'ar' && meal.nameAr ? meal.nameAr : meal.name}
                    </h4>

                    {/* Macros & Glycemic Impact */}
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
                      <span className="font-bold text-emerald-400">
                        {meal.sugarGrams}g sugar
                      </span>
                      <span>•</span>
                      <span>{meal.carbsGrams}g carbs</span>
                      <span>•</span>
                      <span>{meal.proteinGrams}g protein</span>
                      {meal.calories > 0 && (
                        <>
                          <span>•</span>
                          <span>{meal.calories} kcal</span>
                        </>
                      )}
                    </div>

                    {meal.notes && (
                      <p className="text-[10px] text-slate-400 italic mt-0.5 truncate">
                        "{meal.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Recorded Glucose & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-900 shrink-0">
                  {meal.glucoseAtMeal && (
                    <div className="text-right rtl:text-left">
                      <span className="text-[10px] text-slate-400 block">
                        {lang === 'ar' ? 'سكر الوجبة' : 'Meal Glucose'}
                      </span>
                      <span className="text-xs font-black text-emerald-400">
                        {formatGlucose(meal.glucoseAtMeal)}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => deleteRecordedMeal(meal.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                    title={lang === 'ar' ? 'حذف الوجبة' : 'Delete meal record'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
