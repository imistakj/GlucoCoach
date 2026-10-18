import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KNOWN_SUGAR_COMPOUNDS, getPubChem2DImageUrl, calculateSugarScienceMetrics } from '../../services/scienceService';
import {
  X,
  Beaker,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface SugarScienceWorkbenchModalProps {
  onClose: () => void;
}

export const SugarScienceWorkbenchModal: React.FC<SugarScienceWorkbenchModalProps> = ({ onClose }) => {
  const { lang, todaySugarIntake, remainingSugarBudget, userProfile } = useApp();
  const [selectedKey, setSelectedKey] = useState<string>('sucrose');

  const selectedBio = KNOWN_SUGAR_COMPOUNDS[selectedKey] || KNOWN_SUGAR_COMPOUNDS.sucrose;
  const cmp = selectedBio.compound;

  const exampleSugarGrams = selectedKey === 'erythritol' ? 0 : 20;
  const metrics = calculateSugarScienceMetrics(exampleSugarGrams, 30, selectedBio.glycemicIndex);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl w-full max-w-2xl max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        
        {/* HEADER */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md">
              <Beaker className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Google DeepMind Science Skill
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  PubChem PUG REST + Reactome
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {lang === 'ar' ? 'منصة الكيمياء الحيوية للسكريات ومسارات الأيض' : 'Biochemical Sugar Science Workbench'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QUICK COMPOUND PILL SELECTOR */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">
            {lang === 'ar' ? 'اختر الجزيء الكيميائي للفحص:' : 'Select Chemical Compound / Sugar Species:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(KNOWN_SUGAR_COMPOUNDS).map(([k, s]) => {
              const isSel = selectedKey === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedKey(k)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSel
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950 ring-1 ring-cyan-400'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{s.compound.title.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono opacity-80">({s.compound.molecularFormula})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="p-5 space-y-5">
          
          {/* Compound Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* 2D Structure Rendering directly from PubChem PUG REST API */}
            <div className="w-32 h-32 rounded-2xl bg-white p-2 border border-slate-700 shadow-md shrink-0 flex items-center justify-center">
              <img
                src={getPubChem2DImageUrl(cmp.cid, '250x250')}
                alt={cmp.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2 min-w-0 flex-1 text-center sm:text-left rtl:sm:text-right">
              <div className="flex items-center justify-center sm:justify-start rtl:sm:justify-end gap-2 flex-wrap">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  PubChem CID: {cmp.cid}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedBio.classification}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  selectedBio.glycemicIndex > 70
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : selectedBio.glycemicIndex > 40
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  GI: {selectedBio.glycemicIndex} ({selectedBio.glycemicIndex === 0 ? 'Zero Glycemic' : selectedBio.glycemicIndex > 70 ? 'High' : 'Moderate'})
                </span>
              </div>

              <h4 className="text-base font-bold text-white">{cmp.title}</h4>
              <p className="text-[11px] font-mono text-slate-400 break-all leading-tight">
                {cmp.iupacName}
              </p>

              {/* Physicochemical Monospace Properties */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Formula</span>
                  <span className="text-white font-bold">{cmp.molecularFormula}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Mol Weight</span>
                  <span className="text-white font-bold">{cmp.molecularWeight} g/mol</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">H-Donors/Acc</span>
                  <span className="text-white font-bold">{cmp.hBondDonorCount || '-'}/{cmp.hBondAcceptorCount || '-'}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">TPSA</span>
                  <span className="text-white font-bold">{cmp.tpsa || '-'} Ų</span>
                </div>
              </div>
            </div>
          </div>

          {/* Canonical SMILES in Monospace */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
              Canonical SMILES (PubChem PUG REST)
            </span>
            <code className="text-xs font-mono text-cyan-300 break-all block bg-slate-900 p-2 rounded-lg border border-slate-800">
              {cmp.canonicalSmiles}
            </code>
          </div>

          {/* Common Sources in Qatari Diet */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              {lang === 'ar' ? 'أشهر الأطعمة والمشروبات في قطر التي تحتوي عليه:' : 'Common Qatari Dining Sources:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedBio.commonSources.map((src, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium"
                >
                  🍲 {src}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Metabolic Fate & Impact on Type 2 Diabetes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'المسار الأيضي بالجسم' : 'Metabolic Processing & Fate'}</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ar' ? selectedBio.metabolicFate.ar : selectedBio.metabolicFate.en}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'التأثير السريري على مرضى السكري' : 'Type 2 Diabetes Clinical Impact'}</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ar' ? selectedBio.diabeticImpact.ar : selectedBio.diabeticImpact.en}
              </p>
            </div>
          </div>

          {/* Reactome Curated Pathway Integration */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">
                  {lang === 'ar' ? 'مسار Reactome البيولوجي المعتمد:' : 'Curated Reactome Biological Pathway:'}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  {selectedBio.reactomePathway.id}
                </span>
              </div>
              <h5 className="text-xs font-bold text-white mt-0.5">
                {selectedBio.reactomePathway.name}
              </h5>
            </div>

            <a
              href={selectedBio.reactomePathway.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1 shrink-0 border border-slate-700 transition-colors"
            >
              <span>{lang === 'ar' ? 'عرض المسار' : 'View in Reactome'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Outbound Authority Link */}
          <div className="text-center pt-2">
            <a
              href={selectedBio.pubchemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
            >
              <span>
                {lang === 'ar'
                  ? `عرض السجل الكامل لمركب ${cmp.title} في قاعدة بيانات PubChem الرسمية (NIH)`
                  : `View authoritative PubChem record for ${cmp.title} (NIH PUG REST)`}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
