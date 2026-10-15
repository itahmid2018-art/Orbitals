import React, { useState, useMemo } from 'react';
import {
  PeriodicElement,
  PERIODIC_ELEMENTS,
  CATEGORY_COLORS,
  ElementCategory,
} from '../services/periodicTableData';
import {
  Search,
  SlidersHorizontal,
  X,
  ExternalLink,
  Atom,
  Flame,
  Zap,
  Layers,
  Sparkles,
  Info,
  ArrowLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface Props {
  onBackToWorkbench: () => void;
  onLoadMoleculeIn3D: (formula: string) => void;
}

type HeatmapMode = 'category' | 'electronegativity' | 'atomicRadius' | 'meltingPoint';

export const PeriodicTablePage: React.FC<Props> = ({
  onBackToWorkbench,
  onLoadMoleculeIn3D,
}) => {
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(
    PERIODIC_ELEMENTS[0] // Hydrogen selected by default
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('category');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

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
      C: 'CH4',
      N: 'NH3',
      O: 'H2O',
      F: 'SF6',
      P: 'PCl5',
      S: 'SF6',
      Cl: 'PCl5',
      B: 'BF3',
      Br: 'C6H5Br',
    };
    const target = commonFormulas[symbol] || symbol;
    onLoadMoleculeIn3D(target);
    onBackToWorkbench();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToWorkbench}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
                title="Return to 3D Molecular Workbench"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>3D Workbench</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900">
                    Periodic Table of Elements
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Complete Reference & Properties
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Interactive chemical properties, electron configurations, and quantum periodic trends
                </p>
              </div>
            </div>

            {/* Search & Heatmap Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search element (e.g. Iron, Fe, 26)..."
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
              All Categories
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
        <div className="xl:col-span-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <div className="min-w-[850px] space-y-4">
            {/* Main 18x7 Grid */}
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
              }}
            >
              {PERIODIC_ELEMENTS.map((el) => {
                const isSelected = selectedElement?.number === el.number;
                const style = getTileStyle(el);
                const pos = getGridStyle(el);

                return (
                  <button
                    key={el.number}
                    onClick={() => {
                      setSelectedElement(el);
                      setIsInspectorOpen(true);
                    }}
                    style={{
                      ...style,
                      ...pos,
                    }}
                    className={`p-1 rounded-lg border text-center transition-all flex flex-col justify-between items-center h-14 relative cursor-pointer hover:scale-105 hover:z-20 ${
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
              })}
            </div>

            {/* Legend & Periodic Trends Summary */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-[11px]">
                <span className="font-semibold text-slate-800">Periodic Trends:</span>
                <span>Electronegativity increases ➔ and ⬆</span>
                <span>·</span>
                <span>Atomic radius increases ⬅ and ⬇</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Click any element to inspect complete physical, quantum & chemical properties
              </span>
            </div>
          </div>
        </div>

        {/* Right Pane: Element Properties Inspector (4 cols on xl) */}
        {selectedElement && isInspectorOpen && (
          <div className="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-28">
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
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
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
                  <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5 truncate">
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
                  <span className="text-slate-400 text-[10px] block">Standard State (STP)</span>
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
                  <span className="font-semibold text-slate-800 text-[11px] block mt-0.5 truncate" title={selectedElement.discoverer}>
                    {selectedElement.discoveryYear} ({selectedElement.discoverer})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
