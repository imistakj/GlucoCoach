import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Utensils, HeartPulse, UserCheck } from 'lucide-react';

export const Navigation: React.FC = () => {
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 sm:py-2">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-semibold bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {item.statusDot && (
                  <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-slate-950 animate-ping" />
                )}
              </div>
              <span className="text-[11px] mt-1 truncate max-w-[80px] text-center leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
