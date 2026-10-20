import React from 'react';
import { VibrationalMode, MeasurementSelection, Atom3D } from '../types/chemistry';
import {
  Activity,
  Thermometer,
  Zap,
  Ruler,
  Info,
  RotateCcw,
} from 'lucide-react';

interface Props {
  vibrationalModes: VibrationalMode[];
  activeMode: VibrationalMode | null;
  onSelectMode: (mode: VibrationalMode | null) => void;
  temperatureK: number;
  onChangeTemperature: (temp: number) => void;
  showDipole: boolean;
  onToggleDipole: (show: boolean) => void;
  dipoleDebye: number;
  measurement: MeasurementSelection;
  atoms: Atom3D[];
  onClearMeasurement: () => void;
}

export const DynamicsControls: React.FC<Props> = ({
  vibrationalModes,
  activeMode,
  onSelectMode,
  temperatureK,
  onChangeTemperature,
  showDipole,
  onToggleDipole,
  dipoleDebye,
  measurement,
  atoms,
  onClearMeasurement,
}) => {
  return (
    <div className="space-y-4">
      {/* Normal Vibrational Modes */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Normal Vibrational Modes
            </h3>
          </div>
          {activeMode && (
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              {activeMode.frequencyCm1} cm⁻¹
            </span>
          )}
        </div>

        {vibrationalModes.length > 0 ? (
          <div className="space-y-2 text-xs">
            {vibrationalModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onSelectMode(activeMode?.id === mode.id ? null : mode)}
                className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                  activeMode?.id === mode.id
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-2xs font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{mode.name}</span>
                  <span className="font-mono text-[11px] text-slate-500">{mode.frequencyCm1} cm⁻¹</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{mode.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
            Standard harmonic stretching modes active. Use the thermal temperature slider below to simulate Brownian lattice dynamics.
          </div>
        )}
      </div>

      {/* Thermal Temperature Simulation */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Thermal Brownian Dynamics
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-slate-800">
            {temperatureK} K ({temperatureK === 0 ? 'Absolute Zero' : `${(temperatureK - 273.15).toFixed(0)} °C`})
          </span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={temperatureK}
            onChange={(e) => onChangeTemperature(parseInt(e.target.value, 10))}
            className="w-full accent-rose-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0 K (Frozen Ground State)</span>
            <span>298 K (Room Temp)</span>
            <span>500 K (Excited)</span>
          </div>
        </div>
      </div>

      {/* Dipole Moment Vector */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Electrostatic Dipole Moment
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-700">
            μ = {dipoleDebye.toFixed(2)} D
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Render 3D Dipole Vector Arrow:</span>
          <button
            onClick={() => onToggleDipole(!showDipole)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              showDipole
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {showDipole ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Point-and-Click Bond & Angle Measurement Tool */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Bond Distance & Angle Tool
            </h3>
          </div>
          {measurement.atoms.length > 0 && (
            <button
              onClick={onClearMeasurement}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        <div className="text-xs text-slate-600 space-y-2">
          <p className="text-[11px] leading-relaxed">
            Click on any atoms directly inside the 3D viewport:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
            <li><strong>Click 1 atom:</strong> Inspect atomic radius & partial charge.</li>
            <li><strong>Click 2 atoms:</strong> Measures bond length in Ångströms (Å) and picometers (pm).</li>
            <li><strong>Click 3 atoms:</strong> Computes the exact 3D vertex bond angle in degrees (°).</li>
          </ul>

          {measurement.atoms.length > 0 && (
            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 space-y-1 mt-2 text-xs">
              <span className="font-semibold text-blue-900 block text-[11px]">Active Measurement:</span>
              <div className="font-mono text-slate-800 text-[11px]">
                {measurement.atoms.length === 3 ? (
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-1">
                      <span>{atoms[measurement.atoms[0]]?.element}#{measurement.atoms[0] + 1}</span>
                      <span className="text-slate-400">──</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        Vertex: {atoms[measurement.vertexAtom !== undefined ? measurement.vertexAtom : measurement.atoms[1]]?.element}#{(measurement.vertexAtom !== undefined ? measurement.vertexAtom : measurement.atoms[1]) + 1}
                      </span>
                      <span className="text-slate-400">──</span>
                      <span>{atoms[measurement.atoms[2]]?.element}#{measurement.atoms[2] + 1}</span>
                    </div>
                  </div>
                ) : (
                  <span>Selected Atoms: {measurement.atoms.map((idx) => `${atoms[idx]?.element}#${idx + 1}`).join(' → ')}</span>
                )}
              </div>
              {measurement.distance !== undefined && measurement.atoms.length === 2 && (
                <div className="font-mono text-xs font-bold text-blue-700">
                  Length: {measurement.distance.toFixed(3)} Å ({(measurement.distance * 100).toFixed(1)} pm)
                </div>
              )}
              {measurement.angle !== undefined && (
                <div className="space-y-1">
                  <div className="font-mono text-sm font-bold text-emerald-700 flex items-center justify-between">
                    <span>Bond Angle: {measurement.angle.toFixed(1)}°</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 flex justify-between">
                    <span>Arm 1: {measurement.distance?.toFixed(3)} Å</span>
                    {measurement.distance2 !== undefined && <span>Arm 2: {measurement.distance2.toFixed(3)} Å</span>}
                  </div>
                  {measurement.geometryName && measurement.idealAngle !== undefined && (
                    <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex justify-between">
                      <span>Ideal: {measurement.geometryName} ({measurement.idealAngle}°)</span>
                      <span className="font-mono font-semibold">
                        Δ {measurement.deviation && measurement.deviation >= 0 ? '+' : ''}{measurement.deviation?.toFixed(1)}°
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
