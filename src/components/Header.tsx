import React from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, HeartPulse, Globe, Activity, Camera } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    toggleLang,
    unit,
    setUnit,
    triggerRedEmergency,
    triageStatus,
    todaySugarIntake,
    setIsMealLoggerOpen,
  } = useApp();

  const getTriageBadgeColor = () => {
    switch (triageStatus) {
      case 'RED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      case 'AMBER':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base md:text-lg tracking-tight text-white">
                {lang === 'ar' ? 'جلوكو كوتش قطر' : 'GlucoCoach Qatar'}
              </h1>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getTriageBadgeColor()}`}>
                {triageStatus === 'RED'
                  ? lang === 'ar' ? 'طوارئ' : 'ALERT'
                  : triageStatus === 'AMBER'
                  ? lang === 'ar' ? 'تنبيه طبي' : 'AMBER'
                  : lang === 'ar' ? 'سليم' : 'OPTIMAL'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {lang === 'ar'
                ? 'مساعد اتخاذ القرار والوقاية من السكري'
                : 'Prevention & Point-of-Decision Assistant'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Sugar Intake Tracker */}
          <button
            onClick={() => setIsMealLoggerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 font-bold border border-emerald-600/30 transition-all active:scale-95 shadow-sm"
            title="Log Meal & Count Sugar Intake"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>{todaySugarIntake}g / 25g {lang === 'ar' ? 'سكر' : 'sugar'}</span>
          </button>

          {/* Unit Toggle (mg/dL vs mmol/L) */}
          <button
            onClick={() => setUnit(unit === 'mg/dL' ? 'mmol/L' : 'mg/dL')}
            className="text-xs px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700/60"
            title="Toggle Glucose Unit"
          >
            {unit}
          </button>

          {/* Bilingual Switcher (Arabic & English) */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/60">
            <button
              onClick={() => setLang('ar')}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                lang === 'ar'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="العربية (Arabic)"
            >
              عربي
            </button>
            <button
              onClick={() => setLang('en')}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                lang === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Quick 999 Qatar Emergency Button */}
          <button
            onClick={triggerRedEmergency}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/40 transition-all active:scale-95 animate-pulse"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>999</span>
          </button>
        </div>
      </div>
    </header>
  );
};
