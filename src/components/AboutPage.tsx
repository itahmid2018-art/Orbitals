import React from 'react';
import {
  Atom,
  ArrowLeft,
  Sparkles,
  Target,
  Compass,
  Rocket,
  Layers,
  Zap,
  Globe,
  Cpu,
  Eye,
  Activity,
  CheckCircle2,
  Table,
  FlaskConical,
  BookOpen,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Scale,
  Code2,
} from 'lucide-react';

interface Props {
  onBackToWorkbench: () => void;
  onOpenPeriodicTable: () => void;
  onLoadMoleculeIn3D: (formula: string) => void;
}

export const AboutPage: React.FC<Props> = ({
  onBackToWorkbench,
  onOpenPeriodicTable,
  onLoadMoleculeIn3D,
}) => {
  const handleLaunch = (formula: string) => {
    onLoadMoleculeIn3D(formula);
    onBackToWorkbench();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header / Navigation Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWorkbench}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-2xs active:scale-95 cursor-pointer"
              title="Return to 3D Molecular Workbench"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>3D Workbench</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Atom className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                  About Orbitalis
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Project Ideas, Vision, Mission, Features & Future Ambitions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPeriodicTable}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors shadow-2xs active:scale-95 cursor-pointer"
            >
              <Table className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Periodic Table (118)</span>
              <span className="sm:hidden">Table</span>
            </button>

            <a
              href="/amp.html"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors shadow-2xs active:scale-95"
            >
              <span className="text-amber-600 font-bold">⚡</span>
              <span className="hidden sm:inline">AMP & HTMX</span>
              <span className="sm:hidden">AMP</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-700/60">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen Scientific Visualization
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
              Bringing Quantum & Molecular Dynamics to Life
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Orbitalis was born out of a desire to break chemistry free from static 2D paper diagrams. 
              By pairing hardware-accelerated 3D WebGL rendering with rigorous chemical physics, ab-initio stoichiometric calculation, 
              and the complete IUPAC periodic table, Orbitalis transforms textbook theory into an intuitive, tactile interactive canvas.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onBackToWorkbench}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                Launch 3D Workbench
              </button>
              <button
                onClick={onOpenPeriodicTable}
                className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Table className="w-4 h-4 text-teal-400" />
                Explore 118 Elements
              </button>
            </div>
          </div>
        </section>

        {/* Vision & Mission Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision Card */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                <Eye className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Vision</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Demystifying the Subatomic & Molecular Universe
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                We envision a world where anyone — from middle school students exploring their first chemical bond to university researchers 
                modeling novel pharmaceutical ligands — can interact with molecules as effortlessly as handling physical blocks.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                By synthesizing physical intuition with computational rigor, we eliminate the cognitive disconnect between abstract chemical formulas 
                and spatial quantum reality.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Accessible everywhere, on any device, with zero installation</span>
            </div>
          </div>

          {/* Mission Card */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-purple-300 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Our Mission</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  High-Precision Chemistry at the Speed of Thought
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our mission is to engineer an open, zero-barrier-to-entry molecular workbench that unites real-time 3D orbital dynamics, 
                VSEPR geometry calculation, and electrostatic potential mapping in a single responsive web environment.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                We are dedicated to building fast, scientifically sound, and aesthetic tools that make chemical education engaging, memorable, 
                and analytically powerful.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-purple-600">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              <span>Scientifically grounded in IUPAC standards and PubChem databases</span>
            </div>
          </div>
        </section>

        {/* The Project Idea & Origin Story */}
        <section className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Genesis</span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                The Project Idea: Why Orbitalis Exists
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm text-slate-600 leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono font-bold">1</span>
                The 2D Abstraction Trap
              </h4>
              <p>
                In classrooms and lecture halls, students are taught 3D concepts like $sp^3$ tetrahedral angles ($109.5^\circ$), 
                chair-boat conformations, and delocalized $\pi$-systems using flat 2D chalk drawings or paper diagrams. 
                Spatial intuition is often lost in translation.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono font-bold">2</span>
                Legacy Software Friction
              </h4>
              <p>
                Existing scientific modeling suites (like PyMOL, VMD, or Spartan) are heavy, platform-dependent desktop applications 
                that require complex installations, licensing fees, and extensive training. Most web tools are either simplistic toy viewers or slow.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono font-bold">3</span>
                The Orbitalis Solution
              </h4>
              <p>
                Orbitalis combines modern WebGL PBR rendering with live chemical calculations. It instantly fetches 3D conformers from PubChem 
                or computes local geometries from scratch, providing sub-millisecond property inspection and dynamic physical simulations in the browser.
              </p>
            </div>
          </div>
        </section>

        {/* Current Core Features */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Engineered Capabilities</span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Current Features & System Architecture
              </h3>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              Production Verified • Version 2.4.0
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Atom className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Interactive 3D WebGL Canvas</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-fidelity Three.js studio lighting with Ball-and-Stick, van der Waals Space-Filling, Stick skeleton, and Wireframe topology. 
                Full-screen immersion with zero camera distortion.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-blue-600 font-semibold">
                <button onClick={() => handleLaunch('H2O')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Test with H₂O <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Table className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Full 118-Element IUPAC Table</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete coverage from Hydrogen ($Z=1$) to Oganesson ($Z=118$) with dedicated 15-column Lanthanide and Actinide subgrids, 
                Pauling electronegativity, ionization energies, and discoverer records.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-teal-600 font-semibold">
                <button onClick={onOpenPeriodicTable} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Open Periodic Table <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Live Mass & Elemental Breakdown</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculated molecular weights ($M_w$), stoichiometric formulas, CPK color-mapped mass fraction stacked bars, and complete 
                per-element weight percentage tables with one-click report export.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-purple-600 font-semibold">
                <button onClick={() => handleLaunch('C8H10N4O2')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Inspect Caffeine ($M_w$) <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Quantum Orbital Visualizer</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hybridization lobes ($sp, sp^2, sp^3, sp^3d, sp^3d^2$), $p$-orbitals, and delocalized $\pi$-clouds (benzene ring aromatic resonance) 
                with dual-phase wavefunction coloring.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-rose-600 font-semibold">
                <button onClick={() => handleLaunch('C6H6')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Inspect Benzene $\pi$-system <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Electrostatic Potential Map (ESP)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Electronegativity gradient calculation generating continuous dielectric isosurface envelopes: Red ($\delta^-$ nucleophilic) to 
                Cyan/Blue ($\delta^+$ electrophilic) with interactive HUD legend.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-amber-600 font-semibold">
                <button onClick={() => handleLaunch('NH3')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Inspect Ammonia Dipole <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">AMP & HTMX Mobile Acceleration</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ultra-fast Google AMP validated mobile edition (`/amp.html`) with embedded HTMX hypermedia boost for sub-50ms chemical lookups 
                and full multi-platform iOS/Android icons.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-sky-600 font-semibold">
                <a href="/amp.html" className="hover:underline flex items-center gap-1">
                  View AMP Edition ⚡ <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Future Ambitions & Strategic Roadmap */}
        <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">The Horizon</span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Future Ambitions & Strategic Roadmap
              </h3>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            Orbitalis is continuously evolving. Our roadmap focuses on expanding from single-molecule structural visualization 
            into complex macromolecular biochemistry, transition-state reaction coordinate physics, and spatial augmented reality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Ambition 1 */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Code2 className="w-4 h-4" />
                <span>PDB / Mol / SDF Drag-and-Drop Ingestion</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct browser file upload and parsing of Protein Data Bank (`.pdb`), MDL Molfile (`.mol`), and `.sdf` files, 
                enabling students and bioinformaticians to visualize complex proteins, enzymes, and DNA fragments.
              </p>
            </div>

            {/* Ambition 2 */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                <span>Frontier Orbitals (HOMO / LUMO)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Integration of lightweight quantum chemistry solvers to calculate and render Highest Occupied (HOMO) and 
                Lowest Unoccupied (LUMO) molecular orbital boundary isosurfaces for predicting chemical reactivity.
              </p>
            </div>

            {/* Ambition 3 */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Activity className="w-4 h-4" />
                <span>3D Reaction Coordinate Pathways</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dynamic transition-state animation showing reactants transforming through transition states to products 
                (e.g., SN2 backside attack, ester hydrolysis) synchronized with interactive potential energy reaction curves E(rxn).
              </p>
            </div>

            {/* Ambition 4 */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Globe className="w-4 h-4" />
                <span>WebXR Augmented Reality (AR)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Projecting full-scale 3D molecules onto physical lab benches, classroom desks, and presentation podiums 
                using WebXR Device API on smartphones and mixed-reality headsets.
              </p>
            </div>
          </div>
        </section>

        {/* Technology & Open Science Standards */}
        <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Built on Open Science & Modern Web Technologies
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Orbitalis is built entirely with modern, open standards. No proprietary runtimes, no plugins, and no paywalls.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {[
              'Three.js (WebGL)',
              'React 19',
              'TypeScript',
              'Tailwind CSS',
              'IUPAC Standard Data',
              'PubChem REST API',
              'VSEPR Geometry Engine',
              'Google AMP ⚡',
              'HTMX Hypermedia',
              'PWA & Web Manifest',
              'Schema.org JSON-LD',
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-mono font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="rounded-2xl bg-blue-50 border border-blue-200 p-6 sm:p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-blue-950 tracking-tight">
            Ready to Explore the Molecular Realm?
          </h3>
          <p className="text-sm text-blue-800 max-w-xl mx-auto">
            Jump directly into the 3D canvas, inspect all 118 chemical elements, or test reaction mechanisms in real time.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={onBackToWorkbench}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Start in 3D Workbench
            </button>
            <button
              onClick={onOpenPeriodicTable}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs transition-all cursor-pointer"
            >
              Open Periodic Table
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-700">
            Orbitalis — 3D Molecular & Quantum Dynamics Workbench
          </p>
          <div className="flex justify-center gap-4 text-[11px] text-slate-500">
            <button onClick={onBackToWorkbench} className="hover:text-blue-600 cursor-pointer">Workbench</button>
            <span>•</span>
            <button onClick={onOpenPeriodicTable} className="hover:text-blue-600 cursor-pointer">Periodic Table</button>
            <span>•</span>
            <a href="/amp.html" className="hover:text-blue-600">AMP Edition</a>
            <span>•</span>
            <a href="/llms.txt" className="hover:text-blue-600">AI Spec (llms.txt)</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
