# Orbitalis: 3D Molecular & Quantum Dynamics Workbench

> An interactive, publication-grade 3D molecular structure visualizer, quantum orbital workbench, IUPAC periodic table, and chemical reaction mechanism predictor built for chemistry students, educators, and researchers.

![Orbitalis 3D Workbench](https://pubchem.ncbi.nlm.nih.gov/images/hero/pubchem_logo.svg)

---

## 🔬 Product Overview

**Orbitalis** bridges theoretical physical chemistry and interactive 3D computing. It enables students, educators, and researchers to explore molecular architecture, hybrid atomic orbital lobes, and real-time vibrational dynamics.

The platform opens directly into a comprehensive **About & Vision Landing Page** detailing the project's genesis, mission, and future ambitions, while providing a persistent **Static Floating Icon-Based Sidebar Menu** for instantaneous 1-click navigation to the **3D Molecular Workbench**, **118-Element Periodic Table**, **Reaction Predictor**, **VSEPR Solver**, **Guided Tutorials**, and **2D/3D View Modes**.

---

## 🌟 Key Capabilities & Feature Matrix

### 1. Default About & Vision Landing Page (Home) & Comprehensive FAQ
- **The Project Idea & Genesis**: Solves the "2D Abstraction Trap" where students struggle to translate flat paper formulas into spatial quantum reality, while eliminating the installation friction and steep learning curves of legacy modeling suites.
- **Vision**: Demystifying the subatomic and molecular universe, providing universal, zero-install, zero-cost access on any device.
- **Mission**: High-precision chemistry at the speed of thought, uniting real-time 3D orbital dynamics, VSEPR (Valence Shell Electron Pair Repulsion) geometry calculation, and ESP (Electrostatic Potential) mapping.
- **Engineered Capabilities**: Interactive 3D WebGL (Web Graphics Library) Studio PBR (Physically-Based Rendering), full 118-element IUPAC (International Union of Pure and Applied Chemistry) periodic table, live stoichiometric mass breakdowns, and multi-platform optimization.
- **Future Ambitions & Roadmap**:
  - *PDB (Protein Data Bank) / Mol / SDF (Structure-Data File) Drag-and-Drop Ingestion*: Native in-browser parsing of macromolecular structures.
  - *Frontier Orbitals (HOMO [Highest Occupied Molecular Orbital] / LUMO [Lowest Unoccupied Molecular Orbital])*: Boundary isosurface calculation for reactivity forecasting.
  - *3D Reaction Coordinate Pathways*: Animated transition states synchronized with potential energy curves $E_{\text{rxn}}$.
  - *WebXR (Extended Reality) Augmented Reality (AR)*: Projecting full-scale 3D molecules onto physical classroom desks and laboratory benches.
- **Comprehensive Interactive FAQ Section**:
  - Searchable knowledge base with category filters (*All Questions*, *Core Chemistry & VSEPR*, *3D & 2D Canvas*, *Periodic Table & IUPAC*, *Reactions & Spectroscopy*, *Mobile & Web Tech*).
  - Clear explanations for 14+ common questions including VSEPR theory derivation, IUPAC nomenclature and standards, Studio PBR lighting, 2D Planar ChemView projection, CPK (Corey-Pauling-Koltun) atom colors, ESP potential gradients, quantum orbital phase signs, PubChem API integration, measurement tools, reaction mechanism prediction, and PWA (Progressive Web Application) vs. AMP (Accelerated Mobile Pages) modes.

### 2. Static Floating Icon-Based Sidebar Menu
- **Persistent Floating Dock**: Anchored smoothly on the left edge (`fixed left-2 sm:left-4 top-1/2 -translate-y-1/2`) with high-contrast frosted glass backdrop blur (`bg-slate-900/90`), subtle border, and elevation shadow.
- **1-Click Feature Navigation**:
  - 🏠 **About & Vision (Home)**: Project genesis, vision, mission, and future roadmap.
  - 🧪 **3D Molecular Workbench**: Studio PBR Three.js canvas, quantum orbitals, dynamics, and property inspector.
  - 📊 **Periodic Table of Elements**: Complete 118 IUPAC elements with lanthanide/actinide subgrids.
  - ⚡ **Chemical Reaction Predictor**: Stoichiometric equations, curved-arrow mechanisms, and thermodynamics.
  - ❓ **VSEPR Theory & Lewis Solver**: Steric numbers, electron geometry, and lone-pair repulsion solver.
  - 📖 **Guided Chemistry Tutorials**: Interactive step-by-step learning modules with camera synchronization.
  - 📐 **2D / 3D Mode Toggle**: Instant planar chemical view vs. 3D quantum PBR view.
  - ⚡ **Ultra-Fast AMP & HTMX Mode**: Direct link to `/amp.html` for sub-50ms mobile access.
- **Zero-Obscuration Design**: Tooltip labels appear on hover with safe offset, never interfering with interactive canvas elements.

### 3. Studio PBR 3D Molecular Viewer & 2D Planar ChemView
- **Photorealistic PBR Rendering (Three.js)**: Built with physical materials (`MeshPhysicalMaterial`), ACES Filmic tonemapping, directional 3-point studio lighting, contact grounding shadows, and procedural studio environment reflections (`RoomEnvironment` via `PMREMGenerator`).
- **📐 2D Planar ChemView Option for ALL Molecules**:
  - Available across every molecule (from simple $H_2O$ and $CH_4$ to complex caffeine $C_8H_{10}N_4O_2$, aspirin $C_9H_8O_4$, benzene $C_6H_6$, and buckyballs $C_{60}$).
  - Automatically calculates the optimal planar projection along the minimum-variance spatial axis.
  - Renders high-contrast atomic symbol tokens (H, C, N, O, etc.) with standard CPK backgrounds and crisp white borders.
  - Flattens bond cylinders into planar lines and aligns the camera orthographically perpendicular to the molecular plane.
  - Accessible via both the left floating sidebar icon and the on-canvas viewport toolbar button.
- **3D Representation Styles**:
  - *Ball-and-Stick*: Single, double, triple, and aromatic bond cylinders with metallic clearcoat.
  - *Space-Filling (vdW)*: Van der Waals overlapping electron radii.
  - *Stick*: Compact skeletal bonding view.
  - *Wireframe*: Minimalist geometric lattice.
  - *⚡ Electrostatic Potential Map (ESP)*: Translucent dielectric electron density envelope with continuous red-yellow-green-cyan-blue potential gradient and floating on-canvas HUD legend.
- **Zero-Occlusion & Focus Controls**:
  - *X-Ray Translucent Shell*: Semi-transparent outer shells to view interior bond axes and nuclear centers.
  - *Coordination Sphere Isolation*: Spotlight a selected atom and its directly bonded neighbors while dimming peripheral atoms.
  - *Collapsible Bottom Dock*: Zen cinema mode keeping the 3D scene 100% unobstructed.
  - *Full-Screen Focus Mode*: Expands the canvas into a full-window immersion mode with aspect ratio preservation and `Escape` key exit.

### 4. Full 118-Element IUPAC Periodic Table Page
- **Complete 18-Column Tabular Grid**: Periods 1–7 and Groups 1–18, color-coded by chemical series (Alkali Metals, Alkaline Earth, Transition Metals, Post-Transition, Metalloids, Nonmetals, Halogens, Noble Gases).
- **Dedicated Lanthanide & Actinide Subgrids**: Full 15-column $f$-block subgrid accurately decoupled below the main body.
- **Interactive Heatmap Overlays**: Switch between Category coloration, Electronegativity gradient, Atomic Radius gradient, and Melting Point temperature heatmap.
- **Exhaustive Electronic & Physical Property Inspector**:
  - Ground-state electron configuration, electrons per shell, Pauling electronegativity, 1st ionization energy, electron affinity, oxidation states, block ($s, p, d, f$).
  - Phase at STP, melting/boiling points (K and °C), density ($g/cm^3$ or $g/L$), atomic radius, covalent radius, discovery year, and discoverer.
- **Instant 3D Workbench Link**: Click "3D View" on any element tile to immediately load its corresponding benchmark molecules in the 3D viewer.

### 5. Live Stoichiometric Mass & Elemental Composition Breakdown
- **Real-Time Molar Mass Calculation**: Automatic stoichiometric evaluation of any chemical formula or PubChem compound.
- **Isotopic Exact Mass**: High-precision mass resolution to four decimal places.
- **Elemental Fraction Breakdown**:
  - Element symbol, atom count, and individual atomic mass contribution.
  - Calculated mass percentage (% w/w) for every constituent element.
  - Proportional multi-segment color progress bar matching IUPAC CPK element colors.

### 6. Complex Orbital Arrangements & Electron Clouds
- **Hybrid Orbitals ($sp, sp^2, sp^3, sp^3d, sp^3d^2$)**: Procedurally generated asymmetric teardrop lobes with wave-function phase coloring (positive phase in cyan, negative counter-lobe in coral).
- **Atomic Orbitals**: Dumbbell $p_x, p_y, p_z$ lobes and $d_{z^2}$ lobes with toroidal donut rings.
- **Delocalized $\pi$ Electron Clouds**: Doughnut-shaped continuous electron density clouds above and below conjugated aromatic rings (e.g. Benzene $6\pi$ ring) and alkenes.
- **Non-Bonding Lone Pairs**: Localized electron density lobes (e.g., Water's "rabbit ears").
- Adjustable iso-surface scale and opacity sliders.

### 7. Atomic Bonding Dynamics & Measurement Tools
- **Normal Vibrational Modes**: Real-time sinusoidal harmonic simulations of symmetric stretching ($\nu_1$), asymmetric stretching ($\nu_3$), in-plane scissoring bends ($\nu_2$), breathing modes, and umbrella inversion (e.g., Ammonia quantum tunneling).
- **Thermal Brownian Simulation**: Maxwell-Boltzmann thermal jitter slider ($0\text{ K}$ absolute zero to $500\text{ K}$ thermal excitation).
- **Dipole Moment Vector**: 3D arrow scaled in Debye (D) passing through the center of charge, with atomic partial charge halos ($\delta^+ / \delta^-$).
- **Point-and-Click Measurement Tool**:
  - Click 2 atoms: calculates exact interatomic distance in Ångströms (Å) and picometers (pm).
  - Click 3 atoms: calculates vertex bond angle in degrees (°).

### 8. Chemical Reaction & Mechanism Predictor
- Input multiple reactants (e.g., `C2H4 + H2O`, `CH4 + 2O2`, `HCl + NaOH`, `C6H6 + Br2`, `CH3COOH + C2H5OH`) or load the active molecule from the 3D viewer.
- Predicts plausible products and balanced stoichiometric equations across:
  - *Electrophilic Addition*
  - *Combustion*
  - *Fischer Esterification*
  - *Electrophilic Aromatic Substitution*
  - *Acid-Base Neutralization*
  - *Halogenation*
- Step-by-step curved-arrow reaction mechanisms with intermediate structures (carbocations, arenium ions, cyclic bromonium ions, tetrahedral intermediates).
- Thermodynamic profiles ($\Delta H^\circ$, activation energy $E_a$, driving forces, recommended catalysts).
- 1-click loading of any reactant or product directly into the 3D viewer.

### 9. Step-by-Step Guided Tutorials & Curated Molecule Library
- **Interactive Guided Lessons**:
  - *Water ($H_2O$)*: Bent Dipole & Lone-Pair Repulsion ($109.5^\circ \to 104.5^\circ$).
  - *Methane ($CH_4$)*: Regular Tetrahedral Symmetry & $sp^3$ Hybrid Overlap.
  - *Benzene ($C_6H_6$)*: Planar Hexagon & $6\pi$ Delocalized Cloud.
  - *Hypervalent Complexes ($SF_6, PCl_5$)*: Period 3 Expanded Octets ($sp^3d, sp^3d^2$) and axial/equatorial bond length inequality.
- Programmatically synchronizes the 3D scene (camera, orbital mode, vibrational modes).

### 10. Expandable / Shrinkable Lab Notebook (Right Inspector)
- **Small Notebook Icon Toggle**: Sits at the top of the right inspector, shrinking into a clean compact bar and expanding smoothly when opened.
- **Live 3D State Snapshot Capture**: Freezes active orbital modes ($sp, sp^2, sp^3$, $\pi$ clouds), normal vibrational frequency ($cm^{-1}$), thermal temperature ($K$), dipole moment, and active point-and-click interatomic distance / bond angle measurements.
- **Rich Student Observations & Tags**: Tag notes under *Observation*, *VSEPR Analysis*, *Spectroscopy*, *Reaction Mechanism*, or *Lab Report*.
- **1-Click 3D State Restoration**: Click the restore icon on any saved card to immediately reload that exact state in the 3D canvas.
- **Markdown Export & Local Persistence**: Stores observations in `localStorage` and exports clean `.md` Markdown files.

### 11. Cross-Platform Favicon & App Icon Matrix
- **Scalable Vector SVG**: Modern neon atomic orbital rings with glowing nucleus (`/favicon.svg`).
- **Multi-Resolution Desktop ICO**: Combined 16×16, 32×32, and 48×48 icon layers (`/favicon.ico`).
- **Apple iOS Touch Icons**: Generated icons for all Apple devices:
  - `apple-touch-icon.png` (180×180 standard)
  - `apple-touch-icon-152x152.png` (iPad retina)
  - `apple-touch-icon-167x167.png` (iPad Pro)
- **Android & PWA Suite**: Web App Manifest (`/manifest.json`), `pwa-192x192.png`, `pwa-512x512.png`, and `pwa-maskable-512x512.png` with safe-zone margin.
- **Windows / Edge Support**: Microsoft tile configuration (`/browserconfig.xml`) and `mstile-150x150.png`.
- **Safari Support**: Pinned tab vector badge (`/safari-pinned-tab.svg`).

### 12. Ultra-Fast AMP & HTMX Mobile Edition (`/amp.html`)
- **Strict Google AMP Specification**: Valid AMP HTML with `<html ⚡ lang="en">`, responsive viewport, and inline AMP boilerplate CSS.
- **Local HTMX Hypermedia Integration**: Self-hosted `htmx.min.js` (`/public/htmx.min.js`) for rapid partial swaps and sub-50ms response times without external CDN dependencies.
- **Instant Chemical Lookup**: Fast elemental searching, formula calculator, and interactive AMP accordion documentation.

### 13. AI SEO & Generative Engine Optimization (GEO)
- **Robots.txt (`/public/robots.txt`)**: Explicitly configured for search crawlers and AI search agents (GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended).
- **Machine-Readable LLM Knowledge (`/public/llms.txt`)**: Structured reference documenting all features, endpoints, and chemical calculation APIs for Large Language Models.
- **Deep-Linking Architecture**: Instant routing for search engines via URL query parameters (`/?view=workbench`, `/?view=elements`, `/?view=about`, `/?molecule=caffeine`, `/?element=Fe`).
- **Semantic JSON-LD Structured Data**: Embedded in both `index.html` and `amp.html` covering `WebApplication`, `Dataset` (IUPAC periodic table), and `FAQPage`.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology |
|---|---|
| **Frontend Framework** | React 19 (TypeScript, Hooks) |
| **3D Graphics Engine** | Three.js (r160+), WebGL, Studio PBR Materials |
| **Mobile Acceleration** | Google AMP HTML & HTMX |
| **Bundler & Dev Server** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Typography** | Inter & JetBrains Mono |
| **Icons** | Lucide React |
| **Chemical Data API** | NCBI PubChem PUG REST API |

---

## 🚀 Local Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### Installation Steps

1. **Clone or Download the Repository**:
   ```bash
   git clone <repository-url>
   cd react-example
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *(Note: The app runs with zero external API keys required. PubChem public endpoints have open CORS).*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The optimized production bundle will be output to the `dist/` directory.

6. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🧪 Testing & Verification Guide

### 1. Static Type Checking & Linting
Run TypeScript type-checking to ensure zero syntax or interface errors:
```bash
npm run lint
```
*Expected output: Clean exit with zero errors (`tsc --noEmit`).*

### 2. Functional Verification Checklist

| Test Scenario | Action | Expected Result |
|---|---|---|
| **Default Landing Page** | Open `http://localhost:3000` without query parameters. | Displays the comprehensive **About & Vision** landing page with project ideas, vision, mission, features, and future ambitions. |
| **Static Floating Sidebar** | Hover over and click any icon on the left floating sidebar. | Switches between About, 3D Workbench, Periodic Table, Reaction Predictor, VSEPR Solver, Tutorials, and 2D/3D modes. |
| **2D Planar ChemView** | Click the `2D` button in the left sidebar or the `2D / 3D` button on the canvas toolbar. | Flattens any 3D molecule into an orthographic 2D chemical structure with CPK elemental badges and planar bonds. |
| **118-Element Periodic Table** | Click the Periodic Table icon in the sidebar or top bar. | Displays all 118 IUPAC elements with lanthanide/actinide subgrids and live property inspection. |
| **Stoichiometric Mass Breakdown** | Inspect right panel on any loaded compound. | Displays live molecular weight, exact mass, and elemental % w/w distribution. |
| **Live Formula Search** | Enter `C9H8O4` (Aspirin) or `C8H10N4O2` (Caffeine) in search. | Fetches PubChem 3D conformer, calculates mass %, TPSA, XLogP, and Lipinski status. |
| **Reaction Predictor** | Click *Reaction Predictor*, select *Acid-Catalyzed Hydration* or enter `C2H4 + H2O`. | Predicts $C_2H_5OH$, outlines mechanism, shows $\Delta H^\circ$, and allows 1-click 3D loading. |
| **Guided Tutorials** | Click *Tutorials*, select *Water (H₂O)*, step through 1 to 4. | Programmatically guides camera, highlights lone-pair repulsion, and activates scissoring bend. |
| **ESP Density Map** | Click `⚡ ESP Map` in bottom dock or Orbitals inspector tab. | Renders translucent dielectric electron density isosurface envelope with continuous potential gradient and HUD legend. |
| **Full-Screen Focus Mode** | Click the Full-Screen icon (`Maximize2`) in the 3D viewport toolbar. | Expands 3D viewport to fill 100% of the screen/window with updated aspect ratio; exits via `Minimize2` or `Escape`. |
| **AMP & HTMX Mobile View** | Open `/amp.html` in browser. | Valid AMP fast-loading page with HTMX interactions and instant chemical calculations. |
| **Favicons & PWA** | Check browser tab icon or inspect `/manifest.json`. | Displays custom vector SVG orbital icon; serves 16x16/32x32 PNGs, 180x180 Apple Touch icon, and maskable PWA icons. |
| **Interactive FAQ Section** | On About page, search for "VSEPR" or filter by category. | Dynamically filters questions; clicking any card expands the detailed scientific answer with full forms in brackets. |

---

## 📜 Scientific Standards & Conventions

- **Atomic Color Coding**: Adheres strictly to standard CPK (Corey-Pauling-Koltun) coloring (Hydrogen: White, Carbon: Slate/Black, Nitrogen: Blue, Oxygen: Red, Fluorine: Emerald, Chlorine: Green, Sulfur: Yellow, Phosphorus: Orange).
- **VSEPR Repulsion Hierarchy**: $(LP—LP) > (LP—BP) > (BP—BP)$ accurately modulates theoretical vs. real bond angles.
- **Orbital Phase Signs**: Signs ($+$ and $-$) represent wave-function mathematical phase for constructive and destructive interference, not electrostatic charge.
- **Data Provenance**: Every molecular record displays explicit provenance badges (`[PubChem 3D Conformer - Verified]` or `[VSEPR Ab Initio Calculated Model]`) with direct outbound links to the NCBI PubChem database.

---

## 📄 License
This project is licensed under the Apache-2.0 License.
