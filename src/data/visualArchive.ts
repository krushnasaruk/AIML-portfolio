export interface ArchiveItem {
  id: string;
  type: "person" | "event" | "project" | "workshop" | "achievement" | "club-moment" | "research";
  title: string;
  category: string;
  year: string;
  image: string;
  gallery?: string[];
  description: string;
  theme: "dark" | "light" | "warm" | "cool" | "neutral";
  typographyStyle: "technical" | "editorial" | "display" | "mono" | "minimal";
  bgColor: string;
  textColor: string;
  accentColor: string;
}

export type ArchiveItemData = ArchiveItem;
export const ArchiveItemData = {};

// Aristide Benoist-inspired harmonious editorial palettes
// Each palette matches the image tones: warm creams, cool slates, deep bronzes, elegant alabasters
const curatedPalettes = [
  { bgColor: '#f7f4ec', textColor: '#c99738', accentColor: '#c99738', theme: 'warm' as const },      // 01 House of Gucci gold
  { bgColor: '#d2d5d8', textColor: '#1d1f21', accentColor: '#1d1f21', theme: 'cool' as const },      // 02 Wakawaka stone gray
  { bgColor: '#ede7dd', textColor: '#2e2318', accentColor: '#a86f3b', theme: 'warm' as const },      // 03 Linen & espresso
  { bgColor: '#f4ede6', textColor: '#9c4d37', accentColor: '#9c4d37', theme: 'warm' as const },      // 04 Blush terracotta
  { bgColor: '#ecefe8', textColor: '#334637', accentColor: '#334637', theme: 'light' as const },     // 05 Celadon & botanical pine
  { bgColor: '#e3e4e6', textColor: '#15181b', accentColor: '#39424e', theme: 'cool' as const },      // 06 Minimal slate carbon
  { bgColor: '#1c1a18', textColor: '#d4aa58', accentColor: '#d4aa58', theme: 'dark' as const },      // 07 Noir & amber gold
  { bgColor: '#e8e5dc', textColor: '#42372d', accentColor: '#8a6848', theme: 'warm' as const },      // 08 Antique sand & mocha
  { bgColor: '#171b20', textColor: '#7aa2c8', accentColor: '#7aa2c8', theme: 'dark' as const },      // 09 Obsidian & cyan steel
  { bgColor: '#f2f0ea', textColor: '#1a1a1a', accentColor: '#c99738', theme: 'light' as const },     // 10 Editorial monochrome alabaster
  { bgColor: '#ebe5db', textColor: '#844b2f', accentColor: '#844b2f', theme: 'warm' as const },      // 11 Ochre clay
  { bgColor: '#dfe3e6', textColor: '#1e242b', accentColor: '#3a5068', theme: 'cool' as const },      // 12 Arctic concrete
];

const titles = [
  "MACHINES THAT LEARN", "TENSOR MATRIX", "NEURAL NIGHTS", "CORE COGNITION", "LATENT SPACES",
  "SYNTAX DYNAMICS", "SUMMIT VISION", "KAGGLE LAB", "GENESIS PRIME", "FUSION PULSE",
  "ARCHITECTURE X", "HORIZON AI", "VISION CORP", "PERCEPTRON", "GRADIENT FLOW",
  "DEEP INFERENCE", "CLOUD NEURAL", "EDGE MATRIX", "QUANTUM LOGIC", "CYBER NEXUS",
  "ROBOTICS ONE", "AUTOMATA SYSTEM", "INTELLIGENCE 24", "DATA STREAM", "PATTERN MINING",
  "LOGIC SYMBOL", "ALGORITHM V", "NEURAL NODE", "CLUSTER CORE", "NETWORK MESH"
];

const categories = [
  "ROBOTICS", "WORKSHOP", "HACKATHON", "TEAM", "RESEARCH",
  "STUDENT CODING", "CLUB MEETING", "COMPETITION", "PROJECT DEMO", "COLLABORATION",
  "TECH PRESENTATION", "CAMPUS ACTIVITY", "AI DEVELOPMENT", "MACHINE LEARNING", "DATA SCIENCE"
];

const types: ArchiveItem["type"][] = ["person", "event", "project", "workshop", "achievement", "club-moment", "research"];
const typoStyles: ArchiveItem["typographyStyle"][] = ["display", "editorial", "technical", "mono", "minimal"];

const coreLeaders: ArchiveItem[] = [
  {
    id: "abuzar",
    type: "person",
    title: "ABUZAR",
    category: "PRESIDENT",
    year: "2024",
    image: "/images/abuzar.jpeg",
    description: "President of the AIML Club. Leading the strategic vision and architectural direction of our AI initiatives and community growth.",
    theme: "warm",
    typographyStyle: "display",
    bgColor: "#f7f4ec",      // Warm cream matching Aristide Gucci
    textColor: "#c99738",    // Golden ochre accent
    accentColor: "#c99738",
  },
  {
    id: "arsh",
    type: "person",
    title: "ARSH",
    category: "TECHNICAL LEAD",
    year: "2024",
    image: "/images/arsh.jpeg",
    description: "Technical Lead driving machine learning model engineering and scalable algorithmic infrastructure across club projects.",
    theme: "cool",
    typographyStyle: "technical",
    bgColor: "#d2d5d8",      // Cool stone gray matching Aristide Wakawaka
    textColor: "#1d1f21",    // Deep charcoal
    accentColor: "#1d1f21",
  },
  {
    id: "krushna",
    type: "person",
    title: "KRUSHNA",
    category: "VICE PRESIDENT",
    year: "2024",
    image: "/images/krushna_1.jpeg",
    description: "Vice President overseeing strategic operations and collaborative team synergy across our engineering divisions.",
    theme: "warm",
    typographyStyle: "editorial",
    bgColor: "#ede7dd",      // Warm linen
    textColor: "#2e2318",    // Deep espresso
    accentColor: "#a86f3b",
  },
  {
    id: "vaishnavi",
    type: "person",
    title: "VAISHNAVI",
    category: "VICE PRESIDENT",
    year: "2024",
    image: "/images/vaishnavi.jpeg",
    description: "Vice President championing community outreach, student engagement, and interdisciplinary hackathon initiatives.",
    theme: "warm",
    typographyStyle: "minimal",
    bgColor: "#f4ede6",      // Blush porcelain
    textColor: "#9c4d37",    // Terracotta bronze
    accentColor: "#9c4d37",
  },
  {
    id: "yugshree",
    type: "person",
    title: "YUGSHREE MAM",
    category: "CLUB ADVISOR",
    year: "2024",
    image: "/images/yugshree_mam.jpeg",
    description: "Faculty Advisor providing academic mentorship and bridging the gap between theoretical research and real-world deployment.",
    theme: "light",
    typographyStyle: "editorial",
    bgColor: "#ecefe8",      // Pale celadon
    textColor: "#334637",    // Botanical pine
    accentColor: "#334637",
  },
  {
    id: "vedika",
    type: "person",
    title: "VEDIKA",
    category: "TECHNICAL LEAD",
    year: "2024",
    image: "/images/vedika.jpeg",
    description: "Technical Lead focusing on neural network architectures, computer vision pipelines, and student technical workshops.",
    theme: "cool",
    typographyStyle: "technical",
    bgColor: "#e3e4e6",      // Architectural concrete
    textColor: "#15181b",    // Dark slate
    accentColor: "#39424e",
  }
];

const generatedItems: ArchiveItem[] = Array.from({ length: 24 }).map((_, i) => {
  const palette = curatedPalettes[(i + 6) % curatedPalettes.length];
  return {
    id: `item-${i + 1}`,
    type: types[i % types.length],
    title: titles[i],
    category: categories[i % categories.length],
    year: (2023 + (i % 4)).toString(),
    image: `/images/item-${i + 1}.jpg`,
    description: `Exploring the frontiers of ${categories[i % categories.length].toLowerCase()} in our student-led AI/ML community.`,
    theme: palette.theme,
    typographyStyle: typoStyles[i % typoStyles.length],
    bgColor: palette.bgColor,
    textColor: palette.textColor,
    accentColor: palette.accentColor,
  };
});

export const visualArchive: ArchiveItem[] = [...coreLeaders, ...generatedItems];
