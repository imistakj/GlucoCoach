import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Utensils, HeartPulse, UserCheck } from 'lucide-react';

interface NavigationProps {
  isContained?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isContained = false }) => {
  const { activeTab, setActiveTab, t, basket, triageStatus } = useApp();

  const navItems = [
    {
      id: 'meal' as const,
      label: t.tabMealGuidance,
      icon: Utensils,
    },
    {
      id: 'heart' as const,
      label: t.tabHeartGuard,
      icon: HeartPulse,
      statusDot: triageStatus !== 'GREEN',
    },
    {
      id: 'basket' as const,
      label: t.tabSmartBasket,
      icon: ShoppingBag,
      badge: basket.length > 0 ? basket.length : undefined,
    },
    {
      id: 'medical-id' as const,
      label: t.tabMedicalID,
      icon: UserCheck,
    },
  ];

  return (
    <nav
      className={`${
        isContained
          ? 'sticky bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5'
          : 'fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-xl shadow-black/40'
      }`}
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-teal-400 font-semibold bg-teal-500/10 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5px] text-teal-400' : 'stroke-[1.8px]'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-teal-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                    {item.badge}
                  </span>
                )}
                {item.statusDot && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-slate-900" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-1 font-medium truncate max-w-[84px] text-center leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
