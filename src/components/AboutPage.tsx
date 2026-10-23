import React, { useState, useMemo } from 'react';
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
  ChevronDown,
  ShieldCheck,
  Scale,
  Code2,
  Search,
  MessageCircleQuestion,
  Filter,
} from 'lucide-react';

interface Props {
  onBackToWorkbench: () => void;
  onOpenPeriodicTable: () => void;
  onLoadMoleculeIn3D: (formula: string) => void;
  onOpenWalkthrough?: () => void;
}

interface FAQItem {
  id: string;
  category: 'Core Chemistry & VSEPR' | '3D & 2D Canvas' | 'Periodic Table & IUPAC' | 'Reactions & Spectroscopy' | 'Mobile & Web Tech';
  question: string;
  answer: React.ReactNode;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 'faq-vsepr',
    category: 'Core Chemistry & VSEPR',
    question: 'What is VSEPR (Valence Shell Electron Pair Repulsion) Theory, and how does Orbitalis calculate 3D shapes?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          <strong className="text-slate-800">VSEPR (Valence Shell Electron Pair Repulsion)</strong> Theory is a foundational chemical model stating that electron pairs (both bonding pairs and non-bonding lone pairs) surrounding a central atom repel each other electrostatically. To minimize this repulsive energy, the atoms and electron clouds arrange themselves at maximum geometric separation.
        </p>
        <p>
          In Orbitalis, the computation engine calculates the central atom's <strong className="text-slate-800">Steric Number (SN = Bonding Pairs + Lone Pairs)</strong>, determines the ideal geometric parent (Linear for SN=2, Trigonal Planar for SN=3, Tetrahedral for SN=4, Trigonal Bipyramidal for SN=5, and Octahedral for SN=6), and then models the repulsive hierarchy:
        </p>
        <div className="p-2 rounded bg-slate-100 font-mono text-[11px] text-slate-800">
          Repulsion Magnitude: (Lone Pair − Lone Pair) &gt; (Lone Pair − Bonding Pair) &gt; (Bonding Pair − Bonding Pair)
        </div>
        <p>
          This causes angle deviations from symmetric values, accurately predicting real experimental bond angles such as the $104.5^\circ$ bent angle in Water ($H_2O$) and $107.8^\circ$ trigonal pyramidal angle in Ammonia ($NH_3$).
        </p>
      </div>
    ),
  },
  {
    id: 'faq-iupac',
    category: 'Periodic Table & IUPAC',
    question: 'What does IUPAC (International Union of Pure and Applied Chemistry) mean, and how does Orbitalis follow IUPAC standards?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          <strong className="text-slate-800">IUPAC (International Union of Pure and Applied Chemistry)</strong> is the universally acknowledged global authority on chemical nomenclature, terminology, standardized atomic weights, and elemental classification.
        </p>
        <p>
          Orbitalis adheres strictly to official IUPAC standards across:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Complete 118 Elements:</strong> Covers all officially confirmed IUPAC elements from Hydrogen ($Z=1$) to Oganesson ($Z=118$).</li>
          <li><strong>1–18 Group Numbering:</strong> Utilizes the modern IUPAC Arabic numeral group scheme (replacing legacy CAS/old European IA–VIIIB formats).</li>
          <li><strong>$f$-Block Splitting:</strong> Accurately isolates Lanthanides (57–71) and Actinides (89–103) into standard 15-column subgrids.</li>
          <li><strong>Systematic Chemical Names:</strong> Provides both IUPAC systematic nomenclature and accepted trivial names for all compounds.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-pbr',
    category: '3D & 2D Canvas',
    question: 'What is Studio PBR (Physically-Based Rendering) and how does the 3D lighting work?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          <strong className="text-slate-800">PBR (Physically-Based Rendering)</strong> is a state-of-the-art computer graphics shading methodology that calculates the reflection of light based on real-world optics and microfacet physics.
        </p>
        <p>
          Orbitalis implements Three.js <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-700">MeshPhysicalMaterial</code> with:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>ACES (Academy Color Encoding System) Filmic Tonemapping:</strong> Delivers true cinematic color reproduction with high dynamic range highlights and realistic contrast.</li>
          <li><strong>Environment Reflections:</strong> Procedural studio reflections generated via <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-700">RoomEnvironment</code> and pre-filtered radiance maps.</li>
          <li><strong>Clearcoat Layers:</strong> Clearcoat specular sheens mimicking atomic crystal lattices and polished chemical models.</li>
          <li><strong>Soft Grounding Shadows:</strong> Realistic contact shadows anchoring molecules naturally in 3D space.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-2d',
    category: '3D & 2D Canvas',
    question: 'How do I switch between 3D Quantum View and 2D Planar ChemView?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          You can toggle between 3D and 2D views anytime using the <strong className="text-slate-800">2D / 3D button</strong> located on the persistent left floating sidebar, or via the top-right toolbar on the 3D canvas itself.
        </p>
        <p>
          When you activate <strong className="text-slate-800">2D Planar ChemView</strong>:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Orbitalis computes an optimal best-fit planar projection along the minimum-variance spatial axis of the molecule.</li>
          <li>Every atom is rendered as a clean, high-contrast circular badge displaying its element symbol (e.g. H, C, N, O) and standard <strong className="text-slate-800">CPK (Corey-Pauling-Koltun)</strong> color background with crisp white borders.</li>
          <li>Bonds are flattened into planar chemical lines.</li>
          <li>The camera snaps orthographically perpendicular to the molecular plane, giving you an instant textbook-grade structural diagram.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-cpk',
    category: 'Core Chemistry & VSEPR',
    question: 'What are CPK (Corey-Pauling-Koltun) colors used for atoms?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          <strong className="text-slate-800">CPK (Corey-Pauling-Koltun)</strong> coloring is the universally recognized scientific color convention developed by Robert Corey, Linus Pauling, and Walter Koltun for physical and computational chemistry models.
        </p>
        <p>Key CPK color assignments in Orbitalis include:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
          <div className="p-1.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white border border-slate-400" />
            <span>Hydrogen (H): White</span>
          </div>
          <div className="p-1.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-800" />
            <span>Carbon (C): Black/Grey</span>
          </div>
          <div className="p-1.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <span>Nitrogen (N): Blue</span>
          </div>
          <div className="p-1.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600" />
            <span>Oxygen (O): Red</span>
          </div>
          <div className="p-1.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Fluorine (F): Green</span>
          </div>
          <div className="p-1.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-600" />
            <span>Chlorine (Cl): Green</span>
          </div>
          <div className="p-1.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span>Sulfur (S): Yellow</span>
          </div>
          <div className="p-1.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Phosphorus (P): Orange</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'faq-esp',
    category: '3D & 2D Canvas',
    question: 'What is an ESP (Electrostatic Potential) map and how do I read the color gradient?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          An <strong className="text-slate-800">ESP (Electrostatic Potential)</strong> map wraps the molecule in a continuous translucent electron density isosurface envelope and colors each point according to the electrostatic potential felt by a positive unit test charge.
        </p>
        <p>The color spectrum directly maps chemical reactivity:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li><span className="font-bold text-red-600">Red (Negative Potential, $\delta^-$):</span> High electron density zones, representing electron-rich, nucleophilic sites susceptible to electrophilic attack.</li>
          <li><span className="font-bold text-yellow-600">Yellow / Green (Neutral Potential, $\approx 0$):</span> Non-polar regions and hydrocarbon backbones with balanced charge distribution.</li>
          <li><span className="font-bold text-blue-600">Cyan / Blue (Positive Potential, $\delta^+$):</span> Low electron density zones, representing electron-poor, electrophilic regions that readily attract nucleophiles.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-phases',
    category: 'Core Chemistry & VSEPR',
    question: 'What do the (+) Cyan and (−) Coral colors represent in quantum orbital lobes?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          In quantum mechanics, atomic and molecular orbitals are described by mathematical wave-functions $\Psi(x, y, z)$. The <strong className="text-cyan-600 font-bold">(+) Cyan</strong> and <strong className="text-rose-600 font-bold">(−) Coral</strong> lobes represent the <strong className="text-slate-800">mathematical phase sign</strong> ($\Psi &gt; 0$ vs. $\Psi &lt; 0$) of the electron probability amplitude.
        </p>
        <p className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
          <strong>Critical Educational Note:</strong> Orbital phase signs do <em>not</em> represent positive or negative electrical charge (the electron is always negatively charged). Instead, phase signs determine whether two overlapping orbitals interfere constructively (same phase $\to$ bonding $\sigma$ or $\pi$ orbital) or destructively (opposite phase $\to$ antibonding $\sigma^*$ or $\pi^*$ orbital with an intermediate nodal plane).
        </p>
      </div>
    ),
  },
  {
    id: 'faq-provenance',
    category: 'Periodic Table & IUPAC',
    question: 'Where does the molecular structure and chemical data come from?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          Orbitalis utilizes a dual-engine architecture to ensure both accuracy and instant responsiveness:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>NCBI PubChem REST API (Application Programming Interface):</strong> Queries the world's largest open chemical database for experimentally determined or MMFF94 force-field optimized 3D conformer coordinates (SDF [Structure-Data File]), systematic IUPAC names, SMILES (Simplified Molecular Input Line Entry System), and InChIKeys.</li>
          <li><strong>Local Ab-Initio VSEPR (Valence Shell Electron Pair Repulsion) Fallback:</strong> If a user inputs a novel or hypothetical formula without internet access, Orbitalis parses the stoichiometric counts locally and generates rigorous 3D coordinates from first principles within milliseconds.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-measure',
    category: '3D & 2D Canvas',
    question: 'How do I measure interatomic bond lengths and bond angles with the measurement tool?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          Orbitalis includes an interactive point-and-click geometric measurement tool integrated directly into the 3D canvas:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>To measure Bond Distance:</strong> Click any <strong className="text-slate-800">2 atoms</strong>. Orbitalis displays their exact interatomic separation in Ångströms (Å) and picometers (pm) with a dashed guide line and in-scene 3D floating distance badge.</li>
          <li><strong>To measure Bond Angle:</strong> Click any <strong className="text-slate-800">3 atoms</strong>. Orbitalis automatically performs topological connectivity and geometric distance analysis to identify the central vertex atom, computes the 3D angle in degrees (°), and renders a glowing 3D arc, translucent angular sector wedge, and billboarded angle sprite overlay directly in the 3D viewport.</li>
          <li><strong>VSEPR Reference Comparison:</strong> The overlay automatically compares the measured angle against standard ideal VSEPR geometries (Linear 180.0°, Trigonal Planar 120.0°, Tetrahedral 109.5°, Trigonal Pyramidal 107.3°, Bent 104.5°, Octahedral 90.0°) and displays the angular deviation $\Delta\theta$.</li>
          <li><strong>Real-Time Dynamics Tracking:</strong> If thermal Brownian motion or vibrational modes are active, distances and angles update live with atomic oscillations.</li>
          <li><strong>Quick Actions & Copy:</strong> Copy calculated angles to clipboard with 1 click or snapshot them into the integrated Lab Notebook. Deselect by clicking "Clear" or tapping any atom again.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-reactions',
    category: 'Reactions & Spectroscopy',
    question: 'How does the Chemical Reaction Predictor work and what reaction types are supported?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          The <strong className="text-slate-800">Chemical Reaction Predictor</strong> accepts multiple reactant formulas (e.g. <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">C2H4 + H2O</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">CH4 + 2O2</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">C6H6 + Br2</code>) and uses functional group analysis and mechanistic heuristics to determine products.
        </p>
        <p>Supported reaction classes include:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Electrophilic Addition:</strong> Hydration and halogenation of alkenes obeying Markovnikov's Rule.</li>
          <li><strong>Combustion:</strong> Complete stoichiometric oxidation of hydrocarbons yielding $CO_2$ and $H_2O$.</li>
          <li><strong>Fischer Esterification:</strong> Acid-catalyzed condensation of carboxylic acids and alcohols.</li>
          <li><strong>Electrophilic Aromatic Substitution:</strong> Bromination, nitration, and sulfonation of benzene rings.</li>
          <li><strong>Acid-Base Neutralization:</strong> Proton transfers forming aqueous salts and water.</li>
        </ul>
        <p>
          Each reaction includes curved-arrow mechanism steps, intermediate structures (carbocations, arenium ions), thermodynamic standard enthalpy $\Delta H^\circ$, and 1-click loading into the 3D canvas.
        </p>
      </div>
    ),
  },
  {
    id: 'faq-amp',
    category: 'Mobile & Web Tech',
    question: 'What is the difference between the full Web App, PWA, and AMP editions?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>Orbitalis is built with progressive enhancement across three optimized deployment tiers:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Full Desktop/Tablet Web App:</strong> Hardware-accelerated Three.js WebGL (Web Graphics Library) rendering, normal vibrational harmonic animations, real-time ESP potential isosurfaces, and full 118-element IUPAC table.</li>
          <li><strong>PWA (Progressive Web Application):</strong> Installable directly to mobile home screens and desktop taskbars with offline cache support, vector favicons, and Web App Manifest (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">manifest.json</code>).</li>
          <li><strong>AMP (Accelerated Mobile Pages) & HTMX (Hypertext Markup Extensions) Edition (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/amp.html</code>):</strong> A validated ultra-fast mobile edition optimized for mobile search crawlers and low-bandwidth connections that loads within 50 milliseconds with zero heavy graphics overhead.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-bioactive',
    category: 'Core Chemistry & VSEPR',
    question: 'What do TPSA (Topological Polar Surface Area) and Lipinski\'s Rule of 5 mean?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          In medicinal chemistry and pharmacology, drug molecules must cross biological cell membranes to reach target receptors. Orbitalis automatically inspects:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>TPSA (Topological Polar Surface Area):</strong> The total molecular surface area belonging to polar atoms (Nitrogen, Oxygen, and their attached Hydrogens). Compounds with TPSA ≤ 140 Å² typically exhibit good cell membrane permeation, while TPSA ≤ 90 Å² allows penetration of the Blood-Brain Barrier (BBB).</li>
          <li><strong>Lipinski's Rule of 5 (Pfizer's Rule):</strong> Predicts whether a compound has high oral bioavailability based on: Molecular Weight ≤ 500 g/mol, XLogP ≤ 5, Hydrogen Bond Donors ≤ 5, and Hydrogen Bond Acceptors ≤ 10.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-fmo',
    category: 'Reactions & Spectroscopy',
    question: 'What are HOMO (Highest Occupied Molecular Orbital) and LUMO (Lowest Unoccupied Molecular Orbital)?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          According to <strong className="text-slate-800">FMO (Frontier Molecular Orbital)</strong> theory (formulated by Nobel laureate Kenichi Fukui):
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>HOMO (Highest Occupied Molecular Orbital):</strong> The highest energetic orbital containing electrons. It acts as the primary electron donor in chemical reactions (nucleophile / Lewis base).</li>
          <li><strong>LUMO (Lowest Unoccupied Molecular Orbital):</strong> The lowest energetic orbital that is empty. It acts as the primary electron acceptor (electrophile / Lewis acid).</li>
          <li>The smaller the energetic gap (ΔE = E(LUMO) − E(HOMO)), the more reactive the compound is towards light absorption and chemical transformation.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-notebook',
    category: '3D & 2D Canvas',
    question: 'How does the Lab Notebook work, and how can I export my observations?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          The collapsible <strong className="text-slate-800">Lab Notebook</strong> (located on the right inspector pane) enables students and researchers to capture live experimental snapshots while exploring molecules:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>1-Click 3D State Capture:</strong> Freezes the current orbital mode (sp, sp², sp³, π clouds), normal vibration frequency in cm⁻¹, thermal temperature in Kelvin (K), dipole moment, and active point-and-click measurements.</li>
          <li><strong>Tagged Student Observations:</strong> Classify notes under <em>Observation</em>, <em>VSEPR Analysis</em>, <em>Spectroscopy</em>, <em>Reaction Mechanism</em>, or <em>Lab Report</em>.</li>
          <li><strong>1-Click 3D Restoration:</strong> Click the restore icon on any notebook card to immediately reload that exact camera angle, temperature, and orbital configuration into the 3D canvas.</li>
          <li><strong>Markdown Export:</strong> Export your full lab record as a clean, standardized Markdown (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">.md</code>) file for assignment submissions.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-walkthrough',
    category: '3D & 2D Canvas',
    question: 'How does the Interactive Guided Walkthrough work?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          Orbitalis includes an <strong className="text-slate-800">Interactive Guided Walkthrough</strong> that directly spotlights UI elements with an SVG aperture mask, step-by-step contextual tooltips, and live feature triggers.
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Dynamic Guidance:</strong> Unlike static docs, the tour walks through search, 3D interaction gestures, quantum orbital energy levels, bond angle calipers, 2D ChemView, and the floating sidebar.</li>
          <li><strong>Keyboard & Touch Navigation:</strong> Use arrow keys (←/→) to move between steps, Escape to dismiss, or click the pulsing action buttons to trigger live molecular shifts.</li>
          <li><strong>Quick Launch:</strong> Open the tour anytime via the <strong className="text-slate-800">Compass icon</strong> on the left floating sidebar or the header banner.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-quantum-orbitals',
    category: 'Core Chemistry & VSEPR',
    question: 'What are quantum numbers (n, l, m) and how does the orbital color-coding toggle work?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          Orbitalis provides a real-time <strong className="text-slate-800">Color-Coding Scheme Toggle</strong> for molecular electron clouds:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Wavefunction Phase Mode (🎨 Phase):</strong> Visualizes quantum mechanical parity (+Ψ Cyan vs -Ψ Amber/Orange), illustrating constructive bonding versus destructive anti-bonding wave interference.</li>
          <li><strong>Quantum Energy Level Mode (⚡ Quantum n, l, m):</strong> Colors orbitals based on the subshell energy hierarchy according to the Aufbau principle:
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              <li><span className="font-semibold text-emerald-700">1s / 2s ($l=0$):</span> Ground valence sphere (Emerald green).</li>
              <li><span className="font-semibold text-blue-700">2p ($l=1$):</span> Subshell orbitals partitioned by magnetic number $m$ (Axial $p_z$ blue, in-plane $p_x/p_y$ purple/amber).</li>
              <li><span className="font-semibold text-cyan-700">Hybrids ($sp, sp^2, sp^3, sp^3d, sp^3d^2$):</span> Directional valence lobes ascending from cyan ($sp$) to cobalt ($sp^3$) and violet ($sp^3d^2$).</li>
              <li><span className="font-semibold text-orange-700">Lone Pairs ($n_b$):</span> Non-bonding valence electron pairs (Warm amber-orange).</li>
              <li><span className="font-semibold text-fuchsia-700">Frontier $\pi$ Molecular Clouds:</span> Delocalized conjugated clouds (Vibrant magenta).</li>
            </ul>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-bond-angle',
    category: '3D & 2D Canvas',
    question: 'How does the 3D bond angle caliper and distance measurement tool work?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          Click any two atoms on the 3D canvas to measure exact bond length in Angstroms (Å). Select a <strong className="text-slate-800">third atom</strong> to trigger the automated 3D angle caliper:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Automatic Topological Vertex Detection:</strong> The engine checks chemical bonding topology to automatically designate the shared central atom as the vertex (e.g. Oxygen in $H_2O$).</li>
          <li><strong>Visual 3D Caliper Overlay:</strong> Renders a glowing radial arc and semi-transparent sector wedge directly in the molecular plane, accompanied by an interactive angle badge.</li>
          <li><strong>VSEPR Geometry Comparison:</strong> Instantly benchmarks your measured angle against ideal VSEPR geometry (e.g. $104.5^\circ$ bent vs $109.5^\circ$ tetrahedral) and displays deviation ($\Delta\theta$).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-snap-to-orbit',
    category: 'Core Chemistry & VSEPR',
    question: 'What is the "Snap-to-Orbit" toggle and how does it aid comparative molecular analysis?',
    answer: (
      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
        <p>
          The <strong className="text-slate-800">Snap-to-Orbit</strong> toggle (located in both the Orbitals inspector tab and the on-canvas bottom dock) aligns atomic and hybrid orbital lobes to <strong className="text-slate-800">standardized, mathematically ideal symmetry axes</strong>:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Canonical Symmetry Frames:</strong> Snaps $sp^3$ tetrahedral lobes to exact $109.47^\circ$ canonical $T_d$ vertices, $sp^2$ lobes to pristine $120.0^\circ$ planar triads, $sp$ to $180.0^\circ$ axial lines, and $sp^3d^2$ to $90.0^\circ$ Cartesian $\pm X, \pm Y, \pm Z$ axes.</li>
          <li><strong>Comparative Geometry Analysis:</strong> In real molecules, lone pairs and steric bulk compress bond angles (e.g. $104.5^\circ$ in Water $H_2O$ vs $107.8^\circ$ in Ammonia $NH_3$). Snap-to-Orbit allows users to toggle between the real conformation and the ideal parent symmetry, making geometric deviations instantly obvious.</li>
          <li><strong>3D Symmetry Visualizer Rays:</strong> Renders dashed cyan guide rays and vertex target markers in the 3D scene, providing an absolute mathematical reference frame.</li>
        </ul>
      </div>
    ),
  },
];

export const AboutPage: React.FC<Props> = ({
  onBackToWorkbench,
  onOpenPeriodicTable,
  onLoadMoleculeIn3D,
  onOpenWalkthrough,
}) => {
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqIds, setExpandedFaqIds] = useState<Set<string>>(
    new Set(['faq-vsepr', 'faq-iupac', 'faq-2d', 'faq-pbr'])
  );

  const toggleFaq = (id: string) => {
    setExpandedFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAllFaqs = () => {
    setExpandedFaqIds(new Set(FAQ_LIST.map((f) => f.id)));
  };

  const collapseAllFaqs = () => {
    setExpandedFaqIds(new Set());
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_LIST.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        faqSearch.trim() === '' ||
        item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(faqSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqSearch, selectedCategory]);

  const handleLaunch = (formula: string) => {
    onLoadMoleculeIn3D(formula);
    onBackToWorkbench();
  };

  const scrollToFaq = () => {
    const el = document.getElementById('faq-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header: Minimal with Logo of 'Orbitalis' only */}
      <header id="about-header" className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/20 shrink-0">
              <Atom className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Orbitalis
              </h1>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block leading-none mt-0.5">
                3D Molecular & Quantum Dynamics Workbench
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-12">
        {/* Hero Section */}
        <section id="about-hero" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-700/60">
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
              By pairing hardware-accelerated 3D WebGL (Web Graphics Library) rendering with rigorous chemical physics, ab-initio stoichiometric calculation, 
              and the complete IUPAC (International Union of Pure and Applied Chemistry) periodic table, Orbitalis transforms textbook theory into an intuitive, tactile interactive canvas.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onBackToWorkbench}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                Launch 3D Workbench
              </button>
              {onOpenWalkthrough && (
                <button
                  id="about-walkthrough-btn"
                  onClick={onOpenWalkthrough}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-slate-950" />
                  Interactive Walkthrough
                </button>
              )}
              <button
                onClick={onOpenPeriodicTable}
                className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Table className="w-4 h-4 text-teal-400" />
                Explore 118 Elements (IUPAC)
              </button>
              <button
                onClick={scrollToFaq}
                className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-blue-300 border border-slate-600 font-semibold text-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-blue-400" />
                Browse User FAQs
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
                VSEPR (Valence Shell Electron Pair Repulsion) geometry calculation, and ESP (Electrostatic Potential) mapping in a single responsive web environment.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                We are dedicated to building fast, scientifically sound, and aesthetic tools that make chemical education engaging, memorable, 
                and analytically powerful.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-purple-600">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              <span>Scientifically grounded in IUPAC standards and NCBI PubChem databases</span>
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
                Existing scientific modeling suites (such as PyMOL, VMD, or Spartan) are heavy, platform-dependent desktop applications 
                that require complex installations, licensing fees, and extensive training. Most web tools are either simplistic toy viewers or slow.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono font-bold">3</span>
                The Orbitalis Solution
              </h4>
              <p>
                Orbitalis combines modern WebGL (Web Graphics Library) Studio PBR (Physically-Based Rendering) with live chemical calculations. It instantly fetches 3D conformers from NCBI PubChem 
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
              Production Verified • Version 2.5.0
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all space-y-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Atom className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">3D WebGL & 2D Planar ChemView</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Studio PBR (Physically-Based Rendering) lighting with Ball-and-Stick, Space-Filling (vdW [van der Waals]), Stick skeleton, Wireframe, and instant 2D Planar ChemView with CPK (Corey-Pauling-Koltun) elemental symbol tokens.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-blue-600 font-semibold">
                <button onClick={() => handleLaunch('H2O')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Test with H₂O in 3D <ChevronRight className="w-3 h-3" />
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
                Pauling electronegativity, ionization energies, STP (Standard Temperature and Pressure) states, and heatmaps.
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
                Real-time molecular weight and isotopic exact mass computation with constituent elemental mass percentage (% w/w) distribution 
                and proportional CPK color progress bars.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-purple-600 font-semibold">
                <button onClick={() => handleLaunch('C8H10N4O2')} className="hover:underline flex items-center gap-1 cursor-pointer">
                  Inspect Caffeine Mass <ChevronRight className="w-3 h-3" />
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
                with dual-phase (+) Cyan and (−) Coral wavefunction coloring.
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
                Cyan/Blue ($\delta^+$ electrophilic) with interactive HUD (Heads-Up Display) legend.
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
                Ultra-fast Google AMP (Accelerated Mobile Pages) validated mobile edition (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/amp.html</code>) with embedded HTMX (Hypertext Markup Extensions) hypermedia boost for sub-50ms chemical lookups.
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
                Direct browser file upload and parsing of PDB (Protein Data Bank), MDL Molfile (<code className="font-mono bg-slate-900 px-1 py-0.5 rounded text-blue-300">.mol</code>), and SDF (Structure-Data File) formats, 
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
                Integration of lightweight quantum chemistry solvers to calculate and render HOMO (Highest Occupied Molecular Orbital) and 
                LUMO (Lowest Unoccupied Molecular Orbital) boundary isosurfaces for predicting chemical reactivity.
              </p>
            </div>

            {/* Ambition 3 */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Activity className="w-4 h-4" />
                <span>3D Reaction Coordinate Pathways</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dynamic transition-state animations showing reactants transforming through transition states to products 
                (such as SN2 backside attacks and ester hydrolysis) synchronized with interactive potential energy reaction curves E(rxn).
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
                using WebXR (Extended Reality) Device APIs on smartphones and mixed-reality headsets.
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
              'Three.js (WebGL [Web Graphics Library])',
              'React 19 (TypeScript)',
              'Tailwind CSS v4',
              'IUPAC (International Union of Pure and Applied Chemistry) Data',
              'NCBI PubChem REST API (Application Programming Interface)',
              'VSEPR (Valence Shell Electron Pair Repulsion) Geometry Engine',
              'Studio PBR (Physically-Based Rendering)',
              'Google AMP ⚡ (Accelerated Mobile Pages)',
              'HTMX (High-power Hypertext Markup Extensions)',
              'PWA (Progressive Web Application) & Web Manifest',
              'Schema.org JSON-LD Structured Data',
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

        {/* Comprehensive Interactive FAQ Section */}
        <section id="faq-section" className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                <MessageCircleQuestion className="w-3.5 h-3.5 text-blue-600" />
                <span>Knowledge Base & Support</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Questions (FAQ)
              </h3>
              <p className="text-xs text-slate-500">
                Common queries regarding chemistry principles, 3D & 2D rendering, IUPAC standards, and webapp features.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={expandAllFaqs}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={collapseAllFaqs}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* FAQ Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search questions (e.g. VSEPR, IUPAC, 2D, ESP, CPK, PBR, orbitals, mass)..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Filter:
              </span>
              {[
                { id: 'all', label: 'All Questions' },
                { id: 'Core Chemistry & VSEPR', label: 'VSEPR & Chemistry' },
                { id: '3D & 2D Canvas', label: '3D/2D Canvas' },
                { id: 'Periodic Table & IUPAC', label: 'Periodic Table' },
                { id: 'Reactions & Spectroscopy', label: 'Reactions' },
                { id: 'Mobile & Web Tech', label: 'Mobile & PWA' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3 pt-2">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item) => {
                const isExpanded = expandedFaqIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border transition-all ${
                      isExpanded
                        ? 'border-blue-300 bg-blue-50/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(item.id)}
                      className="w-full p-4 flex items-center justify-between text-left gap-3 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {item.question}
                        </h4>
                      </div>
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isExpanded
                            ? 'bg-blue-100 text-blue-700 rotate-180'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No questions found matching "{faqSearch}". Try searching for terms like "VSEPR", "IUPAC", "2D", or "ESP".
              </div>
            )}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="rounded-2xl bg-blue-50 border border-blue-200 p-6 sm:p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-blue-950 tracking-tight">
            Ready to Explore the Molecular Realm?
          </h3>
          <p className="text-sm text-blue-800 max-w-xl mx-auto">
            Jump directly into the 3D canvas, inspect all 118 chemical elements (IUPAC), or test reaction mechanisms in real time.
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
              Open Periodic Table (118 IUPAC)
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
            <button onClick={onBackToWorkbench} className="hover:text-blue-600 cursor-pointer">3D Workbench</button>
            <span>•</span>
            <button onClick={onOpenPeriodicTable} className="hover:text-blue-600 cursor-pointer">Periodic Table (118 IUPAC)</button>
            <span>•</span>
            <button onClick={scrollToFaq} className="hover:text-blue-600 cursor-pointer">FAQ Section</button>
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
