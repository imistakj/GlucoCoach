import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  X,
  PhoneCall,
  Calendar,
  MessageCircle,
  Copy,
  Check,
  Building,
  UserCheck,
} from 'lucide-react';

export const AmberAlertModal: React.FC = () => {
  const { lang, t, isAmberAlertOpen, setAmberAlertOpen, userProfile, latestCheckIn } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isAmberAlertOpen) return null;

  const familyMessage = `${lang === 'ar' ? 'تنبيه صحي من جلوكو كوتش قطر:' : 'Health Alert from GlucoCoach Qatar:'}
${lang === 'ar' ? 'مرحباً، تم رصد قراءات متكررة لارتفاع سكر الدم أو إجهاد غير معتاد لـ' : 'Hi, repeated high glucose or fatigue detected for'} ${userProfile.name}.
${lang === 'ar' ? 'آخر قراءة سكر:' : 'Latest Glucose:'} ${latestCheckIn?.glucoseLevel || 195} mg/dL.
${lang === 'ar' ? 'يُرجى المساعدة في جدولة موعد طبي في المركز الصحي (الرعاية الصحية الأولية) للتأكد من جرعات العلاج.' : 'Please help arrange a routine check-up at their PHCC Health Center to review medication dosage.'}`;

  const handleCopyWhatsApp = () => {
    navigator.clipboard?.writeText(familyMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const phone = userProfile.emergencyContact.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(familyMessage);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/70 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="bg-amber-600/90 px-5 py-4 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-slate-950 shrink-0" />
            <div>
              <h2 className="text-base font-bold text-slate-950">
                {t.triageAmber}
              </h2>
              <p className="text-xs text-slate-900 font-medium">
                {lang === 'ar' ? 'توصية طبية وقائية' : 'Preventative Medical Advisory'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAmberAlertOpen(false)}
            className="p-1 rounded-lg bg-amber-700/40 hover:bg-amber-800/60 text-slate-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {t.triageAmberDesc}
          </p>

          {/* Action 1: Alert Family Contact via WhatsApp */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                {t.amberAlertContact}
              </span>
              <span className="text-[11px] text-slate-400">
                {userProfile.emergencyContact.name}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono italic leading-relaxed">
              "{familyMessage}"
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleOpenWhatsApp}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إرسال عبر واتساب' : 'Open in WhatsApp'}</span>
              </button>

              <button
                onClick={handleCopyWhatsApp}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copied : t.copyScript}</span>
              </button>
            </div>
          </div>

          {/* Action 2: Book PHCC / QDA appointment */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <Building className="w-4 h-4" />
              {lang === 'ar' ? 'حجز موعد طبي في قطر' : 'Schedule Qatar Clinic Visit'}
            </span>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p>
                <strong>{lang === 'ar' ? 'المركز المسجل به:' : 'Registered Center:'}</strong>{' '}
                {userProfile.healthCenter}
              </p>
              <p>
                <strong>{lang === 'ar' ? 'طبيب الغدد الصماء:' : 'Primary Physician:'}</strong>{' '}
                {userProfile.primaryDoctor}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:107"
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'اتصل بـ 107 (نرجوكم)' : 'Call 107 (PHCC)'}</span>
              </a>

              <a
                href="tel:+97444547311"
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'الجمعية القطرية للسكري' : 'Qatar Diabetes (QDA)'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={() => setAmberAlertOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
