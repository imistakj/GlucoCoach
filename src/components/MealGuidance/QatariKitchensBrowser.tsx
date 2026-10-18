import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QATAR_KITCHEN_PROVIDERS, QATAR_HEALTHY_MEALS } from '../../data/qatarKitchens';
import { KitchenMealItem } from '../../types';
import {
  ChefHat,
  ShoppingBag,
  Clock,
  MapPin,
  Star,
  ShieldCheck,
  Check,
  Truck,
  Sparkles,
  Search,
  MessageCircle,
} from 'lucide-react';

interface QatariKitchensBrowserProps {
  onSelectMealForOrder: (meal: KitchenMealItem) => void;
}

export const QatariKitchensBrowser: React.FC<QatariKitchensBrowserProps> = ({
  onSelectMealForOrder,
}) => {
  const { lang, t, orders } = useApp();
  const l = lang === 'ar' ? 'ar' : 'en';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedKitchenId, setSelectedKitchenId] = useState<string>('all');

  const filteredMeals = QATAR_HEALTHY_MEALS.filter((meal) => {
    const matchCategory = selectedCategory === 'all' || meal.category === selectedCategory;
    const matchKitchen = selectedKitchenId === 'all' || meal.kitchenId === selectedKitchenId;
    return matchCategory && matchKitchen;
  });

  const latestOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="space-y-4 pt-2">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">
                {lang === 'ar'
                  ? 'المطابخ القطرية الشريكة (طلب وجبات صحية)'
                  : 'Qatari Kitchen Partners (Order Healthy Meals)'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                2-Click Order
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'وجبات تقليدية بوصفات موزونة ومعتمدة للسكري وخالية من السكر المضاف'
                : 'Diabetic-certified recipes prepared by authentic local Qatar kitchens'}
            </p>
          </div>
        </div>

        {latestOrder && (
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs self-start sm:self-auto">
            <Truck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">
              {lang === 'ar' ? 'طلبك الأخير:' : 'Latest Order:'}{' '}
              <strong className="text-emerald-400 font-bold">{latestOrder.meal.name[l]}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Verified Kitchen Provider Cards */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 block px-1">
          {lang === 'ar' ? 'المطابخ المحلية المعتمدة في قطر:' : 'Verified Local Kitchen Providers in Qatar:'}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {QATAR_KITCHEN_PROVIDERS.map((kitchen) => {
            const isSelected = selectedKitchenId === kitchen.id;
            return (
              <button
                key={kitchen.id}
                type="button"
                onClick={() => setSelectedKitchenId(isSelected ? 'all' : kitchen.id)}
                className={`p-3 rounded-2xl border text-left rtl:text-right transition-all flex flex-col justify-between group shadow-sm ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-emerald-400 truncate">
                      {kitchen.zone.split('/')[0]}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5 shrink-0">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {kitchen.rating}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {kitchen.name[l]}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-800/80 mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" />
                    ~{kitchen.deliveryTimeMin}m
                  </span>
                  <span className="text-emerald-400 font-medium">✓ Partner</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: lang === 'ar' ? 'جميع الوجبات الصحية' : 'All Healthy Meals' },
          { id: 'seafood', label: lang === 'ar' ? 'أسماك ومأكولات بحرية' : 'Seafood & Grills' },
          { id: 'grills', label: lang === 'ar' ? 'دجاج ومشويات' : 'Poultry Skewers' },
          { id: 'traditional', label: lang === 'ar' ? 'مجبوس وهريس موزون' : 'Balanced Machboos' },
          { id: 'breakfast', label: lang === 'ar' ? 'فطور بدون سكر' : 'Sugar-Free Breakfast' },
          { id: 'beverages', label: lang === 'ar' ? 'كرك ومشروبات' : 'Karak Bidoon Sukkar' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Curated Healthy Meals Grid with 2-Click Order Button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredMeals.map((meal) => (
          <div
            key={meal.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all group flex flex-col shadow-md"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={meal.imageUrl}
                alt={meal.name[l]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-2 left-2 rtl:right-2 rtl:left-auto flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {meal.sugarGrams}g Sugar • 0g Added
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-white border border-slate-700">
                  {meal.priceQAR} QAR
                </span>
              </div>
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block truncate">
                  {meal.deliveryKitchenName[l]}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mt-0.5">
                  {meal.name[l]}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {meal.description[l]}
                </p>
              </div>

              {/* Nutrition breakdown pill line */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>
                    Carbs: <strong className="text-slate-200">{meal.carbsGrams}g</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Protein: <strong className="text-slate-200">{meal.proteinGrams}g</strong>
                  </span>
                </div>

                {/* 2-Click Order Button */}
                <button
                  type="button"
                  onClick={() => onSelectMealForOrder(meal)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'طلب فوري (نقرتين)' : 'Order (2 Clicks)'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
