import React from 'react';
import { X, CheckCircle2, ChevronRight, BookOpen, Compass } from 'lucide-react';
import { ChemicalProperties } from '../types/chemistry';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  properties: ChemicalProperties | null;
}

export const VSEPRSolverModal: React.FC<Props> = ({ isOpen, onClose, properties }) => {
  if (!isOpen) return null;

  const vsepr = properties?.vsepr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                VSEPR & Quantum Geometry Solver
              </h2>
              <p className="text-xs text-slate-500">
                Step-by-step theoretical derivation for {properties?.formula || 'molecules'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-by-Step VSEPR Roadmap */}
        <div className="space-y-4">
          {/* Step 1: Central Atom */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Central Atom Identification</span>
            </div>
            <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
              The central atom is chosen as the least electronegative non-hydrogen element in the formula:
              {vsepr && (
                <span className="font-semibold text-blue-700 ml-1">
                  Central Atom = {vsepr.centralAtom}.
                </span>
              )}
            </p>
          </div>

          {/* Step 2: Valence Electrons & Bonding Pairs */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Bonding Pairs & Octet Rule Fulfillment</span>
            </div>
            <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
              Surrounding ligand atoms form covalent σ bonds with the central atom.
              {vsepr && (
                <span className="font-semibold text-slate-800 ml-1">
                  Bonding Pairs (BP) = {vsepr.bondingPairs}.
                </span>
              )}
            </p>
          </div>

          {/* Step 3: Non-Bonding Lone Pairs */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Lone Pair Electron Density</span>
            </div>
            <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
              Remaining unshared valence electrons on the central atom organize into non-bonding electron pairs:
              {vsepr && (
                <span className="font-semibold text-amber-700 ml-1">
                  Lone Pairs (LP) = {vsepr.lonePairs}.
                </span>
              )}
            </p>
          </div>

          {/* Step 4: Steric Number (SN) */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-blue-950">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">4</span>
                <span>Calculate Steric Number (SN)</span>
              </div>
              <span className="font-mono text-sm font-bold text-blue-800">
                SN = {vsepr?.stericNumber}
              </span>
            </div>
            <div className="pl-7 text-[11px] font-mono text-slate-700">
              Formula: Steric Number = Bonding Atoms + Lone Pairs = {vsepr?.bondingPairs} + {vsepr?.lonePairs} = {vsepr?.stericNumber}
            </div>
          </div>

          {/* Step 5: Repulsion Hierarchy & Real Bond Angles */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">5</span>
              <span>Lone-Pair Repulsion Dynamics & Angle Deviation</span>
            </div>
            <div className="pl-7 space-y-1 text-[11px] text-slate-600">
              <p>
                Lone pair orbitals are held by only one atomic nucleus and thus occupy a larger spatial volume than bonding pairs:
              </p>
              <div className="font-mono text-[10px] p-2 rounded bg-white border border-slate-200 text-slate-700 font-semibold">
                Repulsion Magnitude: (LP − LP) &gt; (LP − BP) &gt; (BP − BP)
              </div>
              <p>
                This repulsion forces bonding pairs closer together, compressing bond angles below the ideal symmetric value (e.g. 109.5° → 104.5° in H₂O, 109.5° → 107.8° in NH₃).
              </p>
            </div>
          </div>

          {/* Step 6: Hybridization State */}
          <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-indigo-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Resulting Quantum Hybridization</span>
              </div>
              <span className="font-mono text-base font-bold text-indigo-800 px-2 py-0.5 rounded bg-white border border-indigo-200">
                {vsepr?.hybridization}
              </span>
            </div>
            <div className="text-[11px] text-slate-700 space-y-1">
              <div><strong>Electron Geometry:</strong> {vsepr?.electronGeometry}</div>
              <div><strong>Observed Molecular Shape:</strong> {vsepr?.molecularShape}</div>
              <div><strong>Bond Angle:</strong> {vsepr?.actualBondAngle || vsepr?.idealBondAngle}°</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
