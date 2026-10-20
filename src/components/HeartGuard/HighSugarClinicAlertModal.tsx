import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  PhoneCall,
  Building,
  UserCheck,
  X,
  CheckCircle2,
  Calendar,
  Utensils,
  ExternalLink,
  Flame,
  Activity,
  HeartPulse,
  ShieldAlert,
  Droplets,
  Clock,
} from 'lucide-react';
import { QATAR_HEALTHY_MEALS } from '../../data/qatarKitchens';

export const HighSugarClinicAlertModal: React.FC = () => {
  const {
    lang,
    formatGlucose,
    currentSugarLevel,
    userProfile,
    isHighSugarAlarmOpen,
    setIsHighSugarAlarmOpen,
    highSugarAlarmInfo,
    triggerRedEmergency,
    openOrderModalForMeal,
  } = useApp();

  const [acknowledgedProtocol, setAcknowledgedProtocol] = useState(false);

  if (!isHighSugarAlarmOpen) return null;

  const glucose = highSugarAlarmInfo?.glucose || currentSugarLevel || 195;
  const isCritical = glucose >= 250;
  const clinicName = userProfile.healthCenter || 'Al Sadd Primary Health Care Center (PHCC)';
  const doctorName = userProfile.primaryDoctor || 'Dr. Fatima Al-Sulaiti (Endocrinology)';

  const handleOrderLowSugarStabilizer = () => {
    setIsHighSugarAlarmOpen(false);
    // Find a zero-sugar, high-protein meal (e.g., Grilled Hamour with Rocca or Mazzraty Chicken)
    const stabilizerMeal =
      QATAR_HEALTHY_MEALS.find((m) => m.sugarGrams === 0) || QATAR_HEALTHY_MEALS[0];
    openOrderModalForMeal(stabilizerMeal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-rose-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border-t-2 sm:border-2 border-rose-500 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl shadow-rose-950/80 flex flex-col text-slate-100">
        {/* Mobile Drag Handle */}
        <div className="pt-2 pb-1 flex justify-center sm:hidden shrink-0">
          <div className="w-10 h-1 bg-rose-400/60 rounded-full" />
        </div>

        {/* Pulsing Alert Banner Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 px-5 py-3.5 sm:py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-200 block">
                {lang === 'ar' ? 'إنذار طبي: ارتفاع مستمر في سكر الدم' : 'CLINICAL ALERT: PERSISTENT HIGH GLUCOSE'}
              </span>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                {lang === 'ar'
                  ? `السكر مرتفع: ${formatGlucose(glucose)}`
                  : `Elevated Sugar: ${formatGlucose(glucose)}`}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsHighSugarAlarmOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/20 hover:bg-black/30 text-rose-100 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Explanation Alert */}
          <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>
                {lang === 'ar'
                  ? 'تنبيه مراقبة السكري التلقائي'
                  : 'Automated Diabetic Health Monitor'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-200">
              {lang === 'ar'
                ? `تم رصد قراءة سكر مرتفعة (${formatGlucose(glucose)}) تتجاوز النطاق المستهدف (70 - 140 ملغ/ديسيلتر). البقاء في هذا المستوى يعرض الأوعية الدموية للإجهاد. يرجى التواصل مع طبيبك أو عيادة السكري وتناول وجبة منخفضة السكر في موعدها.`
                : `Your glucose reading (${formatGlucose(glucose)}) exceeds the safe target range (70–140 mg/dL). Extended hyperglycemia strains insulin response. Contact your doctor/clinic and consume on-time low-sugar meals.`}
            </p>
          </div>

          {/* User's Designated Clinic & Doctor Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'عيادتك المسجلة في قطر (PHCC):' : 'Your Registered Qatar PHCC Clinic:'}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">{clinicName}</h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{doctorName}</span>
              </p>
            </div>

            {/* Direct Calling & Booking Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <a
                href="tel:107"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'اتصل بالعيادة (107)' : 'Call Clinic (107 PHCC)'}</span>
              </a>

              <a
                href="https://www.phcc.gov.qa"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'ar' ? 'حجز موعد طبيب (نرجوكم)' : 'Book via Nar’aakom'}</span>
              </a>
            </div>
          </div>

          {/* Immediate Clinical Action Steps */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-200 block flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-400" />
              {lang === 'ar' ? 'الإجراءات العاجلة لتخفيض السكر الآن:' : 'Immediate Steps to Lower Blood Sugar Now:'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? '1. شرب 500 مل ماء' : '1. Drink 500mL Water'}</span>
                </div>
                <p className="text-slate-400 text-[10px]">
                  {lang === 'ar' ? 'يساعد الكلى على التخلص من فائض الجلوكوز ويمنع الجفاف' : 'Flushes glucose through renal excretion'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? '2. وجبة بدون سكر' : '2. Low-Sugar Meal'}</span>
                </div>
                <p className="text-slate-400 text-[10px]">
                  {lang === 'ar' ? 'تناول وجبة بروتين وخضار في موعدها لمنع طفرات الكبد' : 'Eat protein & fiber on time; no carbs'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? '3. إعادة الفحص' : '3. Recheck 45m'}</span>
                </div>
                <p className="text-slate-400 text-[10px]">
                  {lang === 'ar' ? 'قس السكر مجدداً بعد 45 دقيقة للتأكد من هبوطه' : 'Re-measure to ensure downward curve'}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleOrderLowSugarStabilizer}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-[0.98]"
            >
              <Utensils className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? 'طلب وجبة صحية خالية من السكر فوراً (توصيل فوري)'
                  : 'Order Low-Sugar Stabilizer Meal Now (On-Time Delivery)'}
              </span>
            </button>

            {/* Critical Emergency option if very high */}
            {isCritical && (
              <button
                onClick={() => {
                  setIsHighSugarAlarmOpen(false);
                  triggerRedEmergency();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/50 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>
                  {lang === 'ar'
                    ? 'أعاني من غثيان أو ضيق تنفس (طلب إسعاف 999 طوارئ)'
                    : 'Experiencing Nausea or Shortness of Breath (Dial 999 Emergency)'}
                </span>
              </button>
            )}

            <button
              onClick={() => setIsHighSugarAlarmOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              {lang === 'ar' ? 'تم استيعاب التنبيه واتخاذ الإجراءات' : 'I Acknowledge & Will Follow Clinic Steps'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
