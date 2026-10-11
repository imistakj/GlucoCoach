import React from 'react';
import { useApp } from '../../context/AppContext';
import { FoodProduct } from '../../types';
import {
  X,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRightLeft,
  Calendar,
  Thermometer,
  Plus,
  Check,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: FoodProduct | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { lang, t, addToBasket, basket } = useApp();

  if (!product) return null;

  const isInBasket = basket.some((item) => item.product.id === product.id);

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case 'LOW':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getSpikeColor = (spike: string) => {
    switch (spike) {
      case 'Slow':
        return 'text-emerald-400';
      case 'Moderate':
        return 'text-amber-400';
      case 'Rapid':
        return 'text-rose-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {product.brand}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {product.name[lang]}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Top Banner: Traffic Light & Spike Velocity */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-xl border ${getTrafficColor(product.trafficLight)} flex flex-col justify-between`}>
              <span className="text-xs font-medium text-slate-400">
                {t.trafficLightGuidance}
              </span>
              <div className="text-base sm:text-lg font-bold mt-1">
                {product.trafficLight === 'LOW'
                  ? t.low
                  : product.trafficLight === 'MEDIUM'
                  ? t.medium
                  : t.high}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-800/50 flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {t.spikeVelocityLabel}
              </span>
              <div className={`text-base sm:text-lg font-bold mt-1 ${getSpikeColor(product.spikeVelocity)}`}>
                {product.spikeVelocity === 'Slow'
                  ? t.spikeSlow
                  : product.spikeVelocity === 'Moderate'
                  ? t.spikeModerate
                  : t.spikeRapid}
              </div>
            </div>
          </div>

          {/* Dual Risk Section 1: Diabetes Impact Assessment */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {t.diabetesImpact}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                NOVA {product.upfLevel} (UPF)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {product.glucoseImpactReason[lang]}
            </p>

            {/* Nutrition Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
              <div className="bg-slate-900 p-2 rounded-lg text-center border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{t.carbs}</span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {product.nutrition.carbs}g
                </span>
              </div>
              <div className={`bg-slate-900 p-2 rounded-lg text-center border ${product.nutrition.addedSugars > 10 ? 'border-rose-500/40' : 'border-slate-800'}`}>
                <span className="text-[10px] text-rose-300 block">{t.sugar}</span>
                <span className="text-xs sm:text-sm font-bold text-rose-400">
                  {product.nutrition.addedSugars}g
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg text-center border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{t.fiber}</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">
                  {product.nutrition.fiber}g
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg text-center border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{t.protein}</span>
                <span className="text-xs sm:text-sm font-bold text-blue-400">
                  {product.nutrition.protein}g
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg text-center border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{t.fats}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-300">
                  {product.nutrition.fats}g
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg text-center border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{t.sodium}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-300">
                  {product.nutrition.sodium}mg
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              {product.summaryTip[lang]}
            </div>
          </div>

          {/* Dual Risk Section 2: Food Safety & Use-By Awareness */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t.foodSafetyAwareness}
              </h3>
              {product.foodSafety.daysRemaining !== undefined && (
                <span className="text-[11px] font-medium text-slate-300">
                  {product.foodSafety.daysRemaining} days left
                </span>
              )}
            </div>

            {/* Explicit Guardrail Note */}
            <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-800/40 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-sky-200">
                <strong className="block text-sky-300 font-semibold mb-0.5">
                  {t.guardrailNotice}
                </strong>
                {t.guardrailDesc}
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p>
                <strong>{t.expiryDate}:</strong>{' '}
                <span className="text-slate-200">{product.foodSafety.expiryDate || 'N/A'}</span>
              </p>
              <p>
                <strong>{t.storageAdvice}:</strong>{' '}
                <span className="text-slate-300">{product.foodSafety.storageInstructions[lang]}</span>
              </p>
            </div>
          </div>

          {/* Culturally Relevant Local Qatar Swaps */}
          {product.qatarSwaps.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" />
                {t.culturallyRelevantSwaps}
              </h3>

              <div className="space-y-2">
                {product.qatarSwaps.map((swap, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">
                        {swap.name[lang]}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                        {swap.sugarReduction}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {swap.whyBetter[lang]}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="text-slate-500">{t.whereToFind}:</span>
                      {swap.supermarketFound}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md px-5 py-3.5 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            {t.close}
          </button>

          <button
            onClick={() => {
              addToBasket(product);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98]"
          >
            {isInBasket ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t.addToBasketBtn} (+1)</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>{t.addToBasketBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
