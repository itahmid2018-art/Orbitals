import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Download,
  Copy,
  Check,
  X,
  FileCode,
  Sparkles,
  Printer,
  BookOpen,
  Moon,
} from 'lucide-react';
import { Atom3D, Bond3D, MeasurementSelection, MolecularGeometry } from '../types/chemistry';
import {
  exportMoleculeToSvg,
  downloadSvgFile,
  copySvgToClipboard,
  SvgExportOptions,
  SvgStylePreset,
  SvgBackground,
} from '../services/svgExporter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  atoms: Atom3D[];
  bonds: Bond3D[];
  camera: THREE.PerspectiveCamera | null;
  moleculeGroup: THREE.Group | null;
  vsepr?: MolecularGeometry;
  measurement?: MeasurementSelection;
  moleculeName?: string;
  chemicalFormula?: string;
  iupacName?: string;
}

export const SvgExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  atoms,
  bonds,
  camera,
  moleculeGroup,
  vsepr,
  measurement,
  moleculeName = 'Molecule',
  chemicalFormula = '',
  iupacName = '',
}) => {
  const [stylePreset, setStylePreset] = useState<SvgStylePreset>('publication');
  const [background, setBackground] = useState<SvgBackground>('transparent');
  const [resolution, setResolution] = useState<number>(1200);
  const [showSymbols, setShowSymbols] = useState<boolean>(true);
  const [showIndices, setShowIndices] = useState<boolean>(false);
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [atomScale, setAtomScale] = useState<number>(1.0);
  const [bondWidth, setBondWidth] = useState<number>(1.0);

  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  // Compute options
  const options: SvgExportOptions = useMemo(
    () => ({
      width: resolution,
      height: resolution,
      stylePreset,
      background,
      showSymbols,
      showIndices,
      showMeasurements,
      showLegend,
      atomScale,
      bondWidth,
      title: moleculeName,
      formula: chemicalFormula,
      iupacName,
    }),
    [
      resolution,
      stylePreset,
      background,
      showSymbols,
      showIndices,
      showMeasurements,
      showLegend,
      atomScale,
      bondWidth,
      moleculeName,
      chemicalFormula,
      iupacName,
    ]
  );

  // Generate SVG vector code
  const svgMarkup = useMemo(() => {
    if (!isOpen || !camera || !moleculeGroup) return '';
    return exportMoleculeToSvg({
      atoms,
      bonds,
      camera,
      moleculeGroup,
      vsepr,
      measurement,
      options,
    });
  }, [isOpen, atoms, bonds, camera, moleculeGroup, vsepr, measurement, options]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const safeName = (chemicalFormula || moleculeName || 'molecule')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const filename = `${safeName}_vector_${stylePreset}.svg`;
    downloadSvgFile(svgMarkup, filename);
  };

  const handleCopy = async () => {
    const success = await copySvgToClipboard(svgMarkup);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`;
  const approximateKb = (new Blob([svgMarkup]).size / 1024).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative flex flex-col w-full max-w-5xl h-[90vh] max-h-[820px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Export to Vector SVG
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Publication Quality
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Infinite resolution 2D vector graphic projected from current 3D camera view for papers & presentations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close dialog (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content: Split Preview & Sidebar Controls */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left: Interactive Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col bg-slate-950/60 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    activeTab === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Vector Graphic
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    activeTab === 'code' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SVG XML Markup
                </button>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{resolution} × {resolution} px</span>
                <span>•</span>
                <span>{approximateKb} KB</span>
              </div>
            </div>

            {/* Preview Viewport Container */}
            <div className="relative flex-1 min-h-[260px] flex items-center justify-center rounded-xl border border-slate-800/80 overflow-hidden bg-dot-grid">
              {/* Checkerboard backdrop to highlight transparency */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(circle, #64748b 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />

              {activeTab === 'preview' ? (
                <div className="relative max-w-full max-h-full flex items-center justify-center p-3">
                  <img
                    src={svgDataUrl}
                    alt="SVG Molecular Preview"
                    className="max-h-[460px] max-w-full object-contain filter drop-shadow-lg transition-transform"
                  />
                </div>
              ) : (
                <div className="relative w-full h-full p-3 overflow-auto font-mono text-[11px] text-emerald-400 bg-slate-950/90 leading-relaxed select-all">
                  <pre>{svgMarkup}</pre>
                </div>
              )}
            </div>

            <div className="pt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Preserves exact camera angle, zoom & perspective
              </span>
              <span className="text-slate-500">
                Ready for LaTeX, Microsoft Word, Illustrator & Inkscape
              </span>
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div className="lg:col-span-5 flex flex-col p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-900/60">
            
            {/* 1. Style Preset Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Publication Style Preset
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setStylePreset('publication')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    stylePreset === 'publication'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1 text-blue-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Publication CPK</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Radial PBR highlights & CPK volume for journal figures.
                  </p>
                </button>

                <button
                  onClick={() => setStylePreset('grayscale')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    stylePreset === 'grayscale'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1 text-slate-200">
                    <Printer className="w-4 h-4" />
                    <span>Print Grayscale</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Monochrome clean line-art for black-and-white print articles.
                  </p>
                </button>

                <button
                  onClick={() => setStylePreset('textbook')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    stylePreset === 'textbook'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1 text-emerald-400">
                    <BookOpen className="w-4 h-4" />
                    <span>Textbook 2D</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Flat colored discs with centered high-contrast chemical symbols.
                  </p>
                </button>

                <button
                  onClick={() => setStylePreset('dark')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    stylePreset === 'dark'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1 text-purple-400">
                    <Moon className="w-4 h-4" />
                    <span>Dark Presentation</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Radiant glowing CPK spheres for slide decks & seminars.
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Background Options */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Background Fill
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setBackground('transparent')}
                  className={`py-2 px-3 rounded-lg border font-medium transition-all ${
                    background === 'transparent'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Transparent
                </button>
                <button
                  onClick={() => setBackground('white')}
                  className={`py-2 px-3 rounded-lg border font-medium transition-all ${
                    background === 'white'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Paper White
                </button>
                <button
                  onClick={() => setBackground('dark')}
                  className={`py-2 px-3 rounded-lg border font-medium transition-all ${
                    background === 'dark'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Dark Slate
                </button>
              </div>
            </div>

            {/* 3. Output Resolution / ViewBox */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Vector Canvas Scale
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[800, 1200, 2000].map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`py-2 px-3 rounded-lg border font-medium transition-all ${
                      resolution === res
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {res} × {res}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Annotations & Toggles */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Graphic Annotations
              </label>
              <div className="space-y-2 bg-slate-800/40 border border-slate-800 p-3 rounded-xl text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Element Symbols (C, H, O...)</span>
                  <input
                    type="checkbox"
                    checked={showSymbols}
                    onChange={(e) => setShowSymbols(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Atom Indices (#1, #2...)</span>
                  <input
                    type="checkbox"
                    checked={showIndices}
                    onChange={(e) => setShowIndices(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Active Measurement (Å / °)</span>
                  <input
                    type="checkbox"
                    checked={showMeasurements}
                    onChange={(e) => setShowMeasurements(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Publication Legend & Caption</span>
                  <input
                    type="checkbox"
                    checked={showLegend}
                    onChange={(e) => setShowLegend(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                </label>
              </div>
            </div>

            {/* 5. Scale Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Atom Sphere Scale</span>
                  <span className="text-slate-400">{atomScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.6"
                  step="0.05"
                  value={atomScale}
                  onChange={(e) => setAtomScale(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Bond Cylinder Stroke</span>
                  <span className="text-slate-400">{bondWidth.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={bondWidth}
                  onChange={(e) => setBondWidth(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/95 shrink-0">
          <div className="text-xs text-slate-400 hidden sm:block">
            Format: <strong className="text-slate-200">W3C SVG 1.1 Vector</strong> • {atoms.length} atoms • {bonds.length} bonds
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied SVG!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/25"
            >
              <Download className="w-4 h-4" />
              <span>Download .SVG</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
