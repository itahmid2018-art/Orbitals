import { OrbitalVisualizationMode, RenderStyle } from '../types/chemistry';

export interface TutorialStep {
  stepIndex: number;
  title: string;
  explanation: string;
  formula: string;
  targetOrbitalMode: OrbitalVisualizationMode;
  targetRenderStyle: RenderStyle;
  activeModeId?: string; // vibrational mode id if applicable
  temperatureK?: number;
  showDipole?: boolean;
  highlightedAtomIndices?: number[];
  takeaway: string;
}

export interface GuidedTutorial {
  id: string;
  title: string;
  subtitle: string;
  moleculeName: string;
  formula: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  steps: TutorialStep[];
}

export const GUIDED_TUTORIALS: GuidedTutorial[] = [
  {
    id: 'tut-water-dipole',
    title: 'Water (H₂O): The Bent Dipole & Lone-Pair Repulsion',
    subtitle: 'Learn how electron repulsion shapes the universal solvent',
    moleculeName: 'Water',
    formula: 'H2O',
    difficulty: 'Beginner',
    durationMinutes: 4,
    steps: [
      {
        stepIndex: 1,
        title: 'Step 1: Oxygen’s Valence Shell & Steric Number',
        explanation: 'Oxygen has 6 valence electrons and forms 2 single covalent bonds with hydrogen atoms, leaving 4 non-bonding electrons (2 lone pairs). With 2 bonding pairs + 2 lone pairs, oxygen has a Steric Number of 4.',
        formula: 'H2O',
        targetOrbitalMode: 'none',
        targetRenderStyle: 'ball_and_stick',
        showDipole: false,
        takeaway: 'Steric Number = 2 bonding pairs + 2 lone pairs = 4 (Tetrahedral electron geometry).',
      },
      {
        stepIndex: 2,
        title: 'Step 2: sp³ Hybridization & Lone Pair "Rabbit Ears"',
        explanation: 'To minimize electrostatic repulsion, oxygen mixes its 2s and three 2p orbitals into four equivalent sp³ hybrid orbitals. Two of these orbitals hold bonding electrons; the other two hold non-bonding lone pairs (colored in amber).',
        formula: 'H2O',
        targetOrbitalMode: 'hybrid',
        targetRenderStyle: 'ball_and_stick',
        showDipole: false,
        takeaway: 'Notice how the two amber lone pair lobes project outward in a pseudo-tetrahedral arrangement.',
      },
      {
        stepIndex: 3,
        title: 'Step 3: Repulsion Angle Compression (109.5° ➔ 104.5°)',
        explanation: 'Because lone pair electrons are held by only one atomic nucleus, they spread out more spatially than bonding pairs. The intense (LP—LP) and (LP—BP) repulsion pushes the two O-H bonds together, compressing the ideal tetrahedral 109.5° angle down to 104.5°.',
        formula: 'H2O',
        targetOrbitalMode: 'hybrid',
        targetRenderStyle: 'ball_and_stick',
        showDipole: true,
        takeaway: 'VSEPR (Valence Shell Electron Pair Repulsion) hierarchy: (LP—LP) > (LP—BP) > (BP—BP), bending the bond angle to 104.5°.',
      },
      {
        stepIndex: 4,
        title: 'Step 4: The Net Dipole Moment & Vibrational Scissoring',
        explanation: 'Oxygen is far more electronegative (3.44) than hydrogen (2.20). The individual bond dipoles reinforce one another through the bent geometry, creating a strong permanent net dipole moment (1.85 Debye) pointing toward oxygen. Notice the in-plane scissoring vibration (ν₂ = 1595 cm⁻¹).',
        formula: 'H2O',
        targetOrbitalMode: 'hybrid',
        targetRenderStyle: 'ball_and_stick',
        activeModeId: 'h2o-bend',
        showDipole: true,
        takeaway: 'The bent geometry ensures bond dipoles do not cancel, giving water its extraordinary polarity and hydrogen-bonding capacity.',
      },
    ],
  },

  {
    id: 'tut-methane-sp3',
    title: 'Methane (CH₄): Perfect Tetrahedral Symmetry & sp³ Overlap',
    subtitle: 'Explore the quintessential building block of organic chemistry',
    moleculeName: 'Methane',
    formula: 'CH4',
    difficulty: 'Beginner',
    durationMinutes: 3,
    steps: [
      {
        stepIndex: 1,
        title: 'Step 1: Carbon’s Ground State vs Valence State',
        explanation: 'Ground state carbon has electron configuration 1s² 2s² 2p², with only two unpaired electrons. By promoting one 2s electron into the vacant 2pz orbital, carbon forms four hybrid sp³ orbitals with one unpaired electron each.',
        formula: 'CH4',
        targetOrbitalMode: 'none',
        targetRenderStyle: 'ball_and_stick',
        showDipole: false,
        takeaway: 'Carbon promotes an electron from 2s to 2p to achieve tetravalency (4 covalent bonds).',
      },
      {
        stepIndex: 2,
        title: 'Step 2: Four Equivalent Directional Lobes at 109.47°',
        explanation: 'The four sp³ hybrid orbitals point toward the vertices of a regular tetrahedron with exact 109.47° bond angles. The large primary lobes (cyan) point outward directly along the C-H bond axes.',
        formula: 'CH4',
        targetOrbitalMode: 'hybrid',
        targetRenderStyle: 'ball_and_stick',
        showDipole: false,
        takeaway: 'Each sp³ orbital consists of 25% s-character and 75% p-character, maximizing directional overlap.',
      },
      {
        stepIndex: 3,
        title: 'Step 3: Head-on σ Bond Overlap & Symmetry Cancellation',
        explanation: 'Each carbon sp³ lobe overlaps head-on with a hydrogen 1s spherical orbital, forming four extremely strong, cylindrically symmetric σ (sigma) bonds. Because the four C-H dipole vectors point symmetrically toward the vertices of a cube, the net dipole vector cancels completely to 0.0 Debye (non-polar).',
        formula: 'CH4',
        targetOrbitalMode: 'hybrid',
        targetRenderStyle: 'ball_and_stick',
        showDipole: true,
        takeaway: 'Methane is non-polar because the four individual bond dipoles symmetrically cancel out.',
      },
      {
        stepIndex: 4,
        title: 'Step 4: Symmetric Breathing Vibration (ν₁ = 2917 cm⁻¹)',
        explanation: 'In the fully symmetric ν₁ breathing mode, all four hydrogen atoms simultaneously expand radially away from carbon and compress back in phase. Because the molecule maintains perfect tetrahedral symmetry throughout this motion, there is zero change in dipole moment, rendering this mode IR-inactive but intensely Raman-active.',
        formula: 'CH4',
        targetOrbitalMode: 'all',
        targetRenderStyle: 'ball_and_stick',
        activeModeId: 'ch4-breathing',
        showDipole: false,
        takeaway: 'Symmetric breathing vibrations maintain molecular symmetry and are Raman-active.',
      },
    ],
  },

  {
    id: 'tut-benzene-aromaticity',
    title: 'Benzene (C₆H₆): The 6π Delocalized Aromatic Cloud',
    subtitle: 'Discover how cyclic resonance creates extraordinary chemical stability',
    moleculeName: 'Benzene',
    formula: 'C6H6',
    difficulty: 'Intermediate',
    durationMinutes: 5,
    steps: [
      {
        stepIndex: 1,
        title: 'Step 1: The Kekulé Dilemma & Bond Length Equivalence',
        explanation: 'In 1865, August Kekulé proposed that benzene alternated rapidly between two cyclohexatriene isomers with alternating single (1.54 Å) and double (1.34 Å) bonds. However, X-ray crystallography proved that all six C-C bonds in benzene are strictly identical at 1.40 Å.',
        formula: 'C6H6',
        targetOrbitalMode: 'none',
        targetRenderStyle: 'ball_and_stick',
        showDipole: false,
        takeaway: 'All six carbon-carbon bonds in benzene have an identical intermediate bond order of 1.5.',
      },
      {
        stepIndex: 2,
        title: 'Step 2: Planar sp² Framework (120° Hexagon)',
        explanation: 'Each carbon is sp² hybridized, forming three in-plane σ bonds at 120° angles (two to adjacent carbons, one to hydrogen). This creates a perfectly flat, rigid planar hexagonal ring.',
        formula: 'C6H6',
        targetOrbitalMode: 'hybrid',
        targetRenderStyle: 'ball_and_stick',
        showDipole: false,
        takeaway: 'The planar sp² framework contains 12 σ bonds (6 C-C and 6 C-H) in the molecular plane.',
      },
      {
        stepIndex: 3,
        title: 'Step 3: Unhybridized 2pz Orbitals & Delocalized π Toroids',
        explanation: 'Perpendicular to the ring plane, each carbon retains one unhybridized 2pz atomic orbital holding 1 electron. Rather than pairing into localized double bonds, all six 2pz orbitals merge continuously into a pair of doughnut-shaped delocalized 6π electron clouds hovering above and below the ring.',
        formula: 'C6H6',
        targetOrbitalMode: 'pi_delocalized',
        targetRenderStyle: 'ball_and_stick',
        showDipole: false,
        takeaway: 'The 6 delocalized π electrons circulate freely around the ring, conferring 150 kJ/mol of aromatic resonance stabilization.',
      },
      {
        stepIndex: 4,
        title: 'Step 4: Ring Breathing Mode (ν₁ = 992 cm⁻¹)',
        explanation: 'In the iconic ring breathing mode, all six carbons pulse synchronously inward and outward like a beating heart at 992 cm⁻¹, generating an intense signature band in laser Raman spectroscopy.',
        formula: 'C6H6',
        targetOrbitalMode: 'all',
        targetRenderStyle: 'ball_and_stick',
        activeModeId: 'c6h6-ring-breathing',
        showDipole: false,
        takeaway: 'The 992 cm⁻¹ breathing vibration is the hallmark spectroscopic fingerprint of the benzene aromatic core.',
      },
    ],
  },

  {
    id: 'tut-hypervalency-sf6',
    title: 'Hypervalent Molecules: SF₆ & PCl₅ (Expanded Octets)',
    subtitle: 'Investigate how 3rd-row elements accommodate 10 and 12 valence electrons',
    moleculeName: 'Sulfur Hexafluoride',
    formula: 'SF6',
    difficulty: 'Advanced',
    durationMinutes: 4,
    steps: [
      {
        stepIndex: 1,
        title: 'Step 1: The Expanded Octet Phenomenon',
        explanation: 'While Period 2 elements (C, N, O, F) strictly obey the octet rule (maximum 8 valence electrons), Period 3 elements like sulfur and phosphorus possess accessible empty 3d subshells and larger covalent radii, allowing them to expand their valence shells to 10 or 12 electrons.',
        formula: 'SF6',
        targetOrbitalMode: 'none',
        targetRenderStyle: 'ball_and_stick',
        showDipole: false,
        takeaway: 'Period 3 elements can expand beyond 8 valence electrons to form hypervalent complexes.',
      },
      {
        stepIndex: 2,
        title: 'Step 2: Octahedral sp³d² Hybridization in SF₆',
        explanation: 'In SF₆, sulfur forms six equivalent S-F bonds at 90° and 180° angles. The central sulfur adopts sp³d² hybridization with Steric Number 6 and zero lone pairs, creating a regular octahedron of Oh point group symmetry.',
        formula: 'SF6',
        targetOrbitalMode: 'hybrid',
        targetRenderStyle: 'ball_and_stick',
        showDipole: false,
        takeaway: 'Six bonding pairs arrange into an octahedron with 90° mutually perpendicular bond angles.',
      },
      {
        stepIndex: 3,
        title: 'Step 3: PCl₅ Trigonal Bipyramid (sp³d) & Axial/Equatorial Inequality',
        explanation: 'In PCl₅ (Steric Number 5, sp³d), geometry is not regular! Three equatorial bonds lie at 120° (2.02 Å), while two axial bonds lie at 90° (2.14 Å). Axial bonds experience more 90° steric crowding from equatorial chlorines and are measurably longer and weaker.',
        formula: 'PCl5',
        targetOrbitalMode: 'hybrid',
        targetRenderStyle: 'ball_and_stick',
        showDipole: false,
        takeaway: 'In trigonal bipyramidal geometry (PCl₅), axial bonds (2.14 Å) are longer than equatorial bonds (2.02 Å).',
      },
    ],
  },
];

export interface MoleculeLibraryCategory {
  category: string;
  description: string;
  molecules: {
    formula: string;
    name: string;
    description: string;
    shape: string;
    hybridization: string;
  }[];
}

export const MOLECULE_LIBRARY: MoleculeLibraryCategory[] = [
  {
    category: 'VSEPR (Valence Shell Electron Pair Repulsion) Fundamentals',
    description: 'Canonical geometric archetypes from linear (SN=2) to octahedral (SN=6)',
    molecules: [
      { formula: 'H2O', name: 'Water', description: 'Bent geometry (104.5°) with 2 lone pairs', shape: 'Bent', hybridization: 'sp³' },
      { formula: 'CH4', name: 'Methane', description: 'Perfect tetrahedral symmetry (109.5°)', shape: 'Tetrahedral', hybridization: 'sp³' },
      { formula: 'NH3', name: 'Ammonia', description: 'Trigonal pyramidal (107.8°) with umbrella inversion', shape: 'Trigonal Pyramidal', hybridization: 'sp³' },
      { formula: 'CO2', name: 'Carbon Dioxide', description: 'Linear (180°) with two orthogonal π bonds', shape: 'Linear', hybridization: 'sp' },
      { formula: 'BF3', name: 'Boron Trifluoride', description: 'Trigonal planar (120°) Lewis acid with empty p orbital', shape: 'Trigonal Planar', hybridization: 'sp²' },
      { formula: 'SF6', name: 'Sulfur Hexafluoride', description: 'Octahedral (90°) hypervalent inert dielectric gas', shape: 'Octahedral', hybridization: 'sp³d²' },
      { formula: 'PCl5', name: 'Phosphorus Pentachloride', description: 'Trigonal bipyramidal with axial/equatorial bond lengths', shape: 'Trigonal Bipyramidal', hybridization: 'sp³d' },
    ],
  },
  {
    category: 'Resonance, π Overlap & Aromaticity',
    description: 'Conjugated systems, restricted alkene rotation, and delocalized ring currents',
    molecules: [
      { formula: 'C6H6', name: 'Benzene', description: 'Planar hexagonal ring with continuous 6π delocalized cloud', shape: 'Planar Hexagonal Ring', hybridization: 'sp²' },
      { formula: 'C2H4', name: 'Ethylene', description: 'Planar alkene with perpendicular 2p-2p π overlap', shape: 'Planar', hybridization: 'sp²' },
    ],
  },
  {
    category: 'Biochemical & Medicines',
    description: 'Bioactive small molecules illustrating functional groups and drug-likeness',
    molecules: [
      { formula: 'C9H8O4', name: 'Aspirin', description: 'Acetylsalicylic acid: aromatic ring with ester and carboxylate', shape: 'Aromatic Ester/Acid', hybridization: 'sp²' },
      { formula: 'C8H10N4O2', name: 'Caffeine', description: 'Purine-derived central nervous system stimulant', shape: 'Fused Bicyclic Purine', hybridization: 'sp²' },
    ],
  },
];
