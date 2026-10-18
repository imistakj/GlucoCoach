import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  MapPin,
  Share2,
  Copy,
  Check,
  AlertOctagon,
  ShieldAlert,
  Building2,
  X,
  FileHeart,
} from 'lucide-react';

export const EmergencyRedModal: React.FC = () => {
  const { lang, t, isRedAlertOpen, setRedAlertOpen, emergencyLocation, userProfile } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isRedAlertOpen) return null;

  const emergencyTextToShare = `${lang === 'ar' ? '🚨 نداء طوارئ طبية (إسعاف قطر 999) 🚨' : '🚨 MEDICAL EMERGENCY ALERT (QATAR 999) 🚨'}
${lang === 'ar' ? 'الموقع الجغرافي:' : 'Location:'} ${emergencyLocation.address}
GPS: ${emergencyLocation.lat.toFixed(6)}, ${emergencyLocation.lng.toFixed(6)}

${lang === 'ar' ? 'الاسم:' : 'Patient:'} ${userProfile.name}
${lang === 'ar' ? 'الرقم الشخصي (QID):' : 'Qatar ID:'} ${userProfile.qatarId}
${lang === 'ar' ? 'البطاقة الصحية:' : 'Hamad Card:'} ${userProfile.healthCardNumber}
${lang === 'ar' ? 'فصيلة الدم:' : 'Blood Type:'} ${userProfile.bloodType}
${lang === 'ar' ? 'الحالة:' : 'Condition:'} ${userProfile.diabeticStatus}
${lang === 'ar' ? 'الأدوية الحالية:' : 'Current Meds:'} ${userProfile.medications.join(', ')}
${lang === 'ar' ? 'الحساسية:' : 'Allergies:'} ${userProfile.allergies.join(', ')}
${lang === 'ar' ? 'جهة اتصال الطوارئ:' : 'Emergency Contact:'} ${userProfile.emergencyContact.name} (${userProfile.emergencyContact.phone})`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(emergencyTextToShare);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDial999 = () => {
    // In mobile, tel:999 initiates call to Qatar Emergency Services
    window.location.href = 'tel:999';
  };

  const qatarHospitals = [
    {
      name: {
        en: 'Hamad General Hospital - Main Emergency Dept',
        ar: 'مستشفى حمد العام - طوارئ الكبار الرئيسي (الدوحة)',
      },
      zone: 'Al Rayyan Rd, Doha',
      phone: '4439 2222',
    },
    {
      name: {
        en: 'Al Wakra Hospital - Emergency Department',
        ar: 'مستشفى الوكرة - قسم الطوارئ (الوكرة)',
      },
      zone: 'Al Wakra Main Road',
      phone: '4011 4444',
    },
    {
      name: {
        en: 'Hazm Mebaireek General Hospital Emergency',
        ar: 'مستشفى حزم مبيريك العام - الطوارئ (المنطقة الصناعية)',
      },
      zone: 'Industrial Area, Doha',
      phone: '4024 0000',
    },
    {
      name: {
        en: 'The Cuban Hospital - Emergency Dept',
        ar: 'المستشفى الكوبي - قسم الطوارئ (دخان)',
      },
      zone: 'Dukhan Highway, Zekreet',
      phone: '4015 7777',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-rose-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border-2 border-rose-500 rounded-3xl w-full max-w-xl max-h-[94vh] overflow-y-auto shadow-2xl shadow-rose-900/50 flex flex-col text-slate-100">
        {/* Top Emergency Banner */}
        <div className="bg-rose-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 text-white animate-bounce shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white">
                {t.emergencyAlertHeader}
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                {t.emergencyAlertSub}
              </p>
            </div>
          </div>
          <button
            onClick={() => setRedAlertOpen(false)}
            className="p-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: DIAL 999 IMMEDIATELY */}
        <div className="p-5 space-y-4">
          <button
            onClick={handleDial999}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-lg sm:text-xl shadow-xl shadow-rose-900/60 transition-all active:scale-[0.98] flex items-center justify-center gap-3 animate-pulse ring-4 ring-rose-500/30"
          >
            <PhoneCall className="w-6 h-6 fill-current shrink-0" />
            <span>{t.call999Btn}</span>
          </button>
          <p className="text-[11px] text-center text-slate-400 font-medium">
            {t.emergency999Sub}
          </p>

          {/* GPS Location & Medical ID Share Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                {t.shareLocationTitle}
              </h3>

              <button
                onClick={handleCopy}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyCoords}</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
              <div className="text-white font-bold flex items-center gap-1 text-[13px]">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {emergencyLocation.address}
              </div>
              <div className="text-[11px] text-slate-400">
                Lat: {emergencyLocation.lat.toFixed(6)} | Lng: {emergencyLocation.lng.toFixed(6)}
              </div>
            </div>

            {/* Quick First Responder Card */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileHeart className="w-3.5 h-3.5 text-rose-400" />
                {t.firstResponderCard}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>
                  <strong>{t.qatarIdNumber}:</strong> {userProfile.qatarId}
                </div>
                <div>
                  <strong>{t.bloodTypeLabel}:</strong>{' '}
                  <span className="text-rose-400 font-bold">{userProfile.bloodType}</span>
                </div>
                <div>
                  <strong>{t.conditionLabel}:</strong> {userProfile.diabeticStatus}
                </div>
                <div>
                  <strong>{t.healthCardNo}:</strong> {userProfile.healthCardNumber}
                </div>
              </div>
              <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-900">
                <strong>{t.currentMedications}:</strong> {userProfile.medications.join(', ')}
              </div>
            </div>
          </div>

          {/* Nearest Qatar Emergency Hospitals */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-400" />
              {t.emergencyHospitals}
            </h3>

            <div className="space-y-1.5">
              {qatarHospitals.map((hosp, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-white text-xs">{hosp.name[lang === 'ar' ? 'ar' : 'en'] || hosp.name.en}</h4>
                    <span className="text-[10px] text-slate-400">{hosp.zone}</span>
                  </div>
                  <a
                    href={`tel:${hosp.phone.replace(/\s/g, '')}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-[11px] shrink-0 border border-slate-700 flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{hosp.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>{t.showDoctor}</span>
          <button
            onClick={() => setRedAlertOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
