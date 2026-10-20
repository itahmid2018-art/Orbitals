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
  Copy,
  Check,
  Compass,
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

// Helper to generate 3D billboarded text sprite for calculated bond angle overlay
function createAngleLabelSprite(
  angleDeg: number,
  atomsStr: string,
  idealComparison?: string
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 150;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 400, 150);

    const r = 22;
    const x = 10;
    const y = 8;
    const w = 380;
    const h = 134;

    // Glowing drop shadow
    ctx.shadowColor = 'rgba(16, 185, 129, 0.55)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;

    // Rounded rectangle path
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.fill();

    // Vibrant emerald border
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#10b981';
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Top Header / Atom Pathway: "∠ H1 — O2 — H3"
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 22px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(atomsStr, 200, 20);

    // Large Bold Angle Number: "104.5°"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${angleDeg.toFixed(1)}°`, 200, 74);

    // Bottom Subtitle (Reference comparison or geometry)
    if (idealComparison) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 17px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(idealComparison, 200, 114);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.4, 0.525, 1);
  sprite.renderOrder = 9999;
  return sprite;
}

// Helper to generate 3D billboarded text sprite for calculated distance overlay
function createDistanceLabelSprite(distAngstrom: number, atomsStr: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 340;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 340, 140);

    const r = 20;
    const x = 10;
    const y = 10;
    const w = 320;
    const h = 120;

    ctx.shadowColor = 'rgba(2, 132, 199, 0.55)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.fill();

    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#0284c7';
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#7dd3fc';
    ctx.font = 'bold 20px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(atomsStr, 170, 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${distAngstrom.toFixed(3)} Å`, 170, 68);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 17px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, sans-serif';
    ctx.fillText(`(${(distAngstrom * 100).toFixed(1)} pm)`, 170, 104);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.3, 0.535, 1);
  sprite.renderOrder = 9999;
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
  const [copiedAngle, setCopiedAngle] = useState(false);

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
  const atomMeshesRef = useRef<{ mesh: THREE.Object3D; initialPos: THREE.Vector3; id: number }[]>([]);
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

      if (is2D) {
        // In 2D Planar ChemView mode: Render ONLY the clean 2D atomic symbol badge (NO 3D sphere)
        if (isIsolatedVisible) {
          const sprite = createElementTextSprite(elem.symbol, elem.cpkColor, isSelected);
          sprite.position.set(pos.x, pos.y, 0.05);
          sprite.userData = { atomIndex: idx, atom, elementData: elem };
          molGroup.add(sprite);

          atomMeshesRef.current.push({
            mesh: sprite,
            initialPos: pos.clone(),
            id: idx,
          });
        }
      } else {
        // In 3D Quantum View mode: Render Studio PBR physical sphere
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
      }

      // Orbital representations for central / key atoms (3D mode only)
      if (!is2D && orbitalMode !== 'none' && (isCentral || atoms.length <= 6) && isIsolatedVisible) {
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

    // 2. Create Bond Meshes
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
      if (dist < 0.001) return;

      const isBondIsolated =
        !isIsolationMode ||
        activeSelectedAtom === null ||
        bond.sourceIndex === activeSelectedAtom ||
        bond.targetIndex === activeSelectedAtom;

      const bondGroup = new THREE.Group();

      if (is2D) {
        // Clean 2D Planar Chemical Bonds (Orthogonal flat planar strips in XY plane)
        const dir = p2.clone().sub(p1).normalize();
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const angle = Math.atan2(dir.y, dir.x);
        const perp = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
        const bondColor = isDarkBg ? 0x94a3b8 : 0x475569;
        const bondWidth = 0.055;

        const createFlatLine = (center: THREE.Vector3, length: number) => {
          const planeGeom = new THREE.PlaneGeometry(length, bondWidth);
          planeGeom.rotateZ(angle);
          const planeMat = new THREE.MeshBasicMaterial({
            color: bondColor,
            side: THREE.DoubleSide,
            transparent: !isBondIsolated,
            opacity: !isBondIsolated ? 0.2 : 1.0,
          });
          const plane = new THREE.Mesh(planeGeom, planeMat);
          plane.position.set(center.x, center.y, 0.01);
          return plane;
        };

        if (bond.order === 1) {
          bondGroup.add(createFlatLine(mid, dist));
        } else if (bond.order === 2) {
          const offset = 0.075;
          bondGroup.add(createFlatLine(mid.clone().add(perp.clone().multiplyScalar(offset)), dist));
          bondGroup.add(createFlatLine(mid.clone().add(perp.clone().multiplyScalar(-offset)), dist));
        } else if (bond.order === 3) {
          const offset = 0.095;
          bondGroup.add(createFlatLine(mid, dist));
          bondGroup.add(createFlatLine(mid.clone().add(perp.clone().multiplyScalar(offset)), dist));
          bondGroup.add(createFlatLine(mid.clone().add(perp.clone().multiplyScalar(-offset)), dist));
        } else {
          // 1.5 order / aromatic
          const offset = 0.075;
          bondGroup.add(createFlatLine(mid.clone().add(perp.clone().multiplyScalar(offset)), dist));
          bondGroup.add(createFlatLine(mid.clone().add(perp.clone().multiplyScalar(-offset)), dist * 0.85));
        }
      } else {
        // 3D Mode: Studio PBR Physical Cylinders
        const dir = p2.clone().sub(p1).normalize();
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const bondRadius = renderStyle === 'wireframe' ? 0.05 : renderStyle === 'stick' ? 0.12 : 0.09;
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir);

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
      }

      molGroup.add(bondGroup);
      bondMeshesRef.current.push({
        mesh: bondGroup,
        sourceIdx: bond.sourceIndex,
        targetIdx: bond.targetIndex,
        order: bond.order,
      });
    });

    // 3. Electrostatic Potential Map (ESP) Molecular Surface (3D mode only)
    if (!is2D && renderStyle === 'esp_surface') {
      const espSurface = createEspMolecularSurface(atoms, bonds, new THREE.Vector3(cx, cy, cz));
      molGroup.add(espSurface);
    }

    // 4. Dipole Moment Vector Arrow (3D mode only)
    if (!is2D && showDipole && dipoleDebye > 0.1) {
      const arrowDir = new THREE.Vector3(0, 0, 1).normalize();
      const arrowLength = Math.min(3.5, 0.8 + dipoleDebye * 0.8);
      const arrowOrigin = new THREE.Vector3(0, 0, -arrowLength * 0.5);

      const arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowLength, 0x10b981, 0.5, 0.3);
      dynGroup.add(arrow);
    }

    // Toggle contact shadow and orbitals group visibility based on 2D mode
    if (contactShadowRef.current) {
      contactShadowRef.current.visible = !is2D;
    }
    if (orbitalsGroupRef.current) {
      orbitalsGroupRef.current.visible = !is2D;
    }

    // Auto-frame camera based on molecule radius
    let maxR = 2.0;
    atoms.forEach((a) => {
      const r = is2D
        ? Math.hypot((pos2DMap.get(a.id ?? 0)?.x ?? a.x - cx), (pos2DMap.get(a.id ?? 0)?.y ?? a.y - cy))
        : Math.hypot(a.x - cx, a.y - cy, a.z - cz);
      if (r > maxR) maxR = r;
    });
    cameraDistanceRef.current = Math.max(6, maxR * 2.8);
    cameraSphericalRef.current.radius = cameraDistanceRef.current;
    if (is2D) {
      cameraSphericalRef.current.theta = 0;
      cameraSphericalRef.current.phi = Math.PI / 2;
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 0, cameraDistanceRef.current);
        cameraRef.current.lookAt(0, 0, 0);
      }
      if (moleculeGroupRef.current) {
        moleculeGroupRef.current.position.set(0, 0, 0);
        moleculeGroupRef.current.rotation.set(0, 0, 0);
      }
    } else {
      updateCameraPosition();
    }
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
    isDarkBg,
    updateCameraPosition,
  ]);

  // Measurement visual line, 3D angle arc, sector fan, and floating billboard overlays
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
        const dist = measurement.distance ?? p1.distanceTo(p2);

        const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0x0284c7,
          dashSize: 0.2,
          gapSize: 0.1,
          linewidth: 2.5,
        });
        const line = new THREE.Line(lineGeom, lineMat);
        line.computeLineDistances();
        measGroup.add(line);

        // In-scene 3D distance billboard sprite
        const pMid = p1.clone().add(p2).multiplyScalar(0.5);
        const elem1 = atoms[idx1]?.element || `#${idx1 + 1}`;
        const elem2 = atoms[idx2]?.element || `#${idx2 + 1}`;
        const distSprite = createDistanceLabelSprite(dist, `${elem1}#${idx1 + 1} ── ${elem2}#${idx2 + 1}`);
        distSprite.position.copy(pMid).add(new THREE.Vector3(0, 0.28, 0));
        measGroup.add(distSprite);
      }
    } else if (measurement.atoms.length === 3 && atomMeshesRef.current.length > 0) {
      const vertexIdx = measurement.vertexAtom !== undefined ? measurement.vertexAtom : measurement.atoms[1];
      const armIndices = measurement.atoms.filter((id) => id !== vertexIdx);
      const arm1Idx = armIndices[0] ?? measurement.atoms[0];
      const arm2Idx = armIndices[1] ?? measurement.atoms[2];

      const mV = atomMeshesRef.current.find((a) => a.id === vertexIdx);
      const m1 = atomMeshesRef.current.find((a) => a.id === arm1Idx);
      const m2 = atomMeshesRef.current.find((a) => a.id === arm2Idx);

      if (mV && m1 && m2) {
        const pV = mV.initialPos.clone();
        const p1 = m1.initialPos.clone();
        const p2 = m2.initialPos.clone();

        const v1 = p1.clone().sub(pV);
        const v2 = p2.clone().sub(pV);
        const d1 = v1.length();
        const d2 = v2.length();

        if (d1 > 1e-4 && d2 > 1e-4) {
          const u1 = v1.clone().divideScalar(d1);
          const u2 = v2.clone().divideScalar(d2);
          const cosTheta = THREE.MathUtils.clamp(u1.dot(u2), -1, 1);
          const angleRad = Math.acos(cosTheta);
          const angleDeg = THREE.MathUtils.radToDeg(angleRad);

          // 1. Arm connecting dashed guide lines
          const arm1Geom = new THREE.BufferGeometry().setFromPoints([p1, pV]);
          const arm2Geom = new THREE.BufferGeometry().setFromPoints([pV, p2]);
          const armMat = new THREE.LineDashedMaterial({
            color: 0x10b981,
            dashSize: 0.15,
            gapSize: 0.08,
            linewidth: 2.5,
          });
          const line1 = new THREE.Line(arm1Geom, armMat);
          line1.computeLineDistances();
          const line2 = new THREE.Line(arm2Geom, armMat.clone());
          line2.computeLineDistances();
          measGroup.add(line1);
          measGroup.add(line2);

          // 2. Normal vector & in-plane perpendicular vector
          let normal = new THREE.Vector3().crossVectors(u1, u2);
          if (normal.lengthSq() < 1e-6) {
            const up = Math.abs(u1.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
            normal.crossVectors(u1, up).normalize();
          } else {
            normal.normalize();
          }
          const uPerp = new THREE.Vector3().crossVectors(normal, u1).normalize();

          // 3. Smooth 3D Bond Angle Arc
          const arcRadius = Math.max(0.48, Math.min(0.95, 0.45 * Math.min(d1, d2)));
          const segments = 36;
          const arcPoints: THREE.Vector3[] = [];
          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const a = t * angleRad;
            const dir = new THREE.Vector3()
              .addScaledVector(u1, Math.cos(a))
              .addScaledVector(uPerp, Math.sin(a));
            arcPoints.push(pV.clone().addScaledVector(dir, arcRadius));
          }

          const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPoints);
          const arcMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 3 });
          const arcLine = new THREE.Line(arcGeom, arcMat);
          measGroup.add(arcLine);

          // 4. Translucent Angular Sector Fan
          const fanVertices: number[] = [];
          for (let i = 0; i < segments; i++) {
            fanVertices.push(pV.x, pV.y, pV.z);
            fanVertices.push(arcPoints[i].x, arcPoints[i].y, arcPoints[i].z);
            fanVertices.push(arcPoints[i + 1].x, arcPoints[i + 1].y, arcPoints[i + 1].z);
          }
          const fanGeom = new THREE.BufferGeometry();
          fanGeom.setAttribute('position', new THREE.Float32BufferAttribute(fanVertices, 3));
          fanGeom.computeVertexNormals();
          const fanMat = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.22,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          const fanMesh = new THREE.Mesh(fanGeom, fanMat);
          measGroup.add(fanMesh);

          // 5. 3D In-Scene Angle Text Sprite Overlay
          let bisectDir: THREE.Vector3;
          if (angleDeg < 179.5 && angleDeg > 0.5) {
            bisectDir = new THREE.Vector3().addVectors(u1, u2).normalize();
          } else {
            bisectDir = uPerp.clone();
          }
          const labelPos = pV.clone().addScaledVector(bisectDir, arcRadius + 0.38);

          const elem1 = atoms[arm1Idx]?.element || `A#${arm1Idx + 1}`;
          const elemV = atoms[vertexIdx]?.element || `V#${vertexIdx + 1}`;
          const elem2 = atoms[arm2Idx]?.element || `B#${arm2Idx + 1}`;
          const atomsTitle = `∠ ${elem1}#${arm1Idx + 1} — ${elemV}#${vertexIdx + 1} — ${elem2}#${arm2Idx + 1}`;

          let idealSubtext = '';
          if (measurement.geometryName && measurement.idealAngle !== undefined) {
            const diff = angleDeg - measurement.idealAngle;
            idealSubtext = `${measurement.geometryName} (${measurement.idealAngle.toFixed(1)}°) · Δ ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}°`;
          }

          const labelSprite = createAngleLabelSprite(angleDeg, atomsTitle, idealSubtext);
          labelSprite.position.copy(labelPos);
          measGroup.add(labelSprite);
        }
      }
    }
  }, [measurement, atoms]);

  // Main Animation Loop with frame-rate independent kinematics
  useEffect(() => {
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      const time = clockRef.current.getElapsedTime();

      // Smooth auto-rotation (3D mode only)
      if (renderStyle !== '2d_projected' && autoRotate && moleculeGroupRef.current) {
        cameraSphericalRef.current.theta += delta * 0.4;
        updateCameraPosition();
      }

      // Bonding Dynamics & Normal Mode Vibrational Simulation (3D mode only)
      if (renderStyle !== '2d_projected' && isVibrating && activeVibrationalMode && atomMeshesRef.current.length > 0) {
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
      } else if (renderStyle !== '2d_projected' && temperatureK > 0 && atomMeshesRef.current.length > 0) {
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
  }, [autoRotate, isVibrating, activeVibrationalMode, temperatureK, renderStyle, updateCameraPosition]);

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

  // Native non-passive Wheel & Trackpad Zoom Handler attached to container
  // Prevents the browser from zooming the webpage or scrolling the parent document
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onNativeWheel = (e: WheelEvent) => {
      // Strictly prevent browser page zoom (Ctrl+wheel / trackpad pinch) and page scroll
      e.preventDefault();
      e.stopPropagation();

      // Normalize delta across browsers and devices
      let delta = e.deltaY;
      if (e.deltaMode === 1) {
        delta *= 16;
      } else if (e.deltaMode === 2) {
        delta *= 100;
      }

      // If user is pinch-zooming on trackpad (browser sets ctrlKey: true)
      if (e.ctrlKey) {
        delta *= 2.0;
      }

      const zoomFactor = delta * 0.01;
      cameraSphericalRef.current.radius = Math.max(
        2.5,
        Math.min(65, cameraSphericalRef.current.radius + zoomFactor)
      );

      if (renderStyle === '2d_projected') {
        cameraSphericalRef.current.theta = 0;
        cameraSphericalRef.current.phi = Math.PI / 2;
        if (cameraRef.current) {
          cameraRef.current.position.set(0, 0, cameraSphericalRef.current.radius);
          cameraRef.current.lookAt(0, 0, 0);
        }
      } else {
        updateCameraPosition();
      }
    };

    // Prevent Safari/WebKit trackpad gesture zooming on whole page
    const onGesture = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    container.addEventListener('wheel', onNativeWheel, { passive: false });
    container.addEventListener('gesturestart', onGesture, { passive: false });
    container.addEventListener('gesturechange', onGesture, { passive: false });

    return () => {
      container.removeEventListener('wheel', onNativeWheel);
      container.removeEventListener('gesturestart', onGesture);
      container.removeEventListener('gesturechange', onGesture);
    };
  }, [renderStyle, updateCameraPosition]);

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
      prevMousePosRef.current = { x: t.clientX, y: t.clientY };

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
      if (renderStyle === '2d_projected') {
        cameraSphericalRef.current.theta = 0;
        cameraSphericalRef.current.phi = Math.PI / 2;
        if (cameraRef.current) {
          cameraRef.current.position.set(0, 0, cameraSphericalRef.current.radius);
          cameraRef.current.lookAt(0, 0, 0);
        }
      } else {
        updateCameraPosition();
      }
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
    if (moleculeGroupRef.current) {
      moleculeGroupRef.current.position.set(0, 0, 0);
      moleculeGroupRef.current.rotation.set(0, 0, 0);
    }
    if (renderStyle === '2d_projected') {
      cameraSphericalRef.current = { radius: cameraDistanceRef.current, theta: 0, phi: Math.PI / 2 };
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 0, cameraDistanceRef.current);
        cameraRef.current.lookAt(0, 0, 0);
      }
    } else {
      cameraSphericalRef.current = { radius: cameraDistanceRef.current, theta: Math.PI / 4, phi: Math.PI / 3 };
      updateCameraPosition();
    }
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

  // Align camera strictly to flat orthographic view when entering 2D mode, and toggle shadow/orbitals visibility
  useEffect(() => {
    if (renderStyle === '2d_projected') {
      cameraSphericalRef.current = { radius: cameraDistanceRef.current, theta: 0, phi: Math.PI / 2 };
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 0, cameraDistanceRef.current);
        cameraRef.current.lookAt(0, 0, 0);
      }
      if (moleculeGroupRef.current) {
        moleculeGroupRef.current.position.set(0, 0, 0);
        moleculeGroupRef.current.rotation.set(0, 0, 0);
      }
      if (contactShadowRef.current) {
        contactShadowRef.current.visible = false;
      }
      if (orbitalsGroupRef.current) {
        orbitalsGroupRef.current.visible = false;
      }
    } else {
      if (contactShadowRef.current) {
        contactShadowRef.current.visible = true;
      }
      if (orbitalsGroupRef.current) {
        orbitalsGroupRef.current.visible = true;
      }
      cameraSphericalRef.current = { radius: cameraDistanceRef.current, theta: Math.PI / 4, phi: Math.PI / 3 };
      updateCameraPosition();
    }
  }, [renderStyle, updateCameraPosition]);

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
      className={`select-none overflow-hidden overscroll-contain touch-none transition-all duration-200 ${
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
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Top Spec Badges */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap items-center gap-1.5 z-10 max-w-[58%] sm:max-w-none">
        <div className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/70 shadow-lg text-slate-200 text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-semibold whitespace-nowrap">Studio PBR (Physically-Based Rendering)</span>
          <span className="text-slate-400 text-[10px] hidden md:inline">ACES (Academy Color Encoding System)</span>
        </div>

        {renderStyle === '2d_projected' ? (
          <div className="px-2 sm:px-2.5 py-1 rounded-lg bg-amber-500/90 border border-amber-300 shadow-lg text-slate-950 text-[11px] sm:text-xs flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-slate-950 shrink-0" />
            <span>2D Planar ChemView</span>
            <span className="text-slate-900/80 text-[10px] hidden sm:inline">Orthogonal Projection</span>
          </div>
        ) : renderStyle === 'esp_surface' ? (
          <div className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900/90 border border-amber-500/50 shadow-lg text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="font-semibold text-amber-300 whitespace-nowrap">ESP (Electrostatic Potential) Surface</span>
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
        {/* 2D / 3D Mode Toggle Button */}
        <button
          onClick={() => onChangeRenderStyle(renderStyle === '2d_projected' ? 'ball_and_stick' : '2d_projected')}
          title={renderStyle === '2d_projected' ? 'Switch to 3D Quantum View' : 'Switch to 2D Planar Chemical View'}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
            renderStyle === '2d_projected'
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md ring-1 ring-amber-300'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <span>{renderStyle === '2d_projected' ? '2D View' : '2D / 3D'}</span>
        </button>

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
        <div className="absolute top-14 left-3 p-3 rounded-xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl text-xs z-10 max-w-xs sm:max-w-sm backdrop-blur-md transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                {measurement.atoms.length === 3 ? (
                  <Compass className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Ruler className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div>
                <span className="font-bold text-slate-100 text-[11px] block">
                  {measurement.atoms.length === 3
                    ? '3D Bond Angle Measurement'
                    : measurement.atoms.length === 2
                    ? 'Bond Length Measurement'
                    : 'Measurement Tool (Step 1 of 3)'}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {measurement.atoms.length === 3
                    ? '3-atom spatial vertex angle & arc'
                    : measurement.atoms.length === 2
                    ? '2-atom interatomic distance'
                    : 'Select 2nd atom for distance, 3rd for angle'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {measurement.atoms.length === 3 && measurement.angle !== undefined && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${measurement.angle?.toFixed(1)}°`);
                    setCopiedAngle(true);
                    setTimeout(() => setCopiedAngle(false), 2000);
                  }}
                  title="Copy calculated bond angle"
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  {copiedAngle ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
              <button
                onClick={onClearMeasurement}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Measurement content */}
          <div className="mt-2 pt-2 border-t border-slate-800/80">
            {measurement.atoms.length === 1 && (
              <span className="text-slate-300 text-[11px]">
                Atom 1: <strong className="text-cyan-400 font-mono">{atoms[measurement.atoms[0]]?.element}#{measurement.atoms[0] + 1}</strong>.
                Click a second atom to measure distance, or a third atom to measure bond angle.
              </span>
            )}

            {measurement.atoms.length === 2 && measurement.distance !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-300 text-[11px]">
                    {atoms[measurement.atoms[0]]?.element}#{measurement.atoms[0] + 1} ── {atoms[measurement.atoms[1]]?.element}#{measurement.atoms[1] + 1}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-cyan-400 text-sm">{measurement.distance.toFixed(3)} Å</span>
                    <span className="text-slate-400 text-[10px]">({(measurement.distance * 100).toFixed(1)} pm)</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  Tip: Click a 3rd atom to measure the 3D bond angle formed between them.
                </div>
              </div>
            )}

            {measurement.atoms.length === 3 && measurement.angle !== undefined && (
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-mono text-[11px] text-slate-300 flex items-center flex-wrap gap-1">
                    <span>
                      {atoms[measurement.atoms[0]]?.element}#{measurement.atoms[0] + 1}
                    </span>
                    <span className="text-slate-500">──</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                      Vertex: {atoms[measurement.vertexAtom !== undefined ? measurement.vertexAtom : measurement.atoms[1]]?.element}#{(measurement.vertexAtom !== undefined ? measurement.vertexAtom : measurement.atoms[1]) + 1}
                    </span>
                    <span className="text-slate-500">──</span>
                    <span>
                      {atoms[measurement.atoms[2]]?.element}#{measurement.atoms[2] + 1}
                    </span>
                  </div>
                  <div className="font-black font-mono text-emerald-400 text-base shrink-0">
                    {measurement.angle.toFixed(1)}°
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>
                    Arm 1: {measurement.distance?.toFixed(3)} Å
                  </span>
                  {measurement.distance2 !== undefined && (
                    <span>
                      Arm 2: {measurement.distance2.toFixed(3)} Å
                    </span>
                  )}
                </div>

                {measurement.geometryName && measurement.idealAngle !== undefined && (
                  <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between text-[10px]">
                    <span className="text-slate-300">
                      Reference: <strong className="text-emerald-300">{measurement.geometryName}</strong> ({measurement.idealAngle.toFixed(1)}°)
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      Δ {measurement.deviation && measurement.deviation >= 0 ? '+' : ''}{measurement.deviation?.toFixed(1)}°
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ESP Color Legend Floating HUD */}
      {renderStyle === 'esp_surface' && (
        <div
          className={`absolute left-3 p-3 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl text-xs z-10 w-72 backdrop-blur-sm transition-all ${
            measurement.atoms.length === 3 ? 'top-48 sm:top-44' : measurement.atoms.length > 0 ? 'top-32' : 'top-14'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-100 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Electrostatic Potential Map (ESP [Electrostatic Potential])</span>
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
                { id: 'space_filling', label: 'vdW (van der Waals)' },
                { id: 'stick', label: 'Stick' },
                { id: 'wireframe', label: 'Wire' },
                { id: 'esp_surface', label: '⚡ ESP (Electrostatic Potential)' },
                { id: '2d_projected', label: '📐 2D Planar ChemView' },
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
