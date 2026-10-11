import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KitchenMealItem, KitchenFoodOrder } from '../../types';
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
} from 'lucide-react';

interface KitchenOrderModalProps {
  meal: KitchenMealItem | null;
  onClose: () => void;
}

export const KitchenOrderModal: React.FC<KitchenOrderModalProps> = ({ meal, onClose }) => {
  const { lang, t, placeKitchenOrder, userProfile } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Building 14, Street 840, Al Sadd, Zone 38, Doha'
  );
  const [deliveryZone, setDeliveryZone] = useState('Al Sadd, Doha');
  const [specialNotes, setSpecialNotes] = useState('');
  const [placedOrder, setPlacedOrder] = useState<KitchenFoodOrder | null>(null);

  if (!meal) return null;

  // Toggle portion tweaks
  const toggleMod = (mod: string) => {
    setSelectedMods((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handlePlaceOrder = () => {
    const order = placeKitchenOrder(
      meal,
      quantity,
      selectedMods,
      `${deliveryAddress} (${deliveryZone})`,
      specialNotes
    );
    setPlacedOrder(order);
    setStep(3);
  };

  // Prepares WhatsApp dispatch message directly to Qatari kitchen order desk
  const generateWhatsAppMessage = () => {
    const modsText =
      selectedMods.length > 0 ? selectedMods.join(', ') : 'Standard diabetic safe preparation';
    return encodeURIComponent(
      `مرحباً ${meal.deliveryKitchenName[lang]}،
أود تأكيد طلب وجبة صحية معتمدة للسكري عبر تطبيق جلوكو كوتش قطر:
- الوجبة: ${meal.name[lang]} (العدد: ${quantity})
- التعديلات الصحية المطلوبة: ${modsText}
- إجمالي السكر: ${meal.sugarGrams}غ سكر (0غ سكر مضاف)
- العنوان: ${deliveryAddress} (${deliveryZone})
- العميل: ${userProfile.name} (${userProfile.emergencyContact.phone})
شكراً لكم!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-lg max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                {lang === 'ar' ? 'طلب فوري من المطابخ القطرية الشريكة' : 'Direct Qatari Kitchen Order'}
              </span>
              <h3 className="text-sm font-bold text-white">
                {step === 1
                  ? lang === 'ar' ? 'الخطوة 1: تخصيص الوجبة والكمية' : 'Step 1: Meal & Diabetic Customization'
                  : step === 2
                  ? lang === 'ar' ? 'الخطوة 2: عنوان التوصيل والتأكيد' : 'Step 2: Delivery Address & Confirm'
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

        {/* STEP 1: Meal Customization (Click 1) */}
        {step === 1 && (
          <div className="p-5 space-y-4">
            {/* Meal Hero Overview */}
            <div className="flex gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 items-start">
              <img
                src={meal.imageUrl}
                alt={meal.name[lang]}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 block truncate">
                  {meal.deliveryKitchenName[lang]}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug truncate">
                  {meal.name[lang]}
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
              <span className="text-xs font-semibold text-slate-300 block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {lang === 'ar' ? 'تعديلات مطبخ السكري (اختر ما يناسبك):' : 'Diabetic-Safe Preparation Tweaks:'}
              </span>

              <div className="space-y-2">
                {meal.portionMods[lang].map((mod, idx) => {
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
              <span>{lang === 'ar' ? 'متابعة إلى عنوان التوصيل' : 'Continue to Delivery (Click 2)'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* STEP 2: Delivery Details & Confirm (Click 2 & 3) */}
        {step === 2 && (
          <div className="p-5 space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">{lang === 'ar' ? 'المطبخ المزود:' : 'Kitchen Provider:'}</span>
                <span className="font-bold text-white">{meal.deliveryKitchenName[lang]}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">{lang === 'ar' ? 'إجمالي الطلب:' : 'Total Amount:'}</span>
                <span className="font-bold text-emerald-400 text-sm">{meal.priceQAR * quantity} QAR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{lang === 'ar' ? 'وقت التوصيل التقديري:' : 'Estimated Delivery:'}</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  25 - 30 mins (Doha Express)
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

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {lang === 'ar' ? 'ملاحظة خاصة للشيف (اختياري):' : 'Chef Special Request (Optional):'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'مثال: بدون زيت إضافي نهائياً' : 'e.g. Zero cooking oil, extra lemon'}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
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
                <span>{lang === 'ar' ? 'تأكيد الطلب الفوري (نقرة واحدة)' : 'Confirm & Place Order (1-Click)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Order Placed & Live Tracking (Post-Click 3) */}
        {step === 3 && placedOrder && (
          <div className="p-5 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                ORDER CONFIRMED #{placedOrder.id}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                {lang === 'ar' ? 'تم إرسال طلبك إلى المطبخ بنجاح!' : 'Order Dispatched to Qatari Kitchen!'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'يقوم الشيف حالياً بتحضير الوجبة وفق مواصفات السكري والوقاية المعتمدة.'
                  : 'The kitchen is preparing your meal following verified diabetic portion and sugar standards.'}
              </p>
            </div>

            {/* Live Progress Bar */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left rtl:text-right space-y-3">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4" />
                  {placedOrder.status === 'confirmed'
                    ? lang === 'ar' ? 'تم استلام الطلب بالمطبخ' : 'Received by Kitchen'
                    : placedOrder.status === 'preparing'
                    ? lang === 'ar' ? 'جاري الطهي الموزون' : 'Preparing with Low-Sugar Mods'
                    : lang === 'ar' ? 'السائق في الطريق إليك' : 'Out for Delivery'}
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
                <span>{lang === 'ar' ? 'العنوان:' : 'Address:'} {placedOrder.deliveryAddress}</span>
                <span className="font-bold text-white">{placedOrder.totalQAR} QAR</span>
              </div>
            </div>

            {/* Meal Recorded Banner */}
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center gap-2 text-left rtl:text-right">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                {lang === 'ar'
                  ? 'تم تسجيل هذه الوجبة تلقائياً في سجل وجباتك اليومي وتم تحديث اقتراح وجبتك القادمة!'
                  : 'This meal has been recorded in your Meal History, and your Next Meal recommendation is updated!'}
              </span>
            </div>

            {/* Direct WhatsApp Dispatch button for instant kitchen reassurance */}
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
