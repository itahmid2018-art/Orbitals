import React, { useState, useMemo } from 'react';
import { ChemicalProperties, Atom3D } from '../types/chemistry';
import { getElement } from '../services/elementData';
import { parseFormula } from '../services/chemistryEngine';
import {
  Compass,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Zap,
  Scale,
  PieChart,
  Layers,
  Atom,
  Hash,
  Sparkles,
} from 'lucide-react';

interface Props {
  properties: ChemicalProperties;
  atoms?: Atom3D[];
}

export const PropertyInspector: React.FC<Props> = ({ properties, atoms = [] }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [highPrecision, setHighPrecision] = useState(false);
  const [selectedCompositionElement, setSelectedCompositionElement] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Derive stoichiometric counts directly from active molecule atoms if available, or parse formula
  const activeCounts = useMemo(() => {
    if (atoms && atoms.length > 0) {
      const counts: Record<string, number> = {};
      for (const atom of atoms) {
        counts[atom.element] = (counts[atom.element] || 0) + 1;
      }
      return counts;
    }
    return parseFormula(properties.formula);
  }, [atoms, properties.formula]);

  // Reactive calculation of molecular weight and elemental composition breakdown
  const compositionData = useMemo(() => {
    let totalMass = 0;
    let totalAtomCount = 0;
    let heavyAtomCount = 0;

    const entries = Object.entries(activeCounts);
    for (const [elem, count] of entries) {
      const data = getElement(elem);
      totalMass += data.mass * count;
      totalAtomCount += count;
      if (elem !== 'H') {
        heavyAtomCount += count;
      }
    }

    const items = entries.map(([elem, count]) => {
      const data = getElement(elem);
      const massContrib = data.mass * count;
      const massPercent = totalMass > 0 ? (massContrib / totalMass) * 100 : 0;
      const atomPercent = totalAtomCount > 0 ? (count / totalAtomCount) * 100 : 0;

      return {
        element: elem,
        name: data.name,
        atomicNumber: data.atomicNumber,
        count,
        atomicMass: data.mass,
        massContribution: massContrib,
        massPercent,
        atomPercent,
        cpkColor: data.cpkColor,
        electronegativity: data.electronegativity,
      };
    });

    // Sort by mass percent descending
    items.sort((a, b) => b.massPercent - a.massPercent);

    // Build the mathematical calculation string
    const formulaString = items
      .map((it) => `(${it.count} × ${it.atomicMass.toFixed(3)})`)
      .join(' + ');

    return {
      totalMass,
      totalAtomCount,
      heavyAtomCount,
      items,
      formulaString,
      uniqueElements: items.length,
    };
  }, [activeCounts]);

  const vsepr = properties.vsepr;

  const handleCopyComposition = () => {
    const formatted = compositionData.items
      .map(
        (it) =>
          `${it.element} (${it.name}): ${it.massPercent.toFixed(2)}% [${it.count} atom${
            it.count > 1 ? 's' : ''
          }, ${it.massContribution.toFixed(2)} g/mol]`
      )
      .join('\n');
    const summary = `Molecular Weight: ${compositionData.totalMass.toFixed(
      4
    )} g/mol (${properties.name || properties.formula})\nElemental Composition:\n${formatted}`;
    copyToClipboard(summary, 'composition');
  };

  return (
    <div className="space-y-4">
      {/* Overview Identity Card */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{properties.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="font-mono text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {properties.formula}
              </span>
              {properties.iupacName && properties.iupacName !== properties.name && (
                <span
                  className="text-xs text-slate-500 italic truncate max-w-[240px] sm:max-w-[320px]"
                  title={properties.iupacName}
                >
                  {properties.iupacName}
                </span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Molecular Weight
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-lg font-bold font-mono text-blue-600">
                {highPrecision
                  ? compositionData.totalMass.toFixed(4)
                  : compositionData.totalMass.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-slate-500">g/mol</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculated Molecular Weight & Stoichiometry Card */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Calculated Molecular Weight
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighPrecision(!highPrecision)}
              className="text-[11px] px-2 py-0.5 rounded border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
              title="Toggle between standard 2-decimal and high precision 4-decimal readout"
            >
              {highPrecision ? 'Standard (2 dec)' : 'High Prec (4 dec)'}
            </button>
            <button
              onClick={() =>
                copyToClipboard(
                  `${compositionData.totalMass.toFixed(highPrecision ? 4 : 2)} g/mol`,
                  'mw'
                )
              }
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              title="Copy calculated molecular weight"
            >
              {copiedKey === 'mw' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Calculation Formula Display */}
        <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Stoichiometric Formula Sum:</span>
            </span>
            <span className="font-mono font-bold text-blue-800 text-xs">
              MW = Σ (nᵢ × Mᵢ)
            </span>
          </div>

          <p className="font-mono text-[11px] text-slate-700 bg-white/90 p-2 rounded border border-blue-200/60 overflow-x-auto whitespace-nowrap leading-relaxed">
            {compositionData.formulaString || '—'} ={' '}
            <strong className="text-blue-700 font-bold">
              {compositionData.totalMass.toFixed(highPrecision ? 4 : 2)} g/mol
            </strong>
          </p>
        </div>

        {/* Quick Molecule Quantitative Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Total Atoms
            </span>
            <span className="text-base font-bold font-mono text-slate-800">
              {compositionData.totalAtomCount}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Heavy Atoms
            </span>
            <span className="text-base font-bold font-mono text-slate-800">
              {compositionData.heavyAtomCount}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Elements
            </span>
            <span className="text-base font-bold font-mono text-slate-800">
              {compositionData.uniqueElements}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Exact Mass
            </span>
            <span className="text-base font-bold font-mono text-slate-800">
              {compositionData.totalMass.toFixed(2)}{' '}
              <span className="text-[10px] font-normal text-slate-400">Da</span>
            </span>
          </div>
        </div>
      </div>

      {/* Elemental Mass Composition Breakdown */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Elemental Composition Breakdown
            </h3>
          </div>
          <button
            onClick={handleCopyComposition}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer"
            title="Copy elemental composition breakdown to clipboard"
          >
            {copiedKey === 'composition' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Breakdown</span>
              </>
            )}
          </button>
        </div>

        {/* Visual Stacked Proportional Mass Percentage Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-0.5">
            <span>Mass Proportion (% by weight)</span>
            <span>100% Total Mass</span>
          </div>
          <div className="w-full h-4 rounded-lg overflow-hidden flex bg-slate-100 border border-slate-200/80 shadow-2xs">
            {compositionData.items.map((item) => (
              <div
                key={item.element}
                onClick={() =>
                  setSelectedCompositionElement(
                    selectedCompositionElement === item.element ? null : item.element
                  )
                }
                style={{
                  width: `${Math.max(1, item.massPercent)}%`,
                  backgroundColor: item.cpkColor,
                }}
                title={`${item.element} (${item.name}): ${item.massPercent.toFixed(
                  2
                )}% (${item.count} atoms)`}
                className="h-full transition-all border-r border-white/30 last:border-0 hover:opacity-90 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Detailed Breakdown List / Table */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
          {compositionData.items.map((item) => {
            const isSelected = selectedCompositionElement === item.element;
            return (
              <div
                key={item.element}
                onClick={() =>
                  setSelectedCompositionElement(isSelected ? null : item.element)
                }
                className={`p-3 transition-colors cursor-pointer flex flex-col gap-2 ${
                  isSelected ? 'bg-blue-50/80' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0"
                      style={{ backgroundColor: item.cpkColor }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">
                          {item.element}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          (Z={item.atomicNumber})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3 text-right">
                    <div className="text-[11px] font-mono text-slate-500">
                      <span className="font-semibold text-slate-700">{item.count}</span>
                      <span className="text-slate-400"> × {item.atomicMass.toFixed(2)} = </span>
                      <span className="font-semibold text-slate-800">
                        {item.massContribution.toFixed(2)} g/mol
                      </span>
                    </div>
                    <div className="w-16 text-right">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {item.massPercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Relative progress bar */}
                <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.massPercent}%`,
                      backgroundColor: item.cpkColor === '#FFFFFF' ? '#94A3B8' : item.cpkColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VSEPR & Quantum Geometry Card */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              VSEPR (Valence Shell Electron Pair Repulsion) & Orbitals
            </h3>
          </div>
          <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
            {vsepr.hybridization}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Steric Number (SN)</span>
            <span className="text-base font-bold font-mono text-slate-800">
              {vsepr.stericNumber}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Bonding Pairs</span>
            <span className="text-base font-bold font-mono text-slate-800">
              {vsepr.bondingPairs}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Lone Pairs</span>
            <span className="text-base font-bold font-mono text-amber-600">
              {vsepr.lonePairs}
            </span>
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
            <span className="text-slate-400 block text-[10px]">Polar Surface (TPSA [Topological Polar Surface Area])</span>
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
              Conformational flexibility (Rotatable Bonds ≤ 10, TPSA [Topological Polar Surface Area] ≤ 140 Å²).
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
                <span className="text-slate-400 text-[10px] block uppercase font-mono">
                  SMILES (Simplified Molecular Input Line Entry System)
                </span>
                <span className="font-mono text-slate-800 text-[11px] select-all">
                  {properties.smiles}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(properties.smiles!, 'smiles')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-500 transition-colors shrink-0"
                title="Copy SMILES (Simplified Molecular Input Line Entry System)"
              >
                {copiedKey === 'smiles' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}

          {properties.inchiKey && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <div className="truncate pr-2">
                <span className="text-slate-400 text-[10px] block uppercase font-mono">
                  InChIKey (International Chemical Identifier Key)
                </span>
                <span className="font-mono text-slate-800 text-[11px] select-all">
                  {properties.inchiKey}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(properties.inchiKey!, 'inchikey')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-500 transition-colors shrink-0"
                title="Copy InChIKey (International Chemical Identifier Key)"
              >
                {copiedKey === 'inchikey' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
