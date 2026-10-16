import * as THREE from 'three';
import { Atom3D, Bond3D } from '../types/chemistry';
import { getElement } from './elementData';

/**
 * Computes partial charges (q_i) for each atom in the molecule
 * based on Pauling electronegativity differences with bonded neighbors.
 */
export function computePartialCharges(atoms: Atom3D[], bonds: Bond3D[]): number[] {
  const charges = atoms.map((a) => a.partialCharge ?? 0);

  // If explicit partial charges already exist on atoms, verify they are non-trivial
  const hasExistingCharges = charges.some((q) => Math.abs(q) > 0.05);
  if (hasExistingCharges) {
    return charges;
  }

  // Calculate using electronegativity differences
  const computed = new Array(atoms.length).fill(0);

  // Fallback: If no bonds provided, deduce neighbor proximity by distance
  const effectiveBonds = [...bonds];
  if (effectiveBonds.length === 0 && atoms.length > 1) {
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const dist = Math.hypot(
          atoms[i].x - atoms[j].x,
          atoms[i].y - atoms[j].y,
          atoms[i].z - atoms[j].z
        );
        const r1 = getElement(atoms[i].element).covalentRadius;
        const r2 = getElement(atoms[j].element).covalentRadius;
        if (dist <= (r1 + r2) * 1.3) {
          effectiveBonds.push({ id: `b-${i}-${j}`, sourceIndex: i, targetIndex: j, order: 1 });
        }
      }
    }
  }

  effectiveBonds.forEach((bond) => {
    const a1 = atoms[bond.sourceIndex];
    const a2 = atoms[bond.targetIndex];
    if (!a1 || !a2) return;

    const en1 = getElement(a1.element).electronegativity || 2.2;
    const en2 = getElement(a2.element).electronegativity || 2.2;

    const diff = en2 - en1;
    // Fractional charge transfer proportional to electronegativity difference and bond order
    const chargeTransfer = (diff / 5.2) * Math.min(2.0, Math.max(1.0, bond.order));

    computed[bond.sourceIndex] += chargeTransfer;
    computed[bond.targetIndex] -= chargeTransfer;
  });

  return computed;
}

/**
 * Calculates the electrostatic potential V(r) at a 3D coordinate r
 * V(r) = sum_i [ q_i / max(0.5, ||r - r_i||) ]
 */
export function calculateEspAtPoint(
  point: THREE.Vector3,
  atoms: Atom3D[],
  partialCharges: number[]
): number {
  let potential = 0;
  for (let i = 0; i < atoms.length; i++) {
    const a = atoms[i];
    const q = partialCharges[i] || 0;
    const dist = Math.max(0.45, point.distanceTo(new THREE.Vector3(a.x, a.y, a.z)));
    potential += q / dist;
  }
  return potential;
}

/**
 * Converts a calculated electrostatic potential into a scientific ESP color
 * Red = High electron density / Negative potential (δ-)
 * Yellow / Green = Neutral (0)
 * Cyan / Deep Blue = Low electron density / Positive potential (δ+)
 */
export function getEspColor(potential: number, scale = 0.45): THREE.Color {
  // Normalize into [-1, 1] range
  const t = Math.max(-1, Math.min(1, potential / scale));

  const color = new THREE.Color();

  if (t < 0) {
    // Negative potential / High electron density: interpolate Red (t=-1) to Yellow/Green (t=0)
    // Red: (1.0, 0.12, 0.12) -> Yellow: (1.0, 0.85, 0.1) -> Green: (0.2, 0.8, 0.3)
    const factor = Math.abs(t); // 0 at neutral, 1 at most negative
    const r = 0.95 + 0.05 * factor;
    const g = 0.85 * (1 - factor * 0.82);
    const b = 0.15 * (1 - factor);
    color.setRGB(r, g, b);
  } else {
    // Positive potential / Low electron density: interpolate Green/Cyan (t=0) to Deep Blue (t=+1)
    // Yellow/Green: (0.8, 0.9, 0.2) -> Cyan: (0.1, 0.75, 0.9) -> Blue: (0.15, 0.35, 0.95)
    const factor = t; // 0 at neutral, 1 at most positive
    const r = 0.85 * (1 - factor);
    const g = 0.85 * (1 - factor * 0.55);
    const b = 0.2 + 0.78 * factor;
    color.setRGB(r, g, b);
  }

  return color;
}

/**
 * Generates an Electrostatic Potential Map (ESP) molecular surface mesh
 * enveloping the atoms, where each surface vertex is colored by its local electron density potential.
 */
export function createEspMolecularSurface(
  atoms: Atom3D[],
  bonds: Bond3D[],
  centerOffset: THREE.Vector3
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'esp-molecular-surface';

  const partialCharges = computePartialCharges(atoms, bonds);

  // Determine dynamic scale so colors are distinct for both weak and strong dipoles
  const maxCharge = Math.max(...partialCharges.map((q) => Math.abs(q)), 0.08);
  const espScale = Math.max(0.18, Math.min(0.85, maxCharge * 0.85));

  atoms.forEach((atom) => {
    const elem = getElement(atom.element);
    // Envelope shell slightly outside covalent radius (~0.8x vdW radius)
    const radius = Math.max(0.72, elem.vdwRadius * 0.8);
    const geom = new THREE.SphereGeometry(radius, 32, 32);

    const posAttr = geom.attributes.position;
    const colors: number[] = [];

    const atomWorldPos = new THREE.Vector3(atom.x, atom.y, atom.z);
    const atomShiftedPos = atomWorldPos.clone().sub(centerOffset);

    // Calculate ESP for each vertex on this atom's envelope
    for (let v = 0; v < posAttr.count; v++) {
      const vx = posAttr.getX(v);
      const vy = posAttr.getY(v);
      const vz = posAttr.getZ(v);

      // Vertex in unshifted world coordinate
      const vertexWorld = new THREE.Vector3(vx, vy, vz).add(atomWorldPos);
      const pot = calculateEspAtPoint(vertexWorld, atoms, partialCharges);

      const c = getEspColor(pot, espScale);
      colors.push(c.r, c.g, c.b);
    }

    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Studio PBR translucent dielectric material with vertex coloring
    const mat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.26,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      transmission: 0.25,
      transparent: true,
      opacity: 0.84,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(atomShiftedPos);
    group.add(mesh);
  });

  return group;
}
