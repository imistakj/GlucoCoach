import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyCheckIn } from '../../types';
import { EmergencyRedModal } from './EmergencyRedModal';
import { AmberAlertModal } from './AmberAlertModal';
import { GlucoseTrendChart } from './GlucoseTrendChart';
import { Type2DiabetesHealthQuestionsCard } from './Type2DiabetesHealthQuestionsCard';
import {
  HeartPulse,
  Activity,
  Watch,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Moon,
  Pill,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Footprints,
} from 'lucide-react';

export const HeartGuardView: React.FC = () => {
  const {
    lang,
    t,
    unit,
    formatGlucose,
    dailyCheckIns,
    addCheckIn,
    triageStatus,
    wearableSynced,
    syncWearable,
    todayRestingHr,
    todaySteps,
    todaySleepHours,
    triggerRedEmergency,
    setAmberAlertOpen,
  } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form fields
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>('morning');
  const [feelingRating, setFeelingRating] = useState<'great' | 'good' | 'tired' | 'unwell'>('good');
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState<'good' | 'fair' | 'poor'>('good');
  const [medicationTaken, setMedicationTaken] = useState(true);
  const [glucoseInput, setGlucoseInput] = useState('');
  const [glucoseTiming, setGlucoseTiming] = useState<'fasting' | 'post_meal' | 'pre_meal' | 'bedtime'>('fasting');

  // Red-flag symptom checkboxes
  const [chestTightness, setChestTightness] = useState(false);
  const [shortnessOfBreath, setShortnessOfBreath] = useState(false);
  const [numbnessShoulderJaw, setNumbnessShoulderJaw] = useState(false);
  const [coldSweat, setColdSweat] = useState(false);
  const [dizzinessFainting, setDizzinessFainting] = useState(false);
  const [legSwelling, setLegSwelling] = useState(false);
  const [unusualFatigue, setUnusualFatigue] = useState(false);
  const [excessiveThirst, setExcessiveThirst] = useState(false);

  const handleSubmitCheckIn = (e: React.FormEvent) => {
    e.preventDefault();

    let rawGlucose: number | undefined = undefined;
    if (glucoseInput.trim()) {
      const val = parseFloat(glucoseInput);
      if (!isNaN(val)) {
        rawGlucose = unit === 'mmol/L' ? Math.round(val * 18.0182) : Math.round(val);
      }
    }

    const checkInData: Omit<DailyCheckIn, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      timeOfDay,
      feelingRating,
      sleepHours,
      sleepQuality,
      medicationTaken,
      glucoseLevel: rawGlucose,
      glucoseTiming,
      restingHeartRate: todayRestingHr,
      steps: todaySteps,
      symptoms: {
        chestTightness,
        shortnessOfBreath,
        numbnessShoulderJaw,
        coldSweat,
        dizzinessFainting,
        legSwelling,
        unusualFatigue,
        excessiveThirst,
      },
      triageLevel: 'GREEN', // will be evaluated inside context
    };

    addCheckIn(checkInData);
    setIsFormOpen(false);

    // Reset inputs
    setGlucoseInput('');
    setChestTightness(false);
    setShortnessOfBreath(false);
    setNumbnessShoulderJaw(false);
    setColdSweat(false);
    setDizzinessFainting(false);
  };

  const getTriageBanner = () => {
    switch (triageStatus) {
      case 'RED':
        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/80 border-2 border-rose-500 shadow-xl shadow-rose-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-black text-sm sm:text-base text-rose-200">
                  {t.triageRed}
                </h3>
                <p className="text-xs text-rose-300/90 mt-0.5">
                  {t.triageRedDesc}
                </p>
              </div>
            </div>
            <button
              onClick={triggerRedEmergency}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0 shadow-lg"
            >
              <PhoneCall className="w-4 h-4 fill-current" />
              <span>{t.call999Btn}</span>
            </button>
          </div>
        );
      case 'AMBER':
        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/60 border-2 border-amber-500/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm sm:text-base text-amber-200">
                  {t.triageAmber}
                </h3>
                <p className="text-xs text-amber-300/90 mt-0.5">
                  {t.triageAmberDesc}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAmberAlertOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-md"
            >
              <span>{lang === 'ar' ? 'عرض التوصية والتنبيه' : 'View Advisory'}</span>
            </button>
          </div>
        );
      default:
        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-emerald-200">
                {t.triageGreen}
              </h3>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                {t.triageGreenDesc}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <HeartPulse className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">
            {lang === 'ar' ? 'الرعاية الصحية الأولية • طوارئ 999' : 'PHCC • Heart Guard • Emergency Triage'}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {t.heartGuardTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          {t.heartGuardSubtitle}
        </p>
      </div>

      {/* Three-Level Triage Status Banner */}
      {getTriageBanner()}

      {/* Type 2 Diabetes Daily Health Questions (Hindi, Arabic, English) */}
      <Type2DiabetesHealthQuestionsCard />

      {/* Wearable Sync & Vitals Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Watch className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                {lang === 'ar' ? 'مزامنة الساعات والأجهزة الذكية' : 'Wearable Vitals & Activity Sync'}
              </h3>
              <span className="text-[11px] text-slate-400">
                {wearableSynced ? t.wearableSynced : 'Apple Health / Garmin / Whoop'}
              </span>
            </div>
          </div>

          <button
            onClick={syncWearable}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
              wearableSynced
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{wearableSynced ? t.wearableSynced : t.syncWearableBtn}</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">
              {t.restingHr}
            </span>
            <div className="text-sm sm:text-base font-bold text-white flex items-center justify-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              <span>{todayRestingHr} bpm</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-medium">Normal Baseline</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">
              {t.todaySteps}
            </span>
            <div className="text-sm sm:text-base font-bold text-white flex items-center justify-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-emerald-400" />
              <span>{todaySteps.toLocaleString()}</span>
            </div>
            <span className="text-[9px] text-slate-400">Target: 8,000</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">
              {t.sleepDuration}
            </span>
            <div className="text-sm sm:text-base font-bold text-white flex items-center justify-center gap-1">
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span>{todaySleepHours} hrs</span>
            </div>
            <span className="text-[9px] text-sky-400 font-medium">Restful</span>
          </div>
        </div>
      </div>

      {/* 7-Day Glucose Trends & Anomaly Detection Visualization */}
      <GlucoseTrendChart />

      {/* Daily Check-In Collapsible Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full px-5 py-4 flex items-center justify-between text-left rtl:text-right hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {t.dailyCheckInBtn}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'فحص الصباح والمساء لرصد مؤشرات القلب والسكري' : 'Morning & evening symptom and glucose check'}
              </p>
            </div>
          </div>
          {isFormOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {isFormOpen && (
          <form onSubmit={handleSubmitCheckIn} className="p-5 border-t border-slate-800 space-y-4">
            {/* Time of day selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl">
              <button
                type="button"
                onClick={() => setTimeOfDay('morning')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeOfDay === 'morning' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                {t.morningCheck}
              </button>
              <button
                type="button"
                onClick={() => setTimeOfDay('evening')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeOfDay === 'evening' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                {t.eveningCheck}
              </button>
            </div>

            {/* How are you feeling today */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.howFeeling}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'great', label: lang === 'ar' ? 'ممتاز' : 'Great' },
                  { id: 'good', label: lang === 'ar' ? 'جيد' : 'Good' },
                  { id: 'tired', label: lang === 'ar' ? 'مرهق' : 'Tired' },
                  { id: 'unwell', label: lang === 'ar' ? 'تعبان' : 'Unwell' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFeelingRating(item.id as any)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                      feelingRating === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Medication taken & Sleep quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-300 font-medium">{t.medicationPrompt}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMedicationTaken(!medicationTaken)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    medicationTaken ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {medicationTaken ? (lang === 'ar' ? 'نعم' : 'Yes') : (lang === 'ar' ? 'لا' : 'No')}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span className="text-xs text-slate-300 font-medium">{t.sleepQualityPrompt}</span>
                </div>
                <select
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value as any)}
                  className="bg-slate-900 text-xs text-white border border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="good">{lang === 'ar' ? 'نوم مريح' : 'Good'}</option>
                  <option value="fair">{lang === 'ar' ? 'متوسط' : 'Fair'}</option>
                  <option value="poor">{lang === 'ar' ? 'متقطع / سيء' : 'Poor'}</option>
                </select>
              </div>
            </div>

            {/* Glucose Reading input */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>{t.logGlucoseBtn}</span>
                </label>
                <span className="text-[11px] text-slate-400">{t.targetRange}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder={unit === 'mg/dL' ? 'e.g. 110 mg/dL' : 'e.g. 6.1 mmol/L'}
                  value={glucoseInput}
                  onChange={(e) => setGlucoseInput(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />

                <select
                  value={glucoseTiming}
                  onChange={(e) => setGlucoseTiming(e.target.value as any)}
                  className="bg-slate-900 text-xs text-white border border-slate-800 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="fasting">{lang === 'ar' ? 'صائم (صباحاً)' : 'Fasting (Morning)'}</option>
                  <option value="post_meal">{lang === 'ar' ? 'بعد الأكل بساعتين' : '2h Post-Meal'}</option>
                  <option value="pre_meal">{lang === 'ar' ? 'قبل الوجبة' : 'Pre-Meal'}</option>
                  <option value="bedtime">{lang === 'ar' ? 'قبل النوم' : 'Bedtime'}</option>
                </select>
              </div>
            </div>

            {/* Red-Flag Heart Symptoms Checklist (CRITICAL TRIAGE SAFETY) */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-300">
                <AlertOctagon className="w-4 h-4" />
                <h4 className="text-xs font-bold">{t.anyRedFlags}</h4>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  {
                    checked: chestTightness,
                    setter: setChestTightness,
                    label: t.chestTightness,
                    isRed: true,
                  },
                  {
                    checked: shortnessOfBreath,
                    setter: setShortnessOfBreath,
                    label: t.shortnessOfBreath,
                    isRed: true,
                  },
                  {
                    checked: numbnessShoulderJaw,
                    setter: setNumbnessShoulderJaw,
                    label: t.numbnessShoulderJaw,
                    isRed: true,
                  },
                  {
                    checked: coldSweat,
                    setter: setColdSweat,
                    label: t.coldSweat,
                    isRed: true,
                  },
                  {
                    checked: dizzinessFainting,
                    setter: setDizzinessFainting,
                    label: t.dizzinessFainting,
                    isRed: true,
                  },
                  {
                    checked: legSwelling,
                    setter: setLegSwelling,
                    label: t.legSwelling,
                    isRed: false,
                  },
                  {
                    checked: unusualFatigue,
                    setter: setUnusualFatigue,
                    label: t.unusualFatigue,
                    isRed: false,
                  },
                ].map((symptom, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                      symptom.checked ? 'bg-rose-950/60 border border-rose-500/50' : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={symptom.checked}
                      onChange={(e) => symptom.setter(e.target.checked)}
                      className="mt-0.5 rounded text-rose-500 focus:ring-rose-500 accent-rose-600"
                    />
                    <span className={`${symptom.checked ? 'text-rose-200 font-semibold' : 'text-slate-300'}`}>
                      {symptom.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {t.submitCheckIn}
            </button>
          </form>
        )}
      </div>

      {/* Culturally Relevant Daily Micro-Habits in Qatar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          {t.microHabitsTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              Habit 1 • Movement
            </span>
            <p className="text-xs text-slate-300 leading-snug">{t.habit1}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
              Habit 2 • Climate Hydration
            </span>
            <p className="text-xs text-slate-300 leading-snug">{t.habit2}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              Habit 3 • Meal Sequencing
            </span>
            <p className="text-xs text-slate-300 leading-snug">{t.habit3}</p>
          </div>
        </div>
      </div>

      {/* Recent Glucose & Check-In History */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <h3 className="font-bold text-sm text-slate-200">
          {t.recentReadings}
        </h3>

        <div className="space-y-2">
          {dailyCheckIns.map((rec) => {
            const isRed = rec.triageLevel === 'RED';
            const isAmber = rec.triageLevel === 'AMBER';

            return (
              <div
                key={rec.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {rec.date} ({rec.timeOfDay === 'morning' ? t.morningCheck : t.eveningCheck})
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isRed
                          ? 'bg-rose-500/20 text-rose-300'
                          : isAmber
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {rec.triageLevel}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Sleep: {rec.sleepHours}h • HR: {rec.restingHeartRate || 68} bpm • Meds: {rec.medicationTaken ? '✓' : '✗'}
                  </div>
                </div>

                {rec.glucoseLevel && (
                  <div className="text-right">
                    <span
                      className={`text-sm font-bold block ${
                        rec.glucoseLevel > 180
                          ? 'text-rose-400'
                          : rec.glucoseLevel > 140
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {formatGlucose(rec.glucoseLevel)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {rec.glucoseTiming || 'reading'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Modals */}
      <EmergencyRedModal />
      <AmberAlertModal />
    </div>
  );
};
