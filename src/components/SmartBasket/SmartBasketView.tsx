import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodProduct } from '../../types';
import { QATAR_SUPERMARKET_PRODUCTS } from '../../data/qatarProducts';
import { ScannerModal } from './ScannerModal';
import { QRScannerModal } from './QRScannerModal';
import { ProductDetailModal } from './ProductDetailModal';
import {
  ShoppingBag,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowRightLeft,
  Sparkles,
  Info,
  Calendar,
  Zap,
  CheckCircle2,
  Store,
  QrCode,
} from 'lucide-react';

export const SmartBasketView: React.FC = () => {
  const {
    lang,
    t,
    basket,
    addToBasket,
    removeFromBasket,
    clearBasket,
    applySmartSwaps,
    totalBasketSugars,
    totalBasketCarbs,
    weeklySugarLimit,
    isSugarLimitExceeded,
  } = useApp();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct | null>(null);

  // Sugar percentage of weekly allowance
  const sugarPercent = Math.min(100, Math.round((totalBasketSugars / weeklySugarLimit) * 100));

  const handleProductDetected = (product: FoodProduct) => {
    setIsScannerOpen(false);
    setIsQRScannerOpen(false);
    setSelectedProduct(product);
  };

  const getTrafficBadge = (level: string) => {
    switch (level) {
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

  return (
    <div className="space-y-4 sm:space-y-5 pb-20 max-w-4xl mx-auto px-2 sm:px-4 pt-2 sm:pt-4">
      {/* Top Banner / Clinical Supermarket Intelligence */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Store className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold text-teal-400">
                {lang === 'ar' ? 'الميرة • اللولو • كارفور قطر • بلدنا' : 'Al Meera • Lulu • Carrefour Qatar • Baladna'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {t.basketTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {t.basketSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-teal-300 font-bold text-xs sm:text-sm border border-slate-700/80 shadow-md transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{lang === 'ar' ? 'مسح رمز QR الغذائي' : 'QR Nutrition Scanner'}</span>
            </button>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-teal-950 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>{t.scanItemBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Basket Health Balance & Sugar Gauge */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              {t.basketSummary}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {t.itemsCount.replace('{count}', String(basket.length))}
          </span>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">
                {t.weeklySugarBudget}
              </span>
              <span className={`font-bold ${totalBasketSugars > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {totalBasketSugars}g / {weeklySugarLimit}g ({sugarPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  totalBasketSugars > 70
                    ? 'bg-rose-500'
                    : totalBasketSugars > 35
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (totalBasketSugars / weeklySugarLimit) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>
              {t.weeklyCarbsBudget}:{' '}
              <strong className="text-slate-200">{totalBasketCarbs}g</strong> total carbs
            </span>
            <span className="text-[11px] text-slate-500">
              {lang === 'ar' ? 'إرشادات الجمعية القطرية للسكري' : 'QDA Prevention Standards'}
            </span>
          </div>
        </div>

        {/* Sugar Warning Banner if limit approached/exceeded */}
        {isSugarLimitExceeded && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-300">
                  {t.sugarWarning}
                </h4>
                <p className="text-[11px] text-rose-200/90 mt-0.5 leading-snug">
                  {t.sugarWarningDesc
                    .replace('{amount}', String(totalBasketSugars))
                    .replace('{pct}', String(sugarPercent))}
                </p>
              </div>
            </div>

            <button
              onClick={applySmartSwaps}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-md active:scale-95"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{t.smartSwapAll}</span>
            </button>
          </div>
        )}
      </div>

      {/* Scanned Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-sm text-slate-300">
            {lang === 'ar' ? 'المنتجات في سلتك' : 'Items in Scanned Basket'}
          </h3>
          {basket.length > 0 && (
            <button
              onClick={clearBasket}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.clearBasket}</span>
            </button>
          )}
        </div>

        {basket.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">
                {t.basketEmptyTitle}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {t.basketEmptyDesc}
              </p>
            </div>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.scanItemBtn}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {basket.map((item) => {
              const prod = item.product;
              return (
                <div
                  key={prod.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-3.5 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="cursor-pointer flex-1"
                      onClick={() => setSelectedProduct(prod)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {prod.brand}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTrafficBadge(
                            prod.trafficLight
                          )}`}
                        >
                          {prod.trafficLight}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" />
                          {prod.spikeVelocity}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mt-1 hover:text-emerald-400 transition-colors">
                        {prod.name[lang]}
                      </h4>
                    </div>

                    {/* Quantity & Remove controls - Mobile Touch Optimized */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              addToBasket(prod, -1);
                            } else {
                              removeFromBasket(prod.id);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white rounded-lg active:bg-slate-700 font-bold text-base transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToBasket(prod, 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white rounded-lg active:bg-slate-700 font-bold text-base transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromBasket(prod.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title={t.remove}
                        aria-label={t.remove}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Nutrition stats pill list */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                    <span>
                      {t.sugar}:{' '}
                      <strong className={prod.nutrition.addedSugars > 10 ? 'text-rose-400' : 'text-slate-200'}>
                        {prod.nutrition.addedSugars * item.quantity}g
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      {t.carbs}: <strong className="text-slate-200">{prod.nutrition.carbs * item.quantity}g</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {t.protein}: <strong className="text-slate-200">{prod.nutrition.protein * item.quantity}g</strong>
                    </span>

                    {/* Food safety status preview */}
                    {prod.foodSafety.daysRemaining !== undefined && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-sky-400">
                          <Calendar className="w-3 h-3" />
                          {prod.foodSafety.daysRemaining}d left
                        </span>
                      </>
                    )}
                  </div>

                  {/* Cultural Swap Teaser if High */}
                  {prod.trafficLight === 'HIGH' && prod.qatarSwaps.length > 0 && (
                    <div
                      onClick={() => setSelectedProduct(prod)}
                      className="cursor-pointer bg-slate-950/60 hover:bg-slate-950 border border-slate-800/90 rounded-xl p-2.5 flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <div>
                          <span className="text-[11px] text-amber-400 font-medium block">
                            {t.swapAvailable}:
                          </span>
                          <span className="text-slate-200 font-semibold text-xs">
                            {prod.qatarSwaps[0].name[lang]}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                        {prod.qatarSwaps[0].sugarReduction}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Catalog / Add Local Groceries */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {t.quickPresets}
          </h3>
          <span className="text-[11px] text-slate-500">
            {lang === 'ar' ? 'انقر لإضافة المنتج فوراً' : 'Tap to add to basket'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {QATAR_SUPERMARKET_PRODUCTS.map((prod) => {
            const inBasket = basket.some((b) => b.product.id === prod.id);
            return (
              <div
                key={prod.id}
                className="bg-slate-950/60 hover:bg-slate-950 border border-slate-800/90 rounded-xl p-2.5 flex items-center justify-between gap-2 group transition-all"
              >
                <div
                  className="cursor-pointer flex-1 truncate"
                  onClick={() => setSelectedProduct(prod)}
                >
                  <span className="text-[10px] text-slate-400 block truncate">
                    {prod.brand}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors block truncate">
                    {prod.name[lang]}
                  </span>
                </div>

                <button
                  onClick={() => addToBasket(prod, 1)}
                  className={`p-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    inBasket
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title="Add to basket"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {isQRScannerOpen && (
        <QRScannerModal
          onClose={() => setIsQRScannerOpen(false)}
          onProductDetected={handleProductDetected}
        />
      )}

      {isScannerOpen && (
        <ScannerModal
          onClose={() => setIsScannerOpen(false)}
          onProductDetected={handleProductDetected}
        />
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
