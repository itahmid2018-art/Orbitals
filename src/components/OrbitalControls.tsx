import React from 'react';
import {
  OrbitalVisualizationMode,
  OrbitalColorScheme,
  RenderStyle,
  MolecularGeometry,
} from '../types/chemistry';
import { Layers, Eye, Sliders, Sparkles, BookOpen, Compass } from 'lucide-react';

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
  orbitalColorScheme?: OrbitalColorScheme;
  onChangeOrbitalColorScheme?: (scheme: OrbitalColorScheme) => void;
  isSnapToOrbit?: boolean;
  onToggleSnapToOrbit?: () => void;
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
  orbitalColorScheme = 'phase',
  onChangeOrbitalColorScheme,
  isSnapToOrbit = false,
  onToggleSnapToOrbit,
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
            { id: 'space_filling', label: 'Space-Filling (vdW [van der Waals])' },
            { id: 'stick', label: 'Stick Model' },
            { id: 'wireframe', label: 'Wireframe Skeleton' },
            { id: 'esp_surface', label: '⚡ ESP (Electrostatic Potential) Map' },
            { id: '2d_projected', label: '📐 2D Planar ChemView' },
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

        {/* Orbital Color-Coding Toggle (Quantum Numbers vs Wavefunction Phase) */}
        {orbitalMode !== 'none' && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Orbital Color-Coding Scheme:
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                {orbitalColorScheme === 'quantum_numbers' ? '⚡ (n, l, m) Energy' : '🎨 Phase (+/−)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onChangeOrbitalColorScheme?.('phase')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  orbitalColorScheme === 'phase'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-semibold text-[11px] flex items-center gap-1">
                  <span>🎨 Wavefunction Phase</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Sign of Ψ (+ Cyan, − Rose)
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChangeOrbitalColorScheme?.('quantum_numbers')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  orbitalColorScheme === 'quantum_numbers'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-2xs font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-semibold text-[11px] flex items-center gap-1">
                  <span>⚡ Quantum (n, l, m)</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Energy levels by subshell
                </div>
              </button>
            </div>

            {/* Quantum Energy Level Legend Breakdown when active */}
            {orbitalColorScheme === 'quantum_numbers' && (
              <div className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-100 text-[10px] space-y-1.5">
                <span className="font-semibold text-purple-900 block text-[11px]">
                  Subshell Energy Hierarchy (Aufbau Principle):
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span><strong>s (l=0):</strong> Ground tier</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span><strong>p_z (m=0):</strong> Axial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                    <span><strong>p_x (m=+1):</strong> In-plane</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span><strong>spⁿ:</strong> Hybrids</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <span><strong>Lone pairs:</strong> Non-bonding</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-fuchsia-500 shrink-0" />
                    <span><strong>π Clouds:</strong> Frontier HOMO</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Snap-to-Orbit (Standardized Mathematically Ideal Axes) Toggle */}
        {orbitalMode !== 'none' && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                Snap-to-Orbit (Standardized Axes):
              </span>
              <button
                type="button"
                onClick={onToggleSnapToOrbit}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isSnapToOrbit ? 'bg-sky-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={isSnapToOrbit}
                title="Toggle Snap-to-Orbit mathematical symmetry axis alignment"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isSnapToOrbit ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div
              onClick={onToggleSnapToOrbit}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                isSnapToOrbit
                  ? 'border-sky-500 bg-sky-50/70 text-sky-950 shadow-2xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs flex items-center gap-1.5 text-slate-800">
                  <span className={`w-2 h-2 rounded-full ${isSnapToOrbit ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'}`} />
                  {isSnapToOrbit ? 'Canonical Mathematical Axes Active' : 'Real Conformation Axes (Snap Disabled)'}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  isSnapToOrbit ? 'bg-sky-200 text-sky-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isSnapToOrbit ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Aligns atomic & hybrid orbital visualizations to standardized, mathematically ideal axes ({vsepr?.electronGeometry || 'Tetrahedral'} · {vsepr?.idealBondAngle || 109.5}° ideal), eliminating thermal jitter and lone-pair repulsion bending for pristine comparative analysis across molecular geometries.
              </p>
              {isSnapToOrbit && (
                <div className="mt-2 pt-1.5 border-t border-sky-200/60 flex items-center justify-between text-[10px] text-sky-900 font-medium">
                  <span>Standard Symmetry: <strong>{vsepr?.hybridization || 'sp³'} Parent Geometry</strong></span>
                  <span className="font-mono font-bold text-sky-700">Ideal: {vsepr?.idealBondAngle || 109.5}°</span>
                </div>
              )}
            </div>
          </div>
        )}

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
