import React from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, HeartPulse, Smartphone, Camera, LogIn, User, ShieldCheck } from 'lucide-react';

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
    currentUser,
    setIsAuthModalOpen,
    setIsAccountModalOpen,
    t,
  } = useApp();

  const getTriageBadge = () => {
    switch (triageStatus) {
      case 'RED':
        return {
          label: lang === 'ar' ? 'طوارئ' : 'CRITICAL',
          classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        };
      case 'AMBER':
        return {
          label: lang === 'ar' ? 'تنبيه' : 'ADVISORY',
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        };
      default:
        return {
          label: lang === 'ar' ? 'مستقر' : 'OPTIMAL',
          classes: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
        };
    }
  };

  const triageInfo = getTriageBadge();

  return (
    <header className="sticky top-0 z-40 bg-[#070b12]/95 backdrop-blur-md border-b border-slate-800/90 px-2.5 py-2 sm:px-4 sm:py-2.5 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand & Healthtech Identity - No Truncation or Wrapping */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-700 flex items-center justify-center shadow-md shadow-teal-950 shrink-0">
            <HeartPulse className="w-4 h-4 text-white stroke-[2.2px]" />
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1 whitespace-nowrap">
              <span>{lang === 'ar' ? 'جلوكو كوتش' : 'GlucoCoach'}</span>
              <span className="text-teal-400 font-semibold text-xs ml-0.5">Qatar</span>
            </h1>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border whitespace-nowrap shrink-0 ${triageInfo.classes}`}>
              {triageInfo.label}
            </span>
          </div>
        </div>

        {/* Action Controls - Mobile-Optimized Compact Cluster */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Quick Sugar Intake Tracker (Shown on tablet/desktop, hidden on narrow mobile where it is already in the main view card) */}
          <button
            onClick={() => setIsMealLoggerOpen(true)}
            className="hidden md:flex items-center gap-1.5 text-xs min-h-[36px] px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-teal-300 font-medium border border-slate-700/80 transition-all active:scale-95 shadow-sm"
            title="Log Meal & Count Sugar Intake"
          >
            <Camera className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="font-mono tabular-nums font-bold">{todaySugarIntake}g</span>
            <span className="text-slate-500 text-[10px]">/25g</span>
          </button>

          {/* Biometric Unit Toggle (mg/dL vs mmol/L) */}
          <button
            onClick={() => setUnit(unit === 'mg/dL' ? 'mmol/L' : 'mg/dL')}
            className="min-h-[36px] px-2 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-mono font-bold text-[11px] sm:text-xs transition-colors border border-slate-700/80 active:scale-95"
            title="Toggle Glucose Unit"
          >
            {unit}
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={toggleLang}
            className="min-h-[36px] px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-teal-300 font-semibold text-[11px] sm:text-xs border border-slate-700/80 transition-all active:scale-95 shadow-sm"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            {lang === 'ar' ? 'English' : 'عربي'}
          </button>

          {/* Patient Portal / Login Access Pill */}
          {currentUser ? (
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="flex items-center gap-1.5 min-h-[36px] px-2.5 py-1 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 transition-all active:scale-95 shadow-sm"
              title={currentUser.displayName || 'Patient Account'}
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Patient'}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                  {(currentUser.displayName || 'P')[0].toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-bold max-w-[80px] truncate">
                {(currentUser.displayName || 'Patient').split(' ')[0]}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Firestore Synced" />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1 text-[11px] sm:text-xs font-bold min-h-[36px] px-2.5 sm:px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-all active:scale-95 shadow-md shadow-teal-950"
              title={t.signIn}
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span>{t.signIn}</span>
            </button>
          )}

          {/* Emergency 999 Hotline */}
          <button
            onClick={triggerRedEmergency}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold min-h-[36px] px-2.5 sm:px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/60 transition-all active:scale-95"
            title="Dial 999 Qatar Emergency Hotline"
          >
            <PhoneCall className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="font-mono font-black">999</span>
          </button>

          {/* Desktop Simulator Switcher */}
          <button
            onClick={() => setIsMobileSimulator(!isMobileSimulator)}
            className={`hidden lg:flex items-center gap-1.5 text-xs min-h-[36px] px-3 py-1 rounded-xl font-semibold border transition-all active:scale-95 shadow-sm ${
              isMobileSimulator
                ? 'bg-teal-600 text-white border-teal-500 shadow-teal-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80'
            }`}
            title="Toggle Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5 text-teal-400" />
            <span>{isMobileSimulator ? 'Full Screen' : 'Phone View'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
