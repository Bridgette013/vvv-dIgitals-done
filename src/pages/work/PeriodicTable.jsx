import { useState, useEffect } from 'react';
import { Search, X, Atom, Flame, Snowflake, Wind } from 'lucide-react';
import Nav from '../../components/Nav';

// =====================================================================
// ELEMENT DATA — all 118
// y values 1–7 = main grid rows. y=8 → lanthanides, y=9 → actinides.
// =====================================================================
const E = (n, sym, name, mass, cat, x, y, config, phase = 'solid') =>
  ({ n, sym, name, mass, cat, x, y, config, phase });

const ELEMENTS = [
  E(1,  'H',  'Hydrogen',     1.008,   'reactive-nonmetal', 1,  1, '1s¹', 'gas'),
  E(2,  'He', 'Helium',       4.003,   'noble-gas',         18, 1, '1s²', 'gas'),
  E(3,  'Li', 'Lithium',      6.94,    'alkali-metal',      1,  2, '[He] 2s¹'),
  E(4,  'Be', 'Beryllium',    9.012,   'alkaline-earth-metal', 2, 2, '[He] 2s²'),
  E(5,  'B',  'Boron',        10.81,   'metalloid',         13, 2, '[He] 2s² 2p¹'),
  E(6,  'C',  'Carbon',       12.011,  'reactive-nonmetal', 14, 2, '[He] 2s² 2p²'),
  E(7,  'N',  'Nitrogen',     14.007,  'reactive-nonmetal', 15, 2, '[He] 2s² 2p³', 'gas'),
  E(8,  'O',  'Oxygen',       15.999,  'reactive-nonmetal', 16, 2, '[He] 2s² 2p⁴', 'gas'),
  E(9,  'F',  'Fluorine',     18.998,  'halogen',           17, 2, '[He] 2s² 2p⁵', 'gas'),
  E(10, 'Ne', 'Neon',         20.180,  'noble-gas',         18, 2, '[He] 2s² 2p⁶', 'gas'),
  E(11, 'Na', 'Sodium',       22.990,  'alkali-metal',      1,  3, '[Ne] 3s¹'),
  E(12, 'Mg', 'Magnesium',    24.305,  'alkaline-earth-metal', 2, 3, '[Ne] 3s²'),
  E(13, 'Al', 'Aluminum',     26.982,  'post-transition-metal', 13, 3, '[Ne] 3s² 3p¹'),
  E(14, 'Si', 'Silicon',      28.085,  'metalloid',         14, 3, '[Ne] 3s² 3p²'),
  E(15, 'P',  'Phosphorus',   30.974,  'reactive-nonmetal', 15, 3, '[Ne] 3s² 3p³'),
  E(16, 'S',  'Sulfur',       32.06,   'reactive-nonmetal', 16, 3, '[Ne] 3s² 3p⁴'),
  E(17, 'Cl', 'Chlorine',     35.45,   'halogen',           17, 3, '[Ne] 3s² 3p⁵', 'gas'),
  E(18, 'Ar', 'Argon',        39.948,  'noble-gas',         18, 3, '[Ne] 3s² 3p⁶', 'gas'),
  E(19, 'K',  'Potassium',    39.098,  'alkali-metal',      1,  4, '[Ar] 4s¹'),
  E(20, 'Ca', 'Calcium',      40.078,  'alkaline-earth-metal', 2, 4, '[Ar] 4s²'),
  E(21, 'Sc', 'Scandium',     44.956,  'transition-metal',  3,  4, '[Ar] 3d¹ 4s²'),
  E(22, 'Ti', 'Titanium',     47.867,  'transition-metal',  4,  4, '[Ar] 3d² 4s²'),
  E(23, 'V',  'Vanadium',     50.942,  'transition-metal',  5,  4, '[Ar] 3d³ 4s²'),
  E(24, 'Cr', 'Chromium',     51.996,  'transition-metal',  6,  4, '[Ar] 3d⁵ 4s¹'),
  E(25, 'Mn', 'Manganese',    54.938,  'transition-metal',  7,  4, '[Ar] 3d⁵ 4s²'),
  E(26, 'Fe', 'Iron',         55.845,  'transition-metal',  8,  4, '[Ar] 3d⁶ 4s²'),
  E(27, 'Co', 'Cobalt',       58.933,  'transition-metal',  9,  4, '[Ar] 3d⁷ 4s²'),
  E(28, 'Ni', 'Nickel',       58.693,  'transition-metal',  10, 4, '[Ar] 3d⁸ 4s²'),
  E(29, 'Cu', 'Copper',       63.546,  'transition-metal',  11, 4, '[Ar] 3d¹⁰ 4s¹'),
  E(30, 'Zn', 'Zinc',         65.38,   'transition-metal',  12, 4, '[Ar] 3d¹⁰ 4s²'),
  E(31, 'Ga', 'Gallium',      69.723,  'post-transition-metal', 13, 4, '[Ar] 3d¹⁰ 4s² 4p¹'),
  E(32, 'Ge', 'Germanium',    72.630,  'metalloid',         14, 4, '[Ar] 3d¹⁰ 4s² 4p²'),
  E(33, 'As', 'Arsenic',      74.922,  'metalloid',         15, 4, '[Ar] 3d¹⁰ 4s² 4p³'),
  E(34, 'Se', 'Selenium',     78.971,  'reactive-nonmetal', 16, 4, '[Ar] 3d¹⁰ 4s² 4p⁴'),
  E(35, 'Br', 'Bromine',      79.904,  'halogen',           17, 4, '[Ar] 3d¹⁰ 4s² 4p⁵', 'liquid'),
  E(36, 'Kr', 'Krypton',      83.798,  'noble-gas',         18, 4, '[Ar] 3d¹⁰ 4s² 4p⁶', 'gas'),
  E(37, 'Rb', 'Rubidium',     85.468,  'alkali-metal',      1,  5, '[Kr] 5s¹'),
  E(38, 'Sr', 'Strontium',    87.62,   'alkaline-earth-metal', 2, 5, '[Kr] 5s²'),
  E(39, 'Y',  'Yttrium',      88.906,  'transition-metal',  3,  5, '[Kr] 4d¹ 5s²'),
  E(40, 'Zr', 'Zirconium',    91.224,  'transition-metal',  4,  5, '[Kr] 4d² 5s²'),
  E(41, 'Nb', 'Niobium',      92.906,  'transition-metal',  5,  5, '[Kr] 4d⁴ 5s¹'),
  E(42, 'Mo', 'Molybdenum',   95.95,   'transition-metal',  6,  5, '[Kr] 4d⁵ 5s¹'),
  E(43, 'Tc', 'Technetium',   98,      'transition-metal',  7,  5, '[Kr] 4d⁵ 5s²'),
  E(44, 'Ru', 'Ruthenium',    101.07,  'transition-metal',  8,  5, '[Kr] 4d⁷ 5s¹'),
  E(45, 'Rh', 'Rhodium',      102.906, 'transition-metal',  9,  5, '[Kr] 4d⁸ 5s¹'),
  E(46, 'Pd', 'Palladium',    106.42,  'transition-metal',  10, 5, '[Kr] 4d¹⁰'),
  E(47, 'Ag', 'Silver',       107.868, 'transition-metal',  11, 5, '[Kr] 4d¹⁰ 5s¹'),
  E(48, 'Cd', 'Cadmium',      112.414, 'transition-metal',  12, 5, '[Kr] 4d¹⁰ 5s²'),
  E(49, 'In', 'Indium',       114.818, 'post-transition-metal', 13, 5, '[Kr] 4d¹⁰ 5s² 5p¹'),
  E(50, 'Sn', 'Tin',          118.710, 'post-transition-metal', 14, 5, '[Kr] 4d¹⁰ 5s² 5p²'),
  E(51, 'Sb', 'Antimony',     121.760, 'metalloid',         15, 5, '[Kr] 4d¹⁰ 5s² 5p³'),
  E(52, 'Te', 'Tellurium',    127.60,  'metalloid',         16, 5, '[Kr] 4d¹⁰ 5s² 5p⁴'),
  E(53, 'I',  'Iodine',       126.904, 'halogen',           17, 5, '[Kr] 4d¹⁰ 5s² 5p⁵'),
  E(54, 'Xe', 'Xenon',        131.293, 'noble-gas',         18, 5, '[Kr] 4d¹⁰ 5s² 5p⁶', 'gas'),
  E(55, 'Cs', 'Cesium',       132.905, 'alkali-metal',      1,  6, '[Xe] 6s¹'),
  E(56, 'Ba', 'Barium',       137.327, 'alkaline-earth-metal', 2, 6, '[Xe] 6s²'),
  E(57, 'La', 'Lanthanum',    138.905, 'lanthanide',        3,  8, '[Xe] 5d¹ 6s²'),
  E(58, 'Ce', 'Cerium',       140.116, 'lanthanide',        4,  8, '[Xe] 4f¹ 5d¹ 6s²'),
  E(59, 'Pr', 'Praseodymium', 140.908, 'lanthanide',        5,  8, '[Xe] 4f³ 6s²'),
  E(60, 'Nd', 'Neodymium',    144.242, 'lanthanide',        6,  8, '[Xe] 4f⁴ 6s²'),
  E(61, 'Pm', 'Promethium',   145,     'lanthanide',        7,  8, '[Xe] 4f⁵ 6s²'),
  E(62, 'Sm', 'Samarium',     150.36,  'lanthanide',        8,  8, '[Xe] 4f⁶ 6s²'),
  E(63, 'Eu', 'Europium',     151.964, 'lanthanide',        9,  8, '[Xe] 4f⁷ 6s²'),
  E(64, 'Gd', 'Gadolinium',   157.25,  'lanthanide',        10, 8, '[Xe] 4f⁷ 5d¹ 6s²'),
  E(65, 'Tb', 'Terbium',      158.925, 'lanthanide',        11, 8, '[Xe] 4f⁹ 6s²'),
  E(66, 'Dy', 'Dysprosium',   162.500, 'lanthanide',        12, 8, '[Xe] 4f¹⁰ 6s²'),
  E(67, 'Ho', 'Holmium',      164.930, 'lanthanide',        13, 8, '[Xe] 4f¹¹ 6s²'),
  E(68, 'Er', 'Erbium',       167.259, 'lanthanide',        14, 8, '[Xe] 4f¹² 6s²'),
  E(69, 'Tm', 'Thulium',      168.934, 'lanthanide',        15, 8, '[Xe] 4f¹³ 6s²'),
  E(70, 'Yb', 'Ytterbium',    173.045, 'lanthanide',        16, 8, '[Xe] 4f¹⁴ 6s²'),
  E(71, 'Lu', 'Lutetium',     174.967, 'lanthanide',        17, 8, '[Xe] 4f¹⁴ 5d¹ 6s²'),
  E(72, 'Hf', 'Hafnium',      178.49,  'transition-metal',  4,  6, '[Xe] 4f¹⁴ 5d² 6s²'),
  E(73, 'Ta', 'Tantalum',     180.948, 'transition-metal',  5,  6, '[Xe] 4f¹⁴ 5d³ 6s²'),
  E(74, 'W',  'Tungsten',     183.84,  'transition-metal',  6,  6, '[Xe] 4f¹⁴ 5d⁴ 6s²'),
  E(75, 'Re', 'Rhenium',      186.207, 'transition-metal',  7,  6, '[Xe] 4f¹⁴ 5d⁵ 6s²'),
  E(76, 'Os', 'Osmium',       190.23,  'transition-metal',  8,  6, '[Xe] 4f¹⁴ 5d⁶ 6s²'),
  E(77, 'Ir', 'Iridium',      192.217, 'transition-metal',  9,  6, '[Xe] 4f¹⁴ 5d⁷ 6s²'),
  E(78, 'Pt', 'Platinum',     195.084, 'transition-metal',  10, 6, '[Xe] 4f¹⁴ 5d⁹ 6s¹'),
  E(79, 'Au', 'Gold',         196.967, 'transition-metal',  11, 6, '[Xe] 4f¹⁴ 5d¹⁰ 6s¹'),
  E(80, 'Hg', 'Mercury',      200.592, 'transition-metal',  12, 6, '[Xe] 4f¹⁴ 5d¹⁰ 6s²', 'liquid'),
  E(81, 'Tl', 'Thallium',     204.38,  'post-transition-metal', 13, 6, '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹'),
  E(82, 'Pb', 'Lead',         207.2,   'post-transition-metal', 14, 6, '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²'),
  E(83, 'Bi', 'Bismuth',      208.980, 'post-transition-metal', 15, 6, '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³'),
  E(84, 'Po', 'Polonium',     209,     'post-transition-metal', 16, 6, '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴'),
  E(85, 'At', 'Astatine',     210,     'halogen',           17, 6, '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵'),
  E(86, 'Rn', 'Radon',        222,     'noble-gas',         18, 6, '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', 'gas'),
  E(87, 'Fr', 'Francium',     223,     'alkali-metal',      1,  7, '[Rn] 7s¹'),
  E(88, 'Ra', 'Radium',       226,     'alkaline-earth-metal', 2, 7, '[Rn] 7s²'),
  E(89, 'Ac', 'Actinium',     227,     'actinide',          3,  9, '[Rn] 6d¹ 7s²'),
  E(90, 'Th', 'Thorium',      232.038, 'actinide',          4,  9, '[Rn] 6d² 7s²'),
  E(91, 'Pa', 'Protactinium', 231.036, 'actinide',          5,  9, '[Rn] 5f² 6d¹ 7s²'),
  E(92, 'U',  'Uranium',      238.029, 'actinide',          6,  9, '[Rn] 5f³ 6d¹ 7s²'),
  E(93, 'Np', 'Neptunium',    237,     'actinide',          7,  9, '[Rn] 5f⁴ 6d¹ 7s²'),
  E(94, 'Pu', 'Plutonium',    244,     'actinide',          8,  9, '[Rn] 5f⁶ 7s²'),
  E(95, 'Am', 'Americium',    243,     'actinide',          9,  9, '[Rn] 5f⁷ 7s²'),
  E(96, 'Cm', 'Curium',       247,     'actinide',          10, 9, '[Rn] 5f⁷ 6d¹ 7s²'),
  E(97, 'Bk', 'Berkelium',    247,     'actinide',          11, 9, '[Rn] 5f⁹ 7s²'),
  E(98, 'Cf', 'Californium',  251,     'actinide',          12, 9, '[Rn] 5f¹⁰ 7s²'),
  E(99, 'Es', 'Einsteinium',  252,     'actinide',          13, 9, '[Rn] 5f¹¹ 7s²'),
  E(100,'Fm', 'Fermium',      257,     'actinide',          14, 9, '[Rn] 5f¹² 7s²'),
  E(101,'Md', 'Mendelevium',  258,     'actinide',          15, 9, '[Rn] 5f¹³ 7s²'),
  E(102,'No', 'Nobelium',     259,     'actinide',          16, 9, '[Rn] 5f¹⁴ 7s²'),
  E(103,'Lr', 'Lawrencium',   266,     'actinide',          17, 9, '[Rn] 5f¹⁴ 7s² 7p¹'),
  E(104,'Rf', 'Rutherfordium',267,     'transition-metal',  4,  7, '[Rn] 5f¹⁴ 6d² 7s²'),
  E(105,'Db', 'Dubnium',      268,     'transition-metal',  5,  7, '[Rn] 5f¹⁴ 6d³ 7s²'),
  E(106,'Sg', 'Seaborgium',   269,     'transition-metal',  6,  7, '[Rn] 5f¹⁴ 6d⁴ 7s²'),
  E(107,'Bh', 'Bohrium',      270,     'transition-metal',  7,  7, '[Rn] 5f¹⁴ 6d⁵ 7s²'),
  E(108,'Hs', 'Hassium',      277,     'transition-metal',  8,  7, '[Rn] 5f¹⁴ 6d⁶ 7s²'),
  E(109,'Mt', 'Meitnerium',   278,     'unknown',           9,  7, '[Rn] 5f¹⁴ 6d⁷ 7s²'),
  E(110,'Ds', 'Darmstadtium', 281,     'unknown',           10, 7, '[Rn] 5f¹⁴ 6d⁸ 7s²'),
  E(111,'Rg', 'Roentgenium',  282,     'unknown',           11, 7, '[Rn] 5f¹⁴ 6d⁹ 7s²'),
  E(112,'Cn', 'Copernicium',  285,     'transition-metal',  12, 7, '[Rn] 5f¹⁴ 6d¹⁰ 7s²'),
  E(113,'Nh', 'Nihonium',     286,     'unknown',           13, 7, '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹'),
  E(114,'Fl', 'Flerovium',    289,     'unknown',           14, 7, '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²'),
  E(115,'Mc', 'Moscovium',    290,     'unknown',           15, 7, '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³'),
  E(116,'Lv', 'Livermorium',  293,     'unknown',           16, 7, '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴'),
  E(117,'Ts', 'Tennessine',   294,     'unknown',           17, 7, '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵'),
  E(118,'Og', 'Oganesson',    294,     'unknown',           18, 7, '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', 'gas'),
];

const CATEGORIES = {
  'alkali-metal':          { label: 'Alkali Metal',         color: '#E07A5F' },
  'alkaline-earth-metal':  { label: 'Alkaline Earth',       color: '#E8B04B' },
  'transition-metal':      { label: 'Transition Metal',     color: '#7DA9C7' },
  'post-transition-metal': { label: 'Post-Transition',      color: '#85B79D' },
  'metalloid':             { label: 'Metalloid',            color: '#C9A875' },
  'reactive-nonmetal':     { label: 'Reactive Nonmetal',    color: '#8FBC6E' },
  'halogen':               { label: 'Halogen',              color: '#5DADE2' },
  'noble-gas':             { label: 'Noble Gas',            color: '#B58CD9' },
  'lanthanide':            { label: 'Lanthanide',           color: '#D87FA0' },
  'actinide':              { label: 'Actinide',             color: '#D96E5C' },
  'unknown':               { label: 'Unknown',              color: '#8A8579' },
};

const periodOf = (n) => {
  if (n <= 2) return 1;
  if (n <= 10) return 2;
  if (n <= 18) return 3;
  if (n <= 36) return 4;
  if (n <= 54) return 5;
  if (n <= 86) return 6;
  return 7;
};

const groupOf = (el) => {
  if (el.cat === 'lanthanide' || el.cat === 'actinide') return '—';
  if (el.x === 1) return '1 (IA)';
  if (el.x === 2) return '2 (IIA)';
  if (el.x === 13) return '13 (IIIA)';
  if (el.x === 14) return '14 (IVA)';
  if (el.x === 15) return '15 (VA)';
  if (el.x === 16) return '16 (VIA)';
  if (el.x === 17) return '17 (VIIA)';
  if (el.x === 18) return '18 (VIIIA)';
  return String(el.x);
};

const getShells = (n) => {
  const caps = [2, 8, 8, 18, 18, 32, 32];
  const shells = [];
  let r = n;
  for (const cap of caps) {
    if (r <= 0) break;
    shells.push(Math.min(r, cap));
    r -= shells[shells.length - 1];
  }
  return shells;
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=JetBrains+Mono:wght@300;400;500;600&family=Manrope:wght@300;400;500;600;700&display=swap');

  .pt-display { font-family: 'Fraunces', Georgia, serif; font-feature-settings: 'ss01' 1, 'ss02' 1; }
  .pt-mono    { font-family: 'JetBrains Mono', ui-monospace, monospace; font-feature-settings: 'tnum' 1; }
  .pt-sans    { font-family: 'Manrope', system-ui, sans-serif; }

  .pt-grain {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.9 0 0 0 0 0.85 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    background-size: 240px;
  }

  @keyframes pt-pulse-ring {
    0%, 100% { box-shadow: 0 0 0 1.5px var(--ring-color), 0 0 18px -2px var(--ring-color); }
    50%      { box-shadow: 0 0 0 1.5px var(--ring-color), 0 0 32px 2px var(--ring-color); }
  }
  .pt-pulse { animation: pt-pulse-ring 2.4s ease-in-out infinite; }

  @keyframes pt-fade-up {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pt-fade-up { animation: pt-fade-up 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); }

  @keyframes pt-orbit {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .pt-orbit-1 { transform-origin: center; animation: pt-orbit 18s linear infinite; }
  .pt-orbit-2 { transform-origin: center; animation: pt-orbit 24s linear infinite reverse; }
  .pt-orbit-3 { transform-origin: center; animation: pt-orbit 30s linear infinite; }
  .pt-orbit-4 { transform-origin: center; animation: pt-orbit 36s linear infinite reverse; }
  .pt-orbit-5 { transform-origin: center; animation: pt-orbit 42s linear infinite; }
  .pt-orbit-6 { transform-origin: center; animation: pt-orbit 48s linear infinite reverse; }
  .pt-orbit-7 { transform-origin: center; animation: pt-orbit 54s linear infinite; }

  .pt-scroll::-webkit-scrollbar { height: 4px; }
  .pt-scroll::-webkit-scrollbar-track { background: transparent; }
  .pt-scroll::-webkit-scrollbar-thumb { background: rgba(240, 230, 210, 0.15); border-radius: 4px; }
`;

function AtomDiagram({ element }) {
  const shells = getShells(element.n);
  const center = 110;
  const baseRadius = 22;
  const step = 11;
  const color = CATEGORIES[element.cat].color;

  return (
    <svg viewBox="0 0 220 220" className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="pt-nucleus" cx="50%" cy="50%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.95" />
          <stop offset="60%"  stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {shells.map((_, i) => (
        <circle
          key={`ring-${i}`}
          cx={center} cy={center}
          r={baseRadius + i * step}
          fill="none"
          stroke={color}
          strokeWidth="0.4"
          strokeDasharray="2 3"
          opacity="0.45"
        />
      ))}

      {shells.map((count, i) => (
        <g key={`shell-${i}`} className={`pt-orbit-${i + 1}`} style={{ transformBox: 'fill-box' }}>
          {Array.from({ length: count }).map((_, j) => {
            const angle = (j / count) * Math.PI * 2;
            const r = baseRadius + i * step;
            const cx = center + Math.cos(angle) * r;
            const cy = center + Math.sin(angle) * r;
            return (
              <circle
                key={`e-${i}-${j}`}
                cx={cx} cy={cy} r="1.6"
                fill={color}
                opacity="0.95"
              />
            );
          })}
        </g>
      ))}

      <circle cx={center} cy={center} r="22" fill="url(#pt-nucleus)" />
      <circle cx={center} cy={center} r="11" fill={color} opacity="0.85" />

      <text
        x={center} y={center}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="700"
        fontFamily="Manrope, sans-serif"
        fill="#0F0D0A"
      >
        {element.sym}
      </text>

      {shells.map((count, i) => {
        const r = baseRadius + i * step;
        return (
          <text
            key={`lbl-${i}`}
            x={center + r + 4}
            y={center - 1}
            fontSize="6"
            fontFamily="JetBrains Mono, monospace"
            fill={color}
            opacity="0.7"
          >
            {count}
          </text>
        );
      })}
    </svg>
  );
}

function PhaseIcon({ phase, size = 10 }) {
  if (phase === 'gas')    return <Wind size={size} strokeWidth={1.8} />;
  if (phase === 'liquid') return <Snowflake size={size} strokeWidth={1.8} />;
  return <Flame size={size} strokeWidth={1.8} />;
}

function ElementTile({ el, isHighlighted, isDimmed, isSelected, onHover, onLeave, onClick }) {
  const cat = CATEGORIES[el.cat];
  const gridRow = el.y === 8 ? 9 : el.y === 9 ? 10 : el.y;

  return (
    <button
      type="button"
      onMouseEnter={() => onHover(el)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(el)}
      onBlur={onLeave}
      onClick={() => onClick(el)}
      style={{
        gridColumn: el.x,
        gridRow,
        '--cat-color': cat.color,
        '--ring-color': cat.color,
        backgroundColor: `${cat.color}1A`,
        borderColor: `${cat.color}55`,
        color: '#F0E6D2',
        opacity: isDimmed ? 0.18 : 1,
      }}
      className={[
        'group relative aspect-square w-full overflow-hidden',
        'border rounded-[4px] cursor-pointer text-left',
        'transition-all duration-200 ease-out',
        'hover:scale-[1.08] hover:z-20 hover:border-[var(--cat-color)]',
        'hover:shadow-[0_8px_24px_-4px_var(--cat-color)]',
        'focus:outline-none focus:scale-[1.08] focus:z-20',
        isHighlighted ? 'ring-1 ring-[var(--cat-color)]' : '',
        isSelected ? 'pt-pulse z-10' : '',
      ].join(' ')}
    >
      <span className="pt-mono absolute top-[2px] left-[3px] text-[8px] leading-none opacity-75 tabular-nums">
        {el.n}
      </span>

      <span
        className="absolute top-[3px] right-[3px] opacity-50"
        style={{ color: cat.color }}
      >
        <PhaseIcon phase={el.phase} size={8} />
      </span>

      <span
        className="pt-sans absolute inset-0 flex items-center justify-center font-bold tracking-tight"
        style={{ fontSize: 'clamp(13px, 2vw, 22px)' }}
      >
        {el.sym}
      </span>

      <span className="pt-sans absolute bottom-[2px] left-1/2 -translate-x-1/2 text-[6.5px] leading-none opacity-70 whitespace-nowrap">
        {el.name}
      </span>

      <span
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ backgroundColor: cat.color, opacity: 0.55 }}
      />
    </button>
  );
}

const blockOf = (el) => {
  if (el.cat === 'lanthanide' || el.cat === 'actinide') return 'f';
  if (el.x >= 3 && el.x <= 12) return 'd';
  if (el.x === 1 || el.x === 2 || (el.n === 2)) return 's';
  return 'p';
};

function Fact({ label, value, mono = false }) {
  return (
    <div className="leading-tight">
      <div className="text-[8.5px] uppercase tracking-[0.15em] opacity-45 mb-[1px]">{label}</div>
      <div className={`text-[11px] opacity-90 ${mono ? 'pt-mono' : ''}`}>{value}</div>
    </div>
  );
}

function DetailPanel({ element }) {
  if (!element) {
    return (
      <div className="border border-[#F0E6D222] rounded-lg bg-[#1A1814] px-6 py-8 mb-6 min-h-[220px] flex items-center justify-center">
        <div className="text-center">
          <Atom className="w-8 h-8 mx-auto mb-3 opacity-40" strokeWidth={1.2} />
          <p className="pt-display italic text-2xl opacity-60 mb-1">
            Hover any element to begin
          </p>
          <p className="pt-sans text-xs opacity-40">
            Click to pin · Search by name, symbol, or number · Filter by category
          </p>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES[element.cat];
  const period = periodOf(element.n);

  return (
    <div
      key={element.n}
      className="pt-fade-up border rounded-lg bg-gradient-to-br from-[#1A1814] to-[#14110D] mb-6 overflow-hidden"
      style={{ borderColor: `${cat.color}44` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-4 p-5 items-center">
        <div className="flex items-center justify-center">
          <div className="w-[180px] h-[180px]">
            <AtomDiagram element={element} />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="pt-mono text-xs opacity-50 tabular-nums">
              № {String(element.n).padStart(3, '0')}
            </span>
            <span
              className="pt-sans text-[10px] uppercase tracking-[0.18em] px-2 py-[2px] rounded-full"
              style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
            >
              {cat.label}
            </span>
          </div>

          <h2 className="pt-display text-5xl md:text-6xl leading-none mb-1" style={{ color: cat.color }}>
            <span className="font-light italic">{element.name}</span>
          </h2>

          <div className="flex items-baseline gap-4 mt-2">
            <span className="pt-sans text-7xl md:text-8xl font-bold leading-none">
              {element.sym}
            </span>
            <div className="pt-mono text-xs opacity-70 space-y-[2px]">
              <div>{element.mass} u</div>
              <div className="flex items-center gap-1 capitalize opacity-70">
                <PhaseIcon phase={element.phase} size={10} />
                <span>{element.phase} at 25°C</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-mono text-[11px] grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-[6px] min-w-[180px] border-l-0 md:border-l md:pl-5" style={{ borderColor: `${cat.color}33` }}>
          <Fact label="Group"  value={groupOf(element)} />
          <Fact label="Period" value={period} />
          <Fact label="Block"  value={blockOf(element)} />
          <Fact label="Shells" value={getShells(element.n).join(' · ')} />
          <Fact label="Configuration" value={element.config} mono />
        </div>
      </div>
    </div>
  );
}

function FilterChips({ active, onChange }) {
  return (
    <div className="pt-scroll flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
      <Chip
        label="All elements"
        color="#F0E6D2"
        isActive={!active}
        onClick={() => onChange(null)}
      />
      {Object.entries(CATEGORIES).map(([key, c]) => (
        <Chip
          key={key}
          label={c.label}
          color={c.color}
          isActive={active === key}
          onClick={() => onChange(active === key ? null : key)}
        />
      ))}
    </div>
  );
}

function Chip({ label, color, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        backgroundColor: isActive ? `${color}33` : 'transparent',
        borderColor: isActive ? color : `${color}55`,
        color: isActive ? color : '#F0E6D2BB',
      }}
      className="pt-sans text-[11px] uppercase tracking-[0.14em] whitespace-nowrap px-3 py-[6px] rounded-full border transition-colors duration-200 hover:text-[var(--c)]"
    >
      <span className="inline-block w-[6px] h-[6px] rounded-full mr-2 align-middle" style={{ backgroundColor: color }} />
      {label}
    </button>
  );
}

export default function PeriodicTable() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);

  const active = hovered || selected;

  const matchSearch = (el) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const numQ = parseInt(q, 10);
    if (!Number.isNaN(numQ) && el.n === numQ) return true;
    if (el.sym.toLowerCase() === q) return true;
    if (el.name.toLowerCase().includes(q)) return true;
    if (el.sym.toLowerCase().includes(q)) return true;
    return false;
  };

  const matchCategory = (el) => !activeFilter || el.cat === activeFilter;
  const isMatched = (el) => matchSearch(el) && matchCategory(el);
  const filteringActive = !!search.trim() || !!activeFilter;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelected(null);
        setSearch('');
        setActiveFilter(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const matchedCount = ELEMENTS.filter(isMatched).length;

  return (
    <>
      <Nav />
      <div className="min-h-screen w-full pt-sans relative overflow-x-auto" style={{ background: 'radial-gradient(ellipse at top, #181410 0%, #0E0C09 70%)', color: '#F0E6D2' }}>
        <style>{STYLES}</style>

        <div className="pt-grain absolute inset-0 pointer-events-none mix-blend-overlay" />

        <div className="relative max-w-[1320px] mx-auto px-6 py-10 min-w-[1100px]" style={{ paddingTop: 120 }}>

          <header className="flex items-end justify-between mb-8 gap-8 flex-wrap">
            <div>
              <div className="pt-mono text-[10px] uppercase tracking-[0.3em] opacity-50 mb-2">
                An interactive reference · 118 elements
              </div>
              <h1 className="pt-display text-6xl md:text-7xl leading-[0.9] tracking-tight">
                <span className="italic font-light">The</span>{' '}
                <span className="font-semibold">Periodic</span>
                <br />
                <span className="italic font-light opacity-80">Table of</span>{' '}
                <span className="font-semibold">Elements</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={14} />
                <input
                  type="text"
                  placeholder="Search Au, gold, 79…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pt-mono bg-[#1A1814] border border-[#F0E6D222] rounded-md pl-9 pr-9 py-2 text-xs w-[260px] focus:outline-none focus:border-[#F0E6D255] placeholder:opacity-40"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="pt-mono text-[10px] opacity-50 tabular-nums">
                {matchedCount}/118
              </div>
            </div>
          </header>

          <DetailPanel element={active} />

          <FilterChips active={activeFilter} onChange={setActiveFilter} />

          <div
            className="relative"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
              gridTemplateRows: 'repeat(7, minmax(0, 1fr)) 14px repeat(2, minmax(0, 1fr))',
              gap: '3px',
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((p) => (
              <div
                key={`period-${p}`}
                className="pt-mono text-[9px] opacity-30 absolute"
                style={{ left: '-18px', top: `calc(${(p - 1)} * (100% / 9.2) + ${(p - 1) * 0.4}rem + 1.4rem)` }}
              >
                {p}
              </div>
            ))}

            {ELEMENTS.map((el) => {
              const matched = isMatched(el);
              const isDim = filteringActive && !matched;
              const isHi = filteringActive && matched;
              const isSel = selected?.n === el.n;
              return (
                <ElementTile
                  key={el.n}
                  el={el}
                  isDimmed={isDim}
                  isHighlighted={isHi}
                  isSelected={isSel}
                  onHover={setHovered}
                  onLeave={() => setHovered(null)}
                  onClick={(e) => setSelected(selected?.n === e.n ? null : e)}
                />
              );
            })}

            <div
              className="pt-mono text-[9px] opacity-50 border border-dashed rounded-[4px] flex flex-col items-center justify-center text-center px-1"
              style={{ gridColumn: 3, gridRow: 6, borderColor: `${CATEGORIES['lanthanide'].color}66`, color: CATEGORIES['lanthanide'].color }}
            >
              <span className="text-[9px]">57</span>
              <span style={{ fontSize: '8px' }}>↓</span>
              <span className="text-[9px]">71</span>
            </div>
            <div
              className="pt-mono text-[9px] opacity-50 border border-dashed rounded-[4px] flex flex-col items-center justify-center text-center px-1"
              style={{ gridColumn: 3, gridRow: 7, borderColor: `${CATEGORIES['actinide'].color}66`, color: CATEGORIES['actinide'].color }}
            >
              <span className="text-[9px]">89</span>
              <span style={{ fontSize: '8px' }}>↓</span>
              <span className="text-[9px]">103</span>
            </div>
          </div>

          <footer className="pt-mono text-[10px] opacity-40 mt-10 flex justify-between flex-wrap gap-4">
            <span>Atomic masses per IUPAC 2021 · Brackets denote most stable isotope mass number</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Wind size={9} /> gas</span>
              <span className="flex items-center gap-1"><Snowflake size={9} /> liquid</span>
              <span className="flex items-center gap-1"><Flame size={9} /> solid</span>
              <span className="opacity-60">· Press ESC to reset</span>
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}
