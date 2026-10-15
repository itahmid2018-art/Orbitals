import * as THREE from 'three';

/**
 * Creates a 3D hybrid orbital lobe (e.g. sp, sp2, sp3) pointing in direction 'dir'.
 * Generates a smooth teardrop mesh with primary positive lobe and small negative counter-lobe.
 */
export function createHybridOrbitalMesh(
  center: THREE.Vector3,
  direction: THREE.Vector3,
  scale = 1.0,
  isLonePair = false
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(center);

  const dir = direction.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir);

  // Generate primary positive lobe mesh
  const primaryGeom = createTeardropGeometry(scale * (isLonePair ? 1.25 : 1.1), 0.55 * scale);
  const primaryMat = new THREE.MeshPhysicalMaterial({
    color: isLonePair ? 0xf59e0b : 0x0ea5e9, // Amber for lone pair, Cyan/Sky Blue for bonding hybrid
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
      color: 0xf43f5e, // Coral/Rose for negative phase (-)
      transparent: true,
      opacity: 0.5,
      roughness: 0.2,
      transmission: 0.3,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const counterMesh = new THREE.Mesh(counterGeom, counterMat);
    // Point in opposite direction
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
  scale = 1.0
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

  const posMesh = new THREE.Mesh(
    lobeGeom,
    new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9, // Positive phase (+)
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
      color: 0xf43f5e, // Negative phase (-)
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
export function createDz2OrbitalMesh(center: THREE.Vector3, scale = 1.0): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(center);

  // Two axial lobes along Z
  const pMesh = createPOrbitalMesh(new THREE.Vector3(0, 0, 0), 'z', scale * 1.1);
  group.add(pMesh);

  // Torus ring in XY plane
  const torusGeom = new THREE.TorusGeometry(scale * 0.6, scale * 0.18, 16, 48);
  const torusMat = new THREE.MeshPhysicalMaterial({
    color: 0xf43f5e, // Negative phase torus ring
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
  thickness: number
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(center);

  const torusGeom = new THREE.TorusGeometry(radius, thickness, 20, 48);
  const cloudMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6, // Purple / Indigo for conjugated pi cloud
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
