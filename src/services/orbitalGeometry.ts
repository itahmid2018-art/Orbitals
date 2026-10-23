import * as THREE from 'three';
import { OrbitalColorScheme } from '../types/chemistry';

export interface QuantumDescriptor {
  n: number; // Principal quantum number (shell energy tier)
  l: number; // Azimuthal quantum number (0 = s, 1 = p, 2 = d)
  m: number; // Magnetic quantum number (-l to +l)
  subshellLabel: string; // e.g. "2p_z", "sp³", "2s", "lone_pair", "pi"
}

/**
 * Returns color hex for Quantum Number (n, l, m) and energy level visualization.
 */
export function getQuantumEnergyColor(
  descriptor: QuantumDescriptor,
  isNegativePhase = false
): number {
  const { l, m, subshellLabel } = descriptor;

  if (subshellLabel.startsWith('lone_pair')) return 0xea580c; // Non-bonding electron density (high energy)
  if (subshellLabel.startsWith('pi')) return 0xc026d3; // Delocalized pi molecular orbital (HOMO/LUMO)
  if (subshellLabel.startsWith('sp3d2')) return 0xe11d48; // sp³d² expanded octet
  if (subshellLabel.startsWith('sp3d')) return 0x9333ea; // sp³d expanded octet
  if (subshellLabel.startsWith('sp3')) return 0x4f46e5; // sp³ hybrid (25% s, higher hybrid energy)
  if (subshellLabel.startsWith('sp2')) return 0x0284c7; // sp² hybrid (33% s)
  if (subshellLabel.startsWith('sp')) return 0x06b6d4; // sp hybrid (50% s, lower hybrid energy)

  if (l === 0) return 0x10b981; // s subshell (l = 0, lowest energy)
  if (l === 1) {
    // p subshell (l = 1): differentiated by magnetic quantum number m
    if (m === 0) return isNegativePhase ? 0x1d4ed8 : 0x2563eb; // p_z (m = 0)
    if (m === 1) return isNegativePhase ? 0x6d28d9 : 0x7c3aed; // p_x (m = +1)
    return isNegativePhase ? 0xb45309 : 0xf59e0b; // p_y (m = -1)
  }
  if (l === 2) return isNegativePhase ? 0xbe123c : 0xe11d48; // d subshell (l = 2)

  return 0x3b82f6;
}

/**
 * Creates a 3D hybrid orbital lobe (e.g. sp, sp2, sp3) pointing in direction 'dir'.
 * Generates a smooth teardrop mesh with primary positive lobe and small negative counter-lobe.
 */
export function createHybridOrbitalMesh(
  center: THREE.Vector3,
  direction: THREE.Vector3,
  scale = 1.0,
  isLonePair = false,
  colorScheme: OrbitalColorScheme = 'phase',
  hybridType = 'sp3'
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(center);

  const dir = direction.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir);

  // Determine colors based on active color scheme
  let primaryColor: number;
  let counterColor: number;

  if (colorScheme === 'quantum_numbers') {
    const qDesc: QuantumDescriptor = {
      n: 2,
      l: isLonePair ? 1 : 1,
      m: 0,
      subshellLabel: isLonePair ? 'lone_pair' : hybridType,
    };
    primaryColor = getQuantumEnergyColor(qDesc, false);
    counterColor = getQuantumEnergyColor(qDesc, true);
  } else {
    // Classic Wavefunction Phase (+ / -)
    primaryColor = isLonePair ? 0xf59e0b : 0x0ea5e9; // Amber for lone pair, Cyan for positive phase
    counterColor = 0xf43f5e; // Coral/Rose for negative phase (-)
  }

  // Generate primary positive lobe mesh
  const primaryGeom = createTeardropGeometry(scale * (isLonePair ? 1.25 : 1.1), 0.55 * scale);
  const primaryMat = new THREE.MeshPhysicalMaterial({
    color: primaryColor,
    transparent: true,
    opacity: isLonePair ? 0.65 : 0.55,
    roughness: 0.2,
    transmission: 0.3,
    ior: 1.2,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const primaryMesh = new THREE.Mesh(primaryGeom, primaryMat);
  primaryMesh.quaternion.copy(quaternion);
  group.add(primaryMesh);

  // Small counter-lobe with opposite phase (-) if not pure lone pair
  if (!isLonePair) {
    const counterGeom = createTeardropGeometry(scale * 0.45, 0.25 * scale);
    const counterMat = new THREE.MeshPhysicalMaterial({
      color: counterColor,
      transparent: true,
      opacity: 0.5,
      roughness: 0.2,
      transmission: 0.3,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const counterMesh = new THREE.Mesh(counterGeom, counterMat);
    const oppQuat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().negate());
    counterMesh.quaternion.copy(oppQuat);
    group.add(counterMesh);
  }

  return group;
}

/**
 * Creates atomic p orbital (dumbbell along axis with + and - phase lobes)
 */
export function createPOrbitalMesh(
  center: THREE.Vector3,
  axis: 'x' | 'y' | 'z',
  scale = 1.0,
  colorScheme: OrbitalColorScheme = 'phase'
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(center);

  const dir = new THREE.Vector3(
    axis === 'x' ? 1 : 0,
    axis === 'y' ? 1 : 0,
    axis === 'z' ? 1 : 0
  );

  const up = new THREE.Vector3(0, 1, 0);
  const qPos = new THREE.Quaternion().setFromUnitVectors(up, dir);
  const qNeg = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().negate());

  const lobeGeom = createTeardropGeometry(scale * 1.1, 0.48 * scale);

  let posColor: number;
  let negColor: number;

  if (colorScheme === 'quantum_numbers') {
    const mVal = axis === 'z' ? 0 : axis === 'x' ? 1 : -1;
    const qDesc: QuantumDescriptor = {
      n: 2,
      l: 1,
      m: mVal,
      subshellLabel: `2p_${axis}`,
    };
    posColor = getQuantumEnergyColor(qDesc, false);
    negColor = getQuantumEnergyColor(qDesc, true);
  } else {
    posColor = 0x0ea5e9; // Positive phase (+)
    negColor = 0xf43f5e; // Negative phase (-)
  }

  const posMesh = new THREE.Mesh(
    lobeGeom,
    new THREE.MeshPhysicalMaterial({
      color: posColor,
      transparent: true,
      opacity: 0.55,
      roughness: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  posMesh.quaternion.copy(qPos);
  group.add(posMesh);

  const negMesh = new THREE.Mesh(
    lobeGeom.clone(),
    new THREE.MeshPhysicalMaterial({
      color: negColor,
      transparent: true,
      opacity: 0.55,
      roughness: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  negMesh.quaternion.copy(qNeg);
  group.add(negMesh);

  return group;
}

/**
 * Creates a d_z2 orbital (two axial lobes + toroidal donut in xy plane)
 */
export function createDz2OrbitalMesh(
  center: THREE.Vector3,
  scale = 1.0,
  colorScheme: OrbitalColorScheme = 'phase'
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(center);

  // Two axial lobes along Z
  const pMesh = createPOrbitalMesh(new THREE.Vector3(0, 0, 0), 'z', scale * 1.1, colorScheme);
  group.add(pMesh);

  let torusColor: number;
  if (colorScheme === 'quantum_numbers') {
    torusColor = getQuantumEnergyColor({ n: 3, l: 2, m: 0, subshellLabel: '3dz2' }, true);
  } else {
    torusColor = 0xf43f5e; // Negative phase torus ring
  }

  // Torus ring in XY plane
  const torusGeom = new THREE.TorusGeometry(scale * 0.6, scale * 0.18, 16, 48);
  const torusMat = new THREE.MeshPhysicalMaterial({
    color: torusColor,
    transparent: true,
    opacity: 0.55,
    roughness: 0.2,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const torusMesh = new THREE.Mesh(torusGeom, torusMat);
  group.add(torusMesh);

  return group;
}

/**
 * Creates delocalized pi electron clouds above and below a planar ring or double bond
 */
export function createDelocalizedPiClouds(
  center: THREE.Vector3,
  radius: number,
  thickness: number,
  colorScheme: OrbitalColorScheme = 'phase'
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(center);

  const cloudColor = colorScheme === 'quantum_numbers' ? 0xc026d3 : 0x8b5cf6;

  const torusGeom = new THREE.TorusGeometry(radius, thickness, 20, 48);
  const cloudMat = new THREE.MeshPhysicalMaterial({
    color: cloudColor, // Purple or Electric Magenta
    transparent: true,
    opacity: 0.45,
    roughness: 0.15,
    transmission: 0.2,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  // Cloud above ring (+z)
  const topCloud = new THREE.Mesh(torusGeom, cloudMat);
  topCloud.position.set(0, 0, 0.7);
  group.add(topCloud);

  // Cloud below ring (-z)
  const bottomCloud = new THREE.Mesh(torusGeom.clone(), cloudMat);
  bottomCloud.position.set(0, 0, -0.7);
  group.add(bottomCloud);

  return group;
}

/**
 * Parametric mathematical teardrop geometry representing orbital wave-function probability lobe
 */
function createTeardropGeometry(length: number, maxRadius: number, radialSegs = 24, heightSegs = 32): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];

  for (let i = 0; i <= heightSegs; i++) {
    const v = i / heightSegs;
    const y = v * length;
    // Profile function: r(v) = 4 * maxRadius * v * (1 - v)^1.2
    const radius = 3.2 * maxRadius * Math.pow(v, 0.9) * Math.pow(1 - v, 1.1);

    for (let j = 0; j <= radialSegs; j++) {
      const u = j / radialSegs;
      const angle = u * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      vertices.push(x, y, z);
      uvs.push(u, v);
    }
  }

  const stride = radialSegs + 1;
  for (let i = 0; i < heightSegs; i++) {
    for (let j = 0; j < radialSegs; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return geom;
}

/**
 * Standardized Canonical VSEPR Reference Frame
 */
export interface StandardizedOrbitalFrame {
  name: string;
  idealAngleDeg: number;
  hybridization: string;
  axes: THREE.Vector3[];
  axisLabels?: string[];
}

/**
 * Generates mathematically ideal, standardized spatial axes for a given VSEPR geometry or hybridization.
 * Enables pristine comparative geometric analysis across different molecular systems.
 */
export function getStandardizedVSEPRAxes(
  geometryName = 'Tetrahedral',
  hybridization = 'sp3'
): StandardizedOrbitalFrame {
  const norm = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).normalize();
  const h = (hybridization || 'sp3').toLowerCase();
  const g = (geometryName || 'Tetrahedral').toLowerCase();

  // 1. Linear (sp) - 180° along canonical Z axis
  if (h === 'sp' || g.includes('linear')) {
    return {
      name: 'Linear (D_inf_h)',
      idealAngleDeg: 180.0,
      hybridization: 'sp',
      axes: [norm(0, 0, 1), norm(0, 0, -1)],
      axisLabels: ['+Z Axis (180°)', '−Z Axis (180°)'],
    };
  }

  // 2. Trigonal Planar (sp2) - 120° in canonical XY plane
  if (h === 'sp2' || g.includes('trigonal planar') || (g.includes('bent') && h.includes('sp2'))) {
    const cos30 = Math.sqrt(3) / 2;
    return {
      name: 'Trigonal Planar (D_3h)',
      idealAngleDeg: 120.0,
      hybridization: 'sp2',
      axes: [
        norm(0, 1, 0),
        norm(-cos30, -0.5, 0),
        norm(cos30, -0.5, 0),
      ],
      axisLabels: ['Vertex A (120°)', 'Vertex B (120°)', 'Vertex C (120°)'],
    };
  }

  // 3. Trigonal Bipyramidal (sp3d) - 90° axial & 120° equatorial
  if (h === 'sp3d' || g.includes('bipyramidal') || g.includes('see-saw') || g.includes('t-shaped')) {
    const cos30 = Math.sqrt(3) / 2;
    return {
      name: 'Trigonal Bipyramidal (D_3h)',
      idealAngleDeg: 90.0,
      hybridization: 'sp3d',
      axes: [
        norm(0, 0, 1), // Axial Top
        norm(0, 0, -1), // Axial Bottom
        norm(0, 1, 0), // Equatorial 1
        norm(-cos30, -0.5, 0), // Equatorial 2
        norm(cos30, -0.5, 0), // Equatorial 3
      ],
      axisLabels: ['Axial +Z (90°)', 'Axial −Z (90°)', 'Equatorial 1 (120°)', 'Equatorial 2 (120°)', 'Equatorial 3 (120°)'],
    };
  }

  // 4. Octahedral (sp3d2) - 90° Cartesian orthogonal axes (±X, ±Y, ±Z)
  if (h === 'sp3d2' || g.includes('octahedral') || g.includes('square')) {
    return {
      name: 'Octahedral (O_h)',
      idealAngleDeg: 90.0,
      hybridization: 'sp3d2',
      axes: [
        norm(1, 0, 0),
        norm(-1, 0, 0),
        norm(0, 1, 0),
        norm(0, -1, 0),
        norm(0, 0, 1),
        norm(0, 0, -1),
      ],
      axisLabels: ['+X (90°)', '−X (90°)', '+Y (90°)', '−Y (90°)', '+Z (90°)', '−Z (90°)'],
    };
  }

  // 5. Default: Tetrahedral (sp3) - Exact 109.4712° canonical tetrahedron
  const invSqrt3 = 1 / Math.sqrt(3);
  return {
    name: 'Tetrahedral (T_d)',
    idealAngleDeg: 109.47,
    hybridization: 'sp3',
    axes: [
      new THREE.Vector3(invSqrt3, invSqrt3, invSqrt3),
      new THREE.Vector3(invSqrt3, -invSqrt3, -invSqrt3),
      new THREE.Vector3(-invSqrt3, invSqrt3, -invSqrt3),
      new THREE.Vector3(-invSqrt3, -invSqrt3, invSqrt3),
    ],
    axisLabels: ['Tetrahedral Vertex 1 (109.5°)', 'Tetrahedral Vertex 2 (109.5°)', 'Tetrahedral Vertex 3 (109.5°)', 'Tetrahedral Vertex 4 (109.5°)'],
  };
}

/**
 * Snaps a directional vector to the closest standardized mathematical symmetry axis.
 */
export function snapVectorToStandardizedAxes(
  inputVector: THREE.Vector3,
  standardAxes: THREE.Vector3[]
): THREE.Vector3 {
  if (!standardAxes || standardAxes.length === 0) return inputVector.clone().normalize();
  const normInput = inputVector.clone().normalize();
  let bestAxis = standardAxes[0];
  let maxDot = -Infinity;

  for (const axis of standardAxes) {
    const dot = normInput.dot(axis);
    if (dot > maxDot) {
      maxDot = dot;
      bestAxis = axis;
    }
  }

  return bestAxis.clone();
}

/**
 * Creates 3D visualizer guide rays and target markers along standardized mathematical axes.
 * Provides real-time comparative reference lines in the 3D viewport.
 */
export function createStandardizedAxesVisualizer(
  center: THREE.Vector3,
  frame: StandardizedOrbitalFrame,
  radius = 2.4
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(center);

  frame.axes.forEach((axis) => {
    // 1. Dashed glowing symmetry ray
    const targetTip = axis.clone().multiplyScalar(radius);
    const points = [new THREE.Vector3(0, 0, 0), targetTip];
    const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8, // Electric Sky Blue
      dashSize: 0.12,
      gapSize: 0.08,
      transparent: true,
      opacity: 0.8,
    });
    const line = new THREE.Line(lineGeom, lineMat);
    line.computeLineDistances();
    group.add(line);

    // 2. Vertex target marker dot
    const dotGeom = new THREE.SphereGeometry(0.065, 12, 12);
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95,
    });
    const dot = new THREE.Mesh(dotGeom, dotMat);
    dot.position.copy(targetTip);
    group.add(dot);

    // 3. Faint outer target ring
    const ringGeom = new THREE.RingGeometry(0.09, 0.12, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.copy(targetTip);
    const up = new THREE.Vector3(0, 0, 1);
    ring.quaternion.setFromUnitVectors(up, axis);
    group.add(ring);
  });

  return group;
}
