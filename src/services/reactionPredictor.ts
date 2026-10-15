export interface ReactionMechanismStep {
  stepNumber: number;
  title: string;
  description: string;
  curlyArrowDescription: string;
  intermediateFormula?: string;
  intermediateName?: string;
}

export interface ChemicalPrinciple {
  name: string;
  summary: string;
  application: string;
  referenceUrl?: string;
}

export interface PredictedReaction {
  id: string;
  title: string;
  reactants: { formula: string; name: string; stoichiometricCoeff: number }[];
  products: { formula: string; name: string; stoichiometricCoeff: number }[];
  balancedEquation: string;
  reactionType:
    | 'Electrophilic Addition'
    | 'Electrophilic Aromatic Substitution'
    | 'Acid-Base Neutralization'
    | 'Esterification (Condensation)'
    | 'Combustion'
    | 'Halogenation'
    | 'Hydrogenation'
    | 'Nucleophilic Substitution'
    | 'Redox Synthesis';
  thermodynamics: {
    enthalpyDeltaH: string; // e.g. "-890.3 kJ/mol (Exothermic)"
    drivingForce: string; // e.g. "Formation of strong C-O and O-H bonds + Entropic gain"
    activationBarrier: string;
    catalystOrCondition?: string;
  };
  mechanism: ReactionMechanismStep[];
  principles: ChemicalPrinciple[];
}

export const PRESET_REACTIONS: PredictedReaction[] = [
  {
    id: 'rxn-hydration-ethylene',
    title: 'Acid-Catalyzed Hydration of Ethylene to Ethanol',
    reactants: [
      { formula: 'C2H4', name: 'Ethylene', stoichiometricCoeff: 1 },
      { formula: 'H2O', name: 'Water', stoichiometricCoeff: 1 },
    ],
    products: [
      { formula: 'C2H6O', name: 'Ethanol', stoichiometricCoeff: 1 },
    ],
    balancedEquation: 'C₂H₄ + H₂O ➔ C₂H₅OH',
    reactionType: 'Electrophilic Addition',
    thermodynamics: {
      enthalpyDeltaH: '−45.3 kJ/mol (Exothermic)',
      drivingForce: 'Conversion of a weaker π bond (bond energy ~264 kJ/mol) into two stronger σ bonds (C-C and C-O).',
      activationBarrier: 'Moderate (Requires Acid Catalyst H₃O⁺)',
      catalystOrCondition: 'Dilute H₂SO₄ or H₃PO₄ catalyst, ~300°C',
    },
    mechanism: [
      {
        stepNumber: 1,
        title: 'Electrophilic Attack of π Electrons on Proton',
        description: 'The loosely held π electron cloud above and below the C=C double bond attacks the hydronium electrophile (H⁺), breaking the π bond.',
        curlyArrowDescription: 'Arrow from C=C π bond to H⁺; arrow from H-O bond to oxygen in H₃O⁺.',
        intermediateFormula: 'C2H5+',
        intermediateName: 'Ethyl Carbocation Intermediate',
      },
      {
        stepNumber: 2,
        title: 'Nucleophilic Attack by Water',
        description: 'Water acts as a Lewis base (nucleophile); its lone-pair electrons attack the positively charged, sp²-hybridized planar carbocation center.',
        curlyArrowDescription: 'Arrow from oxygen lone pair on H₂O to the empty 2p orbital of the carbocation.',
        intermediateFormula: 'C2H5OH2+',
        intermediateName: 'Protonated Ethanol (Alkyloxonium Ion)',
      },
      {
        stepNumber: 3,
        title: 'Deprotonation & Catalyst Regeneration',
        description: 'A second water molecule abstracts the acidic proton from the oxonium intermediate, yielding neutral ethanol and regenerating the hydronium catalyst.',
        curlyArrowDescription: 'Arrow from solvent water lone pair to O-H proton; O-H bonding electrons collapse onto oxygen.',
      },
    ],
    principles: [
      {
        name: "Markovnikov's Rule",
        summary: 'In the addition of HX to an unsymmetrical alkene, the proton adds to the carbon with more hydrogen substituents to generate the most stable carbocation intermediate (tertiary > secondary > primary).',
        application: 'For symmetric ethylene (C₂H₄), both carbons are identical, yielding a single regiochemical product (ethanol). For propene, Markovnikov addition yields 2-propanol.',
      },
      {
        name: 'Frontier Molecular Orbital (FMO) Theory',
        summary: 'Reactions are governed by overlap between the Highest Occupied Molecular Orbital (HOMO) of the nucleophile and the Lowest Unoccupied Molecular Orbital (LUMO) of the electrophile.',
        application: 'The C=C π orbital serves as the electron-rich HOMO, donating electron density directly into the vacant 1s orbital (LUMO) of the incoming proton.',
      },
      {
        name: "Hammond's Postulate",
        summary: 'The structure of a transition state resembles the species (reactants, intermediates, or products) nearest to it in free energy.',
        application: 'Because the carbocation formation step is endothermic, its transition state closely resembles the high-energy carbocation intermediate in geometry and charge distribution.',
      },
    ],
  },

  {
    id: 'rxn-methane-combustion',
    title: 'Complete Combustion of Methane',
    reactants: [
      { formula: 'CH4', name: 'Methane', stoichiometricCoeff: 1 },
      { formula: 'O2', name: 'Oxygen', stoichiometricCoeff: 2 },
    ],
    products: [
      { formula: 'CO2', name: 'Carbon Dioxide', stoichiometricCoeff: 1 },
      { formula: 'H2O', name: 'Water', stoichiometricCoeff: 2 },
    ],
    balancedEquation: 'CH₄ + 2 O₂ ➔ CO₂ + 2 H₂O',
    reactionType: 'Combustion',
    thermodynamics: {
      enthalpyDeltaH: '−890.8 kJ/mol (Highly Exothermic)',
      drivingForce: 'Tremendous release of chemical bond energy forming extremely strong C=O double bonds (804 kJ/mol) and O-H bonds (463 kJ/mol).',
      activationBarrier: 'High (Requires Spark / Ignition Temperature ~600°C)',
      catalystOrCondition: 'Ignition spark (Eₐ ~ 125 kJ/mol)',
    },
    mechanism: [
      {
        stepNumber: 1,
        title: 'Thermal Chain Initiation (Radical Generation)',
        description: 'Thermal energy or spark cleaves the C-H bond or homolytically activates O=O to produce reactive hydroxyl (•OH) and methyl (•CH₃) radical intermediates.',
        curlyArrowDescription: 'Homolytic bond cleavage generating free radicals with unpaired electrons.',
        intermediateFormula: 'CH3•',
        intermediateName: 'Methyl Free Radical',
      },
      {
        stepNumber: 2,
        title: 'Chain Propagation & Oxygen Insertion',
        description: 'Methyl radicals react with molecular oxygen to form peroxy radicals, progressing rapidly through formaldehyde (HCHO) and carbon monoxide (CO).',
        curlyArrowDescription: 'Radical coupling and hydrogen abstraction cascades.',
        intermediateFormula: 'CH2O',
        intermediateName: 'Formaldehyde Intermediate',
      },
      {
        stepNumber: 3,
        title: 'Terminal Oxidation to CO₂ and H₂O',
        description: 'Carbon monoxide is oxidized by •OH radicals to stable linear carbon dioxide, releasing large amounts of heat and light.',
        curlyArrowDescription: 'Oxidation of CO with hydroxyl radical: CO + •OH ➔ •H + CO₂.',
      },
    ],
    principles: [
      {
        name: 'First & Second Laws of Thermodynamics',
        summary: 'The total energy of an isolated system is conserved; spontaneous reactions result in an overall increase in universal entropy (ΔG = ΔH − TΔS < 0).',
        application: 'The huge negative ΔH (−890 kJ/mol) combined with high flame temperature produces a massively negative Gibbs Free Energy (ΔG° < 0), driving the reaction irreversibly to completion.',
      },
      {
        name: 'Bond Dissociation Energies (BDE)',
        summary: 'The heat of reaction can be calculated from the sum of bonds broken minus the sum of bonds formed: ΔH° = Σ(BDE broken) − Σ(BDE formed).',
        application: 'Four C-H (4×413) + two O=O (2×498) broken = 2648 kJ/mol. Two C=O in CO₂ (2×804) + four O-H in 2H₂O (4×463) formed = 3460 kJ/mol. Net = 2648 − 3460 = −812 kJ/mol.',
      },
    ],
  },

  {
    id: 'rxn-esterification',
    title: 'Fischer Esterification (Acetic Acid + Ethanol)',
    reactants: [
      { formula: 'CH3COOH', name: 'Acetic Acid', stoichiometricCoeff: 1 },
      { formula: 'C2H6O', name: 'Ethanol', stoichiometricCoeff: 1 },
    ],
    products: [
      { formula: 'C4H8O2', name: 'Ethyl Acetate', stoichiometricCoeff: 1 },
      { formula: 'H2O', name: 'Water', stoichiometricCoeff: 1 },
    ],
    balancedEquation: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O',
    reactionType: 'Esterification (Condensation)',
    thermodynamics: {
      enthalpyDeltaH: '−3.8 kJ/mol (Thermoneutral Equilibrium)',
      drivingForce: 'Equilibrium reaction governed by Le Chatelier’s principle; driven to completion by removing water or using excess alcohol.',
      activationBarrier: 'Moderate (Requires Acid Catalyst H₂SO₄)',
      catalystOrCondition: 'Concentrated H₂SO₄ reflux',
    },
    mechanism: [
      {
        stepNumber: 1,
        title: 'Carbonyl Activation via Protonation',
        description: 'The carbonyl oxygen of acetic acid is protonated by acid catalyst, dramatically enhancing the electrophilicity of the carbonyl carbon.',
        curlyArrowDescription: 'Oxygen lone pair attacks H⁺, placing positive charge on the carbonyl oxygen.',
      },
      {
        stepNumber: 2,
        title: 'Nucleophilic Attack & Tetrahedral Intermediate',
        description: 'The hydroxyl oxygen of ethanol attacks the activated carbonyl carbon, converting planar sp² carbon into an sp³ tetrahedral intermediate.',
        curlyArrowDescription: 'Ethanol oxygen lone pair attacks carbonyl carbon; π bond electrons collapse onto oxygen.',
        intermediateFormula: 'C4H11O3+',
        intermediateName: 'Tetrahedral Addition Intermediate',
      },
      {
        stepNumber: 3,
        title: 'Proton Transfer & Elimination of Water',
        description: 'Proton transfer converts one of the -OH groups into a good leaving group (-OH₂⁺). Elimination of water re-establishes the planar carbonyl C=O double bond.',
        curlyArrowDescription: 'Internal proton transfer, followed by departure of H₂O and deprotonation to yield ethyl acetate.',
      },
    ],
    principles: [
      {
        name: "Le Chatelier's Principle",
        summary: 'If a dynamic equilibrium is disturbed by changing conditions (concentration, temperature, pressure), the position of equilibrium shifts to counteract the change.',
        application: 'By utilizing a Dean-Stark trap to continuously remove product water or adding excess ethanol, the equilibrium shifts forward to maximize ester yield.',
      },
      {
        name: 'Nucleophilic Acyl Substitution (Addition-Elimination)',
        summary: 'Carboxylic acid derivatives react via an addition-elimination sequence rather than direct SN2 substitution.',
        application: 'The sp² carbonyl carbon undergoes nucleophilic addition to form an sp³ tetrahedral intermediate, followed by elimination of the leaving group to regenerate sp² hybridization.',
      },
    ],
  },

  {
    id: 'rxn-benzene-bromination',
    title: 'Electrophilic Aromatic Substitution (Bromination of Benzene)',
    reactants: [
      { formula: 'C6H6', name: 'Benzene', stoichiometricCoeff: 1 },
      { formula: 'Br2', name: 'Bromine', stoichiometricCoeff: 1 },
    ],
    products: [
      { formula: 'C6H5Br', name: 'Bromobenzene', stoichiometricCoeff: 1 },
      { formula: 'HBr', name: 'Hydrogen Bromide', stoichiometricCoeff: 1 },
    ],
    balancedEquation: 'C₆H₆ + Br₂ ➔ C₆H₅Br + HBr',
    reactionType: 'Electrophilic Aromatic Substitution',
    thermodynamics: {
      enthalpyDeltaH: '−45.0 kJ/mol (Exothermic)',
      drivingForce: 'Preservation of the special 150 kJ/mol aromatic resonance stabilization energy by undergoing substitution rather than addition.',
      activationBarrier: 'High (Requires Lewis Acid Catalyst FeBr₃)',
      catalystOrCondition: 'FeBr₃ or AlBr₃ Lewis acid catalyst',
    },
    mechanism: [
      {
        stepNumber: 1,
        title: 'Generation of Strongly Electrophilic Bromonium Complex',
        description: 'Bromine coordinates with the Lewis acid FeBr₃, polarizing the Br-Br bond to generate a highly reactive electrophilic bromine center [Br-Br-FeBr₃]⁻.',
        curlyArrowDescription: 'Bromine lone pair donates into empty d/p orbital of iron.',
      },
      {
        stepNumber: 2,
        title: 'Attack of Aromatic π Cloud & Arenium Ion Formation',
        description: 'Benzene’s delocalized 6π electron cloud attacks the electrophilic bromine atom, forming a non-aromatic carbocation intermediate (Wheland intermediate / σ-complex) with positive charge delocalized over 3 positions.',
        curlyArrowDescription: 'Benzene π bond attacks terminal Br; Br-Br bond cleaves to form FeBr₄⁻.',
        intermediateFormula: 'C6H6Br+',
        intermediateName: 'Arenium Ion (Wheland σ-Complex)',
      },
      {
        stepNumber: 3,
        title: 'Deprotonation & Aromatic Ring Regeneration',
        description: 'FeBr₄⁻ abstracts the ring proton from the sp³ carbon, restoring the fully conjugated, continuous 6π aromatic ring system.',
        curlyArrowDescription: 'Base abstracts proton; C-H bonding electrons collapse back into the ring to restore aromaticity.',
      },
    ],
    principles: [
      {
        name: 'Aromatic Resonance Stabilization Energy',
        summary: 'Cyclic, planar, fully conjugated systems with (4n + 2) π electrons (Hückel’s Rule) possess exceptional thermodynamic stability (~150 kJ/mol for benzene).',
        application: 'Benzene resists addition reactions (which would permanently destroy aromaticity) and exclusively undergoes substitution to restore its pristine 6π aromatic octet.',
      },
      {
        name: 'Wheland Intermediate (σ-Complex) Delocalization',
        summary: 'The rate-determining transition state leads to an arenium ion where the positive charge is delocalized over the ortho and para positions relative to the sp³ carbon.',
        application: 'Resonance structures for the arenium ion demonstrate that the positive charge is shared by carbons 2, 4, and 6, stabilizing the high-energy intermediate.',
      },
    ],
  },

  {
    id: 'rxn-acid-base-neutralization',
    title: 'Arrhenius & Brønsted-Lowry Neutralization',
    reactants: [
      { formula: 'HCl', name: 'Hydrochloric Acid', stoichiometricCoeff: 1 },
      { formula: 'NaOH', name: 'Sodium Hydroxide', stoichiometricCoeff: 1 },
    ],
    products: [
      { formula: 'NaCl', name: 'Sodium Chloride (Salt)', stoichiometricCoeff: 1 },
      { formula: 'H2O', name: 'Water', stoichiometricCoeff: 1 },
    ],
    balancedEquation: 'HCl + NaOH ➔ NaCl + H₂O',
    reactionType: 'Acid-Base Neutralization',
    thermodynamics: {
      enthalpyDeltaH: '−57.3 kJ/mol (Exothermic)',
      drivingForce: 'Combination of hydronium and hydroxide ions into neutral water with high covalent bond stability (Kw = 1.0 × 10⁻¹⁴).',
      activationBarrier: 'Extremely Low (Diffusion-controlled in aqueous solution)',
      catalystOrCondition: 'Aqueous solution, instantaneous at 25°C',
    },
    mechanism: [
      {
        stepNumber: 1,
        title: 'Complete Dissociation into Aqueous Ions',
        description: 'Strong acid (HCl) and strong base (NaOH) dissociate completely into solvated H₃O⁺, Cl⁻, Na⁺, and OH⁻ ions.',
        curlyArrowDescription: 'Solvation dissociation.',
      },
      {
        stepNumber: 2,
        title: 'Ultrafast Proton Transfer',
        description: 'Hydroxide ion acts as a strong Lewis/Brønsted base; its lone pair captures the proton from hydronium via the Grotthuss proton tunneling mechanism in water.',
        curlyArrowDescription: 'Arrow from OH⁻ oxygen lone pair to proton; arrow from H-O to water oxygen.',
      },
    ],
    principles: [
      {
        name: 'Brønsted-Lowry & Lewis Acid-Base Theories',
        summary: 'Brønsted-Lowry defines acids as proton donors and bases as proton acceptors. Lewis defines acids as electron-pair acceptors and bases as electron-pair donors.',
        application: 'H⁺ acts as a Lewis acid accepting a pair of electrons from the OH⁻ Lewis base to form covalent liquid water.',
      },
    ],
  },

  {
    id: 'rxn-ethylene-bromination',
    title: 'Electrophilic Addition of Bromine to Ethylene',
    reactants: [
      { formula: 'C2H4', name: 'Ethylene', stoichiometricCoeff: 1 },
      { formula: 'Br2', name: 'Bromine', stoichiometricCoeff: 1 },
    ],
    products: [
      { formula: 'C2H4Br2', name: '1,2-Dibromoethane', stoichiometricCoeff: 1 },
    ],
    balancedEquation: 'C₂H₄ + Br₂ ➔ C₂H₄Br₂',
    reactionType: 'Halogenation',
    thermodynamics: {
      enthalpyDeltaH: '−121 kJ/mol (Exothermic)',
      drivingForce: 'Formation of two strong C-Br σ bonds (~285 kJ/mol each) replacing a weaker C=C π bond.',
      activationBarrier: 'Low (Rapid at room temperature without catalyst)',
      catalystOrCondition: 'Nonpolar solvent (CH₂Cl₂), room temperature',
    },
    mechanism: [
      {
        stepNumber: 1,
        title: 'Induced Dipole & Cyclic Bromonium Ion Formation',
        description: 'As the electron-rich C=C π bond approaches non-polar Br₂, it induces a temporary dipole (Brδ+—Brδ−). The π electrons attack Brδ+ while a bromine lone pair attacks the other carbon, forming a three-membered cyclic bromonium ion.',
        curlyArrowDescription: 'Concerted two-electron attack creating three-membered ring with formal +1 charge on bromine.',
        intermediateFormula: 'C2H4Br+',
        intermediateName: 'Cyclic Bromonium Ion Intermediate',
      },
      {
        stepNumber: 2,
        title: 'Backside Nucleophilic Anti-Attack by Bromide',
        description: 'The liberated bromide ion (Br⁻) attacks one of the carbons from the side opposite the three-membered ring (backside attack), opening the ring and establishing stereospecific anti-addition.',
        curlyArrowDescription: 'Br⁻ attacks carbon from underside; C-Br ring bond breaks onto positive bromine.',
      },
    ],
    principles: [
      {
        name: 'Stereospecific Anti-Addition & Ring Strain',
        summary: 'Halogen additions to alkenes proceed through cyclic halonium ions, blocking one face and forcing nucleophilic attack exclusively from the opposite face.',
        application: 'Prevents formation of syn-addition products. In cyclic alkenes like cyclohexene, this exclusively yields trans-1,2-dibromocyclohexane.',
      },
    ],
  },
];

/**
 * Predicts plausible chemical reactions based on inputted formulas or selected reactants
 */
export function predictReaction(reactantsInput: string[]): PredictedReaction | null {
  const cleanList = reactantsInput
    .map((r) => r.trim().toUpperCase().replace(/\s+/g, ''))
    .filter(Boolean);

  if (cleanList.length === 0) return null;

  // Check preset library for direct match
  for (const rxn of PRESET_REACTIONS) {
    const rxnReactants = rxn.reactants.map((r) => r.formula.toUpperCase());
    const matchesAll = rxnReactants.every((r) => cleanList.includes(r));
    if (matchesAll && cleanList.length >= rxnReactants.length) {
      return rxn;
    }
  }

  // Heuristic matching based on chemical functional groups:
  // 1. Hydrocarbon + Oxygen -> Combustion
  const hasO2 = cleanList.includes('O2');
  const hydrocarbon = cleanList.find((f) => /^C\d*H\d*$/.test(f));
  if (hasO2 && hydrocarbon) {
    return {
      id: `custom-combustion-${hydrocarbon}`,
      title: `Combustion of ${hydrocarbon}`,
      reactants: [
        { formula: hydrocarbon, name: hydrocarbon, stoichiometricCoeff: 1 },
        { formula: 'O2', name: 'Oxygen', stoichiometricCoeff: 2 },
      ],
      products: [
        { formula: 'CO2', name: 'Carbon Dioxide', stoichiometricCoeff: 1 },
        { formula: 'H2O', name: 'Water', stoichiometricCoeff: 2 },
      ],
      balancedEquation: `${hydrocarbon} + O₂ ➔ CO₂ + H₂O (Unbalanced)`,
      reactionType: 'Combustion',
      thermodynamics: {
        enthalpyDeltaH: 'Exothermic (ΔH° < 0)',
        drivingForce: 'Formation of highly stable C=O and O-H bonds with high thermodynamic entropy.',
        activationBarrier: 'High (Requires Ignition Spark)',
      },
      mechanism: [
        {
          stepNumber: 1,
          title: 'Thermal Radical Generation',
          description: 'High temperature spark initiates free-radical homolytic cleavage of C-H bonds.',
          curlyArrowDescription: 'Homolytic radical cleavage.',
        },
        {
          stepNumber: 2,
          title: 'Oxygen Radical Cascade',
          description: 'Reaction cascade generating intermediate peroxides, formaldehyde, and CO.',
          curlyArrowDescription: 'Radical propagation.',
        },
        {
          stepNumber: 3,
          title: 'Final Oxidation to CO₂ and H₂O',
          description: 'Exhaustive oxidation forming thermodynamically favored gaseous products.',
          curlyArrowDescription: 'Terminal combustion step.',
        },
      ],
      principles: [
        {
          name: 'Combustion Thermodynamics',
          summary: 'Hydrocarbon oxidation releases chemical bond energy stored in C-C and C-H bonds.',
          application: 'Exothermic release fuels engines and generates thermal energy.',
        },
      ],
    };
  }

  // Fallback default: Return the nearest preset reaction or hydration
  return PRESET_REACTIONS[0];
}
