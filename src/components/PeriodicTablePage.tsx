import React, { useState, useMemo } from 'react';
import {
  PeriodicElement,
  PERIODIC_ELEMENTS,
  CATEGORY_COLORS,
  ElementCategory,
} from '../services/periodicTableData';
import {
  Search,
  X,
  Atom,
  Flame,
  Zap,
  Layers,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Info,
} from 'lucide-react';

interface Props {
  onBackToWorkbench: () => void;
  onLoadMoleculeIn3D: (formula: string) => void;
  onOpenAbout?: () => void;
}

type HeatmapMode = 'category' | 'electronegativity' | 'atomicRadius' | 'meltingPoint';

export const PeriodicTablePage: React.FC<Props> = ({
  onBackToWorkbench,
  onLoadMoleculeIn3D,
  onOpenAbout,
}) => {
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(
    PERIODIC_ELEMENTS[0] // Hydrogen selected by default
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('category');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Split elements into Main Body, Lanthanides, and Actinides
  const mainElements = useMemo(() => {
    return PERIODIC_ELEMENTS.filter(
      (el) => el.category !== 'lanthanide' && el.category !== 'actinide'
    );
  }, []);

  const lanthanides = useMemo(() => {
    return PERIODIC_ELEMENTS.filter((el) => el.category === 'lanthanide').sort(
      (a, b) => a.number - b.number
    );
  }, []);

  const actinides = useMemo(() => {
    return PERIODIC_ELEMENTS.filter((el) => el.category === 'actinide').sort(
      (a, b) => a.number - b.number
    );
  }, []);

  // Filter elements based on search and category
  const filteredElements = useMemo(() => {
    return PERIODIC_ELEMENTS.filter((el) => {
      const matchesSearch =
        el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.number.toString() === searchQuery.trim();

      const matchesCategory =
        activeCategoryFilter === 'all' || el.category === activeCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategoryFilter]);

  // Color generator based on selected heatmap mode
  const getTileStyle = (el: PeriodicElement) => {
    const isFiltered = filteredElements.some((item) => item.number === el.number);
    const isSelected = selectedElement?.number === el.number;

    if (heatmapMode === 'electronegativity') {
      const en = el.electronegativity;
      if (!en) {
        return {
          background: isSelected ? '#38bdf8' : '#f1f5f9',
          color: '#64748b',
          borderColor: isSelected ? '#0284c7' : '#cbd5e1',
          opacity: isFiltered ? 1 : 0.25,
        };
      }
      // Electronegativity scale ~0.7 to 4.0
      const ratio = Math.max(0, Math.min(1, (en - 0.7) / 3.3));
      const r = Math.round(59 + ratio * 180);
      const g = Math.round(130 - ratio * 90);
      const b = Math.round(246 - ratio * 150);
      return {
        background: `rgb(${r}, ${g}, ${b})`,
        color: '#ffffff',
        borderColor: isSelected ? '#ffffff' : 'transparent',
        boxShadow: isSelected ? '0 0 0 2px #0284c7' : 'none',
        opacity: isFiltered ? 1 : 0.25,
      };
    }

    if (heatmapMode === 'atomicRadius') {
      const r = el.atomicRadius || 100;
      // Atomic radius ~30 to 300 pm
      const ratio = Math.max(0, Math.min(1, (r - 30) / 270));
      const g = Math.round(200 - ratio * 120);
      return {
        background: `rgb(30, ${g}, 220)`,
        color: '#ffffff',
        borderColor: isSelected ? '#ffffff' : 'transparent',
        boxShadow: isSelected ? '0 0 0 2px #0284c7' : 'none',
        opacity: isFiltered ? 1 : 0.25,
      };
    }

    if (heatmapMode === 'meltingPoint') {
      const mp = el.meltingPointK || 300;
      // Melting point ~0 to 3800 K
      const ratio = Math.max(0, Math.min(1, mp / 3800));
      const red = Math.round(120 + ratio * 135);
      return {
        background: `rgb(${red}, ${Math.round(80 + ratio * 40)}, 60)`,
        color: '#ffffff',
        borderColor: isSelected ? '#ffffff' : 'transparent',
        boxShadow: isSelected ? '0 0 0 2px #0284c7' : 'none',
        opacity: isFiltered ? 1 : 0.25,
      };
    }

    // Default: Category color
    const cat = CATEGORY_COLORS[el.category] || CATEGORY_COLORS['unknown'];
    return {
      background: cat.bg,
      color: cat.text,
      borderColor: isSelected ? '#0284c7' : cat.border,
      boxShadow: isSelected ? '0 0 0 2px #0284c7' : 'none',
      opacity: isFiltered ? 1 : 0.25,
    };
  };

  // Group columns 1-18, Periods 1-7 layout helper
  const getGridStyle = (el: PeriodicElement) => {
    return {
      gridRow: el.period,
      gridColumn: el.group,
    };
  };

  const handleLaunch3D = (symbol: string) => {
    // Check if we have curated benchmark or construct formula
    const commonFormulas: Record<string, string> = {
      H: 'H2O',
      He: 'He',
      Li: 'LiH',
      Be: 'BeH2',
      B: 'BF3',
      C: 'CH4',
      N: 'NH3',
      O: 'H2O',
      F: 'SF6',
      Ne: 'Ne',
      Na: 'NaCl',
      Mg: 'MgCl2',
      Al: 'AlCl3',
      Si: 'SiH4',
      P: 'PCl5',
      S: 'SF6',
      Cl: 'PCl5',
      Ar: 'Ar',
      K: 'KCl',
      Ca: 'CaCO3',
      Ti: 'TiO2',
      Cr: 'CrO3',
      Mn: 'KMnO4',
      Fe: 'Fe',
      Cu: 'CuSO4',
      Zn: 'ZnCl2',
      Br: 'C6H5Br',
      Ag: 'AgNO3',
      I: 'KI',
      Xe: 'XeF4',
      Pt: 'Cisplatin',
      Au: 'AuCl3',
      U: 'UF6',
    };
    const target = commonFormulas[symbol] || symbol;
    onLoadMoleculeIn3D(target);
    onBackToWorkbench();
  };

  const handleSelectElement = (el: PeriodicElement) => {
    setSelectedElement(el);
    setIsInspectorOpen(true);
    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      setTimeout(() => {
        document.getElementById('element-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  // Reusable tile renderer for both main grid and f-block rows
  const renderElementTile = (el: PeriodicElement, customStyle: React.CSSProperties = {}) => {
    const isSelected = selectedElement?.number === el.number;
    const style = getTileStyle(el);

    return (
      <button
        key={el.number}
        onClick={() => handleSelectElement(el)}
        style={{
          ...style,
          ...customStyle,
        }}
        className={`p-1 rounded-lg border text-center transition-all flex flex-col justify-between items-center h-14 relative cursor-pointer hover:scale-105 active:scale-95 hover:z-20 ${
          isSelected ? 'ring-2 ring-blue-600 z-10 scale-105' : ''
        }`}
      >
        <div className="w-full flex justify-between items-center text-[9px] font-mono leading-none px-0.5">
          <span className="font-bold opacity-80">{el.number}</span>
          <span className="opacity-70 text-[8px]">
            {el.atomicMass.toFixed(1)}
          </span>
        </div>

        <span className="text-sm font-bold font-mono tracking-tight leading-none">
          {el.symbol}
        </span>

        <span className="text-[9px] truncate max-w-full font-medium opacity-90 leading-none">
          {el.name}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Prominent Orbitalis Brand Logo */}
              <div
                onClick={onBackToWorkbench}
                className="flex items-center gap-3 cursor-pointer group select-none"
                title="Orbitalis Workbench"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/20 group-hover:scale-105 transition-transform shrink-0">
                  <Atom className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                      Orbitalis
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      Periodic Table
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 leading-none mt-0.5 hidden sm:block">
                    3D Molecular & Quantum Dynamics Workbench
                  </p>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

              {/* 3D Workbench Action Button */}
              <button
                onClick={onBackToWorkbench}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-2xs cursor-pointer"
                title="Return to 3D Molecular Workbench"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3D Workbench</span>
              </button>
            </div>

            {/* Search & Heatmap Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search element (e.g. Iron, Fe, 26, U)..."
                  className="w-full pl-8 pr-8 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800 font-medium"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Heatmap Mode Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <span className="text-[10px] text-slate-400 uppercase px-1">Heatmap:</span>
                {[
                  { id: 'category', label: 'Category' },
                  { id: 'electronegativity', label: 'EN' },
                  { id: 'atomicRadius', label: 'Radius' },
                  { id: 'meltingPoint', label: 'Melting Pt' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setHeatmapMode(mode.id as HeatmapMode)}
                    className={`px-2 py-1 rounded-md text-[11px] transition-all ${
                      heatmapMode === mode.id
                        ? 'bg-white text-blue-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter Chips Bar */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all shrink-0 ${
                activeCategoryFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All (118 Elements)
            </button>
            {Object.entries(CATEGORY_COLORS).map(([catKey, catVal]) => {
              const isActive = activeCategoryFilter === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setActiveCategoryFilter(isActive ? 'all' : catKey)}
                  style={{
                    backgroundColor: isActive ? catVal.text : catVal.bg,
                    color: isActive ? '#ffffff' : catVal.text,
                    borderColor: catVal.border,
                  }}
                  className="px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all shrink-0 border"
                >
                  {catVal.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area: Grid + Side Inspector */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Periodic Table Grid View (8 cols on xl) */}
        <div className="xl:col-span-8 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          {/* Mobile Swipe Hint Banner */}
          <div className="xl:hidden mb-3 px-3 py-2 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-900 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span>👉</span>
              <span className="text-[11px] font-medium">Swipe horizontally to explore Groups 1–18 and f-block. Tap any element to view properties below.</span>
            </div>
            {selectedElement && (
              <a
                href="#element-inspector"
                className="shrink-0 px-2.5 py-1 rounded-md bg-blue-600 text-white font-semibold text-[11px] active:bg-blue-700 transition-colors"
              >
                Inspect #{selectedElement.number} ↓
              </a>
            )}
          </div>

          <div className="min-w-[860px] space-y-4">
            {/* Group Numbers Header (1-18) */}
            <div
              className="grid gap-1.5 text-center text-[10px] font-mono font-bold text-slate-400"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
              }}
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map((grp) => (
                <div key={grp} className="py-0.5">
                  {grp}
                </div>
              ))}
            </div>

            {/* Main 18x7 Grid (Periods 1-7, Groups 1-18) */}
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
              }}
            >
              {/* Main Body Elements */}
              {mainElements.map((el) => {
                const pos = getGridStyle(el);
                return renderElementTile(el, pos);
              })}

              {/* Lanthanide Placeholder Marker (Period 6, Group 3) */}
              <button
                onClick={() => {
                  const first = lanthanides[0];
                  if (first) handleSelectElement(first);
                }}
                className={`p-1 rounded-lg border text-center transition-all flex flex-col justify-between items-center h-14 relative cursor-pointer hover:scale-105 active:scale-95 bg-fuchsia-50/70 border-fuchsia-200 text-fuchsia-800 hover:bg-fuchsia-100 ${
                  selectedElement?.category === 'lanthanide' ? 'ring-2 ring-fuchsia-500 font-bold' : ''
                }`}
                style={{ gridRow: 6, gridColumn: 3 }}
                title="View Lanthanides series (57-71)"
              >
                <span className="text-[9px] font-mono font-bold opacity-80">57–71</span>
                <span className="text-xs font-bold font-mono tracking-tight">La–Lu</span>
                <span className="text-[8px] truncate font-semibold uppercase">Lanthanides</span>
              </button>

              {/* Actinide Placeholder Marker (Period 7, Group 3) */}
              <button
                onClick={() => {
                  const first = actinides[0];
                  if (first) handleSelectElement(first);
                }}
                className={`p-1 rounded-lg border text-center transition-all flex flex-col justify-between items-center h-14 relative cursor-pointer hover:scale-105 active:scale-95 bg-rose-50/70 border-rose-200 text-rose-800 hover:bg-rose-100 ${
                  selectedElement?.category === 'actinide' ? 'ring-2 ring-rose-500 font-bold' : ''
                }`}
                style={{ gridRow: 7, gridColumn: 3 }}
                title="View Actinides series (89-103)"
              >
                <span className="text-[9px] font-mono font-bold opacity-80">89–103</span>
                <span className="text-xs font-bold font-mono tracking-tight">Ac–Lr</span>
                <span className="text-[8px] truncate font-semibold uppercase">Actinides</span>
              </button>
            </div>

            {/* Inner Transition Elements (f-block Lanthanides & Actinides) */}
            <div className="pt-4 mt-2 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-600" />
                  <span>Inner Transition Elements (f-block Series)</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Lanthanides (57–71) & Actinides (89–103)
                </span>
              </div>

              {/* Lanthanide Row (57-71) */}
              <div className="flex items-center gap-2">
                <div className="w-24 shrink-0 text-right pr-2">
                  <span className="text-[11px] font-bold text-fuchsia-800 block">Lanthanides</span>
                  <span className="text-[9px] font-mono text-slate-400 block">57–71 (4f)</span>
                </div>
                <div
                  className="flex-1 grid gap-1.5"
                  style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}
                >
                  {lanthanides.map((el) => renderElementTile(el))}
                </div>
              </div>

              {/* Actinide Row (89-103) */}
              <div className="flex items-center gap-2">
                <div className="w-24 shrink-0 text-right pr-2">
                  <span className="text-[11px] font-bold text-rose-800 block">Actinides</span>
                  <span className="text-[9px] font-mono text-slate-400 block">89–103 (5f)</span>
                </div>
                <div
                  className="flex-1 grid gap-1.5"
                  style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}
                >
                  {actinides.map((el) => renderElementTile(el))}
                </div>
              </div>
            </div>

            {/* Legend & Periodic Trends Summary */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-[11px]">
                <span className="font-semibold text-slate-800">Periodic Trends:</span>
                <span>Electronegativity increases ➔ and ⬆</span>
                <span>·</span>
                <span>Atomic radius increases ⬅ and ⬇</span>
                <span>·</span>
                <span>Ionization energy increases ➔ and ⬆</span>
              </div>
              <span className="text-[11px] text-slate-400">
                118 Elements Officially Verified (IUPAC [International Union of Pure and Applied Chemistry])
              </span>
            </div>
          </div>
        </div>

        {/* Right Pane: Element Properties Inspector (4 cols on xl) */}
        {selectedElement && isInspectorOpen && (
          <div id="element-inspector" className="xl:col-span-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5 relative xl:sticky xl:top-24">
            {/* Header Identity */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    backgroundColor: CATEGORY_COLORS[selectedElement.category]?.bg,
                    color: CATEGORY_COLORS[selectedElement.category]?.text,
                    borderColor: CATEGORY_COLORS[selectedElement.category]?.border,
                  }}
                  className="w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xs"
                >
                  <span className="text-[10px] font-mono font-bold leading-none">
                    {selectedElement.number}
                  </span>
                  <span className="text-xl font-bold font-mono leading-tight">
                    {selectedElement.symbol}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    {selectedElement.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      style={{
                        backgroundColor: CATEGORY_COLORS[selectedElement.category]?.bg,
                        color: CATEGORY_COLORS[selectedElement.category]?.text,
                      }}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      {CATEGORY_COLORS[selectedElement.category]?.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedElement.atomicMass} u
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLaunch3D(selectedElement.symbol)}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="Visualize in 3D Molecular Workbench"
              >
                <Atom className="w-3.5 h-3.5" />
                <span>3D View</span>
              </button>
            </div>

            {/* Summary */}
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedElement.summary}
            </p>

            {/* Atomic & Quantum Properties Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quantum & Electronic Properties
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Electron Configuration</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5 truncate" title={selectedElement.electronConfiguration}>
                    {selectedElement.electronConfiguration}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Electrons per Shell</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
                    {selectedElement.electronsPerShell.join(', ')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Electronegativity (Pauling)</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
                    {selectedElement.electronegativity !== undefined ? selectedElement.electronegativity : '—'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">1st Ionization Energy</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
                    {selectedElement.ionizationEnergy ? `${selectedElement.ionizationEnergy} kJ/mol` : '—'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Block & Period / Group</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
                    Block {selectedElement.block.toUpperCase()} · P{selectedElement.period} G{selectedElement.group}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Oxidation States</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
                    {selectedElement.oxidationStates.map((s) => (s > 0 ? `+${s}` : s)).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Physical & Thermodynamic Properties Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Physical & Thermodynamic Properties
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Standard State (STP [Standard Temperature and Pressure])</span>
                  <span className="font-semibold text-slate-800 text-[11px] block mt-0.5">
                    {selectedElement.standardState}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Density</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
                    {selectedElement.density !== undefined ? `${selectedElement.density} g/cm³` : '—'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Melting Point</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
                    {selectedElement.meltingPointK !== undefined
                      ? `${selectedElement.meltingPointK} K (${(selectedElement.meltingPointK - 273.15).toFixed(1)} °C)`
                      : '—'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Boiling Point</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
                    {selectedElement.boilingPointK !== undefined
                      ? `${selectedElement.boilingPointK} K (${(selectedElement.boilingPointK - 273.15).toFixed(1)} °C)`
                      : '—'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Atomic / Covalent Radius</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
                    {selectedElement.atomicRadius || '—'} pm / {selectedElement.covalentRadius || '—'} pm
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Discovery</span>
                  <span className="font-semibold text-slate-800 text-[11px] block mt-0.5 truncate" title={`${selectedElement.discoveryYear} by ${selectedElement.discoverer}`}>
                    {selectedElement.discoveryYear} ({selectedElement.discoverer})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Dedicated Periodic Table Footer */}
      <footer id="periodic-table-footer" className="border-t border-slate-200 bg-white py-8 mt-12 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Prominent Orbitalis Branding & IUPAC Description */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/20 shrink-0">
              <Atom className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  Orbitalis
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  All 118 Elements (Complete IUPAC [International Union of Pure and Applied Chemistry])
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                Interactive chemical properties, electron configurations, and quantum periodic trends
              </p>
            </div>
          </div>

          {/* Right: Actions including About Button & Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenAbout && (
              <button
                onClick={onOpenAbout}
                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors flex items-center gap-2 text-xs font-semibold shadow-2xs cursor-pointer"
                title="About Orbitalis (Ideas, Vision, Mission, Ambitions)"
              >
                <Info className="w-4 h-4 text-blue-600" />
                <span>About Orbitalis</span>
              </button>
            )}
            <button
              onClick={onBackToWorkbench}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-2 text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>3D Workbench</span>
            </button>
          </div>
        </div>

        {/* Secondary Sub-Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Orbitalis. Standardized IUPAC chemical data & VSEPR geometry modeling.</p>
          <div className="flex items-center gap-3">
            {onOpenAbout && (
              <button onClick={onOpenAbout} className="hover:text-blue-600 transition-colors cursor-pointer">
                About & Mission
              </button>
            )}
            <span>•</span>
            <a href="/amp.html" className="hover:text-blue-600 transition-colors">AMP Edition</a>
            <span>•</span>
            <a href="/.well-known/security.txt" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Security Policy</a>
            <span>•</span>
            <a href="/llms.txt" className="hover:text-blue-600 transition-colors">AI Context (llms.txt)</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
