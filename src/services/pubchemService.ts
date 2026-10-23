import { Atom3D, Bond3D, ChemicalProperties } from '../types/chemistry';
import { calculateChemicalProperties } from './chemistryEngine';

/**
 * Exponential backoff fetch helper with strict origin isolation and CSRF protection
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 2,
  baseDelayMs = 500
): Promise<Response> {
  // Enforce strict security policies on all outbound API requests
  const secureOptions: RequestInit = {
    mode: 'cors',
    credentials: 'omit', // Omit credentials to prevent CSRF / unauthorized cookie transmission
    referrerPolicy: 'strict-origin-when-cross-origin',
    ...options,
    headers: {
      Accept: 'application/json, text/plain, */*',
      ...(options.headers || {}),
    },
  };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, secureOptions);
      if (response.ok) return response;
      if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
        const retryAfter = Number(response.headers.get('Retry-After'));
        const delay = !Number.isNaN(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : baseDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      return response;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * Math.pow(2, attempt)));
    }
  }
  throw new Error(`Failed to fetch from ${url}`);
}

/**
 * Parse an MDL V2000 SDF string into 3D atoms and bonds
 */
export function parseSDF(sdfText: string): { atoms: Atom3D[]; bonds: Bond3D[] } {
  const lines = sdfText.split('\n');
  const atoms: Atom3D[] = [];
  const bonds: Bond3D[] = [];

  // V2000 counts line is usually line 4 (index 3)
  // e.g., " 13 13  0     0  0  0  0  0  0999 V2000"
  let countsLineIndex = -1;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    if (lines[i].includes('V2000')) {
      countsLineIndex = i;
      break;
    }
  }

  if (countsLineIndex === -1) {
    // Attempt fallback heuristic parsing for 3D coordinates
    return parseSDFHeuristic(lines);
  }

  const countsLine = lines[countsLineIndex];
  const atomCount = parseInt(countsLine.substring(0, 3).trim(), 10);
  const bondCount = parseInt(countsLine.substring(3, 6).trim(), 10);

  const atomStart = countsLineIndex + 1;
  for (let i = 0; i < atomCount && atomStart + i < lines.length; i++) {
    const line = lines[atomStart + i];
    const x = parseFloat(line.substring(0, 10).trim());
    const y = parseFloat(line.substring(10, 20).trim());
    const z = parseFloat(line.substring(20, 30).trim());
    const element = line.substring(31, 34).trim();

    if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z) && element) {
      atoms.push({
        id: i,
        element,
        x,
        y,
        z,
      });
    }
  }

  const bondStart = atomStart + atomCount;
  for (let i = 0; i < bondCount && bondStart + i < lines.length; i++) {
    const line = lines[bondStart + i];
    const sourceIdx = parseInt(line.substring(0, 3).trim(), 10) - 1;
    const targetIdx = parseInt(line.substring(3, 6).trim(), 10) - 1;
    const orderCode = parseInt(line.substring(6, 9).trim(), 10) || 1;

    let order = 1;
    if (orderCode === 2) order = 2;
    if (orderCode === 3) order = 3;
    if (orderCode === 4) order = 1.5; // aromatic

    if (sourceIdx >= 0 && targetIdx >= 0 && sourceIdx < atoms.length && targetIdx < atoms.length) {
      const a1 = atoms[sourceIdx];
      const a2 = atoms[targetIdx];
      const dist = Math.hypot(a1.x - a2.x, a1.y - a2.y, a1.z - a2.z);
      bonds.push({
        id: `b-${sourceIdx}-${targetIdx}`,
        sourceIndex: sourceIdx,
        targetIndex: targetIdx,
        order,
        length: Number(dist.toFixed(2)),
      });
    }
  }

  return { atoms, bonds };
}

function parseSDFHeuristic(lines: string[]): { atoms: Atom3D[]; bonds: Bond3D[] } {
  const atoms: Atom3D[] = [];
  const bonds: Bond3D[] = [];

  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].trim().split(/\s+/);
    if (parts.length >= 4) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      const z = parseFloat(parts[2]);
      const element = parts[3];

      if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z) && /^[A-Z][a-z]?$/.test(element)) {
        atoms.push({
          id: atoms.length,
          element,
          x,
          y,
          z,
        });
      }
    }
  }

  // Deduce bonds from covalent distances if none in file
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const d = Math.hypot(atoms[i].x - atoms[j].x, atoms[i].y - atoms[j].y, atoms[i].z - atoms[j].z);
      if (d > 0.4 && d < 1.9) {
        bonds.push({
          id: `b-${i}-${j}`,
          sourceIndex: i,
          targetIndex: j,
          order: 1,
          length: Number(d.toFixed(2)),
        });
      }
    }
  }

  return { atoms, bonds };
}

/**
 * Query PubChem for a molecule by formula or name
 */
export async function queryPubChem(
  query: string
): Promise<{ properties: ChemicalProperties; atoms: Atom3D[]; bonds: Bond3D[] } | null> {
  const clean = query.trim();
  if (!clean) return null;

  try {
    // 1. Resolve CID by name or fast formula
    let cid: number | null = null;
    let resolvedName = clean;

    const nameRes = await fetchWithRetry(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(clean)}/cids/JSON`
    );

    if (nameRes.ok) {
      const json = await nameRes.json();
      cid = json?.IdentifierList?.CID?.[0] || null;
    } else {
      // Try fast formula lookup
      const formulaRes = await fetchWithRetry(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastformula/${encodeURIComponent(clean)}/cids/JSON`
      );
      if (formulaRes.ok) {
        const json = await formulaRes.json();
        cid = json?.IdentifierList?.CID?.[0] || null;
      }
    }

    if (!cid) return null;

    // 2. Fetch properties
    const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,Complexity,IUPACName/JSON`;
    const propRes = await fetchWithRetry(propUrl);
    let pubProperties: any = {};

    if (propRes.ok) {
      const propJson = await propRes.json();
      pubProperties = propJson?.PropertyTable?.Properties?.[0] || {};
      if (pubProperties.IUPACName) resolvedName = pubProperties.IUPACName;
    }

    // 3. Fetch 3D Conformer SDF
    const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`;
    const sdfRes = await fetchWithRetry(sdfUrl);

    let parsed = { atoms: [] as Atom3D[], bonds: [] as Bond3D[] };
    if (sdfRes.ok) {
      const sdfText = await sdfRes.text();
      parsed = parseSDF(sdfText);
    }

    // Merge calculated baseline properties with PubChem authoritative data
    const formulaStr = pubProperties.MolecularFormula || clean;
    const baseProps = calculateChemicalProperties(formulaStr, resolvedName);

    const mergedProps: ChemicalProperties = {
      ...baseProps,
      cid,
      formula: formulaStr,
      name: resolvedName,
      iupacName: pubProperties.IUPACName || resolvedName,
      smiles: pubProperties.CanonicalSMILES,
      inchiKey: pubProperties.InChIKey,
      molecularWeight: pubProperties.MolecularWeight ? parseFloat(pubProperties.MolecularWeight) : baseProps.molecularWeight,
      xlogp: pubProperties.XLogP !== undefined ? pubProperties.XLogP : baseProps.xlogp,
      tpsa: pubProperties.TPSA !== undefined ? pubProperties.TPSA : baseProps.tpsa,
      hBondDonorCount: pubProperties.HBondDonorCount !== undefined ? pubProperties.HBondDonorCount : baseProps.hBondDonorCount,
      hBondAcceptorCount: pubProperties.HBondAcceptorCount !== undefined ? pubProperties.HBondAcceptorCount : baseProps.hBondAcceptorCount,
      rotatableBondCount: pubProperties.RotatableBondCount !== undefined ? pubProperties.RotatableBondCount : baseProps.rotatableBondCount,
      complexity: pubProperties.Complexity !== undefined ? pubProperties.Complexity : baseProps.complexity,
      provenance: parsed.atoms.length > 0 ? 'PubChem 3D Conformer (Verified)' : 'VSEPR Ab Initio Calculated Model',
      sourceUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
    };

    return {
      properties: mergedProps,
      atoms: parsed.atoms,
      bonds: parsed.bonds,
    };
  } catch (err) {
    console.warn('PubChem fetch failed, will fallback to local calculations:', err);
    return null;
  }
}
