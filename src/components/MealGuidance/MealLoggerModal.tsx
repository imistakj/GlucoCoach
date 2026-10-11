import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MealType } from '../../types';
import {
  X,
  Utensils,
  PlusCircle,
  Camera,
  UploadCloud,
  CheckCircle2,
  Clock,
  Activity,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';

interface MealLoggerModalProps {
  onClose: () => void;
}

const COMMON_QATAR_MEALS = [
  { name: 'Baladna Shakshouka & Wholewheat Bread', nameAr: 'شكشوكة بلدنا وخبز بر', sugar: 2.5, carbs: 20, protein: 18, cal: 320, type: 'breakfast' as MealType },
  { name: 'Grilled Hamour with Rocca Salad', nameAr: 'هامور مشوي وسلطة جرجير', sugar: 0, carbs: 4, protein: 42, cal: 340, type: 'lunch' as MealType },
  { name: 'Portion-Controlled Chicken Machboos', nameAr: 'مجبوس دجاج موزون بالزبادي', sugar: 1.5, carbs: 32, protein: 35, cal: 460, type: 'lunch' as MealType },
  { name: 'Mazzraty Grilled Shish Tawook & Tabbouleh', nameAr: 'شيش طاووق مزرعتي وتبولة', sugar: 0.8, carbs: 10, protein: 39, cal: 390, type: 'dinner' as MealType },
  { name: 'Karak Mqanes Unsweetened Tea & Almonds', nameAr: 'كرك مقناص بدون سكر ولوز', sugar: 1.2, carbs: 6, protein: 7, cal: 180, type: 'snack' as MealType },
  { name: 'Traditional Harees (Whole Grain Wheat & Veal)', nameAr: 'هريس قطري باللحم البلدي', sugar: 1.0, carbs: 45, protein: 28, cal: 480, type: 'dinner' as MealType },
];

export const MealLoggerModal: React.FC<MealLoggerModalProps> = ({ onClose }) => {
  const { lang, t, recordMeal, currentSugarLevel, formatGlucose } = useApp();

  const currentHour = new Date().getHours();
  const initialType: MealType =
    currentHour >= 5 && currentHour < 11
      ? 'breakfast'
      : currentHour >= 11 && currentHour < 16
      ? 'lunch'
      : currentHour >= 16 && currentHour < 21
      ? 'dinner'
      : 'snack';

  const [dishName, setDishName] = useState('');
  const [mealType, setMealType] = useState<MealType>(initialType);
  const [sugarGrams, setSugarGrams] = useState<number>(3);
  const [carbsGrams, setCarbsGrams] = useState<number>(25);
  const [proteinGrams, setProteinGrams] = useState<number>(20);
  const [calories, setCalories] = useState<number>(350);
  const [glucoseAtMeal, setGlucoseAtMeal] = useState<number>(currentSugarLevel || 120);
  const [glucoseTiming, setGlucoseTiming] = useState<'pre_meal' | 'post_meal' | 'fasting' | 'random'>('post_meal');
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleSelectQuickDish = (dish: (typeof COMMON_QATAR_MEALS)[0]) => {
    setDishName(lang === 'ar' ? dish.nameAr : dish.name);
    setSugarGrams(dish.sugar);
    setCarbsGrams(dish.carbs);
    setProteinGrams(dish.protein);
    setCalories(dish.cal);
    setMealType(dish.type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    recordMeal({
      name: dishName.trim(),
      mealType,
      sugarGrams: Number(sugarGrams),
      addedSugarGrams: Number(sugarGrams) > 5 ? Number(sugarGrams) - 2 : 0,
      carbsGrams: Number(carbsGrams),
      proteinGrams: Number(proteinGrams),
      calories: Number(calories),
      glucoseAtMeal: Number(glucoseAtMeal),
      glucoseTiming,
      imageUrl:
        photoPreview ||
        'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=500&q=80',
      source: 'quick_log',
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                {lang === 'ar' ? 'سجل الوجبات اليومي' : 'Meal Intake Logger'}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {lang === 'ar' ? 'تسجيل وجبة تناولتها اليوم' : 'Record a Meal You Just Ate'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick Select Buttons */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 block">
              {lang === 'ar' ? 'أطباق شائعة سريعة:' : 'Quick Select Qatari Dish:'}
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {COMMON_QATAR_MEALS.map((dish, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectQuickDish(dish)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-300 border border-slate-700 transition-colors"
                >
                  {lang === 'ar' ? dish.nameAr : dish.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dish Name Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              {lang === 'ar' ? 'اسم الوجبة أو الطبق *' : 'Meal or Dish Name *'}
            </label>
            <input
              type="text"
              required
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: فيليه هامور مشوي مع سلطة' : 'e.g. Grilled Sea Bass with Rocca'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Meal Type Radio Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              {lang === 'ar' ? 'نوع الوجبة:' : 'Meal Type:'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all text-center capitalize ${
                    mealType === type
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {type === 'breakfast'
                    ? lang === 'ar' ? 'فطور' : 'Breakfast'
                    : type === 'lunch'
                    ? lang === 'ar' ? 'غداء' : 'Lunch'
                    : type === 'dinner'
                    ? lang === 'ar' ? 'عشاء' : 'Dinner'
                    : lang === 'ar' ? 'سناك' : 'Snack'}
                </button>
              ))}
            </div>
          </div>

          {/* Nutrition Macros Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div>
              <label className="text-[11px] font-semibold text-emerald-400 block mb-0.5">
                {lang === 'ar' ? 'السكر (غرام)' : 'Sugar (g)'}
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={sugarGrams}
                onChange={(e) => setSugarGrams(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">
                {lang === 'ar' ? 'النشويات (غرام)' : 'Carbs (g)'}
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={carbsGrams}
                onChange={(e) => setCarbsGrams(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">
                {lang === 'ar' ? 'البروتين (غرام)' : 'Protein (g)'}
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={proteinGrams}
                onChange={(e) => setProteinGrams(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                {lang === 'ar' ? 'السعرات (kcal)' : 'Calories'}
              </label>
              <input
                type="number"
                step="10"
                min="0"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
              />
            </div>
          </div>

          {/* Blood Glucose at Meal */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                {lang === 'ar' ? 'مستوى السكر المسجل بعد أو أثناء الوجبة:' : 'Recorded Sugar Level for this Meal:'}
              </label>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {formatGlucose(glucoseAtMeal)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="40"
                max="500"
                value={glucoseAtMeal}
                onChange={(e) => setGlucoseAtMeal(Number(e.target.value))}
                className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
              />
              <div className="flex items-center gap-1.5 flex-1">
                {(['post_meal', 'pre_meal', 'fasting'] as const).map((timing) => (
                  <button
                    key={timing}
                    type="button"
                    onClick={() => setGlucoseTiming(timing)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                      glucoseTiming === timing
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {timing === 'post_meal'
                      ? lang === 'ar' ? 'بعد الأكل (2h)' : 'Post-Meal'
                      : timing === 'pre_meal'
                      ? lang === 'ar' ? 'قبل الأكل' : 'Pre-Meal'
                      : lang === 'ar' ? 'صائم' : 'Fasting'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Photo Capture & Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              {lang === 'ar' ? 'صورة الطبق (اختياري):' : 'Food Photo (Optional):'}
            </label>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-28 w-full group">
                <img src={photoPreview} alt="Meal Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-semibold"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'التقاط صورة' : 'Take Picture'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-semibold"
                >
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'رفع صورة' : 'Upload Image'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              {lang === 'ar' ? 'ملاحظات وتعديلات صحية:' : 'Notes & Modifications:'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: نصف كمية الأرز وبدون زيت إضافي' : 'e.g. Zero rice, double salad'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تسجيل الوجبة وتحديث التوصية' : 'Record Meal & Update Suggestions'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
