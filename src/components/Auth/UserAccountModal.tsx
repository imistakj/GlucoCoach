import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  X,
  CreditCard,
  LogOut,
  RefreshCw,
  Building,
  HeartPulse,
  PhoneCall,
  ExternalLink,
  CheckCircle2,
  Database,
  FileHeart,
} from 'lucide-react';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({ isOpen, onClose }) => {
  const {
    lang,
    t,
    currentUser,
    userProfile,
    logout,
    setIsAuthModalOpen,
    setActiveTab,
    databaseConnected,
    recordedMeals,
    dailyCheckIns,
    orders,
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  if (!isOpen) return null;

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncDone(true);
      setTimeout(() => setSyncDone(false), 2000);
    }, 800);
  };

  const handleSignOut = async () => {
    await logout();
    onClose();
  };

  const handleSwitchPatient = () => {
    onClose();
    setIsAuthModalOpen(true);
  };

  const handleGoToMedicalId = () => {
    setActiveTab('medical-id');
    onClose();
  };

  const initials = (currentUser?.displayName || userProfile.name || 'Patient')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t sm:border border-teal-500/30 sm:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                {lang === 'ar' ? 'ملف المريض المعتمد' : 'Verified Patient Profile'}
              </span>
              <h3 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'حساب الرعاية الصحية والسكري' : 'Diabetes Healthcare Account'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Patient Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-teal-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3.5 mb-3">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Patient'}
                  className="w-14 h-14 rounded-2xl border-2 border-teal-500/40 object-cover shrink-0 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-500 text-white font-black text-lg flex items-center justify-center border-2 border-teal-400/40 shrink-0 shadow-md">
                  {initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white truncate">
                    {currentUser?.displayName || userProfile.name}
                  </h4>
                  <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
                    {lang === 'ar' ? 'موثق' : 'Verified'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {currentUser?.email || `${userProfile.qatarId}@health.gov.qa`}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-teal-400/90 font-mono">
                  <span>QID: {userProfile.qatarId}</span>
                  <span>·</span>
                  <span>{userProfile.healthCardNumber}</span>
                </div>
              </div>
            </div>

            {/* Health Status Pills */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'ar' ? 'حالة السكري' : 'Diabetic Profile'}
                </span>
                <span className="font-bold text-white capitalize">
                  {userProfile.diabeticStatus.replace('-', ' ')}
                </span>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'ar' ? 'المركز الصحي التابع' : 'Primary Health Center'}
                </span>
                <span className="font-bold text-white truncate block">
                  {userProfile.healthCenter.split('(')[0] || 'Al Sadd PHCC'}
                </span>
              </div>
            </div>
          </div>

          {/* Cloud Firestore Sync Status */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Database className="w-4 h-4 text-teal-400" />
                <span>{lang === 'ar' ? 'المزامنة السحابية (Cloud Firestore)' : 'Cloud Firestore Database'}</span>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {lang === 'ar' ? 'نشط ومتزامن' : 'Active & Synced'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 text-[11px]">
              <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-400 block">{lang === 'ar' ? 'وجبات' : 'Meals'}</span>
                <span className="font-bold text-white">{recordedMeals.length}</span>
              </div>
              <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-400 block">{lang === 'ar' ? 'قياسات' : 'Logs'}</span>
                <span className="font-bold text-white">{dailyCheckIns.length}</span>
              </div>
              <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-400 block">{lang === 'ar' ? 'طلبات' : 'Orders'}</span>
                <span className="font-bold text-white">{orders.length}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500 font-mono">
                UID: {currentUser?.uid ? `${currentUser.uid.slice(0, 14)}...` : 'demo-user'}
              </span>

              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{syncDone ? (lang === 'ar' ? 'تم الحفظ!' : 'Synced!') : (lang === 'ar' ? 'مزامنة الآن' : 'Sync Now')}</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={handleGoToMedicalId}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center justify-between transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <FileHeart className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'عرض وتعديل البطاقة الطبية لمسعفي 999' : 'View & Edit 999 Paramedic Emergency ID'}</span>
              </div>
              <span className="text-slate-500">→</span>
            </button>

            <button
              onClick={handleSwitchPatient}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center justify-between transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-teal-400" />
                <span>{lang === 'ar' ? 'تبديل المريض / الحساب' : 'Switch Patient / Account'}</span>
              </div>
              <span className="text-slate-500">→</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.signOut}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
