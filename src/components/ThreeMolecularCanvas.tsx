import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Atom3D,
  Bond3D,
  RenderStyle,
  OrbitalVisualizationMode,
  VibrationalMode,
  MeasurementSelection,
  MolecularGeometry,
} from '../types/chemistry';
import { getElement } from '../services/elementData';
import {
  createHybridOrbitalMesh,
  createPOrbitalMesh,
  createDz2OrbitalMesh,
  createDelocalizedPiClouds,
} from '../services/orbitalGeometry';
import { createEspMolecularSurface } from '../services/espCalculator';
import {
  RotateCcw,
  Sun,
  Moon,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Camera,
  Ruler,
  Layers,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Eye,
  Sliders,
  Focus,
} from 'lucide-react';

interface Props {
  atoms: Atom3D[];
  bonds: Bond3D[];
  vsepr?: MolecularGeometry;
  activeVibrationalMode?: VibrationalMode | null;
  temperatureK: number;
  renderStyle: RenderStyle;
  onChangeRenderStyle: (style: RenderStyle) => void;
  orbitalMode: OrbitalVisualizationMode;
  onChangeOrbitalMode: (mode: OrbitalVisualizationMode) => void;
  orbitalScale: number;
  onChangeOrbitalScale: (scale: number) => void;
  orbitalOpacity: number;
  onChangeOrbitalOpacity: (opacity: number) => void;
  showDipole: boolean;
  onToggleDipole: (show: boolean) => void;
  dipoleDebye: number;
  measurement: MeasurementSelection;
  onSelectAtom: (atomIndex: number) => void;
  onClearMeasurement: () => void;
  onAddCurrentAsReactant?: () => void;
}

// Helper to generate 2D planar circular atom tokens with high-contrast chemical symbols
function createElementTextSprite(symbol: string, color: string, isSelected: boolean): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    // Outer circle with CPK color & white rim
    ctx.beginPath();
    ctx.arc(64, 64, 52, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? '#0284c7' : color;
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // High-contrast symbol text
    const isLightBg = color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#ffff30' || color.toLowerCase() === '#fff';
    ctx.fillStyle = isLightBg ? '#0f172a' : '#ffffff';
    ctx.font = 'bold 50px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.85, 0.85, 1);
  return sprite;
}

export const ThreeMolecularCanvas: React.FC<Props> = ({
  atoms,
  bonds,
  vsepr,
  activeVibrationalMode,
  temperatureK,
  renderStyle,
  onChangeRenderStyle,
  orbitalMode,
  onChangeOrbitalMode,
  orbitalScale,
  onChangeOrbitalScale,
  orbitalOpacity,
  onChangeOrbitalOpacity,
  showDipole,
  onToggleDipole,
  dipoleDebye,
  measurement,
  onSelectAtom,
  onClearMeasurement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport states
  const [isDarkBg, setIsDarkBg] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isVibrating, setIsVibrating] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isXRayMode, setIsXRayMode] = useState(false);
  const [isIsolationMode, setIsIsolationMode] = useState(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [hoveredAtom, setHoveredAtom] = useState<Atom3D | null>(null);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const moleculeGroupRef = useRef<THREE.Group | null>(null);
  const orbitalsGroupRef = useRef<THREE.Group | null>(null);
  const dynamicsGroupRef = useRef<THREE.Group | null>(null);
  const measurementGroupRef = useRef<THREE.Group | null>(null);
  const contactShadowRef = useRef<THREE.Mesh | null>(null);

  // Mesh reference maps for animation & isolation
  const atomMeshesRef = useRef<{ mesh: THREE.Mesh; initialPos: THREE.Vector3; id: number }[]>([]);
  const bondMeshesRef = useRef<{
    mesh: THREE.Mesh | THREE.Group;
    sourceIdx: number;
    targetIdx: number;
    order: number;
  }[]>([]);

  // Orbit controls state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraDistanceRef = useRef(12);
  const cameraSphericalRef = useRef({ radius: 12, theta: Math.PI / 4, phi: Math.PI / 3 });
  const animFrameIdRef = useRef<number | null>(null);
  const clockRef = useRef(new THREE.Clock());

  // Update camera position from spherical coordinates
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraSphericalRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 0, 0);
  }, []);

  // Initialize Three.js Scene with Studio PBR & Environment Reflections
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 550;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkBg ? 0x0b1120 : 0xf8fafc);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Studio Environment Reflections via RoomEnvironment & PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Studio 3-Point Lighting Rig
    // 1. Warm Directional Key Light
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    keyLight.position.set(12, 18, 14);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // 2. Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x0f172a, 0.7);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // 3. Rim/Backlight for silhouette definition
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.85);
    rimLight.position.set(-14, -8, -12);
    scene.add(rimLight);

    // Soft procedural contact shadow grounding plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const grad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = grad;
    shadowCtx.fillRect(0, 0, 128, 128);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const shadowPlaneGeom = new THREE.PlaneGeometry(12, 12);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: isDarkBg ? 0.6 : 0.25,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowPlaneGeom, shadowPlaneMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.8;
    scene.add(shadowMesh);
    contactShadowRef.current = shadowMesh;

    // Molecular root groups
    const molGroup = new THREE.Group();
    scene.add(molGroup);
    moleculeGroupRef.current = molGroup;

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);
    orbitalsGroupRef.current = orbGroup;

    const dynGroup = new THREE.Group();
    scene.add(dynGroup);
    dynamicsGroupRef.current = dynGroup;

    const measGroup = new THREE.Group();
    scene.add(measGroup);
    measurementGroupRef.current = measGroup;

    // Pre-warm shader programs
    renderer.compile(scene, camera);

    // Resize observer
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight || 550;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      envTexture.dispose();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isDarkBg, updateCameraPosition]);

  // Update Scene Background color and contact shadow opacity
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(isDarkBg ? 0x0b1120 : 0xf8fafc);
    }
    if (contactShadowRef.current) {
      (contactShadowRef.current.material as THREE.MeshBasicMaterial).opacity = isDarkBg ? 0.6 : 0.25;
    }
  }, [isDarkBg]);

  // Build Molecular Structure Meshes with Studio PBR Materials & Zero-Occlusion Isolation
  useEffect(() => {
    if (!moleculeGroupRef.current || !orbitalsGroupRef.current || !dynamicsGroupRef.current) return;

    const molGroup = moleculeGroupRef.current;
    const orbGroup = orbitalsGroupRef.current;
    const dynGroup = dynamicsGroupRef.current;

    // Clear previous children
    while (molGroup.children.length > 0) molGroup.remove(molGroup.children[0]);
    while (orbGroup.children.length > 0) orbGroup.remove(orbGroup.children[0]);
    while (dynGroup.children.length > 0) dynGroup.remove(dynGroup.children[0]);

    atomMeshesRef.current = [];
    bondMeshesRef.current = [];

    if (atoms.length === 0) return;

    // Calculate center of mass to center the molecule at origin
    let cx = 0, cy = 0, cz = 0;
    for (const a of atoms) {
      cx += a.x;
      cy += a.y;
      cz += a.z;
    }
    cx /= atoms.length;
    cy /= atoms.length;
    cz /= atoms.length;

    // Determine isolated atom index (if in isolation mode and user clicked an atom)
    const activeSelectedAtom = measurement.atoms.length > 0 ? measurement.atoms[0] : null;

    // Check if 2D Planar ChemView Mode is active
    const is2D = renderStyle === '2d_projected';

    // Compute best-fit 2D planar projection along the thinnest variance axis for all atoms
    let varX = 0, varY = 0, varZ = 0;
    atoms.forEach((a) => {
      const dx = a.x - cx;
      const dy = a.y - cy;
      const dz = a.z - cz;
      varX += dx * dx;
      varY += dy * dy;
      varZ += dz * dz;
    });

    const smallestAxis = varZ <= varX && varZ <= varY ? 'z' : varX <= varY ? 'x' : 'y';
    const pos2DMap = new Map<number, THREE.Vector3>();
    atoms.forEach((atom, idx) => {
      let px = atom.x - cx;
      let py = atom.y - cy;
      if (smallestAxis === 'x') {
        px = atom.y - cy;
        py = atom.z - cz;
      } else if (smallestAxis === 'y') {
        px = atom.x - cx;
        py = atom.z - cz;
      }
      pos2DMap.set(idx, new THREE.Vector3(px, py, 0));
    });

    // 1. Create Atom Meshes with Studio PBR Physical Shading
    atoms.forEach((atom, idx) => {
      const elem = getElement(atom.element);
      const pos = is2D
        ? (pos2DMap.get(idx) || new THREE.Vector3(atom.x - cx, atom.y - cy, 0))
        : new THREE.Vector3(atom.x - cx, atom.y - cy, atom.z - cz);

      let radius = 0.45;
      if (renderStyle === 'space_filling') {
        radius = elem.vdwRadius * 0.72;
      } else if (renderStyle === 'esp_surface') {
        radius = 0.25; // Compact core sphere inside the translucent ESP electron density envelope
      } else if (renderStyle === 'wireframe') {
        radius = 0.18;
      } else if (renderStyle === 'stick') {
        radius = 0.22;
      } else if (is2D) {
        radius = 0.42; // Flat planar circular token
      } else {
        radius = Math.max(0.3, elem.covalentRadius * 0.65);
      }

      const isSelected = measurement.atoms.includes(idx);
      const isCentral = idx === 0;

      // Zero-Occlusion Isolation Mode check:
      // If isolation mode active, keep selected atom and its directly bonded neighbors visible, dim peripheral atoms
      const isDirectNeighbor =
        activeSelectedAtom !== null &&
        bonds.some(
          (b) =>
            (b.sourceIndex === activeSelectedAtom && b.targetIndex === idx) ||
            (b.targetIndex === activeSelectedAtom && b.sourceIndex === idx)
        );
      const isIsolatedVisible = !isIsolationMode || activeSelectedAtom === null || idx === activeSelectedAtom || isDirectNeighbor;

      const geom = new THREE.SphereGeometry(radius, 36, 36);

      // Studio PBR Physical Material with real clearcoat & roughness
      const mat = new THREE.MeshPhysicalMaterial({
        color: isSelected ? 0x38bdf8 : new THREE.Color(elem.cpkColor),
        roughness: elem.symbol === 'C' ? 0.35 : 0.22,
        metalness: elem.period >= 3 && elem.group <= 12 ? 0.5 : 0.08,
        clearcoat: 0.65,
        clearcoatRoughness: 0.15,
        emissive: isSelected ? 0x0284c7 : 0x000000,
        emissiveIntensity: isSelected ? 0.45 : 0,
        wireframe: renderStyle === 'wireframe',
        transparent: isXRayMode || !isIsolatedVisible,
        opacity: !isIsolatedVisible ? 0.12 : isXRayMode ? 0.35 : 1.0,
        depthWrite: !isXRayMode && isIsolatedVisible,
      });

      const sphere = new THREE.Mesh(geom, mat);
      sphere.position.copy(pos);
      sphere.userData = { atomIndex: idx, atom, elementData: elem };
      molGroup.add(sphere);

      // In 2D Planar ChemView mode, render an atomic symbol sprite badge
      if (is2D && isIsolatedVisible) {
        const sprite = createElementTextSprite(elem.symbol, elem.cpkColor, isSelected);
        sprite.position.set(pos.x, pos.y, 0.08);
        molGroup.add(sprite);
      }

      atomMeshesRef.current.push({
        mesh: sphere,
        initialPos: pos.clone(),
        id: idx,
      });

      // Partial charge visualization halo if polar
      if (atom.partialCharge && Math.abs(atom.partialCharge) > 0.15 && isIsolatedVisible) {
        const haloGeom = new THREE.SphereGeometry(radius * 1.35, 16, 16);
        const haloMat = new THREE.MeshBasicMaterial({
          color: atom.partialCharge > 0 ? 0x0ea5e9 : 0xef4444,
          transparent: true,
          opacity: 0.2,
          wireframe: true,
        });
        const halo = new THREE.Mesh(haloGeom, haloMat);
        halo.position.copy(pos);
        dynGroup.add(halo);
      }

      // Orbital representations for central / key atoms
      if (orbitalMode !== 'none' && (isCentral || atoms.length <= 6) && isIsolatedVisible) {
        if (orbitalMode === 'hybrid' || orbitalMode === 'all') {
          const neighbors = bonds
            .filter((b) => b.sourceIndex === idx || b.targetIndex === idx)
            .map((b) => (b.sourceIndex === idx ? b.targetIndex : b.sourceIndex));

          if (neighbors.length > 0) {
            neighbors.forEach((nIdx) => {
              const neighborAtom = atoms[nIdx];
              const bondDir = new THREE.Vector3(
                neighborAtom.x - atom.x,
                neighborAtom.y - atom.y,
                neighborAtom.z - atom.z
              ).normalize();

              const hybridMesh = createHybridOrbitalMesh(pos, bondDir, orbitalScale * 1.05);
              orbGroup.add(hybridMesh);
            });
          }

          // If lone pairs present (e.g. H2O or NH3), render lone pair rabbit ears
          if (vsepr && vsepr.lonePairs > 0 && isCentral) {
            if (vsepr.lonePairs === 2) {
              const lpDir1 = new THREE.Vector3(0, 0.7, 0.7).normalize();
              const lpDir2 = new THREE.Vector3(0, -0.7, 0.7).normalize();
              orbGroup.add(createHybridOrbitalMesh(pos, lpDir1, orbitalScale * 1.2, true));
              orbGroup.add(createHybridOrbitalMesh(pos, lpDir2, orbitalScale * 1.2, true));
            } else if (vsepr.lonePairs === 1) {
              const lpDir = new THREE.Vector3(0, 0, 1).normalize();
              orbGroup.add(createHybridOrbitalMesh(pos, lpDir, orbitalScale * 1.2, true));
            }
          }
        }

        if (orbitalMode === 'atomic_p') {
          orbGroup.add(createPOrbitalMesh(pos, 'z', orbitalScale * 1.2));
          orbGroup.add(createPOrbitalMesh(pos, 'x', orbitalScale * 1.2));
        }

        if (orbitalMode === 'atomic_d') {
          orbGroup.add(createDz2OrbitalMesh(pos, orbitalScale * 1.1));
        }

        if (orbitalMode === 'pi_delocalized' || orbitalMode === 'all') {
          const isAromatic = bonds.some((b) => b.order === 1.5);
          const hasDouble = bonds.some((b) => b.order === 2);
          if (isAromatic && idx === 0) {
            orbGroup.add(createDelocalizedPiClouds(pos, 1.45, 0.28));
          } else if (hasDouble && idx === 0) {
            orbGroup.add(createPOrbitalMesh(pos, 'z', orbitalScale * 1.15));
          }
        }
      }
    });

    // 2. Create Bond Meshes with Studio PBR Finish
    bonds.forEach((bond) => {
      const a1 = atoms[bond.sourceIndex];
      const a2 = atoms[bond.targetIndex];
      if (!a1 || !a2) return;

      const p1 = is2D
        ? (pos2DMap.get(bond.sourceIndex) || new THREE.Vector3(a1.x - cx, a1.y - cy, 0))
        : new THREE.Vector3(a1.x - cx, a1.y - cy, a1.z - cz);
      const p2 = is2D
        ? (pos2DMap.get(bond.targetIndex) || new THREE.Vector3(a2.x - cx, a2.y - cy, 0))
        : new THREE.Vector3(a2.x - cx, a2.y - cy, a2.z - cz);
      const dist = p1.distanceTo(p2);
      const dir = p2.clone().sub(p1).normalize();
      const mid = p1.clone().add(p2).multiplyScalar(0.5);

      const bondRadius = is2D ? 0.08 : renderStyle === 'wireframe' ? 0.05 : renderStyle === 'stick' ? 0.12 : 0.09;
      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir);

      const isBondIsolated =
        !isIsolationMode ||
        activeSelectedAtom === null ||
        bond.sourceIndex === activeSelectedAtom ||
        bond.targetIndex === activeSelectedAtom;

      const bondGroup = new THREE.Group();

      if (bond.order === 1) {
        const geom = new THREE.CylinderGeometry(bondRadius, bondRadius, dist, 24);
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x94a3b8,
          roughness: 0.25,
          metalness: 0.15,
          clearcoat: 0.5,
          wireframe: renderStyle === 'wireframe',
          transparent: !isBondIsolated,
          opacity: !isBondIsolated ? 0.15 : 1.0,
        });
        const cyl = new THREE.Mesh(geom, mat);
        cyl.position.copy(mid);
        cyl.quaternion.copy(quaternion);
        bondGroup.add(cyl);
      } else if (bond.order === 2) {
        const offset = 0.12;
        const perp = new THREE.Vector3(-dir.y, dir.x, 0).normalize().multiplyScalar(offset);

        [-1, 1].forEach((sign) => {
          const geom = new THREE.CylinderGeometry(bondRadius * 0.85, bondRadius * 0.85, dist, 24);
          const mat = new THREE.MeshPhysicalMaterial({
            color: 0x64748b,
            roughness: 0.25,
            metalness: 0.15,
            clearcoat: 0.5,
            transparent: !isBondIsolated,
            opacity: !isBondIsolated ? 0.15 : 1.0,
          });
          const cyl = new THREE.Mesh(geom, mat);
          cyl.position.copy(mid.clone().add(perp.clone().multiplyScalar(sign)));
          cyl.quaternion.copy(quaternion);
          bondGroup.add(cyl);
        });
      } else if (bond.order === 3) {
        const geom1 = new THREE.CylinderGeometry(bondRadius * 0.75, bondRadius * 0.75, dist, 24);
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x475569,
          roughness: 0.25,
          metalness: 0.15,
          clearcoat: 0.5,
          transparent: !isBondIsolated,
          opacity: !isBondIsolated ? 0.15 : 1.0,
        });
        const c1 = new THREE.Mesh(geom1, mat);
        c1.position.copy(mid);
        c1.quaternion.copy(quaternion);
        bondGroup.add(c1);

        const perp1 = new THREE.Vector3(-dir.y, dir.x, 0).normalize().multiplyScalar(0.14);
        [-1, 1].forEach((sign) => {
          const cyl = new THREE.Mesh(geom1.clone(), mat);
          cyl.position.copy(mid.clone().add(perp1.clone().multiplyScalar(sign)));
          cyl.quaternion.copy(quaternion);
          bondGroup.add(cyl);
        });
      } else if (bond.order === 1.5) {
        const geom = new THREE.CylinderGeometry(bondRadius, bondRadius, dist, 24);
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x64748b,
          roughness: 0.25,
          metalness: 0.15,
          clearcoat: 0.5,
          transparent: !isBondIsolated,
          opacity: !isBondIsolated ? 0.15 : 1.0,
        });
        const cyl = new THREE.Mesh(geom, mat);
        cyl.position.copy(mid);
        cyl.quaternion.copy(quaternion);
        bondGroup.add(cyl);
      }

      molGroup.add(bondGroup);
      bondMeshesRef.current.push({
        mesh: bondGroup,
        sourceIdx: bond.sourceIndex,
        targetIdx: bond.targetIndex,
        order: bond.order,
      });
    });

    // 3. Electrostatic Potential Map (ESP) Molecular Surface
    if (renderStyle === 'esp_surface') {
      const espSurface = createEspMolecularSurface(atoms, bonds, new THREE.Vector3(cx, cy, cz));
      molGroup.add(espSurface);
    }

    // 4. Dipole Moment Vector Arrow
    if (showDipole && dipoleDebye > 0.1) {
      const arrowDir = new THREE.Vector3(0, 0, 1).normalize();
      const arrowLength = Math.min(3.5, 0.8 + dipoleDebye * 0.8);
      const arrowOrigin = new THREE.Vector3(0, 0, -arrowLength * 0.5);

      const arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowLength, 0x10b981, 0.5, 0.3);
      dynGroup.add(arrow);
    }

    // Auto-frame camera based on molecule radius
    let maxR = 2.0;
    atoms.forEach((a) => {
      const r = Math.hypot(a.x - cx, a.y - cy, a.z - cz);
      if (r > maxR) maxR = r;
    });
    cameraDistanceRef.current = Math.max(6, maxR * 2.8);
    cameraSphericalRef.current.radius = cameraDistanceRef.current;
    updateCameraPosition();
  }, [
    atoms,
    bonds,
    renderStyle,
    orbitalMode,
    orbitalScale,
    orbitalOpacity,
    showDipole,
    dipoleDebye,
    vsepr,
    measurement.atoms,
    isXRayMode,
    isIsolationMode,
    updateCameraPosition,
  ]);

  // Measurement visual line and angle arc overlays
  useEffect(() => {
    if (!measurementGroupRef.current) return;
    const measGroup = measurementGroupRef.current;
    while (measGroup.children.length > 0) measGroup.remove(measGroup.children[0]);

    if (measurement.atoms.length === 2 && atomMeshesRef.current.length > 0) {
      const [idx1, idx2] = measurement.atoms;
      const m1 = atomMeshesRef.current.find((a) => a.id === idx1);
      const m2 = atomMeshesRef.current.find((a) => a.id === idx2);
      if (m1 && m2) {
        const p1 = m1.initialPos;
        const p2 = m2.initialPos;
        const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0x0284c7,
          dashSize: 0.2,
          gapSize: 0.1,
          linewidth: 2,
        });
        const line = new THREE.Line(lineGeom, lineMat);
        line.computeLineDistances();
        measGroup.add(line);
      }
    } else if (measurement.atoms.length === 3 && atomMeshesRef.current.length > 0) {
      const [idx1, idx2, idx3] = measurement.atoms;
      const m1 = atomMeshesRef.current.find((a) => a.id === idx1);
      const m2 = atomMeshesRef.current.find((a) => a.id === idx2);
      const m3 = atomMeshesRef.current.find((a) => a.id === idx3);
      if (m1 && m2 && m3) {
        const lineGeom = new THREE.BufferGeometry().setFromPoints([m1.initialPos, m2.initialPos, m3.initialPos]);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x059669, linewidth: 2 });
        measGroup.add(new THREE.Line(lineGeom, lineMat));
      }
    }
  }, [measurement]);

  // Main Animation Loop with frame-rate independent kinematics
  useEffect(() => {
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      const time = clockRef.current.getElapsedTime();

      // Smooth auto-rotation
      if (autoRotate && moleculeGroupRef.current) {
        cameraSphericalRef.current.theta += delta * 0.4;
        updateCameraPosition();
      }

      // Bonding Dynamics & Normal Mode Vibrational Simulation
      if (isVibrating && activeVibrationalMode && atomMeshesRef.current.length > 0) {
        const freqFactor = (activeVibrationalMode.frequencyCm1 || 1000) / 400;
        const phase = time * freqFactor * 3.5;
        const amplitude = 0.18;

        atomMeshesRef.current.forEach(({ mesh, initialPos, id }) => {
          const disp = activeVibrationalMode.displacements?.[id] || { x: 0, y: 0, z: 0 };
          const thermalJitter = (temperatureK / 500) * 0.04;

          mesh.position.x = initialPos.x + disp.x * Math.sin(phase) * amplitude + (Math.random() - 0.5) * thermalJitter;
          mesh.position.y = initialPos.y + disp.y * Math.sin(phase) * amplitude + (Math.random() - 0.5) * thermalJitter;
          mesh.position.z = initialPos.z + disp.z * Math.sin(phase) * amplitude + (Math.random() - 0.5) * thermalJitter;
        });
      } else if (temperatureK > 0 && atomMeshesRef.current.length > 0) {
        const thermalJitter = (temperatureK / 500) * 0.05;
        atomMeshesRef.current.forEach(({ mesh, initialPos }) => {
          mesh.position.x = initialPos.x + (Math.random() - 0.5) * thermalJitter;
          mesh.position.y = initialPos.y + (Math.random() - 0.5) * thermalJitter;
          mesh.position.z = initialPos.z + (Math.random() - 0.5) * thermalJitter;
        });
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate, isVibrating, activeVibrationalMode, temperatureK, updateCameraPosition]);

  // Mouse Orbit Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      if (renderStyle === '2d_projected') {
        if (moleculeGroupRef.current) {
          moleculeGroupRef.current.position.x += deltaX * 0.015;
          moleculeGroupRef.current.position.y -= deltaY * 0.015;
        }
        return;
      }

      cameraSphericalRef.current.theta -= deltaX * 0.008;
      cameraSphericalRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI - 0.05, cameraSphericalRef.current.phi - deltaY * 0.008)
      );

      updateCameraPosition();
      return;
    }

    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    if (moleculeGroupRef.current) {
      const atomSpheres = atomMeshesRef.current.map((a) => a.mesh);
      const intersects = raycaster.intersectObjects(atomSpheres, false);

      if (intersects.length > 0) {
        setHoveredAtom(intersects[0].object.userData.atom);
      } else {
        setHoveredAtom(null);
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.01;
    cameraSphericalRef.current.radius = Math.max(3, Math.min(60, cameraSphericalRef.current.radius + zoomDelta));
    updateCameraPosition();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!canvasRef.current || !cameraRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    if (moleculeGroupRef.current) {
      const atomSpheres = atomMeshesRef.current.map((a) => a.mesh);
      const intersects = raycaster.intersectObjects(atomSpheres, false);

      if (intersects.length > 0) {
        const atomIndex = intersects[0].object.userData.atomIndex;
        onSelectAtom(atomIndex);
      }
    }
  };

  // Touch Orbit and Pinch Zoom Controls for Mobile & Tablet Viewports
  const touchStartPosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const touchPinchDistRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      const t = e.touches[0];
      prevMousePosRef.current = { x: t.clientX, y: t.clientY };
      touchStartPosRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
      touchPinchDistRef.current = null;
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      touchPinchDistRef.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const t = e.touches[0];
      const deltaX = t.clientX - prevMousePosRef.current.x;
      const deltaY = t.clientY - prevMousePosRef.current.y;

      cameraSphericalRef.current.theta -= deltaX * 0.008;
      cameraSphericalRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI - 0.05, cameraSphericalRef.current.phi - deltaY * 0.008)
      );

      prevMousePosRef.current = { x: t.clientX, y: t.clientY };
      updateCameraPosition();
    } else if (e.touches.length === 2 && touchPinchDistRef.current !== null) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const diff = touchPinchDistRef.current - currentDist;

      const zoomFactor = diff * 0.05;
      cameraSphericalRef.current.radius = Math.max(
        3,
        Math.min(60, cameraSphericalRef.current.radius + zoomFactor)
      );
      touchPinchDistRef.current = currentDist;
      updateCameraPosition();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isDraggingRef.current && e.changedTouches.length > 0) {
      const t = e.changedTouches[0];
      const dist = Math.hypot(
        t.clientX - touchStartPosRef.current.x,
        t.clientY - touchStartPosRef.current.y
      );
      const elapsed = Date.now() - touchStartPosRef.current.time;

      // If short tap with minimal finger movement (< 8px, < 350ms), raycast to select tapped atom
      if (dist < 8 && elapsed < 350 && canvasRef.current && cameraRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((t.clientX - rect.left) / rect.width) * 2 - 1,
          -((t.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, cameraRef.current);

        if (moleculeGroupRef.current) {
          const atomSpheres = atomMeshesRef.current.map((a) => a.mesh);
          const intersects = raycaster.intersectObjects(atomSpheres, false);
          if (intersects.length > 0) {
            const atomIndex = intersects[0].object.userData.atomIndex;
            onSelectAtom(atomIndex);
          }
        }
      }
    }

    if (e.touches.length === 0) {
      isDraggingRef.current = false;
      touchPinchDistRef.current = null;
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      prevMousePosRef.current = { x: t.clientX, y: t.clientY };
    }
  };

  const handleResetCamera = () => {
    cameraSphericalRef.current = { radius: cameraDistanceRef.current, theta: Math.PI / 4, phi: Math.PI / 3 };
    updateCameraPosition();
  };

  const handleTakeSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `pbr-molecule-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Sync fullscreen state with browser events and Escape key
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(document.fullscreenElement);
      setIsFullscreen(isFs);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Adjust camera aspect ratio and renderer size when fullscreen toggles
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth || window.innerWidth;
      const newH = containerRef.current.clientHeight || (isFullscreen ? window.innerHeight : 550);
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    const timer1 = setTimeout(updateSize, 40);
    const timer2 = setTimeout(updateSize, 200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement && !isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          // If browser restricts fullscreen in iframe, fallback overlay handles it seamlessly
        });
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`select-none overflow-hidden transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-0 shadow-2xl'
          : 'relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[550px] rounded-2xl border border-slate-200 shadow-sm'
      } ${
        isDarkBg ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Top Spec Badges */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap items-center gap-1.5 z-10 max-w-[58%] sm:max-w-none">
        <div className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/70 shadow-lg text-slate-200 text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-semibold whitespace-nowrap">Studio PBR</span>
          <span className="text-slate-400 text-[10px] hidden md:inline">ACES Tonemapped</span>
        </div>

        {renderStyle === 'esp_surface' ? (
          <div className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900/90 border border-amber-500/50 shadow-lg text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="font-semibold text-amber-300 whitespace-nowrap">ESP Surface</span>
            <span className="text-slate-300 text-[10px] hidden sm:inline">Electron Density</span>
          </div>
        ) : orbitalMode !== 'none' ? (
          <div className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/70 shadow-lg text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-slate-300 hidden sm:inline">Phase:</span>
            <span className="text-cyan-400 font-semibold">(+) Cyan</span>
            <span className="text-rose-400 font-semibold">(−) Coral</span>
          </div>
        ) : null}

        {isFullscreen && (
          <div className="px-2 sm:px-2.5 py-1 rounded-lg bg-blue-600/95 border border-blue-400/60 shadow-lg text-white text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2">
            <Maximize2 className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold whitespace-nowrap">Focus Mode</span>
            <span className="text-blue-100 text-[10px] hidden md:inline">(Esc to exit)</span>
          </div>
        )}
      </div>

      {/* Top Right Quick Actions */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 p-1 sm:p-1.5 rounded-xl bg-slate-900/85 border border-slate-700/70 shadow-lg text-slate-200 z-10">
        <button
          onClick={handleResetCamera}
          title="Reset Camera Orientation"
          className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Pause Auto-Spin' : 'Auto-Spin Camera'}
          className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
            autoRotate ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={() => setIsVibrating(!isVibrating)}
          title={isVibrating ? 'Pause Vibration' : 'Play Vibrational Dynamics'}
          className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
            isVibrating ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          {isVibrating ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        <button
          onClick={() => setIsDarkBg(!isDarkBg)}
          title={isDarkBg ? 'Switch to Lab Light Canvas' : 'Switch to Dark Slate Canvas'}
          className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          {isDarkBg ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        <button
          onClick={handleTakeSnapshot}
          title="Export High-Res PNG"
          className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Full-Screen Focus (Esc)' : 'Full-Screen Focus Mode'}
          aria-label={isFullscreen ? 'Exit Full-Screen Focus' : 'Full-Screen Focus Mode'}
          className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
            isFullscreen ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>

      {/* Measurement HUD banner */}
      {measurement.atoms.length > 0 && (
        <div className="absolute top-14 left-3 p-2.5 rounded-xl bg-slate-900/90 border border-blue-500/50 shadow-xl text-xs z-10 flex items-center gap-3">
          <Ruler className="w-4 h-4 text-cyan-400" />
          <div>
            {measurement.atoms.length === 1 && (
              <span>
                Atom 1: <strong className="text-white">{atoms[measurement.atoms[0]]?.element}#{measurement.atoms[0] + 1}</strong>. Click atom 2 to measure distance.
              </span>
            )}
            {measurement.atoms.length === 2 && measurement.distance !== undefined && (
              <div className="flex items-center gap-2">
                <span>Distance:</span>
                <span className="font-bold font-mono text-cyan-400">{measurement.distance.toFixed(3)} Å</span>
                <span className="text-slate-400 text-[10px]">({(measurement.distance * 100).toFixed(1)} pm)</span>
              </div>
            )}
            {measurement.atoms.length === 3 && measurement.angle !== undefined && (
              <div className="flex items-center gap-2">
                <span>Bond Angle:</span>
                <span className="font-bold font-mono text-emerald-400">{measurement.angle.toFixed(1)}°</span>
              </div>
            )}
          </div>
          <button
            onClick={onClearMeasurement}
            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-1"
          >
            Clear
          </button>
        </div>
      )}

      {/* ESP Color Legend Floating HUD */}
      {renderStyle === 'esp_surface' && (
        <div
          className={`absolute left-3 p-3 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl text-xs z-10 w-72 backdrop-blur-sm transition-all ${
            measurement.atoms.length > 0 ? 'top-28' : 'top-14'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-100 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Electrostatic Potential Map (ESP)</span>
            </div>
            <span className="text-[10px] text-amber-400 font-mono font-semibold">V(r)</span>
          </div>

          {/* Gradient Bar: Red to Blue */}
          <div
            className="h-3 w-full rounded-md shadow-inner mb-1.5 border border-slate-700/60"
            style={{
              background: 'linear-gradient(to right, #ef4444 0%, #f59e0b 25%, #10b981 50%, #06b6d4 75%, #3b82f6 100%)',
            }}
          />

          <div className="flex justify-between items-center text-[10px] font-medium mb-1.5">
            <span className="text-red-400 font-bold">δ⁻ High Density</span>
            <span className="text-emerald-400 font-semibold">Neutral</span>
            <span className="text-blue-400 font-bold">δ⁺ Low Density</span>
          </div>

          <div className="border-t border-slate-800 pt-1.5 text-[10px] text-slate-400 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>
                <strong className="text-slate-200">Red:</strong> Nucleophilic / electron-rich region
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span>
                <strong className="text-slate-200">Blue:</strong> Electrophilic / electron-deficient region
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hover atom info tooltip */}
      {hoveredAtom && (
        <div className="pointer-events-none absolute bottom-24 right-3 p-2 rounded-xl bg-slate-900/90 border border-slate-700 shadow-lg text-xs z-10 flex items-center gap-2 text-slate-200">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>
            {hoveredAtom.element} (Z={getElement(hoveredAtom.element).atomicNumber}, EN={getElement(hoveredAtom.element).electronegativity})
          </span>
          {hoveredAtom.partialCharge !== undefined && (
            <span className="font-mono text-cyan-400">δ={hoveredAtom.partialCharge > 0 ? `+${hoveredAtom.partialCharge}` : hoveredAtom.partialCharge}</span>
          )}
        </div>
      )}

      {/* ZERO-OCCLUSION COLLAPSIBLE BOTTOM DOCK (Per Three.js Skill Directives) */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-20 transition-all duration-300 ease-out`}
      >
        {/* Collapse / Expand Tab Button */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-slate-900/90 hover:bg-slate-900 text-slate-300 hover:text-white border border-b-0 border-slate-700/80 text-[11px] font-medium transition-colors shadow-sm"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show Zero-Occlusion Dock</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls (Cinema View)</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Controls Container */}
        {!isDockCollapsed && (
          <div className="p-2 sm:p-3 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl text-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            {/* Style Pills */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto max-w-full">
              <span className="text-[10px] font-bold uppercase text-slate-400 px-1 shrink-0">Style:</span>
              {[
                { id: 'ball_and_stick', label: 'Ball & Stick' },
                { id: 'space_filling', label: 'vdW' },
                { id: 'stick', label: 'Stick' },
                { id: 'wireframe', label: 'Wire' },
                { id: 'esp_surface', label: '⚡ ESP Map' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeRenderStyle(item.id as RenderStyle)}
                  className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-all shrink-0 ${
                    renderStyle === item.id ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Orbitals selector */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shrink-0">
              <span className="text-[10px] font-bold uppercase text-slate-400 px-1">Orbitals:</span>
              <button
                onClick={() => onChangeOrbitalMode(orbitalMode === 'none' ? 'hybrid' : orbitalMode === 'hybrid' ? 'pi_delocalized' : orbitalMode === 'pi_delocalized' ? 'all' : 'none')}
                className="px-2 sm:px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px] sm:text-[11px] transition-colors whitespace-nowrap"
              >
                {orbitalMode === 'none' ? 'Off' : orbitalMode === 'hybrid' ? 'Hybrid' : orbitalMode === 'pi_delocalized' ? 'π Clouds' : 'All'}
              </button>
            </div>

            {/* Zero-Occlusion Toggles */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => setIsXRayMode(!isXRayMode)}
                title="Toggle Translucent X-Ray Shells for Zero Internal Occlusion"
                className={`px-2 sm:px-2.5 py-1 rounded-xl border text-[10px] sm:text-[11px] font-medium transition-colors flex items-center gap-1 sm:gap-1.5 ${
                  isXRayMode
                    ? 'bg-cyan-600/90 text-white border-cyan-500 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>X-Ray</span>
              </button>

              <button
                onClick={() => setIsIsolationMode(!isIsolationMode)}
                title="Isolate Active Atom's Coordination Sphere (Dimm peripheral atoms)"
                className={`px-2 sm:px-2.5 py-1 rounded-xl border text-[10px] sm:text-[11px] font-medium transition-colors flex items-center gap-1 sm:gap-1.5 ${
                  isIsolationMode
                    ? 'bg-purple-600/90 text-white border-purple-500 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Focus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Isolate</span>
              </button>

              <button
                onClick={() => onToggleDipole(!showDipole)}
                className={`px-2 sm:px-2.5 py-1 rounded-xl border text-[10px] sm:text-[11px] font-medium transition-colors ${
                  showDipole ? 'bg-emerald-600/90 text-white border-emerald-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Dipole
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
