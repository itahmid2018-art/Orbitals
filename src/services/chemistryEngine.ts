import {
  ChemicalProperties,
  ElementalFraction,
  MolecularGeometry,
  Atom3D,
  Bond3D,
} from '../types/chemistry';
import { getElement, ELEMENTS } from './elementData';

/**
 * Parses a chemical formula string (e.g. "H2O", "C6H12O6", "CH3COOH", "(NH4)2SO4")
 * into stoichiometric counts per element.
 */
export function parseFormula(formula: string): Record<string, number> {
  const result: Record<string, number> = {};
  if (!formula || !formula.trim()) return result;

  const cleanFormula = formula.trim().replace(/\s+/g, '');

  // Recursive parser handling parentheses e.g. (CH3)2CHOH or Ca(OH)2
  function parseSegment(segment: string, multiplier = 1) {
    const parenRegex = /\(([^()]+)\)(\d*)/g;
    let expanded = segment;
    let match;

    while ((match = parenRegex.exec(expanded)) !== null) {
      const inner = match[1];
      const count = match[2] ? parseInt(match[2], 10) : 1;
      parseSegment(inner, multiplier * count);
    }

    // Now remove parenthesized parts to process remaining elements
    const stripped = expanded.replace(/\(([^()]+)\)\d*/g, '');
    const elementRegex = /([A-Z][a-z]*)(\d*)/g;
    let elemMatch;

    while ((elemMatch = elementRegex.exec(stripped)) !== null) {
      const elem = elemMatch[1];
      const count = elemMatch[2] ? parseInt(elemMatch[2], 10) : 1;
      result[elem] = (result[elem] || 0) + count * multiplier;
    }
  }

  parseSegment(cleanFormula, 1);
  return result;
}

/**
 * Determine the central atom and deduce VSEPR geometry, hybridization, and bond angles.
 */
export function calculateVSEPR(
  elementCounts: Record<string, number>,
  formula: string
): MolecularGeometry {
  const elements = Object.keys(elementCounts);

  if (elements.length === 0) {
    return {
      centralAtom: 'Unknown',
      stericNumber: 0,
      bondingPairs: 0,
      lonePairs: 0,
      electronGeometry: 'Undefined',
      molecularShape: 'Undefined',
      hybridization: 'None',
      idealBondAngle: 0,
      geometryDescription: 'No elements provided',
    };
  }

  // Diatomic or single element
  const totalAtoms = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  if (totalAtoms <= 2) {
    return {
      centralAtom: elements[0],
      stericNumber: 1,
      bondingPairs: 1,
      lonePairs: 0,
      electronGeometry: 'Linear',
      molecularShape: 'Linear',
      hybridization: 'sp',
      idealBondAngle: 180,
      actualBondAngle: 180,
      geometryDescription: 'Diatomic molecule with linear 180° geometry.',
    };
  }

  // Identify central atom: least electronegative non-hydrogen atom, or lowest count
  let central = elements[0];
  let minEn = 999;

  for (const elem of elements) {
    if (elem === 'H') continue;
    const en = ELEMENTS[elem]?.electronegativity || 2.5;
    const count = elementCounts[elem];
    if (count === 1) {
      central = elem;
      break;
    }
    if (en < minEn) {
      minEn = en;
      central = elem;
    }
  }

  const centralData = getElement(central);
  const centralValence = centralData.valenceElectrons;

  // Count atoms bonded to central atom
  let bondedAtoms = 0;
  for (const [elem, count] of Object.entries(elementCounts)) {
    if (elem === central) {
      bondedAtoms += count - 1;
    } else {
      bondedAtoms += count;
    }
  }

  // Specific canonical VSEPR lookups for key student molecules
  const normFormula = formula.toUpperCase().replace(/\s+/g, '');
  if (normFormula === 'H2O') {
    return {
      centralAtom: 'O',
      stericNumber: 4,
      bondingPairs: 2,
      lonePairs: 2,
      electronGeometry: 'Tetrahedral',
      molecularShape: 'Bent (Angular)',
      hybridization: 'sp³',
      idealBondAngle: 109.5,
      actualBondAngle: 104.5,
      geometryDescription: 'Tetrahedral electron geometry with 2 lone pairs compressing the H-O-H angle to 104.5° via valence shell repulsion.',
    };
  }
  if (normFormula === 'NH3') {
    return {
      centralAtom: 'N',
      stericNumber: 4,
      bondingPairs: 3,
      lonePairs: 1,
      electronGeometry: 'Tetrahedral',
      molecularShape: 'Trigonal Pyramidal',
      hybridization: 'sp³',
      idealBondAngle: 109.5,
      actualBondAngle: 107.8,
      geometryDescription: 'Tetrahedral electron geometry with 1 apical lone pair exerting repulsion to yield a 107.8° H-N-H angle.',
    };
  }
  if (normFormula === 'CH4') {
    return {
      centralAtom: 'C',
      stericNumber: 4,
      bondingPairs: 4,
      lonePairs: 0,
      electronGeometry: 'Tetrahedral',
      molecularShape: 'Tetrahedral',
      hybridization: 'sp³',
      idealBondAngle: 109.5,
      actualBondAngle: 109.5,
      geometryDescription: 'Perfect tetrahedral symmetry with four equivalent sp³ hybridized C-H σ bonds at 109.47°.',
    };
  }
  if (normFormula === 'CO2') {
    return {
      centralAtom: 'C',
      stericNumber: 2,
      bondingPairs: 2,
      lonePairs: 0,
      electronGeometry: 'Linear',
      molecularShape: 'Linear',
      hybridization: 'sp',
      idealBondAngle: 180,
      actualBondAngle: 180,
      geometryDescription: 'sp-hybridized carbon with two double bonds (two σ and two π bonds) at 180° collinear angle.',
    };
  }
  if (normFormula === 'BF3') {
    return {
      centralAtom: 'B',
      stericNumber: 3,
      bondingPairs: 3,
      lonePairs: 0,
      electronGeometry: 'Trigonal Planar',
      molecularShape: 'Trigonal Planar',
      hybridization: 'sp²',
      idealBondAngle: 120,
      actualBondAngle: 120,
      geometryDescription: 'sp²-hybridized boron with planar 120° bond angles and an empty perpendicular 2p orbital.',
    };
  }
  if (normFormula === 'SF6') {
    return {
      centralAtom: 'S',
      stericNumber: 6,
      bondingPairs: 6,
      lonePairs: 0,
      electronGeometry: 'Octahedral',
      molecularShape: 'Octahedral',
      hybridization: 'sp³d²',
      idealBondAngle: 90,
      actualBondAngle: 90,
      geometryDescription: 'Hypervalent sulfur with expanded octet (12 valence electrons), sp³d² hybridization, and 90°/180° bond angles.',
    };
  }
  if (normFormula === 'PCL5') {
    return {
      centralAtom: 'P',
      stericNumber: 5,
      bondingPairs: 5,
      lonePairs: 0,
      electronGeometry: 'Trigonal Bipyramidal',
      molecularShape: 'Trigonal Bipyramidal',
      hybridization: 'sp³d',
      idealBondAngle: 120,
      actualBondAngle: 120,
      geometryDescription: 'Expanded octet with 3 equatorial bonds at 120° and 2 longer axial bonds at 90° (sp³d hybridization).',
    };
  }
  if (normFormula === 'C2H4') {
    return {
      centralAtom: 'C',
      stericNumber: 3,
      bondingPairs: 3,
      lonePairs: 0,
      electronGeometry: 'Trigonal Planar',
      molecularShape: 'Planar',
      hybridization: 'sp²',
      idealBondAngle: 120,
      actualBondAngle: 121.3,
      geometryDescription: 'Planar sp² carbon centers linked by a C=C double bond (one σ bond + one π orbital overlap above/below plane).',
    };
  }
  if (normFormula === 'C2H2') {
    return {
      centralAtom: 'C',
      stericNumber: 2,
      bondingPairs: 2,
      lonePairs: 0,
      electronGeometry: 'Linear',
      molecularShape: 'Linear',
      hybridization: 'sp',
      idealBondAngle: 180,
      actualBondAngle: 180,
      geometryDescription: 'Collinear sp carbon centers connected by a C≡C triple bond (one σ bond + two orthogonal π bond lobes).',
    };
  }
  if (normFormula === 'C6H6') {
    return {
      centralAtom: 'C',
      stericNumber: 3,
      bondingPairs: 3,
      lonePairs: 0,
      electronGeometry: 'Trigonal Planar',
      molecularShape: 'Planar Hexagonal Ring',
      hybridization: 'sp²',
      idealBondAngle: 120,
      actualBondAngle: 120,
      geometryDescription: 'Aromatic planar hexagonal ring with 6 delocalized π electrons forming continuous cyclic electron density clouds above and below.',
    };
  }

  // General Lewis / VSEPR derivation:
  // Lone pairs on central atom estimate
  let electronsShared = bondedAtoms;
  let remainingValence = centralValence - electronsShared;
  let lonePairs = Math.max(0, Math.floor(remainingValence / 2));
  
  // For halogens, if bonded to multiple atoms or oxygen
  if (central === 'C' && bondedAtoms === 4) lonePairs = 0;
  if (central === 'C' && bondedAtoms === 3) lonePairs = 0;
  if (central === 'N' && bondedAtoms === 3) lonePairs = 1;
  if (central === 'O' && bondedAtoms === 2) lonePairs = 2;

  const stericNumber = Math.min(6, Math.max(2, bondedAtoms + lonePairs));

  let electronGeometry = 'Linear';
  let molecularShape = 'Linear';
  let hybridization = 'sp';
  let idealBondAngle = 180;
  let actualBondAngle = 180;

  switch (stericNumber) {
    case 2:
      electronGeometry = 'Linear';
      molecularShape = 'Linear';
      hybridization = 'sp';
      idealBondAngle = 180;
      actualBondAngle = 180;
      break;
    case 3:
      electronGeometry = 'Trigonal Planar';
      hybridization = 'sp²';
      idealBondAngle = 120;
      if (lonePairs === 0) {
        molecularShape = 'Trigonal Planar';
        actualBondAngle = 120;
      } else {
        molecularShape = 'Bent';
        actualBondAngle = 118;
      }
      break;
    case 4:
      electronGeometry = 'Tetrahedral';
      hybridization = 'sp³';
      idealBondAngle = 109.5;
      if (lonePairs === 0) {
        molecularShape = 'Tetrahedral';
        actualBondAngle = 109.5;
      } else if (lonePairs === 1) {
        molecularShape = 'Trigonal Pyramidal';
        actualBondAngle = 107.5;
      } else {
        molecularShape = 'Bent';
        actualBondAngle = 104.5;
      }
      break;
    case 5:
      electronGeometry = 'Trigonal Bipyramidal';
      hybridization = 'sp³d';
      idealBondAngle = 120;
      if (lonePairs === 0) molecularShape = 'Trigonal Bipyramidal';
      else if (lonePairs === 1) molecularShape = 'Seesaw';
      else if (lonePairs === 2) molecularShape = 'T-Shaped';
      else molecularShape = 'Linear';
      actualBondAngle = 120;
      break;
    case 6:
      electronGeometry = 'Octahedral';
      hybridization = 'sp³d²';
      idealBondAngle = 90;
      if (lonePairs === 0) molecularShape = 'Octahedral';
      else if (lonePairs === 1) molecularShape = 'Square Pyramidal';
      else molecularShape = 'Square Planar';
      actualBondAngle = 90;
      break;
  }

  return {
    centralAtom: central,
    stericNumber,
    bondingPairs: bondedAtoms,
    lonePairs,
    electronGeometry,
    molecularShape,
    hybridization,
    idealBondAngle,
    actualBondAngle,
    geometryDescription: `${electronGeometry} electron configuration with ${lonePairs} lone pair(s) resulting in ${molecularShape} molecular shape.`,
  };
}

/**
 * Calculates complete physicochemical properties, elemental composition,
 * Lipinski Rule of 5 and Veber drug-likeness.
 */
export function calculateChemicalProperties(
  formula: string,
  name?: string
): ChemicalProperties {
  const elementCounts = parseFormula(formula);
  let totalMass = 0;
  const fractions: ElementalFraction[] = [];

  for (const [elem, count] of Object.entries(elementCounts)) {
    const data = getElement(elem);
    const mass = data.mass * count;
    totalMass += mass;
  }

  for (const [elem, count] of Object.entries(elementCounts)) {
    const data = getElement(elem);
    const mass = data.mass * count;
    fractions.push({
      element: elem,
      count,
      massPercent: totalMass > 0 ? (mass / totalMass) * 100 : 0,
      atomicMass: data.mass,
    });
  }

  // Sort fractions by mass % descending
  fractions.sort((a, b) => b.massPercent - a.massPercent);

  const vsepr = calculateVSEPR(elementCounts, formula);

  // Polarity and electronegativity gradient
  let maxEnDiff = 0;
  const elements = Object.keys(elementCounts);
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const en1 = ELEMENTS[elements[i]]?.electronegativity || 2.0;
      const en2 = ELEMENTS[elements[j]]?.electronegativity || 2.0;
      const diff = Math.abs(en1 - en2);
      if (diff > maxEnDiff) maxEnDiff = diff;
    }
  }

  let polarity: ChemicalProperties['polarity'] = 'Non-polar';
  let estimatedDipoleDebye = 0;

  if (vsepr.lonePairs > 0 && maxEnDiff > 0.4) {
    if (maxEnDiff > 1.2) {
      polarity = 'Strongly Polar';
      estimatedDipoleDebye = 1.85; // e.g. H2O ~1.85 D
    } else {
      polarity = 'Polar';
      estimatedDipoleDebye = 1.47; // e.g. NH3 ~1.47 D
    }
  } else if (vsepr.molecularShape === 'Linear' || vsepr.molecularShape === 'Tetrahedral' || vsepr.molecularShape === 'Octahedral') {
    // Highly symmetric shapes usually cancel dipole vectors
    polarity = 'Non-polar';
    estimatedDipoleDebye = 0.0;
  } else if (maxEnDiff > 0.5) {
    polarity = 'Slightly Polar';
    estimatedDipoleDebye = 0.8;
  }

  // Lipinski Rule of 5 evaluations
  const mw = Number(totalMass.toFixed(2));
  const hBondDonors = (elementCounts['H'] && (elementCounts['O'] || elementCounts['N'])) ? Math.min(elementCounts['H'], (elementCounts['O'] || 0) + (elementCounts['N'] || 0)) : 0;
  const hBondAcceptors = (elementCounts['O'] || 0) + (elementCounts['N'] || 0);
  const estimatedLogP = Number(((elementCounts['C'] || 0) * 0.5 - (elementCounts['O'] || 0) * 0.8 - (elementCounts['N'] || 0) * 0.5 + (elementCounts['Cl'] || 0) * 0.6).toFixed(2));

  const lipinskiViolations: string[] = [];
  if (mw > 500) lipinskiViolations.push(`Molecular Weight (${mw} Da) > 500 Da`);
  if (estimatedLogP > 5) lipinskiViolations.push(`Calculated LogP (${estimatedLogP}) > 5`);
  if (hBondDonors > 5) lipinskiViolations.push(`H-Bond Donors (${hBondDonors}) > 5`);
  if (hBondAcceptors > 10) lipinskiViolations.push(`H-Bond Acceptors (${hBondAcceptors}) > 10`);

  const veberViolations: string[] = [];
  const rotatableBonds = Math.max(0, Math.floor((elementCounts['C'] || 0) / 2) - 1);
  const tpsa = Number(((elementCounts['O'] || 0) * 20.2 + (elementCounts['N'] || 0) * 23.8).toFixed(1));

  if (rotatableBonds > 10) veberViolations.push(`Rotatable Bonds (${rotatableBonds}) > 10`);
  if (tpsa > 140) veberViolations.push(`TPSA (${tpsa} Å²) > 140 Å²`);

  return {
    formula,
    name: name || formula,
    molecularWeight: mw,
    exactMass: mw,
    elementalComposition: fractions,
    xlogp: estimatedLogP,
    tpsa,
    hBondDonorCount: hBondDonors,
    hBondAcceptorCount: hBondAcceptors,
    rotatableBondCount: rotatableBonds,
    complexity: (elementCounts['C'] || 0) * 15 + (elementCounts['O'] || 0) * 10,
    vsepr,
    polarity,
    estimatedDipoleDebye,
    lipinskiPassed: lipinskiViolations.length <= 1,
    lipinskiViolations,
    veberPassed: veberViolations.length === 0,
    veberViolations,
    provenance: 'VSEPR Ab Initio Calculated Model',
  };
}

/**
 * Procedurally generates 3D atom coordinates and bonds for standard VSEPR shapes
 * when PubChem 3D conformer is not requested or as instant ab-initio fallback.
 */
export function generateVSEPRCoordinates(
  formula: string,
  geometry: MolecularGeometry,
  elementCounts: Record<string, number>
): { atoms: Atom3D[]; bonds: Bond3D[] } {
  const atoms: Atom3D[] = [];
  const bonds: Bond3D[] = [];

  const central = geometry.centralAtom;
  const centralElem = getElement(central);

  // Central atom at origin (0,0,0)
  atoms.push({
    id: 0,
    element: central,
    x: 0,
    y: 0,
    z: 0,
    hybridOrbital: geometry.hybridization,
  });

  // Identify ligands (surrounding atoms)
  const ligands: string[] = [];
  for (const [elem, count] of Object.entries(elementCounts)) {
    const isCentral = elem === central;
    const ligCount = isCentral ? count - 1 : count;
    for (let i = 0; i < ligCount; i++) {
      ligands.push(elem);
    }
  }

  // Pre-calculated ideal direction vectors for different steric geometries
  let directions: { x: number; y: number; z: number }[] = [];

  switch (geometry.stericNumber) {
    case 2: // Linear
      directions = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
      ];
      break;
    case 3: // Trigonal planar (or bent)
      directions = [
        { x: 0, y: 1, z: 0 },
        { x: Math.cos(Math.PI / 6), y: -Math.sin(Math.PI / 6), z: 0 },
        { x: -Math.cos(Math.PI / 6), y: -Math.sin(Math.PI / 6), z: 0 },
      ];
      break;
    case 4: // Tetrahedral (or bent, pyramidal)
      if (geometry.lonePairs === 2) {
        // Bent (like H2O) with realistic 104.5° angle
        const halfAngle = (104.5 * Math.PI) / 360;
        directions = [
          { x: Math.sin(halfAngle), y: -Math.cos(halfAngle), z: 0 },
          { x: -Math.sin(halfAngle), y: -Math.cos(halfAngle), z: 0 },
        ];
      } else if (geometry.lonePairs === 1) {
        // Trigonal Pyramidal (like NH3) 107.8°
        const h = 0.38;
        const r = Math.sqrt(1 - h * h);
        directions = [
          { x: r, y: -h, z: 0 },
          { x: -r * 0.5, y: -h, z: r * (Math.sqrt(3) / 2) },
          { x: -r * 0.5, y: -h, z: -r * (Math.sqrt(3) / 2) },
        ];
      } else {
        // Perfect Tetrahedral 109.47°
        const a = 1 / Math.sqrt(3);
        directions = [
          { x: a, y: a, z: a },
          { x: -a, y: -a, z: a },
          { x: -a, y: a, z: -a },
          { x: a, y: -a, z: -a },
        ];
      }
      break;
    case 5: // Trigonal bipyramidal (3 equatorial at 120°, 2 axial at 90°)
      directions = [
        { x: 0, y: 1, z: 0 }, // axial top
        { x: 0, y: -1, z: 0 }, // axial bottom
        { x: 1, y: 0, z: 0 }, // equatorial 1
        { x: -0.5, y: 0, z: Math.sqrt(3) / 2 }, // equatorial 2
        { x: -0.5, y: 0, z: -Math.sqrt(3) / 2 }, // equatorial 3
      ];
      break;
    case 6: // Octahedral
      directions = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 },
      ];
      break;
    default:
      directions = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
      ];
  }

  for (let i = 0; i < ligands.length && i < directions.length; i++) {
    const ligElem = ligands[i];
    const ligData = getElement(ligElem);
    // Typical covalent bond distance in Angstroms
    const bondDist = Math.max(0.96, centralElem.covalentRadius + ligData.covalentRadius);
    const dir = directions[i];

    const atomIndex = atoms.length;
    atoms.push({
      id: atomIndex,
      element: ligElem,
      x: dir.x * bondDist,
      y: dir.y * bondDist,
      z: dir.z * bondDist,
    });

    bonds.push({
      id: `bond-0-${atomIndex}`,
      sourceIndex: 0,
      targetIndex: atomIndex,
      order: 1,
      length: bondDist,
    });
  }

  return { atoms, bonds };
}
