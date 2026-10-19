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

const MainContent: React.FC = () => {
  const {
    activeTab,
    isOrderModalOpen,
    selectedMealForOrder,
    setIsOrderModalOpen,
    isMobileSimulator,
    setIsMobileSimulator,
    lang,
  } = useApp();

  const sharedAppUrl = 'https://ais-pre-ts3eppyt44myqpmrrqa2qn-43610583691.asia-southeast1.run.app';

  const appContent = (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white relative">
      <Header />
      <div className="pt-2 pb-20">
        {activeTab === 'meal' && <MealGuidanceView />}
        {activeTab === 'heart' && <HeartGuardView />}
        {activeTab === 'basket' && <SmartBasketView />}
        {activeTab === 'medical-id' && <MedicalIDView />}
      </div>
      <Navigation />

      {/* 2-3 Clicks Qatari Kitchen Order Modal */}
      {isOrderModalOpen && selectedMealForOrder && (
        <KitchenOrderModal
          meal={selectedMealForOrder}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}

      {/* Persistent High Sugar Clinic & Doctor Alarm Modal */}
      <HighSugarClinicAlertModal />
    </div>
  );

  if (isMobileSimulator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-4 sm:py-8 px-2 flex flex-col items-center justify-center">
        {/* Simulator Top Toolbar */}
        <div className="w-full max-w-[420px] mb-3 flex items-center justify-between px-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">
              {lang === 'ar' ? 'محاكي شاشة الجوال (390 × 844)' : 'Mobile Phone View (390 × 844)'}
            </span>
          </div>

          <button
            onClick={() => setIsMobileSimulator(false)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold active:scale-95 transition-all"
          >
            {lang === 'ar' ? 'عرض الشاشة الكاملة' : 'Full Screen'}
          </button>
        </div>

        {/* Realistic Mobile Device Shell (iPhone 16 Pro Style) */}
        <div className="w-full max-w-[410px] bg-slate-900 border-[10px] border-slate-800 rounded-[48px] shadow-2xl shadow-emerald-950/50 overflow-hidden relative ring-1 ring-slate-700/60 h-[840px] max-h-[90vh] flex flex-col">
          {/* Dynamic Island & Status Bar */}
          <div className="bg-slate-950 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 select-none shrink-0 border-b border-slate-900/60 z-30">
            <span>9:41</span>
            {/* Dynamic Island Pill */}
            <div className="w-24 h-4.5 bg-black rounded-full flex items-center justify-center gap-1.5 border border-slate-800/80 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Scrollable Phone Viewport */}
          <div className="overflow-y-auto flex-1 relative bg-slate-950">
            {appContent}
          </div>

          {/* Mobile Bottom Home Indicator Bar */}
          <div className="bg-slate-950 py-1.5 flex justify-center shrink-0 border-t border-slate-900/40 z-30">
            <div className="w-32 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>

        {/* Real Mobile Link QR Helper Notice */}
        <div className="mt-3 text-center text-xs text-slate-400 max-w-sm space-y-1">
          <p>
            {lang === 'ar'
              ? 'أو افتح التطبيق مباشرة على متصفح هاتفك المحمول:'
              : 'Or open directly in Safari/Chrome on your phone:'}
          </p>
          <a
            href={sharedAppUrl}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline font-mono text-[11px] break-all inline-block"
          >
            {sharedAppUrl}
          </a>
        </div>
      </div>
    );
  }

  return <main>{appContent}</main>;
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
