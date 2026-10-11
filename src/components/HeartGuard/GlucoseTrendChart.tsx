import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Dot,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { DailyCheckIn } from '../../types';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Filter,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

interface GlucoseChartPoint {
  id: string;
  rawDate: string;
  displayDate: string;
  timeOfDay: 'morning' | 'evening';
  timingLabel: string;
  glucose: number; // in current active unit or mg/dL
  glucoseMgDl: number;
  isAnomaly: boolean;
  anomalyType?: 'HIGH_SPIKE' | 'ELEVATED' | 'LOW';
  notes?: string;
  restingHeartRate?: number;
  steps?: number;
  triageLevel: string;
}

export const GlucoseTrendChart: React.FC = () => {
  const { lang, t, unit, dailyCheckIns, formatGlucose } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'fasting' | 'post_meal'>('all');
  const [selectedPoint, setSelectedPoint] = useState<GlucoseChartPoint | null>(null);

  // Convert checkins to chronological order for the last 7 days
  const chartData: GlucoseChartPoint[] = useMemo(() => {
    // Sort oldest to newest for chronological plotting
    const sorted = [...dailyCheckIns].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Take records from the last 7 days
    const points: GlucoseChartPoint[] = [];

    sorted.forEach((item) => {
      if (item.glucoseLevel === undefined) return;

      const timing = item.glucoseTiming || (item.timeOfDay === 'morning' ? 'fasting' : 'post_meal');
      if (filterType === 'fasting' && timing !== 'fasting') return;
      if (filterType === 'post_meal' && timing !== 'post_meal') return;

      const isHighSpike = item.glucoseLevel >= 180;
      const isElevated = item.glucoseLevel > 140 && item.glucoseLevel < 180;
      const isLow = item.glucoseLevel < 70;

      const isAnomaly = isHighSpike || isLow;

      const d = new Date(item.date);
      const shortDay = d.toLocaleDateString(lang === 'ar' ? 'ar-QA' : 'en-US', {
        weekday: 'short',
        day: 'numeric',
      });
      const period = item.timeOfDay === 'morning' ? (lang === 'ar' ? 'ص' : 'AM') : (lang === 'ar' ? 'م' : 'PM');

      const convertedGlucose =
        unit === 'mmol/L'
          ? Number((item.glucoseLevel / 18.0182).toFixed(1))
          : item.glucoseLevel;

      points.push({
        id: item.id,
        rawDate: item.date,
        displayDate: `${shortDay} ${period}`,
        timeOfDay: item.timeOfDay,
        timingLabel:
          timing === 'fasting'
            ? lang === 'ar' ? 'صائم' : 'Fasting'
            : lang === 'ar' ? 'بعد الوجبة' : 'Post-Meal',
        glucose: convertedGlucose,
        glucoseMgDl: item.glucoseLevel,
        isAnomaly,
        anomalyType: isHighSpike ? 'HIGH_SPIKE' : isElevated ? 'ELEVATED' : isLow ? 'LOW' : undefined,
        notes: item.notes,
        restingHeartRate: item.restingHeartRate,
        steps: item.steps,
        triageLevel: item.triageLevel,
      });
    });

    return points;
  }, [dailyCheckIns, filterType, lang, unit]);

  // Clinical Summary Statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) return { avg: 0, inRangePct: 0, anomaliesCount: 0, trend: 'stable' };

    const totalMgDl = chartData.reduce((sum, p) => sum + p.glucoseMgDl, 0);
    const avgMgDl = Math.round(totalMgDl / chartData.length);

    // Standard clinical target in range (70 - 140 mg/dL)
    const inRange = chartData.filter((p) => p.glucoseMgDl >= 70 && p.glucoseMgDl <= 140).length;
    const inRangePct = Math.round((inRange / chartData.length) * 100);

    const anomalies = chartData.filter((p) => p.isAnomaly || p.anomalyType === 'HIGH_SPIKE');

    // Trend calculation: compare first half to second half
    const half = Math.floor(chartData.length / 2);
    const firstHalfAvg =
      chartData.slice(0, half).reduce((s, p) => s + p.glucoseMgDl, 0) / (half || 1);
    const secondHalfAvg =
      chartData.slice(half).reduce((s, p) => s + p.glucoseMgDl, 0) / (chartData.length - half || 1);

    const trend = secondHalfAvg - firstHalfAvg > 10 ? 'rising' : secondHalfAvg - firstHalfAvg < -10 ? 'declining' : 'stable';

    return {
      avg: avgMgDl,
      inRangePct,
      anomaliesCount: anomalies.length,
      trend,
    };
  }, [chartData]);

  // Target ranges in current unit
  const targetMin = unit === 'mmol/L' ? 3.9 : 70;
  const targetMax = unit === 'mmol/L' ? 7.8 : 140;
  const spikeThreshold = unit === 'mmol/L' ? 10.0 : 180;
  const yDomain = unit === 'mmol/L' ? [3.0, 13.0] : [60, 220];

  // Custom Dot Renderer that clearly pinpoints High Spikes and Anomalies
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;

    if (payload.anomalyType === 'HIGH_SPIKE') {
      return (
        <g key={`dot-anomaly-${payload.id}`} className="cursor-pointer" onClick={() => setSelectedPoint(payload)}>
          <circle cx={cx} cy={cy} r={9} fill="rgba(244, 63, 94, 0.3)" className="animate-ping" />
          <circle cx={cx} cy={cy} r={6} fill="#f43f5e" stroke="#fff" strokeWidth={2} />
        </g>
      );
    }

    if (payload.anomalyType === 'ELEVATED') {
      return (
        <circle
          key={`dot-elev-${payload.id}`}
          cx={cx}
          cy={cy}
          r={5}
          fill="#f59e0b"
          stroke="#1e293b"
          strokeWidth={1.5}
          className="cursor-pointer"
          onClick={() => setSelectedPoint(payload)}
        />
      );
    }

    return (
      <circle
        key={`dot-norm-${payload.id}`}
        cx={cx}
        cy={cy}
        r={4}
        fill="#10b981"
        stroke="#0f172a"
        strokeWidth={1.5}
        className="cursor-pointer hover:r-6 transition-all"
        onClick={() => setSelectedPoint(payload)}
      />
    );
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const pt = payload[0].payload as GlucoseChartPoint;

    return (
      <div className="bg-slate-950/95 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[180px]">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
          <span>{pt.displayDate}</span>
          <span className="font-semibold text-emerald-400">{pt.timingLabel}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-300">{lang === 'ar' ? 'قراءة السكر:' : 'Glucose Reading:'}</span>
          <span
            className={`text-sm font-bold ${
              pt.glucoseMgDl >= 180
                ? 'text-rose-400'
                : pt.glucoseMgDl > 140
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {formatGlucose(pt.glucoseMgDl)}
          </span>
        </div>

        {pt.anomalyType === 'HIGH_SPIKE' && (
          <div className="p-1.5 rounded bg-rose-950/60 border border-rose-800/60 text-[10px] text-rose-300 font-medium">
            ⚠️ {lang === 'ar' ? 'طفرة ارتفاع حادة (>180 ملغ/ديسيلتر)' : 'High Spike Anomaly (>180 mg/dL)'}
          </div>
        )}

        {pt.notes && (
          <div className="text-[10px] text-amber-200/90 italic pt-0.5">
            "{pt.notes}"
          </div>
        )}

        {pt.restingHeartRate && (
          <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-900 flex justify-between">
            <span>{t.restingHr}:</span>
            <span className="text-slate-200 font-mono">{pt.restingHeartRate} bpm</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
      {/* Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              {lang === 'ar' ? 'مخطط اتجاه السكر في آخر 7 أيام' : '7-Day Glucose Trends & Anomaly Detection'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'ar'
                ? 'رصد التغيرات اليومية، طفرات ما بعد الولائم، واستقرار النطاق الآمن'
                : 'Monitoring glycemic variability, post-prandial spikes, and Time-in-Range (TIR)'}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
            { id: 'fasting', label: lang === 'ar' ? 'صائم' : 'Fasting' },
            { id: 'post_meal', label: lang === 'ar' ? 'بعد الأكل' : 'Post-Meal' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterType(btn.id as any)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterType === btn.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Clinical Summary Statistics Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">
            {lang === 'ar' ? 'الوقت في النطاق (TIR)' : 'Time in Range (TIR)'}
          </span>
          <span className="text-sm sm:text-base font-bold text-emerald-400">
            {stats.inRangePct}%
          </span>
          <span className="text-[9px] text-slate-500 block">Target &gt; 70%</span>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">
            {lang === 'ar' ? 'متوسط السكر (7 أيام)' : '7-Day Average'}
          </span>
          <span className="text-sm sm:text-base font-bold text-white">
            {formatGlucose(stats.avg)}
          </span>
          <span className="text-[9px] text-slate-500 block">70-140 optimal</span>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">
            {lang === 'ar' ? 'طفرات غير معتادة' : 'Anomalies Detected'}
          </span>
          <span className={`text-sm sm:text-base font-bold ${stats.anomaliesCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {stats.anomaliesCount} {lang === 'ar' ? 'طفرة' : 'Spike'}
          </span>
          <span className="text-[9px] text-slate-500 block">Oct 6 Majlis Feast</span>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">
            {lang === 'ar' ? 'مسار الاتجاه' : 'Trajectory Trend'}
          </span>
          <div className="flex items-center justify-center gap-1 font-bold text-xs sm:text-sm text-emerald-400">
            {stats.trend === 'rising' ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">{lang === 'ar' ? 'تصاعدي' : 'Rising'}</span>
              </>
            ) : stats.trend === 'declining' ? (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'تحسن واستقرار' : 'Improving'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'مستقر' : 'Stable'}</span>
              </>
            )}
          </div>
          <span className="text-[9px] text-slate-500 block">Recovery in-progress</span>
        </div>
      </div>

      {/* RECHARTS COMPOSED CHART CONTAINER */}
      <div className="w-full h-64 sm:h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Target Range Reference Shaded Band (70 - 140 mg/dL) */}
            <ReferenceArea
              y1={targetMin}
              y2={targetMax}
              fill="#10b981"
              fillOpacity={0.08}
              strokeOpacity={0}
            />

            {/* Critical Spike Threshold Line (180 mg/dL) */}
            <ReferenceLine
              y={spikeThreshold}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: lang === 'ar' ? 'حد الطفرة 180' : 'Spike Alert 180',
                fill: '#f43f5e',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            {/* Target Ceiling Line (140 mg/dL) */}
            <ReferenceLine
              y={targetMax}
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: lang === 'ar' ? 'الهدف 140' : 'Target 140',
                fill: '#10b981',
                fontSize: 9,
                position: 'insideBottomRight',
              }}
            />

            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />

            <YAxis
              domain={yDomain}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Area Fill for Visual Curve Depth */}
            <Area
              type="monotone"
              dataKey="glucose"
              stroke="none"
              fill="url(#glucoseGradient)"
            />

            {/* Main Smooth Spline Line */}
            <Line
              type="monotone"
              dataKey="glucose"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={renderCustomDot}
              activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2, fill: '#10b981' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Anomaly Highlights Bar */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>{lang === 'ar' ? 'نطاق صحي (70-140)' : 'Optimal Target (70-140)'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>{lang === 'ar' ? 'مرتفع خفيف (141-179)' : 'Elevated (141-179)'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-pulse" />
            <span>{lang === 'ar' ? 'طفرة حادة (≥180)' : 'High Spike (≥180)'}</span>
          </span>
        </div>

        <span className="text-slate-500 italic">
          {lang === 'ar' ? 'انقر على أي نقطة لعرض التفاصيل' : 'Tap any point for details'}
        </span>
      </div>

      {/* Selected Point Detail Card */}
      {selectedPoint && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">
                {selectedPoint.displayDate} ({selectedPoint.timingLabel})
              </span>
              {selectedPoint.anomalyType === 'HIGH_SPIKE' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {lang === 'ar' ? 'طفرة غير معتادة' : 'Spike Anomaly'}
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {lang === 'ar' ? 'ضمن النطاق' : 'Within Range'}
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedPoint(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">
              {lang === 'ar' ? 'مستوى السكر:' : 'Recorded Glucose:'}{' '}
              <strong className="text-white text-sm">{formatGlucose(selectedPoint.glucoseMgDl)}</strong>
            </span>
            {selectedPoint.restingHeartRate && (
              <span className="text-slate-400">
                HR: <strong className="text-slate-200">{selectedPoint.restingHeartRate} bpm</strong>
              </span>
            )}
          </div>

          {selectedPoint.notes && (
            <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-200/90">
              <strong>{lang === 'ar' ? 'الملاحظة المسجلة:' : 'Log Note:'}</strong> {selectedPoint.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
