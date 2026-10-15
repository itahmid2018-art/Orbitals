import React, { useState } from 'react';
import {
  Atom,
  Search,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Zap,
  BookOpen,
  Table,
} from 'lucide-react';
import { ChemicalProperties } from '../types/chemistry';

interface Props {
  properties: ChemicalProperties | null;
  onSearch: (query: string) => void;
  isLoading: boolean;
  onOpenVseprGuide: () => void;
  onOpenReactionPredictor: () => void;
  onOpenTutorials: () => void;
  onOpenPeriodicTable: () => void;
}

const QUICK_EXAMPLES = [
  { formula: 'H2O', label: 'H₂O (Water)', category: 'VSEPR' },
  { formula: 'CH4', label: 'CH₄ (Methane)', category: 'VSEPR' },
  { formula: 'NH3', label: 'NH₃ (Ammonia)', category: 'VSEPR' },
  { formula: 'CO2', label: 'CO₂ (Carbon Dioxide)', category: 'VSEPR' },
  { formula: 'BF3', label: 'BF₃ (Boron Trifluoride)', category: 'VSEPR' },
  { formula: 'SF6', label: 'SF₆ (Sulfur Hexafluoride)', category: 'VSEPR' },
  { formula: 'PCl5', label: 'PCl₅ (Phosphorus Pentachloride)', category: 'VSEPR' },
  { formula: 'C6H6', label: 'C₆H₆ (Benzene - 6π Cloud)', category: 'Resonance' },
  { formula: 'C2H4', label: 'C₂H₄ (Ethylene - π Bond)', category: 'Resonance' },
  { formula: 'C9H8O4', label: 'C₉H₈O₄ (Aspirin)', category: 'Bioactive' },
  { formula: 'C8H10N4O2', label: 'C₈H₁₀N₄O₂ (Caffeine)', category: 'Bioactive' },
];

export const Header: React.FC<Props> = ({
  properties,
  onSearch,
  isLoading,
  onOpenVseprGuide,
  onOpenReactionPredictor,
  onOpenTutorials,
  onOpenPeriodicTable,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Atom className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">Orbitalis</h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  3D Quantum Workbench
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Molecular viewer, orbital wavefunctions, reactions & atomic bonding dynamics
              </p>
            </div>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={handleSubmit} className="relative w-full sm:w-60 md:w-64">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Formula (SF6, C6H6, Aspirin)..."
                className="w-full pl-8 pr-16 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 placeholder-slate-400 text-slate-800 transition-all font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-1 top-1 px-2 py-1 text-[11px] font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
              >
                {isLoading ? '...' : 'Render'}
              </button>
            </form>

            {/* Periodic Table Independent Page Trigger */}
            <button
              onClick={onOpenPeriodicTable}
              title="Open full interactive Periodic Table of Elements"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors shadow-2xs"
            >
              <Table className="w-3.5 h-3.5 text-teal-600" />
              <span>Periodic Table</span>
            </button>

            {/* Reaction Predictor Trigger */}
            <button
              onClick={onOpenReactionPredictor}
              title="Predict chemical reactions and mechanisms"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Reaction Predictor</span>
            </button>

            {/* Tutorials & Library Trigger */}
            <button
              onClick={onOpenTutorials}
              title="Guided Step-by-Step Tutorials & Example Library"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tutorials</span>
            </button>

            {/* VSEPR Guide Trigger */}
            <button
              onClick={onOpenVseprGuide}
              title="VSEPR & Lewis Structure Solver"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">VSEPR</span>
            </button>
          </div>
        </div>

        {/* Quick-Try Example Chip Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-600">
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Try:
          </span>

          <div className="flex items-center gap-1.5">
            {QUICK_EXAMPLES.map((ex) => {
              const isActive = properties?.formula.toUpperCase() === ex.formula.toUpperCase();
              return (
                <button
                  key={ex.formula}
                  onClick={() => onSearch(ex.formula)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  {ex.label}
                </button>
              );
            })}
          </div>

          {/* Epistemic Provenance Badge */}
          {properties && (
            <div className="ml-auto shrink-0 flex items-center gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {properties.provenance}
              </span>
              {properties.sourceUrl && (
                <a
                  href={properties.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 text-blue-600 hover:underline font-mono"
                  title="View authoritative PubChem record"
                >
                  <span>PubChem CID {properties.cid}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
