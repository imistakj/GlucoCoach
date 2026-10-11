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

const MainContent: React.FC = () => {
  const {
    activeTab,
    isOrderModalOpen,
    selectedMealForOrder,
    setIsOrderModalOpen,
  } = useApp();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Header />
      <div className="pt-2">
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
