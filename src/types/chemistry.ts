export interface ElementData {
  symbol: string;
  name: string;
  atomicNumber: number;
  mass: number;
  electronegativity: number;
  valenceElectrons: number;
  covalentRadius: number; // in Angstroms
  vdwRadius: number; // in Angstroms
  cpkColor: string;
  period: number;
  group: number;
  electronConfiguration: string;
}

export interface Atom3D {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
  formalCharge?: number;
  partialCharge?: number; // estimated Mulliken/Pauling partial charge
  hybridOrbital?: string; // e.g. sp3, sp2, sp
}

export interface Bond3D {
  id: string;
  sourceIndex: number;
  targetIndex: number;
  order: number; // 1 = single, 2 = double, 3 = triple, 1.5 = aromatic
  length?: number;
}

export interface MolecularGeometry {
  centralAtom: string;
  stericNumber: number;
  bondingPairs: number;
  lonePairs: number;
  electronGeometry: string;
  molecularShape: string;
  hybridization: string;
  idealBondAngle: number;
  actualBondAngle?: number;
  geometryDescription: string;
}

export interface ElementalFraction {
  element: string;
  count: number;
  massPercent: number;
  atomicMass: number;
}

export interface ChemicalProperties {
  formula: string;
  name: string;
  iupacName?: string;
  cid?: number;
  smiles?: string;
  inchiKey?: string;
  molecularWeight: number;
  exactMass: number;
  elementalComposition: ElementalFraction[];
  xlogp?: number;
  tpsa?: number;
  hBondDonorCount?: number;
  hBondAcceptorCount?: number;
  rotatableBondCount?: number;
  complexity?: number;
  vsepr: MolecularGeometry;
  polarity: 'Non-polar' | 'Slightly Polar' | 'Polar' | 'Strongly Polar';
  estimatedDipoleDebye: number;
  lipinskiPassed: boolean;
  lipinskiViolations: string[];
  veberPassed: boolean;
  veberViolations: string[];
  provenance: 'PubChem 3D Conformer (Verified)' | 'VSEPR Ab Initio Calculated Model' | 'Curated Quantum Geometry';
  sourceUrl?: string;
}

export interface VibrationalMode {
  id: string;
  name: string;
  description: string;
  frequencyCm1: number;
  type: 'stretch_sym' | 'stretch_asym' | 'bend_scissor' | 'twist_rock' | 'breathing';
  // displacement vectors for each atom
  displacements?: { x: number; y: number; z: number }[];
}

export type RenderStyle = 'ball_and_stick' | 'space_filling' | 'stick' | 'wireframe' | 'surface' | 'esp_surface' | '2d_projected';

export type OrbitalVisualizationMode = 
  | 'none' 
  | 'hybrid' 
  | 'atomic_p' 
  | 'atomic_d' 
  | 'pi_delocalized' 
  | 'lone_pairs' 
  | 'all';

export interface MeasurementSelection {
  atoms: number[]; // indices of clicked atoms
  distance?: number; // Angstroms (if 2 atoms)
  angle?: number; // degrees (if 3 atoms)
}
