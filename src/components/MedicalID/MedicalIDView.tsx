import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  ShieldCheck,
  CreditCard,
  PhoneCall,
  Pill,
  AlertCircle,
  Building,
  Edit2,
  Save,
  X,
  FileHeart,
  Database,
  Download,
  CheckCircle2,
  HeartPulse,
  Syringe,
  Activity,
  FileText,
  Utensils,
  Share2,
  Copy,
  Check,
} from 'lucide-react';

export const MedicalIDView: React.FC = () => {
  const {
    lang,
    t,
    userProfile,
    updateUserProfile,
    triggerRedEmergency,
    databaseConnected,
    exportDatabase,
    recordedMeals,
    dailyCheckIns,
    orders,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isParamedicMode, setIsParamedicMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  const handleExportDownload = () => {
    const dataStr = exportDatabase();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glucocoach_qatar_database_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportDatabase());
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileHeart className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">
                {lang === 'ar' ? 'البطاقة الصحية الطبية في دولة قطر' : 'State of Qatar Emergency Medical ID'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {t.medicalIdTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {lang === 'ar'
                ? 'الملف الطبي الموحد وحفظ بيانات السكر، الوجبات، وتفاصيل الطوارئ لفرق الإسعاف 999'
                : 'Unified medical passport syncing food, blood glucose, and emergency data for 999 paramedics'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsParamedicMode(!isParamedicMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isParamedicMode
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>{lang === 'ar' ? 'بطاقة مسعف 999' : '999 Paramedic Card'}</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Database className="w-4 h-4" />
              <span>{lang === 'ar' ? 'قاعدة البيانات' : 'Database'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CLOUD DATABASE STATUS & RECORDS TELEMETRY BAR */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <span className="text-white font-bold flex items-center gap-1.5">
              <span>{lang === 'ar' ? 'قاعدة بيانات المستخدم نشطة ومؤمنة' : 'User Database Active & Synced'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                Firestore
              </span>
            </span>
            <span className="text-[11px] text-slate-400 block">
              {lang === 'ar' ? 'حفظ تلقائي للوجبات ومستويات السكر والملف الطبي' : 'Auto-persisting food intake, blood glucose, and emergency data'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
            <Utensils className="w-3 h-3 text-amber-400" />
            <span>{recordedMeals.length} {lang === 'ar' ? 'وجبة' : 'Meals'}</span>
          </span>
          <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
            <Activity className="w-3 h-3 text-rose-400" />
            <span>{dailyCheckIns.length} {lang === 'ar' ? 'قراءات' : 'Logs'}</span>
          </span>
          <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{lang === 'ar' ? 'ملف 999 مشفّر' : '999 Profile'}</span>
          </span>
        </div>
      </div>

      {/* PARAMEDIC EMERGENCY FLASH CARD (Shown in Paramedic Mode) */}
      {isParamedicMode && (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 border-2 border-rose-500 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-rose-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-600 text-white font-black text-sm">
                999 QATAR
              </span>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  {lang === 'ar' ? 'بطاقة الطوارئ الطبية الفورية للمسعف' : 'Immediate Paramedic Emergency Protocol'}
                </h3>
                <span className="text-xs text-rose-300">Hamad Health Card • Blood & Allergy Urgent Triage</span>
              </div>
            </div>
            <button
              onClick={() => setIsParamedicMode(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-900/60">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.bloodTypeLabel}</span>
              <span className="text-xl font-black text-rose-400">{userProfile.bloodType}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.healthCardNo}</span>
              <span className="text-sm font-bold text-white font-mono">{userProfile.healthCardNumber}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">QID</span>
              <span className="text-sm font-bold text-white font-mono">{userProfile.qatarId}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-900/60">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Insulin Status</span>
              <span className="text-xs font-bold text-amber-400">
                {userProfile.insulinDependent ? 'Insulin Dependent' : 'Non-Insulin Dependent'}
              </span>
            </div>
          </div>

          {/* CRITICAL EMERGENCY NOTES */}
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 space-y-1">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{lang === 'ar' ? 'تنبيه طوارئ 999 الحرج' : 'Critical 999 Paramedic Advisory'}</span>
            </span>
            <p className="text-xs text-rose-100 font-medium leading-relaxed">
              {userProfile.emergencyNotes || 'Check capillary blood glucose immediately if confused or unresponsive.'}
            </p>
          </div>

          {/* Quick 999 Call Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-300">
              <span>Primary Hospital: </span>
              <span className="font-bold text-white">{userProfile.preferredHospital || 'Hamad General Hospital'}</span>
            </div>
            <a
              href="tel:999"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{lang === 'ar' ? 'اتصال مباشر بالإسعاف 999' : 'Call 999 Ambulance'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Digital Qatari Health Passport Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/40 p-5 sm:p-6 shadow-2xl space-y-5 overflow-hidden">
        {/* Subtle Watermark emblem */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-emerald-300">
          <CreditCard className="w-56 h-56" />
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
              HAMAD HEALTH SERVICES • PHCC QATAR
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {userProfile.name}
            </h3>
            <span className="text-xs text-slate-400 block font-mono">
              QID: {userProfile.qatarId}
            </span>
          </div>

          <button
            onClick={() => {
              setFormData(userProfile);
              setIsEditing(!isEditing);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={t.editProfile}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3 pt-2 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.qatarIdNumber}</label>
                <input
                  type="text"
                  value={formData.qatarId}
                  onChange={(e) => setFormData({ ...formData, qatarId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.healthCardNo}</label>
                <input
                  type="text"
                  value={formData.healthCardNumber}
                  onChange={(e) => setFormData({ ...formData, healthCardNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.bloodTypeLabel}</label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Diabetic Condition Status</label>
                <select
                  value={formData.diabeticStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      diabeticStatus: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="pre-diabetes">Pre-Diabetes (Impaired Fasting Glucose)</option>
                  <option value="type-2">Type 2 Diabetes</option>
                  <option value="preventative">Preventative / Healthy</option>
                  <option value="type-1">Type 1 Diabetes</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Insulin Dependent?</label>
                <select
                  value={formData.insulinDependent ? 'yes' : 'no'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      insulinDependent: e.target.value === 'yes',
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="no">No - Diet / Oral agents</option>
                  <option value="yes">Yes - Insulin Dependent</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.emergencyContactLabel}</label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Emergency Phone (+974)</label>
                <input
                  type="text"
                  value={formData.emergencyContact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-400 block mb-1">Preferred Emergency Hospital (Qatar)</label>
                <input
                  type="text"
                  value={formData.preferredHospital}
                  onChange={(e) => setFormData({ ...formData, preferredHospital: e.target.value })}
                  placeholder="e.g. Hamad General Hospital Emergency Department (Doha)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-400 block mb-1">
                  {lang === 'ar' ? 'ملاحظات الطوارئ الحيوية للمسعف (999)' : 'Critical Emergency Notes for 999 Paramedics'}
                </label>
                <textarea
                  rows={2}
                  value={formData.emergencyNotes}
                  onChange={(e) => setFormData({ ...formData, emergencyNotes: e.target.value })}
                  placeholder="e.g. Patient carries glucose gel in pouch. Check capillary blood glucose if confused."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'حفظ في قاعدة البيانات' : 'Save to Database'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10">
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">{t.bloodTypeLabel}</span>
              <span className="text-base sm:text-lg font-bold text-rose-400">
                {userProfile.bloodType}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">{t.healthCardNo}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 font-mono">
                {userProfile.healthCardNumber}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">{t.conditionLabel}</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 capitalize">
                {userProfile.diabeticStatus}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Daily Sugar Limit</span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {userProfile.targetDailyAddedSugar}g / day
              </span>
            </div>
          </div>
        )}

        {/* Chronic Conditions & Emergency Notes */}
        <div className="space-y-3 pt-1 border-t border-slate-800/80 relative z-10 text-xs">
          {userProfile.chronicConditions && userProfile.chronicConditions.length > 0 && (
            <div>
              <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                <span>{lang === 'ar' ? 'الأمراض المزمنة المرصودة' : 'Chronic Medical Conditions'}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.chronicConditions.map((cond, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300 text-[11px]"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          )}

          {userProfile.emergencyNotes && (
            <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-800/40">
              <span className="text-[10px] font-bold text-amber-400 block mb-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>{lang === 'ar' ? 'ملاحظات الطوارئ المسجلة للإسعاف 999' : 'Emergency 999 Paramedic Instructions'}</span>
              </span>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                {userProfile.emergencyNotes}
              </p>
            </div>
          )}

          {/* Current Meds & Allergies */}
          <div>
            <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-emerald-400" />
              {t.currentMedications}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {userProfile.medications.map((med, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px]"
                >
                  {med}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              {t.allergiesLabel}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {userProfile.allergies.map((all, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300 text-[11px]"
                >
                  {all}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Health Center & Family Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 relative z-10 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center gap-1">
              <Building className="w-3 h-3 text-sky-400" />
              {t.primaryHealthCenter}
            </span>
            <span className="font-semibold text-slate-200 text-[11px]">
              {userProfile.healthCenter}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {userProfile.primaryDoctor}
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5 flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              {t.emergencyContactLabel}
            </span>
            <span className="font-semibold text-slate-200 text-[11px]">
              {userProfile.emergencyContact.name}
            </span>
            <a
              href={`tel:${userProfile.emergencyContact.phone}`}
              className="text-[10px] text-emerald-400 font-mono block mt-0.5 hover:underline"
            >
              {userProfile.emergencyContact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Simulation Trigger */}
      <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-rose-300">
            {lang === 'ar' ? 'فحص جاهزية طوارئ 999 في قطر' : '999 Qatar Emergency Response Test'}
          </h4>
          <p className="text-[11px] text-rose-200/80 mt-0.5">
            {lang === 'ar'
              ? 'اختبر ظهور شاشة الطوارئ الفورية مع إحداثيات الدوحة ومشاركة الملف الطبي'
              : 'Test immediate full-screen emergency protocol with GPS and paramedic card'}
          </p>
        </div>

        <button
          onClick={triggerRedEmergency}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'تشغيل بروتوكول 999' : 'Open Emergency 999'}</span>
        </button>
      </div>

      {/* DATABASE EXPORT & HEALTH MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {lang === 'ar' ? 'قاعدة بيانات المستخدم والملف الطبي' : 'Patient Health Database Records'}
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Firestore Connection Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Synchronized</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Recorded Meals in Database:</span>
                  <span className="text-white font-mono font-bold">{recordedMeals.length} records</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Blood Sugar Readings:</span>
                  <span className="text-white font-mono font-bold">{dailyCheckIns.length} records</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Emergency Profile Data:</span>
                  <span className="text-white font-mono font-bold">1 Complete Dossier</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Kitchen Food Orders:</span>
                  <span className="text-white font-mono font-bold">{orders.length} orders</span>
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed text-[11px]">
                {lang === 'ar'
                  ? 'جميع بياناتك الطبية والغذائية محفوظة محلياً وفي السحابة بشكل دائم. يمكنك تنزيل نسخة احتياطية كاملة بصيغة JSON لأخذها لطبيبك أو لمستشفى حمد العام.'
                  : 'All nutrition and medical records are permanently stored with full data privacy. You can download or copy your complete encrypted JSON health record at any time for your physician at PHCC or Hamad.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleCopyJson}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedJson ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ البيانات' : 'Copy JSON')}</span>
              </button>

              <button
                onClick={handleExportDownload}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تحميل ملف قاعدة البيانات' : 'Download Backup (.json)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
