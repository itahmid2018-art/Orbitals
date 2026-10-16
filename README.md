# Orbitalis: 3D Molecular & Quantum Dynamics Workbench

> An interactive, publication-grade 3D molecular structure visualizer, quantum orbital workbench, and chemical reaction mechanism predictor built for chemistry students, educators, and researchers.

![Orbitalis 3D Workbench](https://pubchem.ncbi.nlm.nih.gov/images/hero/pubchem_logo.svg)

---

## 🔬 Product Overview

**Orbitalis** bridges theoretical physical chemistry and interactive 3D computing. It enables students and scientists to enter chemical formulas (e.g., `H2O`, `CH4`, `C6H6`, `SF6`, `C9H8O4`) or common names to visualize 3D molecular structures, hybrid atomic orbital lobes, and real-time vibrational dynamics.

### Key Capabilities

1. **Studio PBR 3D Molecular Viewer (Three.js)**
   - **Photorealistic PBR Rendering**: Built with physical materials (`MeshPhysicalMaterial`), ACES Filmic tonemapping, directional 3-point studio lighting, contact grounding shadows, and procedural studio environment reflections (`RoomEnvironment` via `PMREMGenerator`).
   - **Representation Styles**: Ball-and-Stick (with distinct single, double, triple, and aromatic bond cylinders), Space-Filling (Van der Waals radii), Stick, Wireframe skeletons, and **⚡ Electrostatic Potential Map (ESP)**.
   - **Electrostatic Potential Map (ESP)**: Wraps the molecule in an electron density gradient isosurface with scientific potential mapping—vibrant red for high electron density (nucleophilic $\delta^-$ zones), yellow/green for neutral regions, and deep blue for low electron density (electrophilic $\delta^+$ zones), accompanied by a floating on-canvas HUD legend.
   - **Zero-Occlusion Controls**:
     - *X-Ray Translucent Shell*: Makes outer electron shells semi-transparent to view interior bond axes and nuclear centers without occlusion.
     - *Coordination Sphere Isolation*: Spotlight a selected atom's local coordination geometry while dimming peripheral atoms.
     - *Collapsible Bottom Dock*: Cinema/Zen view keeping the central 3D scene 100% unobstructed.
   - **Full-Screen Focus Mode**: Dedicated full-screen toggle button (`Maximize2` / `Minimize2` icon) on the top-right viewport toolbar. Expands the 3D molecular canvas into an immersive, distraction-free viewport with automatic camera aspect ratio recalibration, native `fullscreenchange` synchronization, seamless CSS fixed overlay fallback for sandboxed iframes, and quick `Escape` key exit.

2. **Complex Orbital Arrangements & Electron Clouds**
   - **Hybrid Orbitals ($sp, sp^2, sp^3, sp^3d, sp^3d^2$)**: Procedurally generated asymmetric teardrop lobes with wave-function phase coloring (positive phase in cyan, negative counter-lobe in coral).
   - **Atomic Orbitals**: Dumbbell $p_x, p_y, p_z$ lobes and $d_{z^2}$ lobes with toroidal donut rings.
   - **Delocalized $\pi$ Electron Clouds**: Doughnut-shaped continuous electron density clouds above and below conjugated aromatic rings (e.g. Benzene $6\pi$ ring) and alkenes.
   - **Non-Bonding Lone Pairs**: Localized electron density lobes (e.g., Water's "rabbit ears").
   - Adjustable iso-surface scale and opacity sliders.

3. **Atomic Bonding Dynamics & Measurement Tools**
   - **Normal Vibrational Modes**: Real-time sinusoidal harmonic simulations of symmetric stretching ($\nu_1$), asymmetric stretching ($\nu_3$), in-plane scissoring bends ($\nu_2$), breathing modes, and umbrella inversion (e.g., Ammonia quantum tunneling).
   - **Thermal Brownian Simulation**: Maxwell-Boltzmann thermal jitter slider ($0\text{ K}$ absolute zero to $500\text{ K}$ thermal excitation).
   - **Dipole Moment Vector**: 3D arrow scaled in Debye (D) passing through the center of charge, with atomic partial charge halos ($\delta^+ / \delta^-$).
   - **Point-and-Click Measurement Tool**:
     - Click 2 atoms: calculates exact interatomic distance in Ångströms (Å) and picometers (pm).
     - Click 3 atoms: calculates vertex bond angle in degrees (°).

4. **Chemical Reaction & Mechanism Predictor**
   - Input two or more reactants (e.g. `C2H4 + H2O`, `CH4 + 2O2`, `HCl + NaOH`, `C6H6 + Br2`, `CH3COOH + C2H5OH`) or load the active molecule from the 3D viewer.
   - Predicts plausible products and balanced stoichiometric equations across:
     - *Electrophilic Addition*
     - *Combustion*
     - *Fischer Esterification*
     - *Electrophilic Aromatic Substitution*
     - *Acid-Base Neutralization*
     - *Halogenation*
   - Step-by-step curved-arrow reaction mechanisms with intermediate structures (carbocations, arenium ions, cyclic bromonium ions, tetrahedral intermediates).
   - Thermodynamic profiles ($\Delta H^\circ$, activation energy $E_a$, driving forces, recommended catalysts).
   - Deep links to chemical principles: Markovnikov's Rule, Le Chatelier's Principle, Hammond's Postulate, Frontier Molecular Orbital (FMO HOMO-LUMO) Theory, and Aromatic Resonance Energy.
   - 1-click loading of any reactant or product directly into the 3D viewer.

5. **Step-by-Step Guided Tutorials & Curated Molecule Library**
   - **Interactive Guided Lessons**:
     - *Water ($H_2O$)*: Bent Dipole & Lone-Pair Repulsion ($109.5^\circ \to 104.5^\circ$).
     - *Methane ($CH_4$)*: Regular Tetrahedral Symmetry & $sp^3$ Hybrid Overlap.
     - *Benzene ($C_6H_6$)*: Planar Hexagon & $6\pi$ Delocalized Cloud.
     - *Hypervalent Complexes ($SF_6, PCl_5$)*: Period 3 Expanded Octets ($sp^3d, sp^3d^2$) and axial/equatorial bond length inequality.
   - Programmatically synchronizes the 3D scene (camera, orbital mode, vibrational modes).
   - Comprehensive library categorized by VSEPR fundamentals, conjugated systems, and pharmaceuticals.

6. **Independent Interactive Periodic Table of Elements Page**
   - **Full 18-Column Grid**: Complete tabular layout displaying Periods 1–7 and Groups 1–18, color-coded by chemical series (Alkali Metals, Alkaline Earth, Transition Metals, Post-Transition, Metalloids, Nonmetals, Halogens, Noble Gases, Lanthanides, Actinides).
   - **Exhaustive Property Inspector**:
     - *Electronic & Quantum*: Ground-state electron configuration, electrons per shell, electronegativity (Pauling), 1st ionization energy, electron affinity, oxidation states, block ($s, p, d, f$).
     - *Physical & Thermodynamic*: Standard phase at STP, melting and boiling points (K and °C), density ($g/cm^3$ or $g/L$), atomic radius, covalent radius, discovery year, and discoverer.
   - **Interactive Heatmap Overlays**: Switch between Category coloration, Electronegativity gradient, Atomic Radius gradient, and Melting Point temperature heatmap.
   - **Instant 3D Workbench Link**: Click "3D View" on any element tile to immediately load its corresponding benchmark molecules in the 3D viewer.

7. **Authoritative Science Data Integration**
   - Resolves live chemical data via the **NCBI PubChem PUG REST API** for experimental/MMFF94 3D conformer coordinates (SDF), IUPAC names, SMILES, InChIKey, and physicochemical properties.
   - Instant ab-initio VSEPR mathematical model fallbacks when offline or exploring hypothetical formulas.
   - Evaluates **Lipinski's Rule of 5** and **Veber Oral Bioavailability Criteria** for drug-likeness.

8. **Expandable / Shrinkable Lab Notebook (Right Inspector)**
   - **Small Notebook Icon Toggle**: Sits at the top of the right inspector, shrinking into a clean compact bar with a small notebook icon and saved note count badge, and expanding smoothly when opened.
   - **Live 3D State Snapshot Capture**: Freezes active orbital modes ($sp, sp^2, sp^3$, $\pi$ clouds), normal vibrational frequency ($cm^{-1}$), thermal temperature ($K$), dipole moment, and active point-and-click interatomic distance / bond angle measurements.
   - **Rich Student Observations & Tags**: Tag notes under *Observation*, *VSEPR Analysis*, *Spectroscopy*, *Reaction Mechanism*, or *Lab Report*.
   - **1-Click 3D State Restoration**: Click the restore icon on any saved card to immediately reload that exact orbital state, render style, temperature, and vibration in the 3D canvas.
   - **Markdown Export & Local Persistence**: Stores observations in `localStorage` and exports clean `.md` Markdown files for chemistry lab assignment submissions.

9. **Multi-Viewport Favicon Suite & Mobile/Tablet Responsive Design**
   - **Comprehensive Favicon Suite**:
     - Modern vector SVG favicon (`/favicon.svg`) with quantum orbital rings, glowing nucleus, and antialiased gradients.
     - High-DPI desktop tab favicons (`/favicon-32x32.png`, `/favicon-16x16.png`, and multi-resolution `/favicon.ico`).
     - Apple Touch Icon (`/apple-touch-icon.png` 180x180) for iOS Safari home screen bookmarks and iPad viewports.
     - Android & PWA App Icons (`/pwa-192x192.png`, `/pwa-512x512.png`, and `/pwa-maskable-512x512.png` with safe-zone margin).
     - Standard Web App Manifest (`/manifest.json`) and theme colors (`#0b1120`).
   - **Mobile & Tablet Touch Controls**:
     - *1-Finger Drag*: Smoothly orbits 3D camera angles ($\theta$ and $\phi$).
     - *2-Finger Pinch*: Smoothly zooms camera distance in and out.
     - *Short Tap*: Raycasts and selects atomic centers for measurement and inspection.
     - `touch-action: none` prevents browser pull-to-refresh interference while manipulating 3D molecules.
   - **Mobile Layout & Viewport Adaptations**:
     - Responsive canvas height (`h-[400px]` on mobile, `h-[490px]` on tablet, `h-[740px]` on desktop).
     - Mobile quick navigation anchor bar for instant switching between 3D Canvas and Inspector & Notebook.
     - Horizontally scrollable zero-occlusion dock with touch-friendly pills.
     - Periodic Table mobile swipe guide and auto-scroll to element properties.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology |
|---|---|
| **Frontend Framework** | React 19 (TypeScript, Hooks) |
| **3D Graphics Engine** | Three.js (r160+), WebGL, Studio PBR Materials |
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
| **Quick-Try Chips** | Click `H2O`, `CH4`, `C6H6`, `SF6`, or `PCl5` in the top bar. | 3D structure updates instantly with exact geometry, bond orders, and VSEPR data. |
| **Live Formula Search** | Enter `C9H8O4` (Aspirin) or `C8H10N4O2` (Caffeine) in search. | Fetches PubChem 3D conformer, calculates mass %, TPSA, XLogP, and Lipinski status. |
| **Orbital Modes** | Switch between *Hybrid Lobes*, *Atomic p*, *π Clouds*, and *All*. | Generates wave-function envelopes with (+) cyan and (−) coral phases. |
| **Bonding Dynamics** | Toggle vibration play/pause or select *Scissoring Bend* on $H_2O$. | Harmonic sinusoidal displacements oscillate atoms at specified $cm^{-1}$ frequency. |
| **Thermal Slider** | Adjust temperature slider from 0 K to 500 K. | Brownian thermal jitter amplitude scales realistically with temperature. |
| **3D Measurement** | Click two atoms in viewport, then click a third atom. | Displays interatomic distance in Å/pm and vertex bond angle in degrees. |
| **Zero-Occlusion** | Toggle *X-Ray Shell* or *Isolate* in the bottom dock. | Atomic shells become semi-transparent, exposing inner bond axes without occlusion. |
| **Reaction Predictor** | Click *Reaction Predictor*, select *Acid-Catalyzed Hydration* or enter `C2H4 + H2O`. | Predicts $C_2H_5OH$, outlines 3-step mechanism, shows $\Delta H^\circ$, and links Markovnikov's Rule. |
| **Guided Tutorials** | Click *Tutorials*, select *Water (H₂O)*, step through 1 to 4. | Programmatically guides camera, highlights lone-pair repulsion, and activates scissoring bend. |
| **ESP Density Map** | Click `⚡ ESP Map` in bottom dock or Orbitals inspector tab. | Renders translucent dielectric electron density isosurface envelope with continuous Red-Yellow-Green-Cyan-Blue potential gradient; displays floating ESP legend HUD. |
| **Full-Screen Focus Mode** | Click the Full-Screen icon (`Maximize2`) in the 3D viewport toolbar. | Expands 3D viewport to fill 100% of the screen/window with updated aspect ratio; displays "Focus Mode" badge; exits via `Minimize2` button or `Escape` key. |
| **Favicons & PWA** | Check browser tab icon or inspect `/manifest.json`. | Displays custom vector SVG orbital icon; serves 16x16/32x32 PNGs, 180x180 Apple Touch icon, and maskable PWA icons. |
| **Snapshot Export** | Click the camera icon in the 3D viewport toolbar. | Downloads high-resolution transparent PNG snapshot. |

---

## 📜 Scientific Standards & Conventions

- **Atomic Color Coding**: Adheres strictly to standard CPK (Corey-Pauling-Koltun) coloring (Hydrogen: White, Carbon: Slate/Black, Nitrogen: Blue, Oxygen: Red, Fluorine: Emerald, Chlorine: Green, Sulfur: Yellow, Phosphorus: Orange).
- **VSEPR Repulsion Hierarchy**: $(LP—LP) > (LP—BP) > (BP—BP)$ accurately modulates theoretical vs. real bond angles.
- **Orbital Phase Signs**: Signs ($+$ and $-$) represent wave-function mathematical phase for constructive and destructive interference, not electrostatic charge.
- **Data Provenance**: Every molecular record displays explicit provenance badges (`[PubChem 3D Conformer - Verified]` or `[VSEPR Ab Initio Calculated Model]`) with direct outbound links to the NCBI PubChem database.

---

## 📄 License
This project is licensed under the Apache-2.0 License.
