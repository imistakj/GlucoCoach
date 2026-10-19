import React from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, HeartPulse, Smartphone, Camera, Sparkles } from 'lucide-react';

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
    isMobileSimulator,
    setIsMobileSimulator,
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
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2.5 sm:px-4 sm:py-3 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Identity */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-black text-sm sm:text-base tracking-tight text-white truncate">
                {lang === 'ar' ? 'جلوكو كوتش' : 'GlucoCoach'}
                <span className="text-emerald-400 text-xs font-bold ml-1 hidden xs:inline sm:inline">Qatar</span>
              </h1>
              <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded border ${getTriageBadgeColor()}`}>
                {triageStatus === 'RED'
                  ? lang === 'ar' ? 'طوارئ' : 'ALERT'
                  : triageStatus === 'AMBER'
                  ? lang === 'ar' ? 'تنبيه' : 'AMBER'
                  : lang === 'ar' ? 'سليم' : 'OPTIMAL'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              {lang === 'ar'
                ? 'مساعد اتخاذ القرار والوقاية من السكري'
                : 'Prevention & Point-of-Decision Assistant'}
            </p>
          </div>
        </div>

        {/* Action Controls - Mobile-First Tight Cluster */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Quick Sugar Intake Tracker - Hidden on very small screens, visible from 380px+ */}
          <button
            onClick={() => setIsMealLoggerOpen(true)}
            className="hidden xs:flex sm:flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 font-bold border border-emerald-600/30 transition-all active:scale-95 shadow-sm"
            title="Log Meal & Count Sugar Intake"
          >
            <Camera className="w-3 h-3 text-emerald-400" />
            <span className="font-mono">{todaySugarIntake}g</span>
            <span className="text-slate-400 text-[10px]">/25g</span>
          </button>

          {/* Unit Toggle (mg/dL vs mmol/L) */}
          <button
            onClick={() => setUnit(unit === 'mg/dL' ? 'mmol/L' : 'mg/dL')}
            className="text-[11px] px-2 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 font-mono font-bold transition-colors border border-slate-700/60 active:scale-95"
            title="Toggle Glucose Unit"
          >
            {unit}
          </button>

          {/* 1-Tap Language Toggle Pill (Saves 40px over double button) */}
          <button
            onClick={toggleLang}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            {lang === 'ar' ? 'English' : 'عربي'}
          </button>

          {/* Quick 999 Qatar Emergency Button */}
          <button
            onClick={triggerRedEmergency}
            className="flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/50 transition-all active:scale-95 animate-pulse"
            title="Dial 999 Qatar Emergency"
          >
            <PhoneCall className="w-3 h-3 fill-current" />
            <span>999</span>
          </button>

          {/* Desktop Only: Mobile Simulator Toggle (Hidden on mobile / tablet to prevent crowding) */}
          <button
            onClick={() => setIsMobileSimulator(!isMobileSimulator)}
            className={`hidden lg:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-bold border transition-all active:scale-95 shadow-sm ${
              isMobileSimulator
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60'
            }`}
            title="Toggle Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isMobileSimulator ? 'Full Screen' : 'Mobile View'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
