import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KitchenMealItem, KitchenFoodOrder, QatarFoodProvider } from '../../types';
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Flame,
  Truck,
  ChefHat,
  ChevronRight,
  Check,
  Zap,
  Repeat,
  Store,
} from 'lucide-react';

interface KitchenOrderModalProps {
  meal: KitchenMealItem | null;
  onClose: () => void;
}

export const KitchenOrderModal: React.FC<KitchenOrderModalProps> = ({ meal, onClose }) => {
  const {
    lang,
    t,
    placeKitchenOrder,
    userProfile,
    foodProviders,
    autoMealOrderConfig,
    updateAutoMealOrderConfig,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string>(
    autoMealOrderConfig.preferredProviderId || 'provider-talabat'
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    autoMealOrderConfig.deliveryAddress || 'Building 14, Street 840, Al Sadd, Zone 38, Doha'
  );
  const [deliveryZone, setDeliveryZone] = useState('Al Sadd, Doha');
  const [specialNotes, setSpecialNotes] = useState('');
  const [enableAutoSchedule, setEnableAutoSchedule] = useState(autoMealOrderConfig.enabled);
  const [placedOrder, setPlacedOrder] = useState<KitchenFoodOrder | null>(null);

  if (!meal) return null;

  const l = lang === 'ar' ? 'ar' : 'en';

  const currentProvider: QatarFoodProvider =
    foodProviders.find((p) => p.id === selectedProviderId) || foodProviders[0];

  const toggleMod = (mod: string) => {
    setSelectedMods((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handlePlaceOrder = () => {
    if (enableAutoSchedule !== autoMealOrderConfig.enabled) {
      updateAutoMealOrderConfig({
        enabled: enableAutoSchedule,
        preferredProviderId: selectedProviderId,
        deliveryAddress,
        deliveryZone,
      });
    }

    const order = placeKitchenOrder(
      meal,
      quantity,
      selectedMods,
      `${deliveryAddress} (${deliveryZone})`,
      specialNotes,
      selectedProviderId
    );
    setPlacedOrder(order);
    setStep(3);
  };

  const generateWhatsAppMessage = () => {
    const modsText =
      selectedMods.length > 0 ? selectedMods.join(', ') : 'Standard diabetic safe preparation';
    return encodeURIComponent(
      `مرحباً ${meal.deliveryKitchenName[l]} عبر ${currentProvider.name[l]}،
أود تأكيد طلب وجبة صحية معتمدة للسكري عبر تطبيق جلوكو كوتش قطر:
- الوجبة: ${meal.name[l]} (العدد: ${quantity})
- مزود التوصيل في قطر: ${currentProvider.name[l]}
- التعديلات الصحية المطلوبة: ${modsText}
- إجمالي السكر: ${meal.sugarGrams}غ سكر (0غ سكر مضاف)
- العنوان: ${deliveryAddress} (${deliveryZone})
- العميل: ${userProfile.name} (${userProfile.emergencyContact.phone})
شكراً لكم!`
    );
  };

  const totalCost = meal.priceQAR * quantity + (currentProvider?.deliveryFeeQAR || 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-lg max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                {lang === 'ar' ? 'طلب فوري من المطابخ ومزودي قطر' : 'On-Time Qatar Meal Order'}
              </span>
              <h3 className="text-sm font-bold text-white">
                {step === 1
                  ? lang === 'ar' ? 'الخطوة 1: تخصيص الوجبة والكمية' : 'Step 1: Meal & Diabetic Customization'
                  : step === 2
                  ? lang === 'ar' ? 'الخطوة 2: اختيار مزود التوصيل وتأكيد الطلب' : 'Step 2: Choose Qatar Provider & Deliver'
                  : lang === 'ar' ? 'تم تأكيد الطلب بنجاح!' : 'Order Placed & Dispatched!'}
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

        {/* STEP 1: Meal Customization */}
        {step === 1 && (
          <div className="p-5 space-y-4">
            {/* Meal Hero Overview */}
            <div className="flex gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 items-start">
              <img
                src={meal.imageUrl}
                alt={meal.name[l]}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 block truncate">
                  {meal.deliveryKitchenName[l]}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug truncate">
                  {meal.name[l]}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-black text-emerald-400">
                    {meal.priceQAR} QAR
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {meal.sugarGrams}g Sugar • 0g Added
                  </span>
                </div>
              </div>
            </div>

            {/* Diabetic Modifications Checkboxes */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {lang === 'ar' ? 'تعديلات مطبخ السكري (اختر ما يناسبك):' : 'Diabetic-Safe Preparation Tweaks:'}
              </span>

              <div className="space-y-2">
                {meal.portionMods[l].map((mod: string, idx: number) => {
                  const isSelected = selectedMods.includes(mod);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleMod(mod)}
                      className={`w-full p-2.5 rounded-xl border text-left rtl:text-right text-xs flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 text-white font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{mod}</span>
                      <span
                        className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700'
                        }`}
                      >
                        {isSelected && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">
                {lang === 'ar' ? 'عدد الوجبات:' : 'Meal Quantity:'}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-bold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Proceed to Step 2 */}
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{lang === 'ar' ? 'متابعة إلى مزودي التوصيل والعنوان' : 'Continue to Delivery Provider'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* STEP 2: Qatar Food Providers & Delivery Details */}
        {step === 2 && (
          <div className="p-5 space-y-4">
            
            {/* Qatar Food Provider Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-400" />
                  {lang === 'ar' ? 'اختر مزود التوصيل في قطر:' : 'Select Qatar Food Provider:'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'شركاء التوصيل المعتمدين' : 'Authorized Delivery Partners'}
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {foodProviders.map((provider) => {
                  const isSelected = selectedProviderId === provider.id;
                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => setSelectedProviderId(provider.id)}
                      className={`p-2.5 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-gradient-to-r ${provider.accentColor} text-white`}>
                            {provider.logoText}
                          </span>
                          <span className="text-[10px] font-bold text-amber-400">
                            ★ {provider.rating}
                          </span>
                        </div>
                        <h5 className="text-[11px] font-bold text-white line-clamp-1">
                          {provider.name[l]}
                        </h5>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 text-sky-400" />
                          ~{provider.deliveryTimeMin}m
                        </span>
                        <span className="font-bold text-emerald-400">
                          {provider.deliveryFeeQAR} QAR
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Price & Timing Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">{lang === 'ar' ? 'المطبخ والوجبة:' : 'Meal & Kitchen:'}</span>
                <span className="font-bold text-white truncate max-w-[200px]">{meal.name[l]}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">{lang === 'ar' ? 'المزود المختار في قطر:' : 'Delivery Provider:'}</span>
                <span className="font-bold text-emerald-400">{currentProvider.name[l]} ({currentProvider.deliveryFeeQAR} QAR Fee)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">{lang === 'ar' ? 'الإجمالي الشامل للتوصيل:' : 'Total Amount (Incl. Delivery):'}</span>
                <span className="font-black text-emerald-400 text-sm">{totalCost} QAR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{lang === 'ar' ? 'الوصول في موعد الوجبة:' : 'On-Time Meal ETA:'}</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  ~{currentProvider.deliveryTimeMin} mins (On time for meal window)
                </span>
              </div>
            </div>

            {/* Address inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {lang === 'ar' ? 'المنطقة في قطر:' : 'Delivery Zone in Qatar:'}
                </label>
                <select
                  value={deliveryZone}
                  onChange={(e) => setDeliveryZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Al Sadd, Doha">Al Sadd (Zone 38)</option>
                  <option value="West Bay / Diplomatic Area">West Bay (Zone 60)</option>
                  <option value="Lusail Marina">Lusail Marina (Zone 69)</option>
                  <option value="The Pearl Qatar">The Pearl Island (Zone 66)</option>
                  <option value="Al Rayyan / Education City">Al Rayyan (Zone 51)</option>
                  <option value="Al Wakrah City">Al Wakrah (Zone 90)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {lang === 'ar' ? 'تفاصيل العنوان والمبنى:' : 'Street & Building Details:'}
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Automation Checkbox Option: User can automate this */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableAutoSchedule}
                  onChange={(e) => setEnableAutoSchedule(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-emerald-300 block">
                    {lang === 'ar'
                      ? 'أتمتة طلب الوجبات الصحية في موعدها يومياً (Auto-Pilot)'
                      : 'Automate on-time delivery for future meals (Auto-Pilot)'}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {lang === 'ar'
                      ? 'سيقوم التطبيق بتأكيد وجبة الغداء أو العشاء المنخفضة السكر تلقائياً مع مزودك المفضل لضمان الأكل في الموعد دون نسيان.'
                      : 'App will automatically schedule recommended low-sugar meals at your preferred meal hours so you never miss on-time nutrition.'}
                  </span>
                </div>
              </label>
            </div>

            {/* Back & Confirm buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {lang === 'ar' ? 'رجوع' : 'Back'}
              </button>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Check className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? `تأكيد الطلب الفوري عبر ${currentProvider.name[l]}`
                    : `Order Now via ${currentProvider.name[l]}`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Order Placed & Live Tracking */}
        {step === 3 && placedOrder && (
          <div className="p-5 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                ORDER CONFIRMED #{placedOrder.id} • {placedOrder.providerName}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                {lang === 'ar' ? 'تم إرسال طلبك للتحضير الفوري!' : 'Meal Dispatched for On-Time Delivery!'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {lang === 'ar'
                  ? `يقوم ${placedOrder.providerName} بالتوصيل السريع لضمان وصول وجبتك في موعدها الصحي.`
                  : `Dispatched via ${placedOrder.providerName} to ensure your low-sugar meal arrives right on schedule.`}
              </p>
            </div>

            {/* Live Progress Bar */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left rtl:text-right space-y-3">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  {placedOrder.status === 'confirmed'
                    ? lang === 'ar' ? 'تم استلام الطلب' : 'Received by Kitchen'
                    : placedOrder.status === 'preparing'
                    ? lang === 'ar' ? 'جاري الطهي الموزون' : 'Preparing Low-Sugar Meal'
                    : lang === 'ar' ? 'في الطريق إليك' : 'Out for Delivery'}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {placedOrder.estimatedDeliveryTime}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{
                    width:
                      placedOrder.status === 'confirmed'
                        ? '35%'
                        : placedOrder.status === 'preparing'
                        ? '65%'
                        : '90%',
                  }}
                />
              </div>

              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900 flex justify-between">
                <span>{lang === 'ar' ? 'المزود:' : 'Provider:'} {placedOrder.providerName}</span>
                <span className="font-bold text-white">{placedOrder.totalQAR} QAR</span>
              </div>
            </div>

            {/* Meal Recorded Banner */}
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center gap-2 text-left rtl:text-right">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                {lang === 'ar'
                  ? 'تم تسجيل هذه الوجبة تلقائياً في سجل وجباتك اليومي وتم ضبط موعد الوجبة القادمة!'
                  : 'This meal has been logged in your history, and your on-time schedule has been refreshed!'}
              </span>
            </div>

            {/* Direct WhatsApp Dispatch button */}
            <a
              href={`https://wa.me/97455446789?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'متابعة الطلب عبر واتساب المطبخ' : 'Track & Chat with Kitchen on WhatsApp'}</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              {lang === 'ar' ? 'تم، العودة لدليل الوجبات' : 'Done, Return to Meals'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
