import React, { useState } from 'react';
import { ChemicalProperties } from '../types/chemistry';
import { getElement } from '../services/elementData';
import {
  Compass,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface Props {
  properties: ChemicalProperties;
}

export const PropertyInspector: React.FC<Props> = ({ properties }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const vsepr = properties.vsepr;

  return (
    <div className="space-y-4">
      {/* Overview Identity Card */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">{properties.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {properties.formula}
              </span>
              {properties.iupacName && properties.iupacName !== properties.name && (
                <span className="text-xs text-slate-500 italic truncate max-w-[280px]" title={properties.iupacName}>
                  {properties.iupacName}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Molecular Weight</span>
            <span className="text-base font-bold font-mono text-slate-800">
              {properties.molecularWeight.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">g/mol</span>
            </span>
          </div>
        </div>
      </div>

      {/* VSEPR & Quantum Geometry Card */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              VSEPR & Orbital Hybridization
            </h3>
          </div>
          <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
            {vsepr.hybridization}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Steric Number (SN)</span>
            <span className="text-base font-bold font-mono text-slate-800">{vsepr.stericNumber}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Bonding Pairs</span>
            <span className="text-base font-bold font-mono text-slate-800">{vsepr.bondingPairs}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Lone Pairs</span>
            <span className="text-base font-bold font-mono text-amber-600">{vsepr.lonePairs}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Ideal Bond Angle</span>
            <span className="text-base font-bold font-mono text-slate-800">
              {vsepr.actualBondAngle ? `${vsepr.actualBondAngle}°` : `${vsepr.idealBondAngle}°`}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-slate-700 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-900">Electron Geometry:</span>
            <span className="font-semibold text-slate-800">{vsepr.electronGeometry}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-900">Molecular Shape:</span>
            <span className="font-semibold text-slate-800">{vsepr.molecularShape}</span>
          </div>
          <p className="text-[11px] text-slate-600 pt-1 leading-relaxed border-t border-blue-100/60 mt-1">
            {vsepr.geometryDescription}
          </p>
        </div>
      </div>

      {/* Elemental Mass Composition Breakdown */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Elemental Composition (% by Mass)
        </h3>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
          {properties.elementalComposition.map((frac) => {
            const elem = getElement(frac.element);
            return (
              <div
                key={frac.element}
                style={{ width: `${frac.massPercent}%`, backgroundColor: elem.cpkColor }}
                title={`${frac.element}: ${frac.massPercent.toFixed(1)}%`}
                className="h-full transition-all border-r border-white/20 last:border-0"
              />
            );
          })}
        </div>

        {/* Breakdown Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {properties.elementalComposition.map((frac) => {
            const elem = getElement(frac.element);
            return (
              <div
                key={frac.element}
                className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: elem.cpkColor }}
                  />
                  <span className="font-bold text-slate-800">{frac.element}</span>
                  <span className="text-slate-400 font-mono text-[11px]">×{frac.count}</span>
                </div>
                <span className="font-mono font-semibold text-slate-700">
                  {frac.massPercent.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physicochemical Properties Grid */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Physicochemical Properties
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Polarity</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              {properties.polarity}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Dipole Moment</span>
            <span className="font-semibold font-mono text-slate-800 mt-0.5 block">
              {properties.estimatedDipoleDebye.toFixed(2)} D
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Lipophilicity (XLogP)</span>
            <span className="font-semibold font-mono text-slate-800 mt-0.5 block">
              {properties.xlogp !== undefined ? properties.xlogp : '—'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Polar Surface (TPSA)</span>
            <span className="font-semibold font-mono text-slate-800 mt-0.5 block">
              {properties.tpsa !== undefined ? `${properties.tpsa} Å²` : '—'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">H-Bond Donors</span>
            <span className="font-semibold font-mono text-slate-800 mt-0.5 block">
              {properties.hBondDonorCount !== undefined ? properties.hBondDonorCount : '—'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">H-Bond Acceptors</span>
            <span className="font-semibold font-mono text-slate-800 mt-0.5 block">
              {properties.hBondAcceptorCount !== undefined ? properties.hBondAcceptorCount : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Drug Discovery & Bioavailability Rules */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Medicinal Chemistry Bioavailability Rules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Lipinski Rule of 5 */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Lipinski's Rule of 5</span>
              {properties.lipinskiPassed ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Passes
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <XCircle className="w-3 h-3" /> Violations
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Evaluates oral drug bioavailability (MW ≤ 500, LogP ≤ 5, HBD ≤ 5, HBA ≤ 10).
            </p>
          </div>

          {/* Veber's Rules */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Veber's Criteria</span>
              {properties.veberPassed ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Passes
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <XCircle className="w-3 h-3" /> Violations
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Conformational flexibility (Rotatable Bonds ≤ 10, TPSA ≤ 140 Å²).
            </p>
          </div>
        </div>
      </div>

      {/* SMILES & InChIKey Copy Cards */}
      {(properties.smiles || properties.inchiKey) && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Chemical Identifiers
          </h3>

          {properties.smiles && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <div className="truncate pr-2">
                <span className="text-slate-400 text-[10px] block uppercase font-mono">SMILES</span>
                <span className="font-mono text-slate-800 text-[11px] select-all">{properties.smiles}</span>
              </div>
              <button
                onClick={() => copyToClipboard(properties.smiles!, 'smiles')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-500 transition-colors shrink-0"
                title="Copy SMILES"
              >
                {copiedKey === 'smiles' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {properties.inchiKey && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <div className="truncate pr-2">
                <span className="text-slate-400 text-[10px] block uppercase font-mono">InChIKey</span>
                <span className="font-mono text-slate-800 text-[11px] select-all">{properties.inchiKey}</span>
              </div>
              <button
                onClick={() => copyToClipboard(properties.inchiKey!, 'inchikey')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-500 transition-colors shrink-0"
                title="Copy InChIKey"
              >
                {copiedKey === 'inchikey' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
