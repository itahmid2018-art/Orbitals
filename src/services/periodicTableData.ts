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

  // Period 5 Landmark Elements
  [37, 'Rb', 'Rubidium', 85.468, 'alkali-metal', 5, 1, 's', '[Kr] 5s¹', 0.82, 46.9, 265, 220, 403, 'Solid', 312.46, 961, 1.532, 1861, 'Bunsen & Kirchhoff', '#702EB0', 'Soft, pyrophoric alkali metal. Fundamental to laser-cooling experiments and atomic fountain quantum clocks.'],
  [38, 'Sr', 'Strontium', 87.62, 'alkaline-earth', 5, 2, 's', '[Kr] 5s²', 0.95, 5.0, 219, 195, 549, 'Solid', 1050, 1655, 2.64, 1790, 'Adair Crawford', '#00FF00', 'Imparts intense red colors to fireworks and safety flares. Strontium optical lattice clocks hold timekeeping accuracy records.'],
  [47, 'Ag', 'Silver', 107.87, 'transition-metal', 5, 11, 'd', '[Kr] 4d¹⁰ 5s¹', 1.93, 125.6, 165, 145, 731, 'Solid', 1234.93, 2435, 10.49, 'Ancient', 'Known to ancients', '#C0C0C0', 'Highest electrical conductivity, thermal conductivity, and optical reflectance of any metal. Revered precious coinage metal.'],
  [53, 'I', 'Iodine', 126.90, 'reactive-nonmetal', 5, 17, 'p', '[Kr] 4d¹⁰ 5s² 5p⁵', 2.66, 295.2, 115, 139, 1008, 'Solid', 386.85, 457.4, 4.933, 1811, 'Bernard Courtois', '#7C3AED', 'Dark purple-black lustrous solid subliming into violet vapor. Crucial trace element required for thyroid hormone synthesis.'],
  [54, 'Xe', 'Xenon', 131.29, 'noble-gas', 5, 18, 'p', '[Kr] 4d¹⁰ 5s² 5p⁶', 2.60, -77, 108, 140, 1170, 'Gas', 161.4, 165.03, 0.005894, 1898, 'Ramsay & Travers', '#429EB0', 'Heavy noble gas that forms genuine fluorides and oxides. Propellant of choice in deep space ion thruster engines.'],

  // Period 6 Landmark Elements
  [55, 'Cs', 'Caesium', 132.91, 'alkali-metal', 6, 1, 's', '[Xe] 6s¹', 0.79, 45.9, 298, 244, 376, 'Solid', 301.59, 944, 1.93, 1860, 'Bunsen & Kirchhoff', '#57178F', 'Most electropositive stable metal. The SI second is defined by 9,192,631,770 cycles of the Cs-133 hyperfine transition.'],
  [56, 'Ba', 'Barium', 137.33, 'alkaline-earth', 6, 2, 's', '[Xe] 6s²', 0.89, 13.95, 253, 215, 503, 'Solid', 1000, 2170, 3.51, 1808, 'Humphry Davy', '#00C900', 'Dense alkaline earth metal. Barium sulfate is opaque to X-rays, serving as a radiocontrast agent for gastrointestinal imaging.'],
  [74, 'W', 'Tungsten', 183.84, 'transition-metal', 6, 6, 'd', '[Xe] 4f¹⁴ 5d⁴ 6s²', 2.36, 78.6, 193, 162, 770, 'Solid', 3695, 6203, 19.25, 1783, 'Elhuyar brothers', '#2194D6', 'Has the highest melting point of all elements (3422°C) and lowest vapor pressure. Used in incandescent filaments and armor penetrators.'],
  [78, 'Pt', 'Platinum', 195.08, 'transition-metal', 6, 10, 'd', '[Xe] 4f¹⁴ 5d⁹ 6s¹', 2.28, 205.3, 177, 136, 870, 'Solid', 2041.4, 4098, 21.45, 1735, 'Antonio de Ulloa', '#D0D0E0', 'Precious transition metal with outstanding catalytic properties. Catalytic converters, hydrogen fuel cells, and cisplatin anticancer drugs.'],
  [79, 'Au', 'Gold', 196.97, 'transition-metal', 6, 11, 'd', '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', 2.54, 222.8, 174, 136, 890, 'Solid', 1337.33, 3243, 19.30, 'Ancient', 'Known to ancients', '#FFD700', 'Most malleable metal; relativistic 6s electron contraction produces its distinctive yellow luster. Does not tarnish or oxidize.'],
  [80, 'Hg', 'Mercury', 200.59, 'transition-metal', 6, 12, 'd', '[Xe] 4f¹⁴ 5d¹⁰ 6s²', 2.00, -48, 171, 132, 1007, 'Liquid', 234.32, 629.88, 13.534, 'Ancient', 'Known to ancients', '#B8B8D0', 'Only metallic element that is liquid at standard room temperature. Relativistic stabilization of 6s² pair prevents crystallization.'],
  [82, 'Pb', 'Lead', 207.2, 'post-transition-metal', 6, 14, 'p', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', 1.87, 35.1, 154, 146, 716, 'Solid', 600.61, 2022, 11.34, 'Ancient', 'Known to ancients', '#575961', 'Dense, malleable post-transition metal. The terminal stable endpoint of natural decay chains; key radiation shielding and battery anode.'],
  [86, 'Rn', 'Radon', 222, 'noble-gas', 6, 18, 'p', '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', 2.20, -68, 120, 145, 1037, 'Gas', 202, 211.3, 0.00973, 1899, 'Ernest Rutherford', '#408299', 'Dense radioactive noble gas formed from the decay of radium. Can accumulate indoors as a significant natural radiation health hazard.'],

  // Period 7 Actinides & Superheavy
  [92, 'U', 'Uranium', 238.03, 'actinide', 7, 3, 'f', '[Rn] 5f³ 6d¹ 7s²', 1.38, 50.9, 175, 196, 598, 'Solid', 1405.3, 4404, 19.1, 1789, 'Martin Klaproth', '#008FFF', 'Dense actinide metal. Uranium-235 is the primary fissile fuel driving commercial nuclear power reactors.'],
  [94, 'Pu', 'Plutonium', 244, 'actinide', 7, 3, 'f', '[Rn] 5f⁶ 7s²', 1.28, -48, 159, 187, 585, 'Solid', 912.5, 3505, 19.816, 1940, 'Glenn Seaborg', '#006BFF', 'Transuranic actinide. Plutonium-238 generates heat in Radioisotope Thermoelectric Generators (RTGs) powering deep-space NASA probes.'],
  [118, 'Og', 'Oganesson', 294, 'unknown', 7, 18, 'p', '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', undefined, 5.4, 152, 170, 860, 'Expected Gas', 325, 450, 5.0, 2002, 'Joint Institute for Nuclear Research & LLNL', '#6B5876', 'The heaviest chemical element officially recognized (Z=118). Relativistic electron effects predict unusual non-noble metallic behavior.'],
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
  if (group === 17) return [-1, 1, 3, 5, 7];
  if (group === 16) return [-2, 2, 4, 6];
  if (group === 15) return [-3, 3, 5];
  if (group === 14) return [-4, 2, 4];
  if (group === 13) return [1, 3];
  return [2, 3];
}
