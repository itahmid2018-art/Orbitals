import React, { useState } from 'react';
import {
  GuidedTutorial,
  GUIDED_TUTORIALS,
  MOLECULE_LIBRARY,
  TutorialStep,
} from '../services/guidedTutorials';
import {
  X,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  CheckCircle2,
  Atom,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyTutorialStep: (step: TutorialStep) => void;
  onLoadMoleculeIn3D: (formula: string) => void;
}

export const TutorialGuideModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApplyTutorialStep,
  onLoadMoleculeIn3D,
}) => {
  const [activeTab, setActiveTab] = useState<'tutorials' | 'library'>('tutorials');
  const [selectedTutorialId, setSelectedTutorialId] = useState<string>(GUIDED_TUTORIALS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentTutorial = GUIDED_TUTORIALS.find((t) => t.id === selectedTutorialId) || GUIDED_TUTORIALS[0];
  const currentStep = currentTutorial.steps[currentStepIndex];

  const handleSelectTutorial = (tutId: string) => {
    setSelectedTutorialId(tutId);
    setCurrentStepIndex(0);
    const tut = GUIDED_TUTORIALS.find((t) => t.id === tutId);
    if (tut && tut.steps[0]) {
      onApplyTutorialStep(tut.steps[0]);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < currentTutorial.steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onApplyTutorialStep(currentTutorial.steps[nextIdx]);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onApplyTutorialStep(currentTutorial.steps[prevIdx]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Interactive Molecular Tutorials & Library
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Guided Learning
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Step-by-step visualizations explaining orbital overlap, VSEPR geometries, and bonding dynamics
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

        {/* Tab Toggle: Tutorials vs Molecule Library */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tutorials')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'tutorials'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Step-by-Step Guided Tutorials
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'library'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Curated Molecule Library
          </button>
        </div>

        {/* Tab 1: Step-by-Step Guided Tutorials */}
        {activeTab === 'tutorials' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column: Select Tutorial (4 cols) */}
            <div className="md:col-span-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
                Select Guided Tour
              </span>
              <div className="space-y-1.5">
                {GUIDED_TUTORIALS.map((tut) => {
                  const isSelected = tut.id === selectedTutorialId;
                  return (
                    <button
                      key={tut.id}
                      onClick={() => handleSelectTutorial(tut.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{tut.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{tut.subtitle}</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {tut.difficulty}
                        </span>
                        <span>{tut.durationMinutes} min tour</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Step-by-step Interactive Viewer (8 cols) */}
            <div className="md:col-span-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              {/* Step Progress Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{currentTutorial.title}</h3>
                  <span className="text-xs text-blue-600 font-medium">
                    Step {currentStepIndex + 1} of {currentTutorial.steps.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {currentTutorial.steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentStepIndex(idx);
                        onApplyTutorialStep(currentTutorial.steps[idx]);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentStepIndex
                          ? 'bg-blue-600 w-6'
                          : idx < currentStepIndex
                          ? 'bg-blue-300'
                          : 'bg-slate-300'
                      }`}
                      title={`Jump to step ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Step Title & Explanation */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    {currentStepIndex + 1}
                  </span>
                  <span>{currentStep.title}</span>
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  {currentStep.explanation}
                </p>

                {/* Key Takeaway box */}
                <div className="p-3 rounded-xl bg-white border border-blue-200/80 shadow-2xs text-xs space-y-1 ml-8">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Scientific Takeaway:</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {currentStep.takeaway}
                  </p>
                </div>
              </div>

              {/* Live 3D Scene Controls for this step */}
              <div className="p-3 rounded-xl bg-slate-200/60 text-xs flex items-center justify-between">
                <span className="text-[11px] text-slate-600">
                  Target 3D Mode: <strong className="text-slate-900">{currentStep.targetOrbitalMode}</strong> · Molecule: <strong className="text-slate-900">{currentStep.formula}</strong>
                </span>
                <button
                  onClick={() => onApplyTutorialStep(currentStep)}
                  className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Sync 3D View</span>
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-white text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentStepIndex < currentTutorial.steps.length - 1 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                  >
                    <span>Complete Tutorial</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pre-Made Molecule Library */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            {MOLECULE_LIBRARY.map((cat) => (
              <div key={cat.category} className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{cat.category}</h3>
                  <p className="text-xs text-slate-500">{cat.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {cat.molecules.map((m) => (
                    <div
                      key={m.formula}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-slate-900">
                            {m.formula}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                            {m.hybridization}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-700 mt-1">{m.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          onLoadMoleculeIn3D(m.formula);
                          onClose();
                        }}
                        className="w-full py-1.5 rounded-lg bg-white hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-300 hover:border-transparent font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Atom className="w-3.5 h-3.5" />
                        <span>Inspect in 3D</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
