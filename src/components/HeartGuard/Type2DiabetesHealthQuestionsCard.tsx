import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Activity,
  Smile,
  Meh,
  Frown,
  AlertOctagon,
  Languages,
  Check,
} from 'lucide-react';

export const Type2DiabetesHealthQuestionsCard: React.FC = () => {
  const { lang, setLang, t, addCheckIn, currentSugarLevel, setCurrentSugarLevel } = useApp();

  // Local card language display preference (can mirror global or allow bilingual comparison)
  const [cardLang, setCardLang] = useState<'ar' | 'hi' | 'en'>(lang as 'ar' | 'hi' | 'en');

  // Form responses
  const [feeling, setFeeling] = useState<'great' | 'good' | 'tired' | 'unwell'>('good');
  const [symptoms, setSymptoms] = useState<'none' | 'thirst' | 'shaky'>('none');
  const [medication, setMedication] = useState<'yes' | 'due' | 'none'>('yes');
  const [glucoseVal, setGlucoseVal] = useState<string>(String(currentSugarLevel || 124));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Sync with global lang when global lang changes
  React.useEffect(() => {
    setCardLang(lang as 'ar' | 'hi' | 'en');
  }, [lang]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericGlucose = Number(glucoseVal) || currentSugarLevel;
    if (numericGlucose > 0) {
      setCurrentSugarLevel(numericGlucose);
    }

    const hasShakiness = symptoms === 'shaky';
    const hasThirst = symptoms === 'thirst';
    const isUnwell = feeling === 'unwell';

    addCheckIn({
      date: new Date().toISOString().slice(0, 10),
      timeOfDay: new Date().getHours() < 12 ? 'morning' : 'evening',
      feelingRating: feeling,
      sleepHours: 7.2,
      sleepQuality: 'good',
      medicationTaken: medication === 'yes',
      glucoseLevel: numericGlucose,
      glucoseTiming: 'random',
      restingHeartRate: 68,
      steps: 4200,
      symptoms: {
        chestTightness: false,
        shortnessOfBreath: false,
        numbnessShoulderJaw: false,
        coldSweat: hasShakiness,
        dizzinessFainting: isUnwell,
        legSwelling: false,
        unusualFatigue: feeling === 'tired' || feeling === 'unwell',
        excessiveThirst: hasThirst,
      },
      notes: `T2D Questions: feeling=${feeling}, sugarSymp=${symptoms}, med=${medication}`,
    });

    // Generate clinical feedback based on selected language
    let clinicalText = '';
    if (hasShakiness) {
      if (cardLang === 'ar') {
        clinicalText =
          'تنبيه سكر منخفض: شعورك بالرجفة قد يدل على هبوط السكر. افحص سكر الدم فوراً، وإذا كان أقل من 70 ملغ/ديسيلتر، تناول 15غ كربوهيدرات سريعة (نصف كوب عصير).';
      } else if (cardLang === 'hi') {
        clinicalText =
          'लो शुगर चेतावनी: कंपकंपी महसूस होना शुगर घटने का संकेत हो सकता है। तुरंत ब्लड शुगर जांचें। यदि 70 से कम है, तो तुरंत 15 ग्राम तेज कार्बोहाइड्रेट (आधा कप जूस) लें।';
      } else {
        clinicalText =
          'Hypoglycemia Alert: Shakiness can indicate low glucose (<70 mg/dL). Check blood sugar immediately and treat with 15g fast-acting carbs if needed.';
      }
    } else if (hasThirst) {
      if (cardLang === 'ar') {
        clinicalText =
          'ملاحظة العطش: قد يعكس ارتفاعاً طفيفاً في سكر الدم أو جفافاً بسبب حرارة وتكييف قطر. احرص على شرب ماء وفير وتجنب المشروبات السكرية.';
      } else if (cardLang === 'hi') {
        clinicalText =
          'प्यास व डिहाइड्रेशन: अत्यधिक प्यास हाई शुगर या कतर के एसी डिहाइड्रेशन का संकेत हो सकती है। खूब पानी पिएं और मीठे पेय से बचें।';
      } else {
        clinicalText =
          'Hyperglycemia / Hydration Note: Thirst may reflect elevated glucose or AC dehydration. Stay well-hydrated with pure water.';
      }
    } else {
      if (cardLang === 'ar') {
        clinicalText =
          'ممتاز! مؤشراتك الصحية لليوم مستقرة. استمر في تناول وجبات متوازنة منخفضة السكر والالتزام بنشاطك اليومي.';
      } else if (cardLang === 'hi') {
        clinicalText =
          'शानदार! आज आपके स्वास्थ्य संकेत स्थिर हैं। संतुलित कम-शुगर आहार लें और दवा का समय पर ध्यान रखें।';
      } else {
        clinicalText =
          'Great! Your wellness indicators are steady today. Continue regular balanced meals and active hydration.';
      }
    }

    setFeedback(clinicalText);
    setIsSubmitted(true);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 p-4 sm:p-6 shadow-2xl space-y-4">
      {/* Header with Bilingual / Trilingual Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                {cardLang === 'ar'
                  ? 'السكري من النوع الثاني'
                  : cardLang === 'hi'
                  ? 'टाइप 2 डायबिटीज'
                  : 'Type 2 Diabetes'}
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                {cardLang === 'ar' ? '٣ أسئلة صحية' : cardLang === 'hi' ? '3 स्वास्थ्य प्रश्न' : '3 Health Questions'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {cardLang === 'ar'
                ? 'الفحص الصحي اليومي لمرضى السكري'
                : cardLang === 'hi'
                ? 'टाइप 2 डायबिटीज दैनिक स्वास्थ्य जांच'
                : 'Type 2 Diabetes Daily Health Check'}
            </h3>
          </div>
        </div>

        {/* In-Card Language Toggle between Arabic, Hindi, and English */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
          <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          <button
            type="button"
            onClick={() => {
              setCardLang('ar');
              setLang('ar');
            }}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              cardLang === 'ar' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            عربي
          </button>
          <button
            type="button"
            onClick={() => {
              setCardLang('hi');
              setLang('hi');
            }}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              cardLang === 'hi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => {
              setCardLang('en');
              setLang('en');
            }}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              cardLang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {isSubmitted ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {cardLang === 'ar'
                ? 'تم تسجيل فحصك الصحي بنجاح وحفظه في قاعدة البيانات!'
                : cardLang === 'hi'
                ? 'आपकी दैनिक स्वास्थ्य जांच सफलतापूर्वक दर्ज और सुरक्षित कर ली गई है!'
                : 'Health check-in recorded successfully and synced to your database!'}
            </span>
          </div>

          {feedback && (
            <p className="text-xs text-slate-200 bg-slate-900/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
              {feedback}
            </p>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
            >
              {cardLang === 'ar' ? 'تعديل أو إعادة الفحص' : cardLang === 'hi' ? 'पुनः जांचें' : 'Update Check-In'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question 1: How are you feeling today? */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center justify-between">
              <span>
                1.{' '}
                {cardLang === 'ar'
                  ? 'كيف تشعر اليوم؟'
                  : cardLang === 'hi'
                  ? 'आज आप कैसा महसूस कर रहे हैं?'
                  : 'How are you feeling today?'}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {cardLang === 'ar' ? '(الحالة العامة والطاقة)' : cardLang === 'hi' ? '(ऊर्जा स्तर)' : '(Energy Level)'}
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFeeling('great')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  feeling === 'great'
                    ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Smile className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">
                  {cardLang === 'ar' ? 'ممتاز وطاقة عالية' : cardLang === 'hi' ? 'बहुत अच्छा' : 'Great'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFeeling('good')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  feeling === 'good'
                    ? 'bg-teal-600/30 border-teal-500 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Smile className="w-4 h-4 text-teal-400" />
                <span className="font-bold">
                  {cardLang === 'ar' ? 'بخير وطبيعي' : cardLang === 'hi' ? 'ठीक / सामान्य' : 'Good'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFeeling('tired')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  feeling === 'tired'
                    ? 'bg-amber-600/30 border-amber-500 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Meh className="w-4 h-4 text-amber-400" />
                <span className="font-bold">
                  {cardLang === 'ar' ? 'مرهق / خمول' : cardLang === 'hi' ? 'थकान / कम ऊर्जा' : 'Tired'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFeeling('unwell')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  feeling === 'unwell'
                    ? 'bg-rose-600/30 border-rose-500 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Frown className="w-4 h-4 text-rose-400" />
                <span className="font-bold">
                  {cardLang === 'ar' ? 'لست على ما يرام' : cardLang === 'hi' ? 'अस्वस्थ' : 'Unwell'}
                </span>
              </button>
            </div>
          </div>

          {/* Question 2: Symptoms of blood sugar fluctuation (thirst, shakiness, dizziness) */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-200">
              2.{' '}
              {cardLang === 'ar'
                ? 'هل تشعر بأي أعراض لارتفاع أو هبوط السكر (عطش شديد، رجفة، دوخة)؟'
                : cardLang === 'hi'
                ? 'क्या आपको शुगर बढ़ने या घटने के लक्षण (अत्यधिक प्यास, कंपकंपी, चक्कर) महसूस हुए?'
                : 'Any symptoms of blood sugar changes (extreme thirst, shakiness, dizziness)?'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSymptoms('none')}
                className={`p-3 rounded-xl border text-start transition-all ${
                  symptoms === 'none'
                    ? 'bg-emerald-600/25 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${symptoms === 'none' ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                  <span className="font-bold">
                    {cardLang === 'ar' ? 'لا، السكر مستقر' : cardLang === 'hi' ? 'नहीं, शुगर स्थिर है' : 'None / Stable'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {cardLang === 'ar'
                    ? 'لا عطش غير طبيعي ولا رجفة'
                    : cardLang === 'hi'
                    ? 'कोई कंपकंपी या प्यास नहीं'
                    : 'No shakiness or abnormal thirst'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSymptoms('thirst')}
                className={`p-3 rounded-xl border text-start transition-all ${
                  symptoms === 'thirst'
                    ? 'bg-amber-600/25 border-amber-500 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${symptoms === 'thirst' ? 'bg-amber-400' : 'bg-slate-700'}`} />
                  <span className="font-bold">
                    {cardLang === 'ar' ? 'عطش شديد أو جفاف' : cardLang === 'hi' ? 'अत्यधिक प्यास / थकान' : 'Thirst / Fatigue'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {cardLang === 'ar'
                    ? 'جفاف الفم أو كثرة التبول'
                    : cardLang === 'hi'
                    ? 'मुंह सूखना / बार-बार पेशाब'
                    : 'Dry mouth or frequent urination'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSymptoms('shaky')}
                className={`p-3 rounded-xl border text-start transition-all ${
                  symptoms === 'shaky'
                    ? 'bg-rose-600/25 border-rose-500 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${symptoms === 'shaky' ? 'bg-rose-400' : 'bg-slate-700'}`} />
                  <span className="font-bold">
                    {cardLang === 'ar' ? 'رجفة أو عرق بارد' : cardLang === 'hi' ? 'कंपकंपी / पसीना (लो शुगर)' : 'Shakiness / Hypo'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {cardLang === 'ar'
                    ? 'اشتباه هبوط السكر (تحت 70)'
                    : cardLang === 'hi'
                    ? 'संभावित लो शुगर (< 70 mg/dL)'
                    : 'Possible low sugar (< 70 mg/dL)'}
                </span>
              </button>
            </div>
          </div>

          {/* Question 3: Diabetes Medication / Insulin */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-200">
              3.{' '}
              {cardLang === 'ar'
                ? 'هل تناولت أدوية السكري (ميتفورمين / إنسولين) اليوم؟'
                : cardLang === 'hi'
                ? 'क्या आपने आज अपनी डायबिटीज की दवा (मेटफॉर्मिन / इंसुलिन) ली है?'
                : 'Have you taken your diabetes medication or insulin today?'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMedication('yes')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  medication === 'yes'
                    ? 'bg-emerald-600/30 border-emerald-500 text-white font-bold'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {cardLang === 'ar'
                  ? 'نعم، أخذت الدواء في موعده'
                  : cardLang === 'hi'
                  ? 'हाँ, समय पर ले लिया'
                  : 'Yes, taken on time'}
              </button>

              <button
                type="button"
                onClick={() => setMedication('due')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  medication === 'due'
                    ? 'bg-amber-600/30 border-amber-500 text-white font-bold'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {cardLang === 'ar'
                  ? 'ليس بعد / حان وقته الآن'
                  : cardLang === 'hi'
                  ? 'अभी नहीं / लेने का समय है'
                  : 'Not yet / Due now'}
              </button>

              <button
                type="button"
                onClick={() => setMedication('none')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  medication === 'none'
                    ? 'bg-slate-800 border-slate-600 text-white font-bold'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {cardLang === 'ar'
                  ? 'لا أحتاج أدوية (نظام غذائي فقط)'
                  : cardLang === 'hi'
                  ? 'दवा नहीं (केवल आहार नियंत्रण)'
                  : 'Diet-only / No meds'}
              </button>
            </div>
          </div>

          {/* Quick optional blood glucose value */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-300">
              {cardLang === 'ar'
                ? 'آخر قراءة سكر (اختياري - ملغ/ديسيلتر):'
                : cardLang === 'hi'
                ? 'ताज़ा शुगर रीडिंग (वैकल्पिक - mg/dL):'
                : 'Latest Blood Glucose (optional - mg/dL):'}
            </span>
            <div className="flex items-center gap-1.5 w-24">
              <input
                type="number"
                value={glucoseVal}
                onChange={(e) => setGlucoseVal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-center font-bold text-xs"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>
              {cardLang === 'ar'
                ? 'تسجيل إجابات الفحص اليومي وحفظها'
                : cardLang === 'hi'
                ? 'दैनिक स्वास्थ्य जांच सहेजें'
                : 'Submit Daily Health Check'}
            </span>
          </button>
        </form>
      )}
    </div>
  );
};
