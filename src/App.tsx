import React, { useState, useEffect } from 'react';
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
import { LabNoteSnapshot } from './types/notebook';
import { Header } from './components/Header';
import { ThreeMolecularCanvas } from './components/ThreeMolecularCanvas';
import { PropertyInspector } from './components/PropertyInspector';
import { OrbitalControls } from './components/OrbitalControls';
import { DynamicsControls } from './components/DynamicsControls';
import { VSEPRSolverModal } from './components/VSEPRSolverModal';
import { ReactionPredictorModal } from './components/ReactionPredictorModal';
import { TutorialGuideModal } from './components/TutorialGuideModal';
import { PeriodicTablePage } from './components/PeriodicTablePage';
import { AboutPage } from './components/AboutPage';
import { LabNotebook } from './components/LabNotebook';
import { FloatingSidebar } from './components/FloatingSidebar';
import {
  Sparkles,
  Layers,
  Activity,
  FileText,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  // Navigation: 'about' (default landing page) | 'workbench' | 'periodic-table'
  const [currentPage, setCurrentPage] = useState<'workbench' | 'periodic-table' | 'about'>('about');

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

  // Support deep links from AMP, sitemap, PWA shortcuts, and AI crawlers (?view=workbench, ?view=elements, ?molecule=caffeine, ?element=Fe)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const molecule = params.get('molecule');
      const element = params.get('element');

      if (view === 'workbench' || view === 'molecules' || view === 'molecule') {
        setCurrentPage('workbench');
      } else if (view === 'elements' || view === 'periodic-table') {
        setCurrentPage('periodic-table');
      } else if (view === 'about') {
        setCurrentPage('about');
      } else if (molecule) {
        loadMolecule(molecule);
        setCurrentPage('workbench');
      } else if (element) {
        loadMolecule(element);
        setCurrentPage('workbench');
      }
    } catch {
      // ignore
    }
  }, []);

  // 2D Planar ChemView vs 3D Quantum View Toggle for Studio PBR
  const handleToggle2D = () => {
    if (renderStyle === '2d_projected') {
      setRenderStyle('ball_and_stick');
    } else {
      setRenderStyle('2d_projected');
      if (currentPage !== 'workbench') {
        setCurrentPage('workbench');
      }
    }
  };

  // Programmatic Tutorial step application to sync 3D viewport
  const handleApplyTutorialStep = (step: TutorialStep) => {
    if (currentPage !== 'workbench') {
      setCurrentPage('workbench');
    }
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
        let vertexIdx = nextAtoms[1];
        let arm1Idx = nextAtoms[0];
        let arm2Idx = nextAtoms[2];
        let foundTopological = false;

        // 1. Automatic topological bond detection for the central vertex:
        // If one of the 3 atoms is bonded to both others, it is definitively the true chemical vertex
        for (const candidate of nextAtoms) {
          const others = nextAtoms.filter((id) => id !== candidate);
          const isConnectedToBoth =
            bonds.some(
              (b) =>
                (b.sourceIndex === candidate && b.targetIndex === others[0]) ||
                (b.targetIndex === candidate && b.sourceIndex === others[0])
            ) &&
            bonds.some(
              (b) =>
                (b.sourceIndex === candidate && b.targetIndex === others[1]) ||
                (b.targetIndex === candidate && b.sourceIndex === others[1])
            );

          if (isConnectedToBoth) {
            vertexIdx = candidate;
            arm1Idx = others[0];
            arm2Idx = others[1];
            foundTopological = true;
            break;
          }
        }

        // 2. Geometric fallback: if topological search didn't find an atom bonded to both,
        // identify the vertex by finding the longest pairwise span (the two outer arms)
        if (!foundTopological) {
          const [i0, i1, i2] = nextAtoms;
          const a0 = atoms[i0];
          const a1 = atoms[i1];
          const a2 = atoms[i2];
          if (a0 && a1 && a2) {
            const d01 = Math.hypot(a0.x - a1.x, a0.y - a1.y, a0.z - a1.z);
            const d12 = Math.hypot(a1.x - a2.x, a1.y - a2.y, a1.z - a2.z);
            const d02 = Math.hypot(a0.x - a2.x, a0.y - a2.y, a0.z - a2.z);

            if (d02 >= d01 && d02 >= d12) {
              vertexIdx = i1;
              arm1Idx = i0;
              arm2Idx = i2;
            } else if (d01 >= d12 && d01 >= d02) {
              vertexIdx = i2;
              arm1Idx = i0;
              arm2Idx = i1;
            } else {
              vertexIdx = i0;
              arm1Idx = i1;
              arm2Idx = i2;
            }
          }
        }

        const aVertex = atoms[vertexIdx];
        const aArm1 = atoms[arm1Idx];
        const aArm2 = atoms[arm2Idx];

        if (aVertex && aArm1 && aArm2) {
          const v1 = { x: aArm1.x - aVertex.x, y: aArm1.y - aVertex.y, z: aArm1.z - aVertex.z };
          const v2 = { x: aArm2.x - aVertex.x, y: aArm2.y - aVertex.y, z: aArm2.z - aVertex.z };

          const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
          const mag1 = Math.hypot(v1.x, v1.y, v1.z);
          const mag2 = Math.hypot(v2.x, v2.y, v2.z);

          if (mag1 > 0 && mag2 > 0) {
            const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
            const angleDeg = (Math.acos(cosTheta) * 180) / Math.PI;

            // Reference VSEPR benchmark angles
            const IDEAL_GEOMETRIES = [
              { name: 'Linear', angle: 180.0 },
              { name: 'Trigonal Planar', angle: 120.0 },
              { name: 'Tetrahedral', angle: 109.5 },
              { name: 'Trigonal Pyramidal', angle: 107.3 },
              { name: 'Bent (Water)', angle: 104.5 },
              { name: 'Octahedral / 90°', angle: 90.0 },
            ];

            let closest = IDEAL_GEOMETRIES[0];
            let minDiff = Math.abs(angleDeg - closest.angle);
            for (const geom of IDEAL_GEOMETRIES) {
              const diff = Math.abs(angleDeg - geom.angle);
              if (diff < minDiff) {
                minDiff = diff;
                closest = geom;
              }
            }

            return {
              atoms: [arm1Idx, vertexIdx, arm2Idx],
              distance: mag1,
              distance2: mag2,
              angle: angleDeg,
              vertexAtom: vertexIdx,
              idealAngle: closest.angle,
              geometryName: closest.name,
              deviation: angleDeg - closest.angle,
            };
          }
        }
      }

      return { atoms: nextAtoms };
    });
  };

  const handleClearMeasurement = () => {
    setMeasurement({ atoms: [] });
  };

  // Restore snapshot state from lab notebook
  const handleRestoreSnapshot = (snapshot: LabNoteSnapshot, formula: string) => {
    if (formula.toUpperCase() !== currentFormula.toUpperCase()) {
      loadMolecule(formula);
    }
    setOrbitalMode(snapshot.orbitalMode);
    setRenderStyle(snapshot.renderStyle);
    setTemperatureK(snapshot.temperatureK);
    if (snapshot.activeVibrationalModeName) {
      const found = vibrationalModes.find((m) => m.name === snapshot.activeVibrationalModeName);
      if (found) setActiveVibrationalMode(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative">
      {/* Static Floating Icon-Based Sidebar Menu for All Views */}
      <FloatingSidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenReactionPredictor={() => setIsReactionModalOpen(true)}
        onOpenVseprGuide={() => setIsVseprModalOpen(true)}
        onOpenTutorials={() => setIsTutorialModalOpen(true)}
        is2DActive={renderStyle === '2d_projected'}
        onToggle2D={handleToggle2D}
      />

      {/* Main Content Area with dedicated clearance for the Floating Left Sidebar */}
      <div className="flex-1 flex flex-col pl-16 sm:pl-20 lg:pl-24 min-w-0 transition-all">
        {/* View 1: About & Vision Landing Page (Default Landing Content) */}
        {currentPage === 'about' && (
          <AboutPage
            onBackToWorkbench={() => setCurrentPage('workbench')}
            onOpenPeriodicTable={() => setCurrentPage('periodic-table')}
            onLoadMoleculeIn3D={(formula) => {
              loadMolecule(formula);
              setCurrentPage('workbench');
            }}
          />
        )}

        {/* View 2: Complete 118-Element IUPAC Periodic Table */}
        {currentPage === 'periodic-table' && (
          <PeriodicTablePage
            onBackToWorkbench={() => setCurrentPage('workbench')}
            onLoadMoleculeIn3D={(formula) => {
              loadMolecule(formula);
              setCurrentPage('workbench');
            }}
            onOpenAbout={() => setCurrentPage('about')}
          />
        )}

        {/* View 3: 3D Molecular Workbench (Studio PBR & Quantum Canvas) */}
        {currentPage === 'workbench' && (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Header with Search, Quick Chips & Action Triggers */}
            <Header
              properties={properties}
              onSearch={loadMolecule}
              isLoading={isLoading}
              onOpenVseprGuide={() => setIsVseprModalOpen(true)}
              onOpenReactionPredictor={() => setIsReactionModalOpen(true)}
              onOpenTutorials={() => setIsTutorialModalOpen(true)}
              onOpenPeriodicTable={() => setCurrentPage('periodic-table')}
              onOpenAbout={() => setCurrentPage('about')}
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

      {/* Mobile Quick Navigation Anchor Bar */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pt-2 w-full flex items-center justify-between gap-2">
        <a
          href="#canvas-section"
          className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-center text-xs font-semibold text-slate-700 shadow-2xs active:bg-slate-100 transition-colors"
        >
          🔬 3D Canvas
        </a>
        <a
          href="#inspector-section"
          className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-center text-xs font-semibold text-blue-700 shadow-2xs active:bg-blue-50 transition-colors"
        >
          📊 Inspector & Notebook
        </a>
      </div>

      {/* Main Dual-Pane Scientific Workbench */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Studio PBR Three.js Molecular Canvas (7 cols on lg) */}
        <div id="canvas-section" className="lg:col-span-7 xl:col-span-7 flex flex-col gap-3 h-[400px] sm:h-[490px] lg:h-[740px] relative lg:sticky lg:top-24">
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
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-700 font-semibold">{atoms.length} Atoms</span>
              <span>·</span>
              <span className="font-mono text-slate-700 font-semibold">{bonds.length} Bonds</span>
              <span>·</span>
              <span className="font-mono text-slate-700">{properties?.vsepr?.molecularShape}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              <span className="hidden sm:inline">Drag to rotate · Scroll/pinch to zoom · Tap atoms to measure</span>
              <span className="sm:hidden">Touch to rotate · Pinch to zoom</span>
            </span>
          </div>
        </div>

        {/* Right Pane: Synchronized Scientific Inspector (5 cols on lg) */}
        <div id="inspector-section" className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4">
          {/* Lab Notebook with expand and shrink icon */}
          <LabNotebook
            properties={properties}
            renderStyle={renderStyle}
            orbitalMode={orbitalMode}
            temperatureK={temperatureK}
            activeVibrationalMode={activeVibrationalMode}
            measurement={measurement}
            onRestoreSnapshot={handleRestoreSnapshot}
          />

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
            <PropertyInspector properties={properties} atoms={atoms} />
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
      </div>
      )}
      </div>

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
        onLoadMoleculeIn3D={(formula) => {
          loadMolecule(formula);
          setCurrentPage('workbench');
        }}
      />

      <TutorialGuideModal
        isOpen={isTutorialModalOpen}
        onClose={() => setIsTutorialModalOpen(false)}
        onApplyTutorialStep={handleApplyTutorialStep}
        onLoadMoleculeIn3D={(formula) => {
          loadMolecule(formula);
          setCurrentPage('workbench');
        }}
      />
    </div>
  );
}
