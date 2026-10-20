/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SmartBasketView } from './components/SmartBasket/SmartBasketView';
import { MealGuidanceView } from './components/MealGuidance/MealGuidanceView';
import { HeartGuardView } from './components/HeartGuard/HeartGuardView';
import { MedicalIDView } from './components/MedicalID/MedicalIDView';
import { KitchenOrderModal } from './components/MealGuidance/KitchenOrderModal';
import { HighSugarClinicAlertModal } from './components/HeartGuard/HighSugarClinicAlertModal';
import { LoginModal } from './components/Auth/LoginModal';
import { UserAccountModal } from './components/Auth/UserAccountModal';

const MainContent: React.FC = () => {
  const {
    activeTab,
    isOrderModalOpen,
    selectedMealForOrder,
    setIsOrderModalOpen,
    isMobileSimulator,
    setIsMobileSimulator,
    lang,
    isAccountModalOpen,
    setIsAccountModalOpen,
  } = useApp();

  const sharedAppUrl = 'https://ais-pre-ts3eppyt44myqpmrrqa2qn-43610583691.asia-southeast1.run.app';

  // Core view content switch
  const renderActiveView = () => {
    switch (activeTab) {
      case 'meal':
        return <MealGuidanceView />;
      case 'heart':
        return <HeartGuardView />;
      case 'basket':
        return <SmartBasketView />;
      case 'medical-id':
        return <MedicalIDView />;
      default:
        return <MealGuidanceView />;
    }
  };

  // If in Simulator Mode (on desktop), render realistic phone chassis with contained navigation
  if (isMobileSimulator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-slate-950 py-4 sm:py-6 px-2 flex flex-col items-center justify-center">
        {/* Simulator Control Toolbar */}
        <div className="w-full max-w-[420px] mb-2.5 flex items-center justify-between px-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="font-semibold text-slate-200">
              {lang === 'ar' ? 'معاينة الهاتف المحمول (393 × 852)' : 'Mobile Phone View (393 × 852)'}
            </span>
          </div>

          <button
            onClick={() => setIsMobileSimulator(false)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-[11px] font-bold active:scale-95 transition-all"
          >
            {lang === 'ar' ? 'عرض الشاشة الكاملة' : 'Full Screen'}
          </button>
        </div>

        {/* Realistic Mobile Device Shell (iPhone 16 Pro / Android Flagship style) */}
        <div className="w-full max-w-[410px] bg-slate-950 border-[10px] border-slate-800 rounded-[50px] shadow-2xl shadow-teal-950/40 overflow-hidden relative ring-1 ring-slate-700/80 h-[850px] max-h-[92vh] flex flex-col select-none">
          {/* Status Bar & Dynamic Island */}
          <div className="bg-slate-950 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 select-none shrink-0 border-b border-slate-900/60 z-30">
            <span className="font-mono">09:41</span>
            {/* Dynamic Island Pill */}
            <div className="w-24 h-4.5 bg-black rounded-full flex items-center justify-center gap-2 border border-slate-800 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Top Header sticky inside phone */}
          <Header />

          {/* Scrollable Phone Viewport */}
          <div className="overflow-y-auto flex-1 relative bg-[#070b12] text-slate-100 overscroll-contain">
            <div className="pb-6">
              {renderActiveView()}
            </div>
          </div>

          {/* Contained Bottom Navigation Bar inside phone */}
          <Navigation isContained={true} />

          {/* Mobile Bottom Home Indicator Bar */}
          <div className="bg-slate-950 py-1.5 flex justify-center shrink-0 border-t border-slate-900/40 z-30">
            <div className="w-32 h-1 bg-slate-700 rounded-full" />
          </div>

          {/* Modals rendered inside simulator context */}
          {isOrderModalOpen && selectedMealForOrder && (
            <KitchenOrderModal
              meal={selectedMealForOrder}
              onClose={() => setIsOrderModalOpen(false)}
            />
          )}
          <HighSugarClinicAlertModal />
          <LoginModal />
          <UserAccountModal
            isOpen={isAccountModalOpen}
            onClose={() => setIsAccountModalOpen(false)}
          />
        </div>

        {/* Helpful Direct Phone Link */}
        <div className="mt-3 text-center text-xs text-slate-400 max-w-sm space-y-1">
          <p className="text-[11px]">
            {lang === 'ar'
              ? 'أو افتح التطبيق مباشرة على متصفح هاتفك المحمول:'
              : 'Direct mobile access on smartphone browser:'}
          </p>
          <a
            href={sharedAppUrl}
            target="_blank"
            rel="noreferrer"
            className="text-teal-400 hover:underline font-mono text-[11px] break-all inline-block"
          >
            {sharedAppUrl}
          </a>
        </div>
      </div>
    );
  }

  // Full Screen / Standard Mobile Browser View
  return (
    <main className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-teal-500 selection:text-white relative">
      <Header />
      <div className="pt-1 pb-24 max-w-5xl mx-auto px-2 sm:px-4">
        {renderActiveView()}
      </div>
      <Navigation isContained={false} />

      {/* 2-3 Clicks Qatari Kitchen Order Modal */}
      {isOrderModalOpen && selectedMealForOrder && (
        <KitchenOrderModal
          meal={selectedMealForOrder}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}

      {/* Persistent High Sugar Clinic & Doctor Alarm Modal */}
      <HighSugarClinicAlertModal />

      {/* Patient Portal Authentication & Account Modals */}
      <LoginModal />
      <UserAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
