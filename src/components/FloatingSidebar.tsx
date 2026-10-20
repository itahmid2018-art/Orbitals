import React from 'react';
import {
  Atom,
  FlaskConical,
  Table,
  Zap,
  HelpCircle,
  BookOpen,
  Layers,
  Sparkles,
  ExternalLink,
  Flame,
} from 'lucide-react';

interface Props {
  currentPage: 'workbench' | 'periodic-table' | 'about';
  onNavigate: (page: 'workbench' | 'periodic-table' | 'about') => void;
  onOpenReactionPredictor: () => void;
  onOpenVseprGuide: () => void;
  onOpenTutorials: () => void;
  is2DActive: boolean;
  onToggle2D: () => void;
}

export const FloatingSidebar: React.FC<Props> = ({
  currentPage,
  onNavigate,
  onOpenReactionPredictor,
  onOpenVseprGuide,
  onOpenTutorials,
  is2DActive,
  onToggle2D,
}) => {
  return (
    <aside
      aria-label="Quick Features Menu"
      className="fixed left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 p-1.5 sm:p-2 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl text-white select-none transition-all"
    >
      {/* Brand Icon / Home (About & Vision) */}
      <div className="relative group">
        <button
          onClick={() => onNavigate('about')}
          title="About & Vision (Mission, Ideas, Features, FAQ & Roadmap)"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            currentPage === 'about'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40 ring-2 ring-cyan-400 scale-105'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
        </button>
        <span className="absolute left-12 sm:left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-xl z-50">
          About & Vision (Home & FAQ)
        </span>
      </div>

      {/* 3D Molecular Workbench (Studio PBR) */}
      <div className="relative group">
        <button
          onClick={() => onNavigate('workbench')}
          title="3D Molecular Workbench (Studio PBR [Physically-Based Rendering], Orbitals, Dynamics)"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            currentPage === 'workbench'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40 ring-2 ring-cyan-400 scale-105'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <span className="absolute left-12 sm:left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-xl z-50">
          3D Workbench (PBR [Physically-Based Rendering])
        </span>
      </div>

      {/* Periodic Table (All 118 Elements) */}
      <div className="relative group">
        <button
          onClick={() => onNavigate('periodic-table')}
          title="Periodic Table of Elements (All 118 IUPAC [International Union of Pure and Applied Chemistry] Elements)"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            currentPage === 'periodic-table'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/40 ring-2 ring-emerald-400 scale-105'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Table className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
        </button>
        <span className="absolute left-12 sm:left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-xl z-50">
          Periodic Table (118 IUPAC [International Union of Pure and Applied Chemistry] Elements)
        </span>
      </div>

      <div className="w-6 h-px bg-slate-700/80 my-0.5" />

      {/* Reaction Predictor Modal */}
      <div className="relative group">
        <button
          onClick={onOpenReactionPredictor}
          title="Reaction Predictor & Chemical Mechanisms"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
        </button>
        <span className="absolute left-12 sm:left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-xl z-50">
          Reaction Predictor & Mechanisms
        </span>
      </div>

      {/* VSEPR & Lewis Solver Modal */}
      <div className="relative group">
        <button
          onClick={onOpenVseprGuide}
          title="VSEPR (Valence Shell Electron Pair Repulsion) & Lewis Structure Solver"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-blue-300 hover:bg-slate-800 transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
        </button>
        <span className="absolute left-12 sm:left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-xl z-50">
          VSEPR (Valence Shell Electron Pair Repulsion) Solver
        </span>
      </div>

      {/* Guided Chemistry Tutorials */}
      <div className="relative group">
        <button
          onClick={onOpenTutorials}
          title="Interactive Chemistry Tutorials & Guided Steps"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-emerald-300 hover:bg-slate-800 transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
        </button>
        <span className="absolute left-12 sm:left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-xl z-50">
          Guided Chemistry Tutorials
        </span>
      </div>

      <div className="w-6 h-px bg-slate-700/80 my-0.5" />

      {/* 2D / 3D Viewing Option Toggle in Studio PBR */}
      <div className="relative group">
        <button
          onClick={onToggle2D}
          title={is2DActive ? 'Switch to 3D Quantum View (Studio PBR [Physically-Based Rendering])' : 'Switch to 2D Planar Chemical View (Orthogonal Projection)'}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer font-bold text-xs ${
            is2DActive
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40 ring-2 ring-amber-300 font-extrabold scale-105'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          {is2DActive ? '2D' : '3D'}
        </button>
        <span className="absolute left-12 sm:left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-xl z-50">
          {is2DActive ? 'Active: 2D Planar ChemView (Click for 3D)' : 'Switch to 2D Planar ChemView'}
        </span>
      </div>

      {/* Fast AMP & HTMX Version Link */}
      <div className="relative group">
        <a
          href="/amp.html"
          title="Ultra-fast AMP (Accelerated Mobile Pages) & HTMX (Hypertext Markup Extensions) Mobile Edition (Sub-50ms)"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-all cursor-pointer"
        >
          <span className="text-sm font-black">⚡</span>
        </a>
        <span className="absolute left-12 sm:left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-xl z-50">
          Fast AMP (Accelerated Mobile Pages) & HTMX Mode (⚡)
        </span>
      </div>
    </aside>
  );
};
