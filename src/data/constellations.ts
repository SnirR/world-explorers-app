// Tappable constellations for the space screen. Each has a simplified star
// pattern (unit coordinates, y grows downward), connecting lines, a Hebrew
// name and a kid-friendly story. Directions place them on the far sky sphere.

export interface ConstellationSpec {
  id: string;
  nameHebrew: string;
  emoji: string;
  storyHebrew: string;
  /** star positions in a unit square (pattern space) */
  stars: [number, number][];
  /** index pairs into `stars` to connect with lines */
  lines: [number, number][];
  /** sky placement: azimuth (rad) + elevation (rad) on the far sphere */
  azimuth: number;
  elevation: number;
}

export const CONSTELLATIONS: ConstellationSpec[] = [
  {
    id: "const-big-dipper",
    nameHebrew: "הדובה הגדולה",
    emoji: "🐻",
    storyHebrew: "שבעה כוכבים בצורת מצקת ענקית — היא עוזרת למצוא את כוכב הצפון!",
    stars: [[0, 0.35], [0.18, 0.3], [0.36, 0.28], [0.52, 0.34], [0.66, 0.3], [0.88, 0.38], [0.74, 0.52]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
    azimuth: 0.4,
    elevation: 0.9,
  },
  {
    id: "const-orion",
    nameHebrew: "אוריון הצייד",
    emoji: "🏹",
    storyHebrew: "צייד ענק עם חגורה של שלושה כוכבים באמצע — הכי קל לזהות בשמיים!",
    stars: [[0.2, 0.05], [0.75, 0.08], [0.42, 0.42], [0.5, 0.5], [0.58, 0.58], [0.22, 0.92], [0.78, 0.88]],
    lines: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 1], [5, 6]],
    azimuth: 1.6,
    elevation: 0.35,
  },
  {
    id: "const-leo",
    nameHebrew: "מזל אריה",
    emoji: "🦁",
    storyHebrew: "אריה שוכב בשמיים! רואים את הרעמה שלו כמו מגל הפוך.",
    stars: [[0.85, 0.25], [0.72, 0.12], [0.58, 0.15], [0.5, 0.3], [0.6, 0.45], [0.2, 0.55], [0.05, 0.42]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [4, 5], [5, 6]],
    azimuth: 2.7,
    elevation: 0.7,
  },
  {
    id: "const-scorpius",
    nameHebrew: "מזל עקרב",
    emoji: "🦂",
    storyHebrew: "עקרב עם זנב מסולסל וכוכב אדום בוהק בלב שלו — אנטארס!",
    stars: [[0.1, 0.2], [0.22, 0.3], [0.3, 0.42], [0.36, 0.58], [0.48, 0.72], [0.66, 0.8], [0.82, 0.72], [0.88, 0.56]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
    azimuth: 3.6,
    elevation: 0.25,
  },
  {
    id: "const-cassiopeia",
    nameHebrew: "קסיופאה",
    emoji: "👑",
    storyHebrew: "מלכה יושבת על כיסא — חמישה כוכבים בצורת האות W!",
    stars: [[0.05, 0.6], [0.28, 0.3], [0.5, 0.55], [0.72, 0.25], [0.95, 0.5]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
    azimuth: 4.4,
    elevation: 0.95,
  },
  {
    id: "const-cygnus",
    nameHebrew: "הברבור",
    emoji: "🦢",
    storyHebrew: "ברבור ענק עף לאורך שביל החלב עם כנפיים פרושות!",
    stars: [[0.5, 0.05], [0.5, 0.35], [0.5, 0.65], [0.5, 0.95], [0.12, 0.45], [0.88, 0.45]],
    lines: [[0, 1], [1, 2], [2, 3], [4, 1], [1, 5]],
    azimuth: 5.2,
    elevation: 0.6,
  },
  {
    id: "const-taurus",
    nameHebrew: "מזל שור",
    emoji: "🐂",
    storyHebrew: "שור עם קרניים ארוכות ועין אדומה זוהרת — הכוכב אלדברן!",
    stars: [[0.5, 0.5], [0.4, 0.42], [0.35, 0.55], [0.08, 0.12], [0.92, 0.08], [0.62, 0.62]],
    lines: [[1, 0], [2, 1], [1, 3], [0, 4], [2, 5]],
    azimuth: 0.9,
    elevation: 0.5,
  },
  {
    id: "const-gemini",
    nameHebrew: "מזל תאומים",
    emoji: "👬",
    storyHebrew: "שני אחים תאומים שמחזיקים ידיים בשמיים — קסטור ופולוקס!",
    stars: [[0.3, 0.1], [0.7, 0.12], [0.28, 0.4], [0.68, 0.42], [0.25, 0.75], [0.72, 0.78]],
    lines: [[0, 2], [2, 4], [1, 3], [3, 5], [2, 3]],
    azimuth: 2.1,
    elevation: 0.85,
  },
  {
    id: "const-southern-cross",
    nameHebrew: "צלב הדרום",
    emoji: "✝️",
    storyHebrew: "ארבעה כוכבים בצורת עפיפון — מראים לספנים איפה הדרום!",
    stars: [[0.5, 0.05], [0.5, 0.95], [0.15, 0.55], [0.85, 0.45]],
    lines: [[0, 1], [2, 3]],
    azimuth: 3.1,
    elevation: -0.7,
  },
  {
    id: "const-pegasus",
    nameHebrew: "פגסוס הסוס המעופף",
    emoji: "🐴",
    storyHebrew: "סוס עם כנפיים! ארבעה כוכבים יוצרים את הריבוע הגדול של גופו.",
    stars: [[0.2, 0.2], [0.8, 0.22], [0.78, 0.75], [0.18, 0.72], [0.02, 0.45]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4]],
    azimuth: 5.9,
    elevation: -0.3,
  },
];

export const CONSTELLATION_BY_ID = new Map(CONSTELLATIONS.map((c) => [c.id, c]));
export const TOTAL_CONSTELLATIONS = CONSTELLATIONS.length;
