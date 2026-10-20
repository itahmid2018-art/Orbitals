import React, { useState } from 'react';
import {
  PredictedReaction,
  PRESET_REACTIONS,
  predictReaction,
} from '../services/reactionPredictor';
import {
  X,
  Sparkles,
  Zap,
  ArrowRight,
  BookOpen,
  Layers,
  Thermometer,
  RotateCcw,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentFormula: string;
  onLoadMoleculeIn3D: (formula: string) => void;
}

export const ReactionPredictorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentFormula,
  onLoadMoleculeIn3D,
}) => {
  const [reactantsText, setReactantsText] = useState('C2H4 + H2O');
  const [predictedReaction, setPredictedReaction] = useState<PredictedReaction | null>(
    PRESET_REACTIONS[0]
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_REACTIONS[0].id);

  if (!isOpen) return null;

  const handlePredict = () => {
    const rawTokens = reactantsText.split('+').map((s) => s.trim());
    const result = predictReaction(rawTokens);
    if (result) {
      setPredictedReaction(result);
      setSelectedPresetId(result.id);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_REACTIONS.find((p) => p.id === presetId);
    if (found) {
      setSelectedPresetId(presetId);
      setPredictedReaction(found);
      setReactantsText(found.reactants.map((r) => r.formula).join(' + '));
    }
  };

  const handleAddCurrentMolecule = () => {
    if (!reactantsText.includes(currentFormula)) {
      setReactantsText((prev) => (prev ? `${prev} + ${currentFormula}` : currentFormula));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Chemical Reaction & Mechanism Predictor
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  FMO (Frontier Molecular Orbital) Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Input reactant formulas to deduce plausible products, thermodynamic driving forces, and step-by-step mechanism
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Preset Reaction Selector */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Reactant Formulas (separated by "+"):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={reactantsText}
                  onChange={(e) => setReactantsText(e.target.value)}
                  placeholder="e.g. C2H4 + H2O, CH4 + 2O2, C6H6 + Br2..."
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                />
                <button
                  onClick={handlePredict}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Predict Reaction</span>
                </button>
              </div>
            </div>

            <div className="sm:w-64 space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Load Benchmark Reaction:
              </label>
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
              >
                {PRESET_REACTIONS.map((rxn) => (
                  <option key={rxn.id} value={rxn.id}>
                    {rxn.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Insert Current Molecule */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-[11px] text-slate-500">
              Active Molecule in 3D Viewer: <strong className="font-mono text-slate-800">{currentFormula}</strong>
            </span>
            <button
              onClick={handleAddCurrentMolecule}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              + Add {currentFormula} to Reactants
            </button>
          </div>
        </div>

        {/* Prediction Results Banner */}
        {predictedReaction && (
          <div className="space-y-6">
            {/* Balanced Equation Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50 to-slate-50 border border-indigo-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  {predictedReaction.reactionType}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {predictedReaction.thermodynamics.enthalpyDeltaH}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-indigo-200/80 shadow-xs flex items-center justify-center text-center">
                <span className="text-base sm:text-lg font-bold font-mono text-slate-900 tracking-wide">
                  {predictedReaction.balancedEquation}
                </span>
              </div>

              {/* Reactants and Products Quick 3D Load Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium text-[11px]">Reactants:</span>
                  {predictedReaction.reactants.map((r) => (
                    <button
                      key={r.formula}
                      onClick={() => {
                        onLoadMoleculeIn3D(r.formula);
                        onClose();
                      }}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 font-mono font-semibold transition-colors border border-slate-200"
                      title={`Inspect ${r.name} in 3D Viewport`}
                    >
                      {r.formula} ➔ 3D
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium text-[11px]">Products:</span>
                  {predictedReaction.products.map((p) => (
                    <button
                      key={p.formula}
                      onClick={() => {
                        onLoadMoleculeIn3D(p.formula);
                        onClose();
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-semibold transition-colors border border-emerald-200"
                      title={`Inspect ${p.name} in 3D Viewport`}
                    >
                      {p.formula} ➔ 3D
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Thermodynamics & Energetics */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Thermometer className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Thermodynamic & Kinetic Profile
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px]">Enthalpy Change (ΔH°):</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {predictedReaction.thermodynamics.enthalpyDeltaH}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Activation Energy Barrier:</span>
                  <span className="font-semibold text-slate-800">
                    {predictedReaction.thermodynamics.activationBarrier}
                  </span>
                </div>
                {predictedReaction.thermodynamics.catalystOrCondition && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Recommended Catalyst / Conditions:</span>
                    <span className="font-semibold text-indigo-700">
                      {predictedReaction.thermodynamics.catalystOrCondition}
                    </span>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-[11px]">Chemical Driving Force:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                    {predictedReaction.thermodynamics.drivingForce}
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Reaction Mechanism Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Reaction Mechanism (Curved-Arrow Formalism)
                </h3>
              </div>

              <div className="space-y-3">
                {predictedReaction.mechanism.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                          {step.stepNumber}
                        </span>
                        <h4 className="font-bold text-slate-900">{step.title}</h4>
                      </div>
                      {step.intermediateFormula && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Intermediate: {step.intermediateFormula}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
                      {step.description}
                    </p>

                    <div className="pl-7 pt-1 font-mono text-[10px] text-indigo-700">
                      <strong>Arrow Flow:</strong> {step.curlyArrowDescription}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relevant Chemical Principles & Theory */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Relevant Chemical Principles & Laws
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {predictedReaction.principles.map((principle) => (
                  <div
                    key={principle.name}
                    className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5"
                  >
                    <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      {principle.name}
                    </h4>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {principle.summary}
                    </p>
                    <div className="text-[11px] text-slate-700 pt-1 border-t border-blue-100/80">
                      <strong>In this reaction:</strong> {principle.application}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition-colors"
          >
            Close Reaction Workbench
          </button>
        </div>
      </div>
    </div>
  );
};
