import * as THREE from 'three';
import { Atom3D, Bond3D, MeasurementSelection, MolecularGeometry } from '../types/chemistry';
import { getElement } from './elementData';

export type SvgStylePreset = 'publication' | 'grayscale' | 'textbook' | 'dark';
export type SvgBackground = 'transparent' | 'white' | 'dark';

export interface SvgExportOptions {
  width: number;
  height: number;
  stylePreset: SvgStylePreset;
  background: SvgBackground;
  showSymbols: boolean;
  showIndices: boolean;
  showMeasurements: boolean;
  showLegend: boolean;
  atomScale: number;
  bondWidth: number;
  title?: string;
  formula?: string;
  iupacName?: string;
}

export const DEFAULT_SVG_OPTIONS: SvgExportOptions = {
  width: 1200,
  height: 1200,
  stylePreset: 'publication',
  background: 'transparent',
  showSymbols: true,
  showIndices: false,
  showMeasurements: true,
  showLegend: true,
  atomScale: 1.0,
  bondWidth: 1.0,
};

interface ProjectedAtom {
  atom: Atom3D;
  index: number;
  screenX: number;
  screenY: number;
  depth: number;
  screenRadius: number;
  color: string;
  symbol: string;
  name: string;
}

interface ProjectedBond {
  bond: Bond3D;
  source: ProjectedAtom;
  target: ProjectedAtom;
  midX: number;
  midY: number;
  depth: number;
}

// Lighten / darken hex color helper for radial specular highlights
function adjustHexColor(hex: string, percent: number): string {
  const clean = hex.replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Check if a color is light or dark for optimal text contrast
function isColorLight(hex: string): boolean {
  const clean = hex.replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  const r = num >> 16;
  const g = (num >> 8) & 0x00ff;
  const b = num & 0x0000ff;
  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
}

/**
 * Mathematically projects the 3D molecular structure into a 2D vector SVG
 * matching the user's current 3D camera orientation, scale, and perspective.
 */
export function exportMoleculeToSvg({
  atoms,
  bonds,
  camera,
  moleculeGroup,
  vsepr,
  measurement,
  options = DEFAULT_SVG_OPTIONS,
}: {
  atoms: Atom3D[];
  bonds: Bond3D[];
  camera: THREE.PerspectiveCamera;
  moleculeGroup: THREE.Group;
  vsepr?: MolecularGeometry;
  measurement?: MeasurementSelection;
  options?: SvgExportOptions;
}): string {
  const {
    width,
    height,
    stylePreset,
    background,
    showSymbols,
    showIndices,
    showMeasurements,
    showLegend,
    atomScale,
    bondWidth,
    title,
    formula,
    iupacName,
  } = options;

  // Make sure matrices are up to date
  moleculeGroup.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);

  // 1. Project all atoms from 3D world space into 2D SVG canvas coordinates
  const projectedAtoms: ProjectedAtom[] = atoms.map((atom, index) => {
    const elem = getElement(atom.element);
    const worldPos = new THREE.Vector3(atom.x, atom.y, atom.z).applyMatrix4(moleculeGroup.matrixWorld);
    const ndc = worldPos.clone().project(camera);

    const screenX = ((ndc.x + 1) / 2) * width;
    const screenY = ((-ndc.y + 1) / 2) * height;

    // Calculate perspective-accurate screen radius
    const baseCovalentRadius = elem.covalentRadius || 0.7;
    // Scale factor for ball-and-stick look
    const physicalRadius = Math.max(0.28, Math.min(1.2, baseCovalentRadius * 0.45 * atomScale));

    // Get camera right vector in world space to project an orthogonal radius
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    const cameraRight = new THREE.Vector3().crossVectors(cameraDir, camera.up).normalize();

    const edgeWorld = worldPos.clone().addScaledVector(cameraRight, physicalRadius);
    const edgeNdc = edgeWorld.project(camera);
    const edgeScreenX = ((edgeNdc.x + 1) / 2) * width;
    const screenRadius = Math.max(7, Math.abs(edgeScreenX - screenX));

    return {
      atom,
      index,
      screenX,
      screenY,
      depth: ndc.z,
      screenRadius,
      color: elem.cpkColor || '#94A3B8',
      symbol: elem.symbol || atom.element,
      name: elem.name || atom.element,
    };
  });

  // 2. Project all bonds
  const projectedBonds: ProjectedBond[] = [];
  bonds.forEach((bond) => {
    const sAtom = projectedAtoms[bond.sourceIndex];
    const tAtom = projectedAtoms[bond.targetIndex];
    if (!sAtom || !tAtom) return;

    projectedBonds.push({
      bond,
      source: sAtom,
      target: tAtom,
      midX: (sAtom.screenX + tAtom.screenX) / 2,
      midY: (sAtom.screenY + tAtom.screenY) / 2,
      depth: (sAtom.depth + tAtom.depth) / 2,
    });
  });

  // Calculate average screen radius for proportional bond strokes
  const avgRadius =
    projectedAtoms.length > 0
      ? projectedAtoms.reduce((acc, a) => acc + a.screenRadius, 0) / projectedAtoms.length
      : 24;
  const baseBondStroke = Math.max(3.5, avgRadius * 0.28 * bondWidth);

  // 3. Collect SVG definitions (radial gradients for publication spheres, drop shadows)
  const defs: string[] = [];

  if (stylePreset === 'publication') {
    projectedAtoms.forEach((pAtom) => {
      const gradId = `atom-grad-${pAtom.index}`;
      const highlight = adjustHexColor(pAtom.color, 45);
      const deepColor = adjustHexColor(pAtom.color, -28);
      const darkRim = adjustHexColor(pAtom.color, -50);

      defs.push(`
    <radialGradient id="${gradId}" cx="32%" cy="32%" r="68%" fx="28%" fy="28%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
      <stop offset="18%" stop-color="${highlight}" />
      <stop offset="55%" stop-color="${pAtom.color}" />
      <stop offset="85%" stop-color="${deepColor}" />
      <stop offset="100%" stop-color="${darkRim}" />
    </radialGradient>`);
    });

    // Cylinder lighting gradients for bonds
    defs.push(`
    <filter id="subtle-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="3" flood-opacity="0.25" />
    </filter>`);
  } else if (stylePreset === 'dark') {
    projectedAtoms.forEach((pAtom) => {
      const gradId = `atom-dark-grad-${pAtom.index}`;
      const highlight = adjustHexColor(pAtom.color, 35);
      const shadow = adjustHexColor(pAtom.color, -35);

      defs.push(`
    <radialGradient id="${gradId}" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="25%" stop-color="${highlight}" />
      <stop offset="70%" stop-color="${pAtom.color}" />
      <stop offset="100%" stop-color="${shadow}" />
    </radialGradient>`);
    });
  }

  // 4. Build elements array for Depth Sorting (Painter's Algorithm)
  // Higher depth value in NDC (closer to +1.0) means further away from camera,
  // so sorting descending by depth renders furthest elements first, foreground on top!
  interface SvgDrawItem {
    depth: number;
    svgContent: string;
  }

  const drawItems: SvgDrawItem[] = [];

  // A. Render Bonds
  projectedBonds.forEach((pBond) => {
    const { source, target, bond, depth } = pBond;
    const dx = target.screenX - source.screenX;
    const dy = target.screenY - source.screenY;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return;

    const ux = dx / dist;
    const uy = dy / dist;
    // Normal vector perpendicular to bond line
    const nx = -uy;
    const ny = ux;

    // Boundary clipping: bond clips into atom circles slightly (0.88 * radius) to avoid white gaps
    const clipStart = source.screenRadius * 0.88;
    const clipEnd = target.screenRadius * 0.88;

    if (dist <= clipStart + clipEnd) return; // Atoms overlap tightly

    const startX = source.screenX + ux * clipStart;
    const startY = source.screenY + uy * clipStart;
    const endX = target.screenX - ux * clipEnd;
    const endY = target.screenY - uy * clipEnd;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    const order = bond.order || 1;
    const strokeWidth = baseBondStroke;
    const multiOffset = strokeWidth * 1.35;

    let bondSvg = '';

    const drawBondSegment = (x1: number, y1: number, x2: number, y2: number, isDashed = false) => {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;

      if (stylePreset === 'grayscale') {
        const dashAttr = isDashed ? 'stroke-dasharray="6,4"' : '';
        return `
      <line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" 
            stroke="#0f172a" stroke-width="${strokeWidth.toFixed(1)}" stroke-linecap="round" ${dashAttr} />`;
      }

      const colorA = stylePreset === 'dark' ? adjustHexColor(source.color, -10) : source.color;
      const colorB = stylePreset === 'dark' ? adjustHexColor(target.color, -10) : target.color;
      const dashAttr = isDashed ? 'stroke-dasharray="5,4"' : '';

      // Two-tone bond meeting at midpoint
      return `
      <g>
        <line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${mx.toFixed(2)}" y2="${my.toFixed(2)}" 
              stroke="${colorA}" stroke-width="${strokeWidth.toFixed(1)}" stroke-linecap="round" ${dashAttr} />
        <line x1="${mx.toFixed(2)}" y1="${my.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" 
              stroke="${colorB}" stroke-width="${strokeWidth.toFixed(1)}" stroke-linecap="round" ${dashAttr} />
      </g>`;
    };

    if (order === 1) {
      // Single bond
      bondSvg = drawBondSegment(startX, startY, endX, endY);
    } else if (order === 2) {
      // Double bond
      const offX = nx * (multiOffset / 2);
      const offY = ny * (multiOffset / 2);
      bondSvg = `
      <g>
        ${drawBondSegment(startX + offX, startY + offY, endX + offX, endY + offY)}
        ${drawBondSegment(startX - offX, startY - offY, endX - offX, endY - offY)}
      </g>`;
    } else if (order === 3) {
      // Triple bond
      const offX = nx * multiOffset;
      const offY = ny * multiOffset;
      bondSvg = `
      <g>
        ${drawBondSegment(startX, startY, endX, endY)}
        ${drawBondSegment(startX + offX, startY + offY, endX + offX, endY + offY)}
        ${drawBondSegment(startX - offX, startY - offY, endX - offX, endY - offY)}
      </g>`;
    } else {
      // Aromatic bond (order 1.5): one solid, one dashed
      const offX = nx * (multiOffset / 2);
      const offY = ny * (multiOffset / 2);
      bondSvg = `
      <g>
        ${drawBondSegment(startX + offX, startY + offY, endX + offX, endY + offY)}
        ${drawBondSegment(startX - offX, startY - offY, endX - offX, endY - offY, true)}
      </g>`;
    }

    drawItems.push({
      depth,
      svgContent: `<g id="bond-${bond.id}">${bondSvg}</g>`,
    });
  });

  // B. Render Atoms
  projectedAtoms.forEach((pAtom) => {
    const { screenX, screenY, screenRadius, color, symbol, index, depth } = pAtom;
    const r = screenRadius;

    let atomFill = color;
    let atomStroke = 'none';
    let atomStrokeWidth = 0;
    let filterAttr = '';

    if (stylePreset === 'publication') {
      atomFill = `url(#atom-grad-${index})`;
      atomStroke = 'rgba(15, 23, 42, 0.4)';
      atomStrokeWidth = 1.2;
      filterAttr = 'filter="url(#subtle-shadow)"';
    } else if (stylePreset === 'grayscale') {
      atomFill = '#ffffff';
      atomStroke = '#0f172a';
      atomStrokeWidth = 2.4;
    } else if (stylePreset === 'textbook') {
      atomFill = color;
      atomStroke = '#ffffff';
      atomStrokeWidth = 2.0;
    } else if (stylePreset === 'dark') {
      atomFill = `url(#atom-dark-grad-${index})`;
      atomStroke = adjustHexColor(color, 40);
      atomStrokeWidth = 1.4;
    }

    // Font styling
    const fontSize = Math.max(10, Math.min(26, r * 0.95));
    const textColor =
      stylePreset === 'grayscale'
        ? '#0f172a'
        : stylePreset === 'textbook'
        ? isColorLight(color)
          ? '#0f172a'
          : '#ffffff'
        : stylePreset === 'dark'
        ? '#f8fafc'
        : isColorLight(color)
        ? '#0f172a'
        : '#ffffff';

    const textShadow =
      stylePreset === 'publication'
        ? `<text x="${screenX.toFixed(2)}" y="${(screenY + fontSize * 0.35 + 1).toFixed(2)}" 
                text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" 
                font-weight="bold" font-size="${fontSize.toFixed(1)}px" 
                fill="rgba(0,0,0,0.4)">${symbol}</text>`
        : '';

    const symbolText = showSymbols
      ? `
      ${textShadow}
      <text x="${screenX.toFixed(2)}" y="${(screenY + fontSize * 0.35).toFixed(2)}" 
            text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, sans-serif" 
            font-weight="800" font-size="${fontSize.toFixed(1)}px" 
            fill="${textColor}">${symbol}</text>`
      : '';

    const indexBadge = showIndices
      ? `
      <g transform="translate(${(screenX + r * 0.65).toFixed(2)}, ${(screenY - r * 0.65).toFixed(2)})">
        <circle r="${Math.max(6, fontSize * 0.4).toFixed(1)}" fill="#0284c7" stroke="#ffffff" stroke-width="1" />
        <text y="${(fontSize * 0.15).toFixed(1)}" text-anchor="middle" font-family="sans-serif" font-weight="700" 
              font-size="${Math.max(6, fontSize * 0.35).toFixed(1)}px" fill="#ffffff">${index + 1}</text>
      </g>`
      : '';

    const atomSvg = `
    <g id="atom-${index}" data-element="${symbol}" data-atom-id="${pAtom.atom.id}">
      <circle cx="${screenX.toFixed(2)}" cy="${screenY.toFixed(2)}" r="${r.toFixed(2)}" 
              fill="${atomFill}" stroke="${atomStroke}" stroke-width="${atomStrokeWidth}" ${filterAttr} />
      ${symbolText}
      ${indexBadge}
    </g>`;

    drawItems.push({
      depth,
      svgContent: atomSvg,
    });
  });

  // C. Render Active Measurements (Distance / Bond Angle) if present and requested
  if (showMeasurements && measurement && measurement.atoms.length >= 2) {
    if (measurement.atoms.length === 2) {
      // 2-atom distance
      const [idxA, idxB] = measurement.atoms;
      const aA = projectedAtoms[idxA];
      const aB = projectedAtoms[idxB];
      if (aA && aB) {
        const mx = (aA.screenX + aB.screenX) / 2;
        const my = (aA.screenY + aB.screenY) / 2;
        const dx = aB.screenX - aA.screenX;
        const dy = aB.screenY - aA.screenY;
        const distPx = Math.hypot(dx, dy);
        const nx = -dy / (distPx || 1);
        const ny = dx / (distPx || 1);

        // Calculate 3D Euclidean distance in Angstroms
        const vA = new THREE.Vector3(aA.atom.x, aA.atom.y, aA.atom.z);
        const vB = new THREE.Vector3(aB.atom.x, aB.atom.y, aB.atom.z);
        const distAngstrom = vA.distanceTo(vB);

        const badgeX = mx + nx * 24;
        const badgeY = my + ny * 24;

        const measurementSvg = `
        <g id="measurement-distance" class="scientific-measurement">
          <!-- Guide line -->
          <line x1="${aA.screenX.toFixed(2)}" y1="${aA.screenX ? aA.screenY.toFixed(2) : '0'}" 
                x2="${aB.screenX.toFixed(2)}" y2="${aB.screenY.toFixed(2)}" 
                stroke="#0284c7" stroke-width="2" stroke-dasharray="4,4" />
          <!-- Measurement badge pill -->
          <g transform="translate(${badgeX.toFixed(2)}, ${badgeY.toFixed(2)})">
            <rect x="-42" y="-14" width="84" height="28" rx="14" 
                  fill="#0f172a" stroke="#0284c7" stroke-width="1.8" />
            <text y="4" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" 
                  font-weight="700" font-size="12px" fill="#7dd3fc">${distAngstrom.toFixed(3)} Å</text>
          </g>
        </g>`;

        drawItems.push({
          depth: Math.min(aA.depth, aB.depth) - 0.05, // Render on top of atoms
          svgContent: measurementSvg,
        });
      }
    } else if (measurement.atoms.length === 3) {
      // 3-atom bond angle
      const [idxA, idxVertex, idxC] = measurement.atoms;
      const aA = projectedAtoms[idxA];
      const aV = projectedAtoms[idxVertex];
      const aC = projectedAtoms[idxC];

      if (aA && aV && aC) {
        // Calculate 3D angle
        const vA = new THREE.Vector3(aA.atom.x, aA.atom.y, aA.atom.z).sub(
          new THREE.Vector3(aV.atom.x, aV.atom.y, aV.atom.z)
        );
        const vC = new THREE.Vector3(aC.atom.x, aC.atom.y, aC.atom.z).sub(
          new THREE.Vector3(aV.atom.x, aV.atom.y, aV.atom.z)
        );
        const angleRad = vA.angleTo(vC);
        const angleDeg = (angleRad * 180) / Math.PI;

        // 2D arc vectors from vertex
        const d1x = aA.screenX - aV.screenX;
        const d1y = aA.screenY - aV.screenY;
        const d2x = aC.screenX - aV.screenX;
        const d2y = aC.screenY - aV.screenY;
        const len1 = Math.hypot(d1x, d1y) || 1;
        const len2 = Math.hypot(d2x, d2y) || 1;

        const arcRadius = Math.min(48, Math.min(len1, len2) * 0.45);
        const p1x = aV.screenX + (d1x / len1) * arcRadius;
        const p1y = aV.screenY + (d1y / len1) * arcRadius;
        const p2x = aV.screenX + (d2x / len2) * arcRadius;
        const p2y = aV.screenY + (d2y / len2) * arcRadius;

        // Angle bisector for label position
        const bisX = d1x / len1 + d2x / len2;
        const bisY = d1y / len1 + d2y / len2;
        const bisLen = Math.hypot(bisX, bisY) || 1;
        const badgeX = aV.screenX + (bisX / bisLen) * (arcRadius + 28);
        const badgeY = aV.screenY + (bisY / bisLen) * (arcRadius + 28);

        const measurementSvg = `
        <g id="measurement-angle" class="scientific-measurement">
          <!-- Vertex ray guides -->
          <line x1="${aV.screenX.toFixed(2)}" y1="${aV.screenY.toFixed(2)}" x2="${aA.screenX.toFixed(2)}" y2="${aA.screenY.toFixed(2)}" 
                stroke="#10b981" stroke-width="1.8" stroke-dasharray="4,3" stroke-opacity="0.7" />
          <line x1="${aV.screenX.toFixed(2)}" y1="${aV.screenY.toFixed(2)}" x2="${aC.screenX.toFixed(2)}" y2="${aC.screenY.toFixed(2)}" 
                stroke="#10b981" stroke-width="1.8" stroke-dasharray="4,3" stroke-opacity="0.7" />
          <!-- Angle arc -->
          <path d="M ${p1x.toFixed(2)} ${p1y.toFixed(2)} A ${arcRadius.toFixed(2)} ${arcRadius.toFixed(2)} 0 0 1 ${p2x.toFixed(2)} ${p2y.toFixed(2)}" 
                fill="none" stroke="#10b981" stroke-width="2.5" />
          <!-- Measurement badge -->
          <g transform="translate(${badgeX.toFixed(2)}, ${badgeY.toFixed(2)})">
            <rect x="-46" y="-14" width="92" height="28" rx="14" 
                  fill="#0f172a" stroke="#10b981" stroke-width="1.8" />
            <text y="4" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" 
                  font-weight="700" font-size="12px" fill="#6ee7b7">${angleDeg.toFixed(1)}°</text>
          </g>
        </g>`;

        drawItems.push({
          depth: Math.min(aA.depth, Math.min(aV.depth, aC.depth)) - 0.05,
          svgContent: measurementSvg,
        });
      }
    }
  }

  // 5. Painter's Algorithm: Sort items from back to front (descending depth in NDC)
  drawItems.sort((a, b) => b.depth - a.depth);

  // 6. Background rect (if not transparent)
  let bgSvg = '';
  if (background === 'white') {
    bgSvg = `<rect width="${width}" height="${height}" fill="#ffffff" />`;
  } else if (background === 'dark') {
    bgSvg = `<rect width="${width}" height="${height}" fill="#0f172a" />`;
  }

  // 7. Research Paper Scientific Legend & Scale Bar (Optional)
  let legendSvg = '';
  if (showLegend) {
    const textColor = background === 'dark' || (background === 'transparent' && stylePreset === 'dark') ? '#94a3b8' : '#475569';
    const titleColor = background === 'dark' || (background === 'transparent' && stylePreset === 'dark') ? '#f8fafc' : '#0f172a';
    const displayTitle = title || 'Molecular Structure';
    const displayFormula = formula ? `(${formula})` : '';
    const displayIupac = iupacName ? `• ${iupacName}` : '';
    const vseprGeometry = vsepr?.molecularShape ? `• Geometry: ${vsepr.molecularShape}` : '';

    legendSvg = `
    <!-- Publication Header / Citation Legend -->
    <g id="publication-legend" transform="translate(32, ${height - 40})">
      <text x="0" y="0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
            font-size="16px" font-weight="700" fill="${titleColor}">
        ${escapeXml(displayTitle)} <tspan font-weight="400" fill="${textColor}">${escapeXml(displayFormula)}</tspan>
      </text>
      <text x="0" y="20" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
            font-size="11px" font-weight="500" fill="${textColor}">
        Vector projection rendered by Orbitalis ${escapeXml(displayIupac)} ${escapeXml(vseprGeometry)}
      </text>
    </g>`;
  }

  // Assemble full standalone SVG document
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 ${width} ${height}" 
     width="${width}" 
     height="${height}" 
     data-generator="Orbitalis 3D-to-SVG Vector Engine" 
     data-atom-count="${atoms.length}" 
     data-bond-count="${bonds.length}">
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:dc="http://purl.org/dc/elements/1.1/">
      <rdf:Description>
        <dc:title>${escapeXml(title || 'Molecular Structure')}</dc:title>
        <dc:description>Vector chemical graphic suitable for peer-reviewed publication</dc:description>
        <dc:format>image/svg+xml</dc:format>
        <dc:creator>Orbitalis Research Chemistry Suite</dc:creator>
      </rdf:Description>
    </rdf:RDF>
  </metadata>
  <defs>
    ${defs.join('\n')}
  </defs>
  ${bgSvg}
  <g id="molecule-vector-scene">
    ${drawItems.map((item) => item.svgContent).join('\n')}
  </g>
  ${legendSvg}
</svg>`.trim();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Triggers a browser download of the SVG file
 */
export function downloadSvgFile(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies SVG text markup to clipboard
 */
export async function copySvgToClipboard(svgString: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(svgString);
    return true;
  } catch (err) {
    console.error('Failed to copy SVG to clipboard:', err);
    return false;
  }
}
