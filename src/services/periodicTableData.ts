export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export interface PeriodicElement {
  number: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: ElementCategory;
  period: number;
  group: number; // 1-18
  block: 's' | 'p' | 'd' | 'f';
  electronConfiguration: string;
  electronsPerShell: number[];
  electronegativity?: number; // Pauling
  atomicRadius?: number; // pm
  covalentRadius?: number; // pm
  vdwRadius?: number; // pm
  ionizationEnergy?: number; // kJ/mol
  electronAffinity?: number; // kJ/mol
  oxidationStates: number[];
  standardState: 'Solid' | 'Liquid' | 'Gas' | 'Expected Solid' | 'Expected Gas';
  meltingPointK?: number;
  boilingPointK?: number;
  density?: number; // g/cm³ or g/L
  discoveryYear: number | string;
  discoverer: string;
  cpkColor: string;
  summary: string;
}

export const CATEGORY_COLORS: Record<ElementCategory, { bg: string; text: string; border: string; name: string }> = {
  'alkali-metal': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', name: 'Alkali Metals' },
  'alkaline-earth': { bg: '#ffedd5', text: '#9a3412', border: '#fdba74', name: 'Alkaline Earth Metals' },
  'transition-metal': { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', name: 'Transition Metals' },
  'post-transition-metal': { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc', name: 'Post-Transition Metals' },
  'metalloid': { bg: '#ccfbf1', text: '#115e59', border: '#5eead4', name: 'Metalloids' },
  'reactive-nonmetal': { bg: '#dcfce7', text: '#166534', border: '#86efac', name: 'Reactive Nonmetals' },
  'noble-gas': { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe', name: 'Noble Gases' },
  'lanthanide': { bg: '#fae8ff', text: '#86198f', border: '#f0abfc', name: 'Lanthanides' },
  'actinide': { bg: '#ffe4e6', text: '#9f1239', border: '#fda4af', name: 'Actinides' },
  'unknown': { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', name: 'Superheavy / Synthetic' },
};

// Raw compact element tuples: [number, symbol, name, mass, category, period, group, block, config, en, en_affinity, radius, cov_radius, ion_energy, state, meltK, boilK, density, year, discoverer, cpk, summary]
const RAW_ELEMENTS_DATA: Array<[
  number, string, string, number, ElementCategory, number, number, 's'|'p'|'d'|'f', string, number | undefined, number | undefined, number | undefined, number | undefined, number | undefined, 'Solid'|'Liquid'|'Gas'|'Expected Solid'|'Expected Gas', number | undefined, number | undefined, number | undefined, number | string, string, string, string
]> = [
  // Period 1
  [1, 'H', 'Hydrogen', 1.008, 'reactive-nonmetal', 1, 1, 's', '1s¹', 2.20, 72.8, 53, 31, 1312, 'Gas', 14.01, 20.28, 0.00008988, 1766, 'Henry Cavendish', '#FFFFFF', 'Most abundant element in the universe (~75% of normal matter). Essential component of water, organic compounds, and stellar fusion.'],
  [2, 'He', 'Helium', 4.0026, 'noble-gas', 1, 18, 's', '1s²', undefined, -48, 31, 28, 2372, 'Gas', 0.95, 4.22, 0.0001785, 1868, 'Pierre Janssen, Norman Lockyer', '#D9FFFF', 'Colorless, odorless noble gas. Second most abundant element in universe. Unrivaled coolant for MRI superconducting magnets.'],

  // Period 2
  [3, 'Li', 'Lithium', 6.94, 'alkali-metal', 2, 1, 's', '[He] 2s¹', 0.98, 59.6, 167, 128, 520, 'Solid', 453.69, 1603, 0.534, 1817, 'Johan August Arfwedson', '#CC80FF', 'Lightest metal and least dense solid element. Essential for high-voltage rechargeable lithium-ion battery technology.'],
  [4, 'Be', 'Beryllium', 9.0122, 'alkaline-earth', 2, 2, 's', '[He] 2s²', 1.57, -50, 112, 96, 899, 'Solid', 1560, 2742, 1.85, 1798, 'Louis Nicolas Vauquelin', '#C2FF00', 'Lightweight, stiff metal transparent to X-rays. Key structural element in James Webb Space Telescope mirrors.'],
  [5, 'B', 'Boron', 10.81, 'metalloid', 2, 13, 'p', '[He] 2s² 2p¹', 2.04, 26.7, 87, 84, 801, 'Solid', 2349, 4200, 2.34, 1808, 'Joseph Louis Gay-Lussac', '#FFB5B5', 'Metalloid semiconductor. Important Lewis acid center, borosilicate glass component, and control rod neutron absorber.'],
  [6, 'C', 'Carbon', 12.011, 'reactive-nonmetal', 2, 14, 'p', '[He] 2s² 2p²', 2.55, 121.8, 67, 76, 1086, 'Solid', 3823, 4300, 2.267, 'Ancient', 'Known to ancients', '#334155', 'Cornerstone of life and organic chemistry. Forms diamond, graphite, graphene, carbon nanotubes, and fullerenes.'],
  [7, 'N', 'Nitrogen', 14.007, 'reactive-nonmetal', 2, 15, 'p', '[He] 2s² 2p³', 3.04, -6.8, 56, 71, 1402, 'Gas', 63.15, 77.36, 0.0012506, 1772, 'Daniel Rutherford', '#2563EB', 'Comprises ~78% of Earth’s atmosphere. N≡N triple bond makes it stable; essential in amino acids and nucleotides.'],
  [8, 'O', 'Oxygen', 15.999, 'reactive-nonmetal', 2, 16, 'p', '[He] 2s² 2p⁴', 3.44, 141.0, 48, 66, 1314, 'Gas', 54.36, 90.20, 0.001429, 1774, 'Priestley & Scheele', '#DC2626', 'Highly reactive electronegative nonmetal forming oxides. Essential for aerobic respiration and water formation.'],
  [9, 'F', 'Fluorine', 18.998, 'reactive-nonmetal', 2, 17, 'p', '[He] 2s² 2p⁵', 3.98, 328.0, 42, 57, 1681, 'Gas', 53.53, 85.03, 0.001696, 1886, 'Henri Moissan', '#10B981', 'The most electronegative and chemically reactive of all elements. Extremely strong oxidizer, Teflon precursor.'],
  [10, 'Ne', 'Neon', 20.180, 'noble-gas', 2, 18, 'p', '[He] 2s² 2p⁶', undefined, -116, 38, 58, 2081, 'Gas', 24.56, 27.07, 0.0009002, 1898, 'Ramsay & Travers', '#B3E3F5', 'Colorless noble gas that glows reddish-orange in high-voltage discharge tubes. Chemically unreactive.'],

  // Period 3
  [11, 'Na', 'Sodium', 22.990, 'alkali-metal', 3, 1, 's', '[Ne] 3s¹', 0.93, 52.8, 190, 166, 496, 'Solid', 370.87, 1156, 0.968, 1807, 'Humphry Davy', '#8B5CF6', 'Soft silvery alkali metal reacting vigorously with water. Key physiological electrolyte driving nerve action potentials.'],
  [12, 'Mg', 'Magnesium', 24.305, 'alkaline-earth', 3, 2, 's', '[Ne] 3s²', 1.31, -40, 145, 141, 738, 'Solid', 923, 1363, 1.738, 1755, 'Joseph Black', '#15803D', 'Lightweight structural metal. Central coordinating cation in chlorophyll and essential cofactor in cellular ATP hydrolysis.'],
  [13, 'Al', 'Aluminium', 26.982, 'post-transition-metal', 3, 13, 'p', '[Ne] 3s² 3p¹', 1.61, 42.5, 118, 121, 578, 'Solid', 933.47, 2792, 2.70, 1825, 'Hans Christian Ørsted', '#BFA6A6', 'Most abundant metal in Earth’s crust (8%). Outstanding strength-to-weight ratio and corrosion resistance via Al₂O₃.'],
  [14, 'Si', 'Silicon', 28.085, 'metalloid', 3, 14, 'p', '[Ne] 3s² 3p²', 1.90, 134.1, 111, 111, 786, 'Solid', 1687, 3538, 2.329, 1824, 'Jöns Jacob Berzelius', '#F0C8A0', 'The foundational semiconductor material driving modern digital computation, solar photovoltaics, and silicate geology.'],
  [15, 'P', 'Phosphorus', 30.974, 'reactive-nonmetal', 3, 15, 'p', '[Ne] 3s² 3p³', 2.19, 72.0, 98, 107, 1012, 'Solid', 317.3, 553.6, 1.823, 1669, 'Hennig Brand', '#EA580C', 'Crucial component of DNA/RNA sugar-phosphate backbone, ATP cellular energy storage, and cell membrane phospholipids.'],
  [16, 'S', 'Sulfur', 32.06, 'reactive-nonmetal', 3, 16, 'p', '[Ne] 3s² 3p⁴', 2.58, 200.4, 88, 105, 1000, 'Solid', 388.36, 717.8, 2.07, 'Ancient', 'Known to ancients', '#EAB308', 'Bright yellow crystalline solid forming crown-shaped S₈ rings. Integral to disulfide bridges in protein tertiary folding.'],
  [17, 'Cl', 'Chlorine', 35.45, 'reactive-nonmetal', 3, 17, 'p', '[Ne] 3s² 3p⁵', 3.16, 349.0, 79, 102, 1251, 'Gas', 171.6, 239.11, 0.003214, 1774, 'Carl Wilhelm Scheele', '#16A34A', 'Pungent greenish-yellow halogen gas. High electron affinity makes it a strong disinfectant; key component in PVC and table salt.'],
  [18, 'Ar', 'Argon', 39.948, 'noble-gas', 3, 18, 'p', '[Ne] 3s² 3p⁶', undefined, -96, 71, 106, 1521, 'Gas', 83.80, 87.30, 0.0017837, 1894, 'Rayleigh & Ramsay', '#80D1E3', 'Third most abundant gas in Earth’s atmosphere (0.93%). Chemically inert shielding gas in welding and silicon crystal growth.'],

  // Period 4
  [19, 'K', 'Potassium', 39.098, 'alkali-metal', 4, 1, 's', '[Ar] 4s¹', 0.82, 48.4, 243, 203, 419, 'Solid', 336.53, 1032, 0.862, 1807, 'Humphry Davy', '#8F40D4', 'Soft silvery metal reacting vigorously with water. Critical electrolyte maintaining intracellular osmotic equilibrium.'],
  [20, 'Ca', 'Calcium', 40.078, 'alkaline-earth', 4, 2, 's', '[Ar] 4s²', 1.00, 2.37, 194, 176, 590, 'Solid', 1115, 1757, 1.54, 1808, 'Humphry Davy', '#3DFF00', 'Fifth most abundant element in Earth’s crust. Structural mineral in bones and teeth; vital second messenger in cell signaling.'],
  [21, 'Sc', 'Scandium', 44.956, 'transition-metal', 4, 3, 'd', '[Ar] 3d¹ 4s²', 1.36, 18.1, 184, 170, 633, 'Solid', 1814, 3109, 2.985, 1879, 'Lars Fredrik Nilson', '#E6E6E6', 'Silvery transition metal used to produce high-strength, weldable scandium-aluminum alloys for aerospace frames.'],
  [22, 'Ti', 'Titanium', 47.867, 'transition-metal', 4, 4, 'd', '[Ar] 3d² 4s²', 1.54, 7.6, 176, 160, 659, 'Solid', 1941, 3560, 4.506, 1791, 'William Gregor', '#BFC2C7', 'High strength-to-density ratio, high corrosion resistance, and biocompatibility for joint implants and jet engines.'],
  [23, 'V', 'Vanadium', 50.942, 'transition-metal', 4, 5, 'd', '[Ar] 3d³ 4s²', 1.63, 50.6, 171, 153, 651, 'Solid', 2183, 3680, 6.11, 1801, 'Andrés Manuel del Río', '#A6A6AB', 'Strengthens steel for high-speed tools and armor plates. Vanadium redox flow batteries provide large-scale energy storage.'],
  [24, 'Cr', 'Chromium', 51.996, 'transition-metal', 4, 6, 'd', '[Ar] 3d⁵ 4s¹', 1.66, 64.3, 166, 139, 653, 'Solid', 2180, 2944, 7.19, 1797, 'Louis Nicolas Vauquelin', '#8A99C7', 'Steely-gray lustrous metal with half-filled 3d⁵ configuration. Provides corrosion resistance to stainless steel.'],
  [25, 'Mn', 'Manganese', 54.938, 'transition-metal', 4, 7, 'd', '[Ar] 3d⁵ 4s²', 1.55, 0, 161, 139, 717, 'Solid', 1519, 2334, 7.21, 1774, 'Johan Gottlieb Gahn', '#9C7AC7', 'Essential for steel manufacturing. Central catalyst in the oxygen-evolving complex of photosystem II in plants.'],
  [26, 'Fe', 'Iron', 55.845, 'transition-metal', 4, 8, 'd', '[Ar] 3d⁶ 4s²', 1.83, 15.7, 156, 132, 762, 'Solid', 1811, 3134, 7.874, 'Ancient', 'Known to ancients', '#E06633', 'Most common element on Earth by mass. Central metal in hemoglobin for oxygen transport; fundamental structural metal of civilization.'],
  [27, 'Co', 'Cobalt', 58.933, 'transition-metal', 4, 9, 'd', '[Ar] 3d⁷ 4s²', 1.88, 63.7, 152, 126, 760, 'Solid', 1768, 3200, 8.90, 1735, 'Georg Brandt', '#F090A0', 'Ferromagnetic metal. Core constituent of Vitamin B₁₂ (cobalamin) and crucial cathode material in lithium-ion batteries.'],
  [28, 'Ni', 'Nickel', 58.693, 'transition-metal', 4, 10, 'd', '[Ar] 3d⁸ 4s²', 1.91, 112.0, 149, 124, 737, 'Solid', 1728, 3186, 8.908, 1751, 'Axel Fredrik Cronstedt', '#50D050', 'Corrosion-resistant metal used in stainless steel, coinage, electroplating, and electric vehicle battery chemistries.'],
  [29, 'Cu', 'Copper', 63.546, 'transition-metal', 4, 11, 'd', '[Ar] 3d¹⁰ 4s¹', 1.90, 118.4, 145, 132, 745, 'Solid', 1357.77, 2835, 8.96, 'Ancient', 'Known to ancients', '#C88033', 'Ductile metal with exceptional thermal and electrical conductivity. Essential trace micronutrient in cytochrome c oxidase.'],
  [30, 'Zn', 'Zinc', 65.38, 'transition-metal', 4, 12, 'd', '[Ar] 3d¹⁰ 4s²', 1.65, 0, 142, 122, 906, 'Solid', 692.68, 1180, 7.14, 1746, 'Andreas Marggraf', '#7D80B0', 'Crucial catalytic cofactor in over 300 enzymes including DNA polymerases and zinc-finger motifs. Protects steel via galvanization.'],
  [31, 'Ga', 'Gallium', 69.723, 'post-transition-metal', 4, 13, 'p', '[Ar] 3d¹⁰ 4s² 4p¹', 1.81, 28.9, 136, 122, 579, 'Solid', 302.91, 2477, 5.91, 1875, 'Lecoq de Boisbaudran', '#C28F8F', 'Melts in human hands (29.8°C). Essential semiconductor base for GaAs and GaN blue/UV LEDs and radar electronics.'],
  [32, 'Ge', 'Germanium', 72.630, 'metalloid', 4, 14, 'p', '[Ar] 3d¹⁰ 4s² 4p²', 2.01, 119.0, 125, 120, 762, 'Solid', 1211.4, 3106, 5.323, 1886, 'Clemens Winkler', '#668F8F', 'Semiconductor metalloid used in early point-contact transistors. Key component in fiber-optic cables and infrared night optics.'],
  [33, 'As', 'Arsenic', 74.922, 'metalloid', 4, 15, 'p', '[Ar] 3d¹⁰ 4s² 4p³', 2.18, 78.2, 114, 119, 947, 'Solid', 1090, 887, 5.727, 1250, 'Albertus Magnus', '#BD80E3', 'Notorious toxic metalloid. Used as an n-type dopant in semiconductors and in gallium arsenide high-efficiency solar cells.'],
  [34, 'Se', 'Selenium', 78.971, 'reactive-nonmetal', 4, 16, 'p', '[Ar] 3d¹⁰ 4s² 4p⁴', 2.55, 195.0, 103, 120, 941, 'Solid', 494, 958, 4.81, 1817, 'Jöns Jacob Berzelius', '#FFA100', 'Photoconductive nonmetal whose conductivity increases under illumination. Trace dietary element in glutathione peroxidase.'],
  [35, 'Br', 'Bromine', 79.904, 'reactive-nonmetal', 4, 17, 'p', '[Ar] 3d¹⁰ 4s² 4p⁵', 2.96, 324.6, 94, 120, 1140, 'Liquid', 265.8, 332.0, 3.1028, 1826, 'Antoine Balard', '#991B1B', 'Dense reddish-brown fuming liquid. Powerful electrophile in organic bromination and flame-retardant chemistry.'],
  [36, 'Kr', 'Krypton', 83.798, 'noble-gas', 4, 18, 'p', '[Ar] 3d¹⁰ 4s² 4p⁶', 3.00, -96, 88, 116, 1351, 'Gas', 115.79, 119.93, 0.003749, 1898, 'Ramsay & Travers', '#5CB8D1', 'Noble gas with distinctive green and orange emission lines. Used in high-speed photographic flashes and lasers.'],

  // Period 5
  [37, 'Rb', 'Rubidium', 85.468, 'alkali-metal', 5, 1, 's', '[Kr] 5s¹', 0.82, 46.9, 265, 220, 403, 'Solid', 312.46, 961, 1.532, 1861, 'Bunsen & Kirchhoff', '#702EB0', 'Soft, pyrophoric alkali metal. Fundamental to laser-cooling experiments, Bose-Einstein condensates, and atomic clocks.'],
  [38, 'Sr', 'Strontium', 87.62, 'alkaline-earth', 5, 2, 's', '[Kr] 5s²', 0.95, 5.0, 219, 195, 549, 'Solid', 1050, 1655, 2.64, 1790, 'Adair Crawford', '#00FF00', 'Imparts intense red colors to fireworks and safety flares. Strontium optical lattice clocks hold timekeeping accuracy records.'],
  [39, 'Y', 'Yttrium', 88.906, 'transition-metal', 5, 3, 'd', '[Kr] 4d¹ 5s²', 1.22, 29.6, 212, 190, 600, 'Solid', 1799, 3609, 4.472, 1794, 'Johan Gadolin', '#94E0E0', 'Rare-earth transition metal used in YBCO high-temperature superconductors and red phosphor in cathode ray tubes.'],
  [40, 'Zr', 'Zirconium', 91.224, 'transition-metal', 5, 4, 'd', '[Kr] 4d² 5s²', 1.33, 41.1, 206, 175, 640, 'Solid', 2128, 4682, 6.52, 1789, 'Martin Klaproth', '#94E0D0', 'Outstanding corrosion resistance and low thermal neutron absorption cross-section, ideal for nuclear fuel cladding.'],
  [41, 'Nb', 'Niobium', 92.906, 'transition-metal', 5, 5, 'd', '[Kr] 4d⁴ 5s¹', 1.6, 86.1, 198, 164, 652, 'Solid', 2750, 5017, 8.57, 1801, 'Charles Hatchett', '#73C2C9', 'Ductile superconducting transition metal used in MRI superconducting magnets and high-strength microalloyed structural steel.'],
  [42, 'Mo', 'Molybdenum', 95.95, 'transition-metal', 5, 6, 'd', '[Kr] 4d⁵ 5s¹', 2.16, 71.9, 190, 154, 684, 'Solid', 2896, 4912, 10.28, 1778, 'Carl Wilhelm Scheele', '#54B5B5', 'High melting point transition metal. Crucial trace enzyme cofactor in nitrogenase, catalyzing biological nitrogen fixation.'],
  [43, 'Tc', 'Technetium', 98, 'transition-metal', 5, 7, 'd', '[Kr] 4d⁵ 5s²', 1.9, 53, 183, 147, 702, 'Solid', 2430, 4538, 11.5, 1937, 'Perrier & Segrè', '#3B9E9E', 'First artificially produced chemical element. Tc-99m gamma-emitter is the most widely utilized medical diagnostic radiotracer.'],
  [44, 'Ru', 'Ruthenium', 101.07, 'transition-metal', 5, 8, 'd', '[Kr] 4d⁷ 5s¹', 2.2, 101.3, 178, 146, 710, 'Solid', 2607, 4423, 12.45, 1844, 'Karl Ernst Claus', '#248F8F', 'Platinum group metal with remarkable organometallic versatility. Key catalytic center in Grubbs olefin metathesis catalysts.'],
  [45, 'Rh', 'Rhodium', 102.91, 'transition-metal', 5, 9, 'd', '[Kr] 4d⁸ 5s¹', 2.28, 109.7, 173, 142, 720, 'Solid', 2237, 3968, 12.41, 1803, 'William Hyde Wollaston', '#0A7D8C', 'Extremely rare, corrosion-resistant noble metal. Essential reduction catalyst in automotive three-way catalytic converters.'],
  [46, 'Pd', 'Palladium', 106.42, 'transition-metal', 5, 10, 'd', '[Kr] 4d¹⁰', 2.20, 54.2, 169, 139, 804, 'Solid', 1828.05, 3236, 12.023, 1803, 'William Hyde Wollaston', '#006985', 'Can absorb up to 900 times its own volume in hydrogen gas. Foundational catalyst in Suzuki and Heck cross-coupling reactions.'],
  [47, 'Ag', 'Silver', 107.87, 'transition-metal', 5, 11, 'd', '[Kr] 4d¹⁰ 5s¹', 1.93, 125.6, 165, 145, 731, 'Solid', 1234.93, 2435, 10.49, 'Ancient', 'Known to ancients', '#C0C0C0', 'Highest electrical conductivity, thermal conductivity, and optical reflectance of any metal. Revered precious coinage metal.'],
  [48, 'Cd', 'Cadmium', 112.41, 'transition-metal', 5, 12, 'd', '[Kr] 4d¹⁰ 5s²', 1.69, -68, 161, 144, 868, 'Solid', 594.22, 1040, 8.65, 1817, 'Friedrich Stromeyer', '#FFD98F', 'Soft bluish-white metal. Historic component in nickel-cadmium batteries and cadmium telluride (CdTe) thin-film solar panels.'],
  [49, 'In', 'Indium', 114.82, 'post-transition-metal', 5, 13, 'p', '[Kr] 4d¹⁰ 5s² 5p¹', 1.78, 38.9, 156, 142, 558, 'Solid', 429.75, 2345, 7.31, 1863, 'Reich & Richter', '#A67573', 'Malleable post-transition metal. Indium tin oxide (ITO) forms the transparent conductive coatings on touchscreen displays.'],
  [50, 'Sn', 'Tin', 118.71, 'post-transition-metal', 5, 14, 'p', '[Kr] 4d¹⁰ 5s² 5p²', 1.96, 107.3, 145, 139, 709, 'Solid', 505.08, 2875, 7.31, 'Ancient', 'Known to ancients', '#668080', 'Silvery post-transition metal. Ancient alloy component of bronze; modern lead-free solders and corrosion-resistant tinplate.'],
  [51, 'Sb', 'Antimony', 121.76, 'metalloid', 5, 15, 'p', '[Kr] 4d¹⁰ 5s² 5p³', 2.05, 103.2, 133, 139, 834, 'Solid', 903.78, 1860, 6.697, 'Ancient', 'Known to ancients', '#9E63B5', 'Lustrous gray metalloid. Extensively used in halogenated flame retardants and as an alloying agent hardening lead in batteries.'],
  [52, 'Te', 'Tellurium', 127.60, 'metalloid', 5, 16, 'p', '[Kr] 4d¹⁰ 5s² 5p⁴', 2.1, 190.2, 123, 138, 869, 'Solid', 722.66, 1261, 6.24, 1782, 'Franz-Joseph Müller', '#D47A00', 'Brittle, rare chalcogen metalloid. Forms bismuth telluride thermoelectric generators and cadmium telluride photovoltaics.'],
  [53, 'I', 'Iodine', 126.90, 'reactive-nonmetal', 5, 17, 'p', '[Kr] 4d¹⁰ 5s² 5p⁵', 2.66, 295.2, 115, 139, 1008, 'Solid', 386.85, 457.4, 4.933, 1811, 'Bernard Courtois', '#7C3AED', 'Dark purple-black lustrous solid subliming into violet vapor. Crucial trace element required for thyroid hormone synthesis.'],
  [54, 'Xe', 'Xenon', 131.29, 'noble-gas', 5, 18, 'p', '[Kr] 4d¹⁰ 5s² 5p⁶', 2.60, -77, 108, 140, 1170, 'Gas', 161.4, 165.03, 0.005894, 1898, 'Ramsay & Travers', '#429EB0', 'Heavy noble gas that forms genuine fluorides and oxides. Propellant of choice in deep space ion thruster engines.'],

  // Period 6
  [55, 'Cs', 'Caesium', 132.91, 'alkali-metal', 6, 1, 's', '[Xe] 6s¹', 0.79, 45.9, 298, 244, 376, 'Solid', 301.59, 944, 1.93, 1860, 'Bunsen & Kirchhoff', '#57178F', 'Most electropositive stable metal. The SI second is defined by 9,192,631,770 cycles of the Cs-133 hyperfine transition.'],
  [56, 'Ba', 'Barium', 137.33, 'alkaline-earth', 6, 2, 's', '[Xe] 6s²', 0.89, 13.95, 253, 215, 503, 'Solid', 1000, 2170, 3.51, 1808, 'Humphry Davy', '#00C900', 'Dense alkaline earth metal. Barium sulfate is opaque to X-rays, serving as a radiocontrast agent for gastrointestinal imaging.'],

  // Period 6 Lanthanides (57-71)
  [57, 'La', 'Lanthanum', 138.91, 'lanthanide', 6, 3, 'f', '[Xe] 5d¹ 6s²', 1.10, 53, 195, 207, 538, 'Solid', 1193, 3737, 6.162, 1839, 'Carl Gustaf Mosander', '#70D4FF', 'Prototypical lanthanide metal. Nickel-metal hydride (NiMH) hybrid car battery anodes and studio carbon arc lighting.'],
  [58, 'Ce', 'Cerium', 140.12, 'lanthanide', 6, 3, 'f', '[Xe] 4f¹ 5d¹ 6s²', 1.12, 55, 185, 204, 534, 'Solid', 1068, 3716, 6.77, 1803, 'von Hisinger & Berzelius', '#E6E696', 'Most abundant rare-earth metal. Cerium(IV) oxide is a premier glass-polishing abrasive and catalytic converter component.'],
  [59, 'Pr', 'Praseodymium', 140.91, 'lanthanide', 6, 3, 'f', '[Xe] 4f³ 6s²', 1.13, 93, 247, 203, 527, 'Solid', 1208, 3793, 6.77, 1885, 'Carl Auer von Welsbach', '#D9FFC7', 'Silvery metal that imparts intense yellow-green colors to protective welder goggles and didymium optical filters.'],
  [60, 'Nd', 'Neodymium', 144.24, 'lanthanide', 6, 3, 'f', '[Xe] 4f⁴ 6s²', 1.14, 184, 206, 201, 533, 'Solid', 1297, 3347, 7.01, 1885, 'Carl Auer von Welsbach', '#C7FFC7', 'Produces the strongest known permanent magnets (Nd₂Fe₁₄B), powering electric vehicle traction motors and wind turbines.'],
  [61, 'Pm', 'Promethium', 145, 'lanthanide', 6, 3, 'f', '[Xe] 4f⁵ 6s²', 1.13, 12, 205, 199, 540, 'Solid', 1315, 3273, 7.26, 1945, 'Marinsky, Glendenin & Coryell', '#A3FFC7', 'Extremely rare radioactive lanthanide. Emits pure beta radiation used in luminous atomic batteries for guided missiles and pacemakers.'],
  [62, 'Sm', 'Samarium', 150.36, 'lanthanide', 6, 3, 'f', '[Xe] 4f⁶ 6s²', 1.17, 15.6, 238, 198, 545, 'Solid', 1345, 2067, 7.52, 1879, 'Lecoq de Boisbaudran', '#8FFFC7', 'Forms high-temperature SmCo permanent magnets and serves as a neutron-absorbing dopant in nuclear control rods.'],
  [63, 'Eu', 'Europium', 151.96, 'lanthanide', 6, 3, 'f', '[Xe] 4f⁷ 6s²', 1.20, 86, 231, 198, 547, 'Solid', 1099, 1802, 5.244, 1901, 'Eugène-Anatole Demarçay', '#61FFC7', 'Most chemically reactive lanthanide. Red and blue europium phosphors produce the anti-counterfeiting phosphorescence on Euro banknotes.'],
  [64, 'Gd', 'Gadolinium', 157.25, 'lanthanide', 6, 3, 'f', '[Xe] 4f⁷ 5d¹ 6s²', 1.20, 13.2, 233, 196, 593, 'Solid', 1585, 3546, 7.90, 1880, 'Jean de Marignac', '#45FFC7', 'Possesses 7 unpaired f-electrons, conferring exceptional paramagnetism; primary intravenously administered MRI contrast agent.'],
  [65, 'Tb', 'Terbium', 158.93, 'lanthanide', 6, 3, 'f', '[Xe] 4f⁹ 6s²', 1.20, 112, 225, 194, 566, 'Solid', 1629, 3503, 8.23, 1843, 'Carl Gustaf Mosander', '#30FFC7', 'Emits brilliant monochromatic green luminescence in fluorescent tubes; core component of Terfenol-D magnetostrictive sonar transducers.'],
  [66, 'Dy', 'Dysprosium', 162.50, 'lanthanide', 6, 3, 'f', '[Xe] 4f¹⁰ 6s²', 1.22, 33.9, 228, 192, 573, 'Solid', 1680, 2840, 8.54, 1886, 'Lecoq de Boisbaudran', '#1FFFC7', 'Has one of the highest magnetic strengths of any element. Prevents demagnetization of neodymium EV magnets at high temperatures.'],
  [67, 'Ho', 'Holmium', 164.93, 'lanthanide', 6, 3, 'f', '[Xe] 4f¹¹ 6s²', 1.23, 32.6, 226, 192, 581, 'Solid', 1734, 2993, 8.79, 1878, 'Jacques-Louis Soret', '#00FF9C', 'Highest magnetic dipole moment of any natural element. Concentrates flux in magnetic pole pieces and powers Ho:YAG surgical lasers.'],
  [68, 'Er', 'Erbium', 167.26, 'lanthanide', 6, 3, 'f', '[Xe] 4f¹² 6s²', 1.24, 30.1, 226, 189, 589, 'Solid', 1802, 3141, 9.066, 1843, 'Carl Gustaf Mosander', '#00E675', 'Erbium-doped fiber amplifiers (EDFAs) optically amplify light signals at 1550 nm, underpinning global transoceanic internet cables.'],
  [69, 'Tm', 'Thulium', 168.93, 'lanthanide', 6, 3, 'f', '[Xe] 4f¹³ 6s²', 1.25, 99, 222, 190, 597, 'Solid', 1818, 2223, 9.32, 1879, 'Per Teodor Cleve', '#00D452', 'Second least abundant lanthanide. Portable medical X-ray sources and high-efficiency solid-state surgical cutting lasers.'],
  [70, 'Yb', 'Ytterbium', 173.05, 'lanthanide', 6, 3, 'f', '[Xe] 4f¹⁴ 6s²', 1.10, -1.9, 222, 187, 603, 'Solid', 1097, 1469, 6.90, 1878, 'Jean de Marignac', '#00BF38', 'Closed 4f¹⁴ electron shell. Used in atomic optical clocks, stainless steel stress gauges, and high-power industrial fiber lasers.'],
  [71, 'Lu', 'Lutetium', 174.97, 'lanthanide', 6, 3, 'd', '[Xe] 4f¹⁴ 5d¹ 6s²', 1.27, 33.4, 217, 187, 524, 'Solid', 1925, 3675, 9.841, 1907, 'Georges Urbain', '#00AB24', 'Heaviest and hardest lanthanide. Lutetium-177 radiopharmaceuticals precisely target and destroy prostate cancer cells.'],

  // Period 6 Transition Metals & Post-Transition
  [72, 'Hf', 'Hafnium', 178.49, 'transition-metal', 6, 4, 'd', '[Xe] 4f¹⁴ 5d² 6s²', 1.3, 17.1, 208, 175, 659, 'Solid', 2506, 4876, 13.31, 1923, 'Coster & de Hevesy', '#4DC2FF', 'High dielectric constant (high-k) insulator in advanced computer microprocessors; neutron absorber in submarine nuclear reactors.'],
  [73, 'Ta', 'Tantalum', 180.95, 'transition-metal', 6, 5, 'd', '[Xe] 4f¹⁴ 5d³ 6s²', 1.5, 31, 200, 170, 761, 'Solid', 3290, 5731, 16.69, 1802, 'Anders Gustaf Ekeberg', '#4DA6FF', 'Extremely corrosion-resistant metal forming miniature high-capacitance capacitors in smartphones, laptops, and automotive electronics.'],
  [74, 'W', 'Tungsten', 183.84, 'transition-metal', 6, 6, 'd', '[Xe] 4f¹⁴ 5d⁴ 6s²', 2.36, 78.6, 193, 162, 770, 'Solid', 3695, 6203, 19.25, 1783, 'Elhuyar brothers', '#2194D6', 'Has the highest melting point of all elements (3422°C) and lowest vapor pressure. Used in incandescent filaments and armor penetrators.'],
  [75, 'Re', 'Rhenium', 186.21, 'transition-metal', 6, 7, 'd', '[Xe] 4f¹⁴ 5d⁵ 6s²', 1.9, 5.8, 188, 151, 760, 'Solid', 3459, 5869, 21.02, 1925, 'Noddack, Tacke & Berg', '#267DAB', 'Exceptionally dense refractory metal with third highest melting point. Essential alloying element in commercial jet engine superalloys.'],
  [76, 'Os', 'Osmium', 190.23, 'transition-metal', 6, 8, 'd', '[Xe] 4f¹⁴ 5d⁶ 6s²', 2.2, 106.1, 185, 144, 840, 'Solid', 3306, 5285, 22.59, 1803, 'Smithson Tennant', '#266696', 'Densest naturally occurring element (22.59 g/cm³). Extremely hard metal used in fountain pen nibs and biological staining (OsO₄).'],
  [77, 'Ir', 'Iridium', 192.22, 'transition-metal', 6, 9, 'd', '[Xe] 4f¹⁴ 5d⁷ 6s²', 2.20, 151.0, 180, 141, 880, 'Solid', 2719, 4701, 22.56, 1803, 'Smithson Tennant', '#175487', 'Most corrosion-resistant metal known. Global geological iridium clay anomaly proved dinosaur-ending Chicxulub asteroid impact.'],
  [78, 'Pt', 'Platinum', 195.08, 'transition-metal', 6, 10, 'd', '[Xe] 4f¹⁴ 5d⁹ 6s¹', 2.28, 205.3, 177, 136, 870, 'Solid', 2041.4, 4098, 21.45, 1735, 'Antonio de Ulloa', '#D0D0E0', 'Precious transition metal with outstanding catalytic properties. Catalytic converters, hydrogen fuel cells, and cisplatin anticancer drugs.'],
  [79, 'Au', 'Gold', 196.97, 'transition-metal', 6, 11, 'd', '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', 2.54, 222.8, 174, 136, 890, 'Solid', 1337.33, 3243, 19.30, 'Ancient', 'Known to ancients', '#FFD700', 'Most malleable metal; relativistic 6s electron contraction produces its distinctive yellow luster. Does not tarnish or oxidize.'],
  [80, 'Hg', 'Mercury', 200.59, 'transition-metal', 6, 12, 'd', '[Xe] 4f¹⁴ 5d¹⁰ 6s²', 2.00, -48, 171, 132, 1007, 'Liquid', 234.32, 629.88, 13.534, 'Ancient', 'Known to ancients', '#B8B8D0', 'Only metallic element that is liquid at standard room temperature. Relativistic stabilization of 6s² pair prevents crystallization.'],
  [81, 'Tl', 'Thallium', 204.38, 'post-transition-metal', 6, 13, 'p', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', 1.62, 36.4, 156, 145, 589, 'Solid', 577, 1746, 11.85, 1861, 'William Crookes', '#A6544D', 'Soft, malleable toxic post-transition metal. Thallium-activated sodium iodide crystals detect gamma rays in nuclear medicine.'],
  [82, 'Pb', 'Lead', 207.2, 'post-transition-metal', 6, 14, 'p', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', 1.87, 35.1, 154, 146, 716, 'Solid', 600.61, 2022, 11.34, 'Ancient', 'Known to ancients', '#575961', 'Dense, malleable post-transition metal. The terminal stable endpoint of natural decay chains; key radiation shielding and battery anode.'],
  [83, 'Bi', 'Bismuth', 208.98, 'post-transition-metal', 6, 15, 'p', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', 2.02, 91.2, 143, 148, 703, 'Solid', 544.7, 1837, 9.78, 1753, 'Claude François Geoffroy', '#9E4FB5', 'High diamagnetism and low toxicity compared to neighboring heavy metals; forms iridescent stepped hopper crystals and Pepto-Bismol.'],
  [84, 'Po', 'Polonium', 209, 'post-transition-metal', 6, 16, 'p', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', 2.0, 183.3, 135, 140, 812, 'Solid', 527, 1235, 9.196, 1898, 'Marie & Pierre Curie', '#AB5C00', 'Extremely intense alpha-emitter discovered by Marie Curie and named after Poland. Used as an anti-static agent and thermal power source.'],
  [85, 'At', 'Astatine', 210, 'metalloid', 6, 17, 'p', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', 2.2, 270.1, 127, 150, 899, 'Solid', 575, 610, 6.35, 1940, 'Corson, MacKenzie & Segrè', '#754F45', 'Rarest naturally occurring element on Earth’s crust (<30 grams total). Short-lived At-211 shows high promise for targeted alpha cancer therapy.'],
  [86, 'Rn', 'Radon', 222, 'noble-gas', 6, 18, 'p', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', 2.20, -68, 120, 145, 1037, 'Gas', 202, 211.3, 0.00973, 1899, 'Ernest Rutherford', '#408299', 'Dense radioactive noble gas formed from the decay of radium. Can accumulate indoors as a significant natural radiation health hazard.'],

  // Period 7
  [87, 'Fr', 'Francium', 223, 'alkali-metal', 7, 1, 's', '[Rn] 7s¹', 0.7, 46.9, 348, 260, 380, 'Solid', 300, 950, 2.48, 1939, 'Marguerite Perey', '#420066', 'Second rarest natural element and heaviest alkali metal. Extremely unstable with a half-life of only 22 minutes (Fr-223).'],
  [88, 'Ra', 'Radium', 226, 'alkaline-earth', 7, 2, 's', '[Rn] 7s²', 0.9, 9.6, 283, 221, 509, 'Solid', 973, 2010, 5.5, 1898, 'Marie & Pierre Curie', '#006600', 'Luminescent radioactive alkaline earth metal. Radium-223 dichloride treats bone metastases in advanced prostate cancer.'],

  // Period 7 Actinides (89-103)
  [89, 'Ac', 'Actinium', 227, 'actinide', 7, 3, 'f', '[Rn] 6d¹ 7s²', 1.1, 33.8, 215, 215, 499, 'Solid', 1323, 3471, 10.07, 1899, 'André-Louis Debierne', '#70ABFA', 'First actinide element, glows with an eerie pale blue light due to intense radioactivity; Ac-225 is a vanguard targeted cancer weapon.'],
  [90, 'Th', 'Thorium', 232.04, 'actinide', 7, 3, 'f', '[Rn] 6d² 7s²', 1.3, 112.7, 206, 206, 587, 'Solid', 2023, 5061, 11.72, 1829, 'Jöns Jacob Berzelius', '#00C7FF', 'Abundant fertile nuclear fuel. Thorium-232 molten salt reactors represent a safer, proliferation-resistant nuclear power cycle.'],
  [91, 'Pa', 'Protactinium', 231.04, 'actinide', 7, 3, 'f', '[Rn] 5f² 6d¹ 7s²', 1.5, 53, 200, 200, 568, 'Solid', 1841, 4300, 15.37, 1913, 'Fajans & Göhring', '#00A1FF', 'Dense actinide metal with complex superconducting phase behavior below 1.4 K; decay intermediate in the natural uranium series.'],
  [92, 'U', 'Uranium', 238.03, 'actinide', 7, 3, 'f', '[Rn] 5f³ 6d¹ 7s²', 1.38, 50.9, 175, 196, 598, 'Solid', 1405.3, 4404, 19.1, 1789, 'Martin Klaproth', '#008FFF', 'Dense actinide metal. Uranium-235 is the primary fissile fuel driving commercial nuclear power reactors.'],
  [93, 'Np', 'Neptunium', 237, 'actinide', 7, 3, 'f', '[Rn] 5f⁴ 6d¹ 7s²', 1.36, 45.8, 190, 190, 604, 'Solid', 917, 4273, 20.45, 1940, 'McMillan & Abelson', '#0080FF', 'First transuranic actinide element synthesized. Neutron capture precursor in the production of Plutonium-238 RTG space power sources.'],
  [94, 'Pu', 'Plutonium', 244, 'actinide', 7, 3, 'f', '[Rn] 5f⁶ 7s²', 1.28, -48, 159, 187, 585, 'Solid', 912.5, 3505, 19.816, 1940, 'Glenn Seaborg', '#006BFF', 'Transuranic actinide. Plutonium-238 generates heat in Radioisotope Thermoelectric Generators (RTGs) powering deep-space NASA probes.'],
  [95, 'Am', 'Americium', 243, 'actinide', 7, 3, 'f', '[Rn] 5f⁷ 7s²', 1.3, 9.9, 180, 180, 578, 'Solid', 1449, 2880, 13.67, 1944, 'Seaborg, James, Morgan & Ghiorso', '#545CF2', 'Synthetic transuranic element. Americium-241 alpha radiation ionizes air in household smoke detectors to sense combustion particles.'],
  [96, 'Cm', 'Curium', 247, 'actinide', 7, 3, 'f', '[Rn] 5f⁷ 6d¹ 7s²', 1.3, 27.2, 169, 169, 581, 'Solid', 1618, 3383, 13.51, 1944, 'Seaborg, James & Ghiorso', '#7854E3', 'Named after Marie and Pierre Curie. Intense alpha radiation powers Alpha Particle X-ray Spectrometers (APXS) on Mars exploration rovers.'],
  [97, 'Bk', 'Berkelium', 247, 'actinide', 7, 3, 'f', '[Rn] 5f⁹ 7s²', 1.3, -165, 170, 170, 601, 'Solid', 1259, 2900, 14.78, 1949, 'Thompson, Ghiorso & Seaborg', '#8A4FE3', 'Synthesized by bombarding americium with alpha particles. Essential target material used in synthesizing superheavy element tennessine (117).'],
  [98, 'Cf', 'Californium', 251, 'actinide', 7, 3, 'f', '[Rn] 5f¹⁰ 7s²', 1.3, -97, 168, 168, 608, 'Solid', 1173, 1743, 15.1, 1950, 'Thompson, Street, Ghiorso & Seaborg', '#A136D4', 'Extremely potent neutron emitter. One microgram of Californium-252 releases 170 million neutrons/minute to inspect aircraft wings.'],
  [99, 'Es', 'Einsteinium', 252, 'actinide', 7, 3, 'f', '[Rn] 5f¹¹ 7s²', 1.3, -28.6, 165, 165, 619, 'Solid', 1133, 1269, 8.84, 1952, 'Albert Ghiorso et al.', '#B31FD4', 'Discovered in the radioactive debris of the Ivy Mike thermonuclear test explosion. Heaviest element isolated in macroscopic quantities.'],
  [100, 'Fm', 'Fermium', 257, 'actinide', 7, 3, 'f', '[Rn] 5f¹² 7s²', 1.3, 33.9, 167, 167, 627, 'Solid', 1800, undefined, undefined, 1952, 'Albert Ghiorso et al.', '#B31FBA', 'Named in honor of Enrico Fermi. The heaviest element that can be formed via neutron capture in high-flux nuclear reactors.'],
  [101, 'Md', 'Mendelevium', 258, 'actinide', 7, 3, 'f', '[Rn] 5f¹³ 7s²', 1.3, 93.9, 173, 173, 635, 'Solid', 1100, undefined, undefined, 1955, 'Albert Ghiorso et al.', '#B30DA6', 'First element synthesized one atom at a time; named after Dmitri Mendeleev, father of the periodic table.'],
  [102, 'No', 'Nobelium', 259, 'actinide', 7, 3, 'f', '[Rn] 5f¹⁴ 7s²', 1.3, -223, 176, 176, 642, 'Solid', 1100, undefined, undefined, 1958, 'Albert Ghiorso et al.', '#BD0D87', 'Synthetic transuranic actinide named after Alfred Nobel. Divalent +2 oxidation state unusually stable due to closed 5f¹⁴ shell.'],
  [103, 'Lr', 'Lawrencium', 266, 'actinide', 7, 3, 'd', '[Rn] 5f¹⁴ 7s² 7p¹', 1.3, -30, 161, 161, 470, 'Solid', 1900, undefined, undefined, 1961, 'Albert Ghiorso et al.', '#C70066', 'Terminal member of the actinide series, named for cyclotron inventor Ernest Lawrence. Features an anomalous 7p valence configuration.'],

  // Period 7 Superheavy Elements (104-118)
  [104, 'Rf', 'Rutherfordium', 267, 'transition-metal', 7, 4, 'd', '[Rn] 5f¹⁴ 6d² 7s²', undefined, undefined, 157, 157, 580, 'Expected Solid', 2400, 5800, 23.2, 1964, 'JINR (Dubna) & LBNL', '#CC0059', 'First transactinide superheavy element (Z=104). Demonstrates Group 4 chemical properties homologous to hafnium and zirconium.'],
  [105, 'Db', 'Dubnium', 268, 'transition-metal', 7, 5, 'd', '[Rn] 5f¹⁴ 6d³ 7s²', undefined, undefined, 149, 149, 665, 'Expected Solid', 2900, undefined, 29.3, 1968, 'JINR (Dubna) & LBNL', '#D1004F', 'Superheavy Group 5 transition metal named after Dubna, Russia. Gas-phase chromatography confirms pentavalent behavior similar to tantalum.'],
  [106, 'Sg', 'Seaborgium', 269, 'transition-metal', 7, 6, 'd', '[Rn] 5f¹⁴ 6d⁴ 7s²', undefined, undefined, 143, 143, 757, 'Expected Solid', undefined, undefined, 35.0, 1974, 'Lawrence Berkeley Laboratory', '#D90045', 'First chemical element named after a living person (Glenn T. Seaborg). Forms volatile hexavalent oxo-compounds mimicking molybdenum and tungsten.'],
  [107, 'Bh', 'Bohrium', 270, 'transition-metal', 7, 7, 'd', '[Rn] 5f¹⁴ 6d⁵ 7s²', undefined, undefined, 137, 137, 740, 'Expected Solid', undefined, undefined, 37.1, 1981, 'GSI Helmholtzzentrum', '#E00038', 'Superheavy Group 7 metal honoring quantum pioneer Niels Bohr. Forms volatile oxychloride BhO₃Cl matching predicted Group 7 trends.'],
  [108, 'Hs', 'Hassium', 277, 'transition-metal', 7, 8, 'd', '[Rn] 5f¹⁴ 6d⁶ 7s²', undefined, undefined, 134, 134, 730, 'Expected Solid', undefined, undefined, 40.7, 1984, 'GSI Helmholtzzentrum', '#E6002E', 'Named after the German state of Hesse. Forms a volatile, high-melting tetroxide (HsO₄) directly homologous to osmium tetroxide.'],
  [109, 'Mt', 'Meitnerium', 278, 'unknown', 7, 9, 'd', '[Rn] 5f¹⁴ 6d⁷ 7s²', undefined, undefined, 130, 130, 800, 'Expected Solid', undefined, undefined, 37.4, 1982, 'GSI Helmholtzzentrum', '#EB0024', 'Named in honor of Austrian physicist Lise Meitner, discoverer of nuclear fission. Superheavy transition metal member of Group 9.'],
  [110, 'Ds', 'Darmstadtium', 281, 'unknown', 7, 10, 'd', '[Rn] 5f¹⁴ 6d⁸ 7s²', undefined, undefined, 128, 128, 960, 'Expected Solid', undefined, undefined, 34.8, 1994, 'GSI Helmholtzzentrum', '#ED001A', 'Named after the German city of Darmstadt. Heavy synthetic element in the nickel-palladium-platinum triad of Group 10.'],
  [111, 'Rg', 'Roentgenium', 282, 'unknown', 7, 11, 'd', '[Rn] 5f¹⁴ 6d⁹ 7s²', undefined, undefined, 121, 121, 1020, 'Expected Solid', undefined, undefined, 28.7, 1994, 'GSI Helmholtzzentrum', '#F00010', 'Named after Wilhelm Röntgen, discoverer of X-rays. Expected to be a dense, noble metal homologous to copper, silver, and gold.'],
  [112, 'Cn', 'Copernicium', 285, 'transition-metal', 7, 12, 'd', '[Rn] 5f¹⁴ 6d¹⁰ 7s²', undefined, undefined, 122, 122, 1155, 'Liquid', 283, 340, 23.7, 1996, 'GSI Helmholtzzentrum', '#F22E00', 'Named in honor of astronomer Nicolaus Copernicus. Strong relativistic 7s contraction suggests it is a volatile liquid, almost noble gas-like.'],
  [113, 'Nh', 'Nihonium', 286, 'post-transition-metal', 7, 13, 'p', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', undefined, undefined, 136, 136, 705, 'Expected Solid', 700, 1400, 16, 2004, 'RIKEN (Japan)', '#F55700', 'First element discovered in an Asian nation (Japan). Group 13 post-transition metal expected to exhibit a predominant +1 oxidation state.'],
  [114, 'Fl', 'Flerovium', 289, 'post-transition-metal', 7, 14, 'p', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', undefined, undefined, 143, 143, 824, 'Expected Solid', 284, 340, 14, 1998, 'JINR & LLNL', '#F77C00', 'Discovered at the Flerov Laboratory in Dubna. Lies near the center of the theoretical "Island of Nuclear Stability" around Z=114.'],
  [115, 'Mc', 'Moscovium', 290, 'post-transition-metal', 7, 15, 'p', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', undefined, undefined, 162, 162, 538, 'Expected Solid', 670, 1400, 13.5, 2003, 'JINR & LLNL', '#FCA100', 'Named after Moscow Oblast. Group 15 pnictogen homologue with enhanced metallic character due to relativistic spin-orbit splitting.'],
  [116, 'Lv', 'Livermorium', 293, 'post-transition-metal', 7, 16, 'p', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', undefined, undefined, 175, 175, 723, 'Expected Solid', 709, 1085, 12.9, 2000, 'JINR & LLNL', '#FFC400', 'Named for Lawrence Livermore National Laboratory. Heavy synthetic chalcogen element with expected oxidation states of +2 and +4.'],
  [117, 'Ts', 'Tennessine', 294, 'unknown', 7, 17, 'p', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', undefined, undefined, 165, 165, 743, 'Expected Solid', 723, 883, 7.2, 2010, 'JINR, LLNL & ORNL', '#FFD000', 'Synthesized with a berkelium target at Oak Ridge, Tennessee. Expected to show semi-metallic behavior rather than a traditional halogen.'],
  [118, 'Og', 'Oganesson', 294, 'noble-gas', 7, 18, 'p', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', undefined, 5.4, 152, 170, 860, 'Expected Gas', 325, 450, 5.0, 2002, 'JINR & LLNL', '#6B5876', 'The heaviest chemical element officially recognized (Z=118). Relativistic electron effects predict unusual non-noble metallic behavior.'],
];

// Map compact raw elements into full PeriodicElement objects
export const PERIODIC_ELEMENTS: PeriodicElement[] = RAW_ELEMENTS_DATA.map((row) => {
  const [
    number, symbol, name, atomicMass, category, period, group, block,
    electronConfiguration, electronegativity, electronAffinity, atomicRadius,
    covalentRadius, ionizationEnergy, standardState, meltingPointK, boilingPointK,
    density, discoveryYear, discoverer, cpkColor, summary
  ] = row;

  // Approximate shell occupancy
  const electronsPerShell = calculateShellOccupancy(number);

  return {
    number,
    symbol,
    name,
    atomicMass,
    category,
    period,
    group,
    block,
    electronConfiguration,
    electronsPerShell,
    electronegativity,
    electronAffinity,
    atomicRadius,
    covalentRadius,
    ionizationEnergy,
    oxidationStates: inferOxidationStates(number, category, group),
    standardState,
    meltingPointK,
    boilingPointK,
    density,
    discoveryYear,
    discoverer,
    cpkColor,
    summary,
  };
});

function calculateShellOccupancy(z: number): number[] {
  const capacities = [2, 8, 18, 32, 32, 18, 8];
  const shells: number[] = [];
  let remaining = z;
  for (const cap of capacities) {
    if (remaining <= 0) break;
    const add = Math.min(remaining, cap);
    shells.push(add);
    remaining -= add;
  }
  return shells;
}

function inferOxidationStates(z: number, cat: ElementCategory, group: number): number[] {
  if (cat === 'noble-gas') return z >= 36 ? [0, 2, 4] : [0];
  if (cat === 'alkali-metal') return [1];
  if (cat === 'alkaline-earth') return [2];
  if (cat === 'lanthanide') return [3, 4];
  if (cat === 'actinide') return [3, 4, 5, 6];
  if (group === 17) return [-1, 1, 3, 5, 7];
  if (group === 16) return [-2, 2, 4, 6];
  if (group === 15) return [-3, 3, 5];
  if (group === 14) return [-4, 2, 4];
  if (group === 13) return [1, 3];
  if (group === 12) return [2];
  if (group === 11) return [1, 2, 3];
  return [2, 3, 4];
}
