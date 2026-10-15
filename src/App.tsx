import React, { useState } from 'react';
import {
  Atom3D,
  Bond3D,
  ChemicalProperties,
  RenderStyle,
  OrbitalVisualizationMode,
  VibrationalMode,
  MeasurementSelection,
} from './types/chemistry';
import { CURATED_MOLECULES, getCuratedMolecule } from './services/curatedMolecules';
import { queryPubChem } from './services/pubchemService';
import {
  parseFormula,
  calculateChemicalProperties,
  generateVSEPRCoordinates,
} from './services/chemistryEngine';
import { TutorialStep } from './services/guidedTutorials';
import { Header } from './components/Header';
import { ThreeMolecularCanvas } from './components/ThreeMolecularCanvas';
import { PropertyInspector } from './components/PropertyInspector';
import { OrbitalControls } from './components/OrbitalControls';
import { DynamicsControls } from './components/DynamicsControls';
import { VSEPRSolverModal } from './components/VSEPRSolverModal';
import { ReactionPredictorModal } from './components/ReactionPredictorModal';
import { TutorialGuideModal } from './components/TutorialGuideModal';
import { PeriodicTablePage } from './components/PeriodicTablePage';
import {
  Sparkles,
  Layers,
  Activity,
  FileText,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  // Navigation: 'workbench' | 'periodic-table'
  const [currentPage, setCurrentPage] = useState<'workbench' | 'periodic-table'>('workbench');

  // Molecular state
  const [currentFormula, setCurrentFormula] = useState('H2O');
  const [properties, setProperties] = useState<ChemicalProperties | null>(CURATED_MOLECULES['H2O'].properties);
  const [atoms, setAtoms] = useState<Atom3D[]>(CURATED_MOLECULES['H2O'].atoms);
  const [bonds, setBonds] = useState<Bond3D[]>(CURATED_MOLECULES['H2O'].bonds);
  const [vibrationalModes, setVibrationalModes] = useState<VibrationalMode[]>(
    CURATED_MOLECULES['H2O'].vibrationalModes
  );
  const [activeVibrationalMode, setActiveVibrationalMode] = useState<VibrationalMode | null>(
    CURATED_MOLECULES['H2O'].vibrationalModes[0] || null
  );

  // Visualization settings
  const [renderStyle, setRenderStyle] = useState<RenderStyle>('ball_and_stick');
  const [orbitalMode, setOrbitalMode] = useState<OrbitalVisualizationMode>('hybrid');
  const [orbitalScale, setOrbitalScale] = useState(1.0);
  const [orbitalOpacity, setOrbitalOpacity] = useState(0.6);
  const [temperatureK, setTemperatureK] = useState(298);
  const [showDipole, setShowDipole] = useState(true);

  // Inspector Tabs: 'properties' | 'orbitals' | 'dynamics'
  const [activeTab, setActiveTab] = useState<'properties' | 'orbitals' | 'dynamics'>('properties');

  // Interactive Measurement tool
  const [measurement, setMeasurement] = useState<MeasurementSelection>({ atoms: [] });

  // App UI states & modals
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVseprModalOpen, setIsVseprModalOpen] = useState(false);
  const [isReactionModalOpen, setIsReactionModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

  // Search & Resolve Molecule
  const loadMolecule = async (query: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setMeasurement({ atoms: [] });

    try {
      // 1. Check if query is in curated benchmark library
      const curated = getCuratedMolecule(query);
      if (curated) {
        setCurrentFormula(curated.formula);
        setProperties(curated.properties);
        setAtoms(curated.atoms);
        setBonds(curated.bonds);
        setVibrationalModes(curated.vibrationalModes);
        setActiveVibrationalMode(curated.vibrationalModes[0] || null);
        setIsLoading(false);
        return;
      }

      // 2. Query PubChem REST API for 3D conformer and properties
      const pubchemResult = await queryPubChem(query);
      if (pubchemResult && pubchemResult.atoms.length > 0) {
        setCurrentFormula(pubchemResult.properties.formula);
        setProperties(pubchemResult.properties);
        setAtoms(pubchemResult.atoms);
        setBonds(pubchemResult.bonds);

        const synthModes: VibrationalMode[] = [
          {
            id: 'synth-stretch',
            name: 'ν Harmonic Stretching Mode',
            description: 'Coupled valence bond length oscillation based on force field.',
            frequencyCm1: 1450,
            type: 'stretch_sym',
          },
        ];
        setVibrationalModes(synthModes);
        setActiveVibrationalMode(synthModes[0]);
        setIsLoading(false);
        return;
      }

      // 3. Fallback: Parse chemical formula locally and build ab-initio VSEPR model
      const counts = parseFormula(query);
      if (Object.keys(counts).length > 0) {
        const calculatedProps = calculateChemicalProperties(query);
        const { atoms: vAtoms, bonds: vBonds } = generateVSEPRCoordinates(
          query,
          calculatedProps.vsepr,
          counts
        );

        setCurrentFormula(query);
        setProperties(calculatedProps);
        setAtoms(vAtoms);
        setBonds(vBonds);

        const synthModes: VibrationalMode[] = [
          {
            id: 'synth-vsepr-bend',
            name: `ν ${calculatedProps.vsepr.molecularShape} Deformation`,
            description: 'Angular vibrational mode around central atom.',
            frequencyCm1: 1200,
            type: 'bend_scissor',
          },
        ];
        setVibrationalModes(synthModes);
        setActiveVibrationalMode(synthModes[0]);
        setIsLoading(false);
        return;
      }

      setErrorMessage(`Could not resolve molecular formula or compound "${query}". Please try a standard formula like SF6, CH4, or C6H6.`);
    } catch (err: any) {
      console.error('Error loading molecule:', err);
      setErrorMessage(`Failed to resolve compound: ${err.message || 'Network error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Programmatic Tutorial step application to sync 3D viewport
  const handleApplyTutorialStep = (step: TutorialStep) => {
    if (step.formula.toUpperCase() !== currentFormula.toUpperCase()) {
      loadMolecule(step.formula);
    }

    setOrbitalMode(step.targetOrbitalMode);
    setRenderStyle(step.targetRenderStyle);
    if (step.showDipole !== undefined) setShowDipole(step.showDipole);
    if (step.temperatureK !== undefined) setTemperatureK(step.temperatureK);

    if (step.activeModeId) {
      const mode = vibrationalModes.find((m) => m.id === step.activeModeId);
      if (mode) setActiveVibrationalMode(mode);
    }
  };

  // Atom selection & measurement logic
  const handleSelectAtom = (atomIndex: number) => {
    setMeasurement((prev) => {
      const current = [...prev.atoms];

      if (current.includes(atomIndex)) {
        const filtered = current.filter((id) => id !== atomIndex);
        return { atoms: filtered };
      }

      if (current.length >= 3) {
        return { atoms: [atomIndex] };
      }

      const nextAtoms = [...current, atomIndex];

      if (nextAtoms.length === 2) {
        const a1 = atoms[nextAtoms[0]];
        const a2 = atoms[nextAtoms[1]];
        const dist = Math.hypot(a1.x - a2.x, a1.y - a2.y, a1.z - a2.z);
        return { atoms: nextAtoms, distance: dist };
      }

      if (nextAtoms.length === 3) {
        const a1 = atoms[nextAtoms[0]];
        const a2 = atoms[nextAtoms[1]];
        const a3 = atoms[nextAtoms[2]];

        const v1 = { x: a1.x - a2.x, y: a1.y - a2.y, z: a1.z - a2.z };
        const v2 = { x: a3.x - a2.x, y: a3.y - a2.y, z: a3.z - a2.z };

        const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        const mag1 = Math.hypot(v1.x, v1.y, v1.z);
        const mag2 = Math.hypot(v2.x, v2.y, v2.z);

        if (mag1 > 0 && mag2 > 0) {
          const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
          const angleDeg = (Math.acos(cosTheta) * 180) / Math.PI;
          return {
            atoms: nextAtoms,
            distance: Math.hypot(a1.x - a2.x, a1.y - a2.y, a1.z - a2.z),
            angle: angleDeg,
          };
        }
      }

      return { atoms: nextAtoms };
    });
  };

  const handleClearMeasurement = () => {
    setMeasurement({ atoms: [] });
  };

  // If on Periodic Table independent page
  if (currentPage === 'periodic-table') {
    return (
      <PeriodicTablePage
        onBackToWorkbench={() => setCurrentPage('workbench')}
        onLoadMoleculeIn3D={loadMolecule}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header with Search, Quick Chips & Action Triggers */}
      <Header
        properties={properties}
        onSearch={loadMolecule}
        isLoading={isLoading}
        onOpenVseprGuide={() => setIsVseprModalOpen(true)}
        onOpenReactionPredictor={() => setIsReactionModalOpen(true)}
        onOpenTutorials={() => setIsTutorialModalOpen(true)}
        onOpenPeriodicTable={() => setCurrentPage('periodic-table')}
      />

      {/* Error alert banner if any */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 w-full">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-900 font-semibold text-[11px]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Dual-Pane Scientific Workbench */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Studio PBR Three.js Molecular Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-3 h-[620px] lg:h-[750px] sticky top-28">
          <ThreeMolecularCanvas
            atoms={atoms}
            bonds={bonds}
            vsepr={properties?.vsepr}
            activeVibrationalMode={activeVibrationalMode}
            temperatureK={temperatureK}
            renderStyle={renderStyle}
            onChangeRenderStyle={setRenderStyle}
            orbitalMode={orbitalMode}
            onChangeOrbitalMode={setOrbitalMode}
            orbitalScale={orbitalScale}
            onChangeOrbitalScale={setOrbitalScale}
            orbitalOpacity={orbitalOpacity}
            onChangeOrbitalOpacity={setOrbitalOpacity}
            showDipole={showDipole}
            onToggleDipole={setShowDipole}
            dipoleDebye={properties?.estimatedDipoleDebye || 0}
            measurement={measurement}
            onSelectAtom={handleSelectAtom}
            onClearMeasurement={handleClearMeasurement}
          />

          {/* Quick status bar beneath canvas */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-700 font-semibold">{atoms.length} Atoms</span>
              <span>·</span>
              <span className="font-mono text-slate-700 font-semibold">{bonds.length} Bonds</span>
              <span>·</span>
              <span className="font-mono text-slate-700">{properties?.vsepr?.molecularShape}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Drag to rotate · Scroll to zoom · Click atoms to measure · Dock controls below
            </span>
          </div>
        </div>

        {/* Right Pane: Synchronized Scientific Inspector (5 cols on lg) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4">
          {/* Navigation Tabs */}
          <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-semibold border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'properties'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Properties</span>
            </button>

            <button
              onClick={() => setActiveTab('orbitals')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'orbitals'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Orbitals</span>
            </button>

            <button
              onClick={() => setActiveTab('dynamics')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'dynamics'
                  ? 'bg-white text-emerald-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Dynamics</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'properties' && properties && (
            <PropertyInspector properties={properties} />
          )}

          {activeTab === 'orbitals' && (
            <OrbitalControls
              renderStyle={renderStyle}
              onChangeRenderStyle={setRenderStyle}
              orbitalMode={orbitalMode}
              onChangeOrbitalMode={setOrbitalMode}
              orbitalScale={orbitalScale}
              onChangeOrbitalScale={setOrbitalScale}
              orbitalOpacity={orbitalOpacity}
              onChangeOrbitalOpacity={setOrbitalOpacity}
              vsepr={properties?.vsepr}
            />
          )}

          {activeTab === 'dynamics' && (
            <DynamicsControls
              vibrationalModes={vibrationalModes}
              activeMode={activeVibrationalMode}
              onSelectMode={setActiveVibrationalMode}
              temperatureK={temperatureK}
              onChangeTemperature={setTemperatureK}
              showDipole={showDipole}
              onToggleDipole={setShowDipole}
              dipoleDebye={properties?.estimatedDipoleDebye || 0}
              measurement={measurement}
              atoms={atoms}
              onClearMeasurement={handleClearMeasurement}
            />
          )}
        </div>
      </main>

      {/* Interactive Modals */}
      <VSEPRSolverModal
        isOpen={isVseprModalOpen}
        onClose={() => setIsVseprModalOpen(false)}
        properties={properties}
      />

      <ReactionPredictorModal
        isOpen={isReactionModalOpen}
        onClose={() => setIsReactionModalOpen(false)}
        currentFormula={currentFormula}
        onLoadMoleculeIn3D={loadMolecule}
      />

      <TutorialGuideModal
        isOpen={isTutorialModalOpen}
        onClose={() => setIsTutorialModalOpen(false)}
        onApplyTutorialStep={handleApplyTutorialStep}
        onLoadMoleculeIn3D={loadMolecule}
      />
    </div>
  );
}
