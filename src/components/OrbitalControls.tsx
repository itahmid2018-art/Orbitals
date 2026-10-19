import React from 'react';
import {
  OrbitalVisualizationMode,
  RenderStyle,
  MolecularGeometry,
} from '../types/chemistry';
import { Layers, Eye, Sliders, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  renderStyle: RenderStyle;
  onChangeRenderStyle: (style: RenderStyle) => void;
  orbitalMode: OrbitalVisualizationMode;
  onChangeOrbitalMode: (mode: OrbitalVisualizationMode) => void;
  orbitalScale: number;
  onChangeOrbitalScale: (scale: number) => void;
  orbitalOpacity: number;
  onChangeOrbitalOpacity: (opacity: number) => void;
  vsepr?: MolecularGeometry;
}

export const OrbitalControls: React.FC<Props> = ({
  renderStyle,
  onChangeRenderStyle,
  orbitalMode,
  onChangeOrbitalMode,
  orbitalScale,
  onChangeOrbitalScale,
  orbitalOpacity,
  onChangeOrbitalOpacity,
  vsepr,
}) => {
  return (
    <div className="space-y-4">
      {/* 3D Representation Style */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            3D Molecular Representation
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'ball_and_stick', label: 'Ball & Stick' },
            { id: 'space_filling', label: 'Space-Filling (vdW)' },
            { id: 'stick', label: 'Stick Model' },
            { id: 'wireframe', label: 'Wireframe Skeleton' },
            { id: 'esp_surface', label: '⚡ ESP Density Map' },
            { id: '2d_projected', label: '📐 2D Planar Structure' },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => onChangeRenderStyle(style.id as RenderStyle)}
              className={`p-2 rounded-lg border text-left font-medium transition-all ${
                renderStyle === style.id
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complex Orbital Arrangements */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Orbital Arrangements & Clouds
            </h3>
          </div>
          {vsepr && (
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              {vsepr.hybridization} Orbitals
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'none', label: 'None (Bonds Only)' },
            { id: 'hybrid', label: `Hybrid Lobes (${vsepr?.hybridization || 'spⁿ'})` },
            { id: 'atomic_p', label: 'Atomic p Orbitals (px, pz)' },
            { id: 'atomic_d', label: 'Atomic d (dz² Toroid)' },
            { id: 'pi_delocalized', label: 'Delocalized π Clouds' },
            { id: 'all', label: 'All Composite Orbitals' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onChangeOrbitalMode(mode.id as OrbitalVisualizationMode)}
              className={`p-2 rounded-lg border text-left font-medium transition-all ${
                orbitalMode === mode.id
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-2xs font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Orbital Scale & Opacity Sliders */}
        {orbitalMode !== 'none' && (
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  Orbital Lobe Iso-surface Scale:
                </span>
                <span className="font-mono font-semibold text-slate-800">{orbitalScale.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={orbitalScale}
                onChange={(e) => onChangeOrbitalScale(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  Wavefunction Cloud Opacity:
                </span>
                <span className="font-mono font-semibold text-slate-800">{Math.round(orbitalOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={orbitalOpacity}
                onChange={(e) => onChangeOrbitalOpacity(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Quantum Chemistry Educational Callout */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Understanding Quantum Orbital Hybridization</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-600">
          According to Valence Bond Theory, atomic orbitals mathematically mix (hybridize) to form directional equivalent lobes that minimize electron-pair electrostatic repulsion:
        </p>
        <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
          <li>
            <strong className="text-slate-800">sp (Linear, 180°):</strong> Mixes one 2s and one 2p orbital; leaves two unhybridized perpendicular 2p orbitals available for π bonding.
          </li>
          <li>
            <strong className="text-slate-800">sp² (Trigonal Planar, 120°):</strong> Mixes 2s with two 2p orbitals; one unhybridized 2pz orbital forms perpendicular π bond (e.g., C=C in ethylene or aromatic ring in benzene).
          </li>
          <li>
            <strong className="text-slate-800">sp³ (Tetrahedral, 109.5°):</strong> Four equivalent tetrahedral lobes with positive primary lobes along C-H bonding axes.
          </li>
          <li>
            <strong className="text-slate-800">Phase Colors (+ / −):</strong> The sign of the wavefunction Ψ determines constructive interference (bonding σ / π overlap) or destructive interference (antibonding σ* / π* nodal planes).
          </li>
        </ul>
      </div>
    </div>
  );
};
