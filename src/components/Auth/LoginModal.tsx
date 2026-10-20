import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  X,
  CreditCard,
  UserCheck,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Building,
  KeyRound,
  Stethoscope,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Loader2,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const {
    lang,
    t,
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginWithQatarHealthId,
    loginAsDemoPatient,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'google' | 'qid' | 'email' | 'demo'>('google');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Email state
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patientName, setPatientName] = useState('');

  // Qatar ID state
  const [qid, setQid] = useState('28963401294');
  const [healthCard, setHealthCard] = useState('HC-9923841');
  const [qidName, setQidName] = useState('Salem Al-Kuwari');
  const [diabeticStatus, setDiabeticStatus] = useState<
    'pre-diabetes' | 'type-2' | 'preventative' | 'type-1'
  >('pre-diabetes');

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      setSuccessMsg(lang === 'ar' ? 'تم تسجيل الدخول بنجاح عبر حساب Google' : 'Signed in successfully via Google');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg(null);
      }, 700);
    } catch (err: any) {
      console.error(err);
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        setErrorMsg(lang === 'ar' ? 'تم إلغاء نافذة تسجيل الدخول' : 'Sign-in window was closed.');
      } else if (code === 'auth/popup-blocked') {
        setErrorMsg(lang === 'ar' ? 'المتصفح حظر النافذة المنبثقة. يرجى السماح بالنوافذ أو تجربة الدخول بالرقم الشخصي' : 'Popup was blocked by browser. Please allow popups or use Qatar ID fast login.');
      } else {
        setErrorMsg(
          err?.message ||
            (lang === 'ar'
              ? 'تعذر الدخول بحساب Google. يمكنك استخدام الرقم الشخصي القطري أو الحساب التجريبي فوراً'
              : 'Google Sign-In note: Try the Qatar ID or Demo Fast-Pass.')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please provide both email and password.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      if (emailMode === 'signup') {
        await registerWithEmail(email, password, patientName || 'Patient');
        setSuccessMsg(lang === 'ar' ? 'تم إنشاء حساب المريض بنجاح!' : 'Patient account created successfully!');
      } else {
        await loginWithEmail(email, password);
        setSuccessMsg(lang === 'ar' ? 'مرحباً بك مجدداً!' : 'Welcome back!');
      }
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg(null);
      }, 700);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message ||
          (lang === 'ar'
            ? 'خطأ في المصادقة. يرجى التحقق من البيانات أو تجربة الدخول بالرقم الشخصي القطري.'
            : 'Authentication error. Please check credentials or use Qatar ID Fast-Pass.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQidLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qid || qid.length < 8) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال رقم شخصي قطري صالح' : 'Please enter a valid Qatar ID (e.g. 11 digits)');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginWithQatarHealthId(qid, healthCard, qidName, diabeticStatus);
      setSuccessMsg(
        lang === 'ar'
          ? `تم التحقق من البطاقة الصحية: مرحباً ${qidName}`
          : `Health Card verified: Welcome ${qidName}`
      );
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg(null);
      }, 700);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(lang === 'ar' ? 'تعذر التحقق من الرقم الشخصي' : 'Failed to verify Qatar Health credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (profileKey: 'salem' | 'fatima' | 'dr_tariq') => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginAsDemoPatient(profileKey);
      setSuccessMsg(lang === 'ar' ? 'تم تفعيل الملف التجريبي بنجاح' : 'Demo profile loaded successfully');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg(null);
      }, 600);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to switch demo patient.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t sm:border border-teal-500/30 sm:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-800/40">
                  {lang === 'ar' ? 'دولة قطر · وزارة الصحة العامة' : 'State of Qatar · MoPH'}
                </span>
                <span className="text-[10px] text-slate-400">| PHCC</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {t.authModalTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 p-1.5 mx-4 mt-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-semibold shrink-0">
          <button
            onClick={() => {
              setActiveTab('google');
              setErrorMsg(null);
            }}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1 text-[11px] sm:text-xs ${
              activeTab === 'google'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Google</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('qid');
              setErrorMsg(null);
            }}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1 text-[11px] sm:text-xs ${
              activeTab === 'qid'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{lang === 'ar' ? 'البطاقة الصحية' : 'Qatar ID'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('email');
              setErrorMsg(null);
            }}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1 text-[11px] sm:text-xs ${
              activeTab === 'email'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{lang === 'ar' ? 'البريد' : 'Email'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('demo');
              setErrorMsg(null);
            }}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1 text-[11px] sm:text-xs ${
              activeTab === 'demo'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{lang === 'ar' ? 'تجريبي' : 'Demo'}</span>
          </button>
        </div>

        {/* Alerts */}
        <div className="px-5 pt-3 shrink-0">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* TAB 1: GOOGLE MEDICAL SSO */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {lang === 'ar' ? 'المزامنة السحابية الطبية الموحدة' : 'Unified Cloud Medical Sync'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {lang === 'ar'
                    ? 'سجّل الدخول بحساب Google لربط قراءات السكر اليومية وسلتك الذكية وملف الطوارئ 999 بأمان تام في قاعدة بيانات Firestore السحابية.'
                    : 'Sign in with your Google account to automatically synchronize daily glucose trends, Smart Basket scans, and Qatar 999 medical passport.'}
                </p>
              </div>

              {/* Real Google SSO Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md shadow-white/5 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{t.loginWithGoogle}</span>
              </button>

              {/* Emergency / Paramedic Quick Note */}
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-teal-400">
                  <HeartPulse className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'حفظ فوري في Firestore' : 'Instant Firestore Cloud Sync'}
                </span>
                <span className="text-slate-500 font-mono">DB: ai-studio-glucocoachqatar</span>
              </div>
            </div>
          )}

          {/* TAB 2: QATAR ID & HEALTH CARD */}
          {activeTab === 'qid' && (
            <form onSubmit={handleQidLogin} className="space-y-3.5">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'التحقق عبر بطاقة حمد الصحية' : 'Hamad Health Card Fast-Pass'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'ربط السجلات الطبية بالرقم الشخصي لمؤسسة حمد' : 'Direct linkage to Qatar National Patient Portal'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'الرقم الشخصي القطري (11 رقماً)' : 'Qatar ID (11 Digits)'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={qid}
                    onChange={(e) => setQid(e.target.value)}
                    maxLength={11}
                    placeholder="28963401294"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 font-mono"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-teal-400 font-mono">
                    {qid.length}/11
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'رقم البطاقة الصحية' : 'Health Card #'}
                  </label>
                  <input
                    type="text"
                    value={healthCard}
                    onChange={(e) => setHealthCard(e.target.value)}
                    placeholder="HC-9923841"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'اسم المريض' : 'Patient Name'}
                  </label>
                  <input
                    type="text"
                    value={qidName}
                    onChange={(e) => setQidName(e.target.value)}
                    placeholder="Salem Al-Kuwari"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'التشخيص الطبي للسكري' : 'Diabetic Diagnosis'}
                </label>
                <select
                  value={diabeticStatus}
                  onChange={(e) => setDiabeticStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="pre-diabetes">{lang === 'ar' ? 'مرحلة ما قبل السكري (Pre-diabetes)' : 'Pre-diabetes'}</option>
                  <option value="type-2">{lang === 'ar' ? 'السكري من النوع الثاني (Type 2)' : 'Type 2 Diabetes'}</option>
                  <option value="type-1">{lang === 'ar' ? 'السكري من النوع الأول (Type 1)' : 'Type 1 Diabetes'}</option>
                  <option value="preventative">{lang === 'ar' ? 'وقائي عام (Preventative Health)' : 'Preventative Health'}</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[46px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-teal-950 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'التحقق والدخول إلى الملف الصحي' : 'Verify & Access Health Record'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: EMAIL / PASSWORD */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setEmailMode('signin')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    emailMode === 'signin'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'تسجيل دخول' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => setEmailMode('signup')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    emailMode === 'signup'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'تسجيل جديد' : 'Register'}
                </button>
              </div>

              {emailMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'اسم المريض الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Salem Al-Kuwari"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@health.qa"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[46px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-teal-950 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>
                      {emailMode === 'signup'
                        ? lang === 'ar'
                          ? 'إنشاء ملف مريض جديد'
                          : 'Create Patient Account'
                        : lang === 'ar'
                        ? 'تسجيل الدخول'
                        : 'Sign In to Portal'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 4: DEMO PATIENT FAST-PASS */}
          {activeTab === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'اختر أحد الملفات السريرية الجاهزة لاختبار تتبع السكر، والطلب من المطابخ، والمسح الذكي فوراً:'
                  : 'Select a pre-calibrated Qatari clinical profile to instantly test glucose tracking, smart basket, and on-time meals:'}
              </p>

              {/* Patient 1 */}
              <button
                onClick={() => handleDemoSelect('salem')}
                disabled={loading}
                className="w-full p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 text-left transition-all active:scale-[0.99] flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                    SA
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                        Salem Al-Kuwari
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                        Pre-Diabetes
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      QID: 28963401294 · Al Sadd PHCC · 25g Sugar Target
                    </p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-teal-400 shrink-0">
                  {lang === 'ar' ? 'تفعيل' : 'Select'} →
                </div>
              </button>

              {/* Patient 2 */}
              <button
                onClick={() => handleDemoSelect('fatima')}
                disabled={loading}
                className="w-full p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 text-left transition-all active:scale-[0.99] flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                    FA
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                        Fatima Al-Sulaiti
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                        Type 2 Diabetes
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      QID: 29263408192 · Rawdat Al Khail PHCC · 18g Sugar Target
                    </p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-teal-400 shrink-0">
                  {lang === 'ar' ? 'تفعيل' : 'Select'} →
                </div>
              </button>

              {/* Clinician / Paramedic 3 */}
              <button
                onClick={() => handleDemoSelect('dr_tariq')}
                disabled={loading}
                className="w-full p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 text-left transition-all active:scale-[0.99] flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                    DT
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                        Dr. Tariq Al-Kuwari
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        HMC Consultant
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Hamad General Hospital · Endocrine & Paramedic 999 View
                    </p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-teal-400 shrink-0">
                  {lang === 'ar' ? 'تفعيل' : 'Select'} →
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Security & Health Compliance Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/90 text-center shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Lock className="w-3 h-3 text-teal-400" />
            <span>{t.loginSecureNotice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
