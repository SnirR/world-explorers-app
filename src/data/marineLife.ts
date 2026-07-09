// The marine-life catalog: ~38 creatures, each living in specific oceans and
// a specific depth zone, with a low-poly builder style and a wow-fact.

import type { OceanId, OceanZoneId } from "./oceans";

export type CreatureStyle =
  | "fish"        // generic parametric fish
  | "shark"
  | "whale"
  | "dolphin"
  | "turtle"
  | "jellyfish"
  | "octopus"
  | "ray"
  | "seahorse"
  | "crab"
  | "penguin"
  | "seal"
  | "anglerfish"
  | "squid"
  | "starfish"
  | "pufferfish"
  | "bear"        // polar bear (yes, it swims!)
  | "narwhal";

export interface MarineCreature {
  id: string;
  nameHebrew: string;
  emoji: string;
  factHebrew: string;
  oceans: OceanId[];
  zone: OceanZoneId;
  style: CreatureStyle;
  color: string;
  accentColor: string;
  /** overall scale multiplier (1 = small fish) */
  size: number;
  /** swim speed multiplier */
  speed: number;
  /** glows in the dark (deep-sea bioluminescence) */
  glows?: boolean;
}

export const MARINE_LIFE: MarineCreature[] = [
  // ── המים הרדודים / שונית 🪸 ──────────────────────────────────────────────
  { id: "clownfish",   nameHebrew: "דג ליצן",        emoji: "🐠", factHebrew: "דג הליצן גר בתוך שושנת ים — והיא שומרת עליו מטורפים!", oceans: ["pacific", "indian"], zone: "reef", style: "fish", color: "#f97316", accentColor: "#ffffff", size: 0.8, speed: 1.2 },
  { id: "blue-tang",   nameHebrew: "דג כירורג כחול", emoji: "🐟", factHebrew: "דג הכירורג הכחול יכול 'להתחבא' בין האלמוגים כשהוא ישן!", oceans: ["pacific", "indian"], zone: "reef", style: "fish", color: "#2563eb", accentColor: "#fbbf24", size: 0.9, speed: 1.1 },
  { id: "sea-turtle",  nameHebrew: "צב ים",           emoji: "🐢", factHebrew: "צבות הים חוזרות להטיל ביצים בדיוק בחוף שבו הן נולדו!", oceans: ["pacific", "atlantic", "indian"], zone: "reef", style: "turtle", color: "#4d7c0f", accentColor: "#a3b18a", size: 1.6, speed: 0.6 },
  { id: "seahorse",    nameHebrew: "סוסון ים",        emoji: "🦄", factHebrew: "אצל סוסוני הים דווקא האבא נושא את הביצים בכיס מיוחד!", oceans: ["atlantic", "pacific"], zone: "reef", style: "seahorse", color: "#eab308", accentColor: "#ca8a04", size: 0.6, speed: 0.4 },
  { id: "starfish",    nameHebrew: "כוכב ים",         emoji: "⭐", factHebrew: "אם כוכב ים מאבד זרוע — צומחת לו חדשה במקומה!", oceans: ["pacific", "atlantic", "indian", "arctic", "southern"], zone: "reef", style: "starfish", color: "#f43f5e", accentColor: "#fb7185", size: 0.8, speed: 0 },
  { id: "crab",        nameHebrew: "סרטן",            emoji: "🦀", factHebrew: "הסרטן הולך הצידה — ויש לו שריון שמתחלף כשהוא גדל!", oceans: ["pacific", "atlantic", "indian", "arctic", "southern"], zone: "reef", style: "crab", color: "#dc2626", accentColor: "#f87171", size: 0.7, speed: 0.3 },
  { id: "pufferfish",  nameHebrew: "דג נפוח",         emoji: "🐡", factHebrew: "כשדג הנפוח נבהל הוא מתנפח לכדור מלא קוצים!", oceans: ["indian", "pacific"], zone: "reef", style: "pufferfish", color: "#d4a373", accentColor: "#fefae0", size: 0.9, speed: 0.7 },
  { id: "parrotfish",  nameHebrew: "דג תוכי",         emoji: "🦜", factHebrew: "דג התוכי נוגס באלמוגים — והחול הלבן בחוף הוא ה... קקי שלו!", oceans: ["atlantic", "indian"], zone: "reef", style: "fish", color: "#14b8a6", accentColor: "#f472b6", size: 1.0, speed: 0.9 },
  { id: "octopus",     nameHebrew: "תמנון",           emoji: "🐙", factHebrew: "לתמנון יש שלושה לבבות — והוא יכול להחליף צבע בשנייה!", oceans: ["pacific", "atlantic", "indian"], zone: "reef", style: "octopus", color: "#9333ea", accentColor: "#c084fc", size: 1.1, speed: 0.5 },
  { id: "reef-shark",  nameHebrew: "כריש שונית",      emoji: "🦈", factHebrew: "כריש השונית ישן בזמן שחלק מהמוח שלו נשאר ער!", oceans: ["pacific", "indian"], zone: "reef", style: "shark", color: "#64748b", accentColor: "#cbd5e1", size: 1.7, speed: 1.3 },
  { id: "lionfish",    nameHebrew: "זהרון",           emoji: "🦁", factHebrew: "לזהרון יש סנפירים כמו רעמת אריה — אבל אסור לגעת, הם עוקצים!", oceans: ["indian"], zone: "reef", style: "fish", color: "#b91c1c", accentColor: "#fecaca", size: 0.9, speed: 0.6 },
  { id: "ray",         nameHebrew: "טריגון",          emoji: "🥞", factHebrew: "הטריגון 'עף' במים כמו שטיח קסמים שטוח!", oceans: ["pacific", "atlantic", "indian"], zone: "reef", style: "ray", color: "#78716c", accentColor: "#d6d3d1", size: 1.4, speed: 0.8 },
  { id: "arctic-cod",  nameHebrew: "דג קרח",          emoji: "❄️", factHebrew: "בדם של דג הקרח יש 'נוגד קיפאון' — כדי שלא יקפא במים!", oceans: ["arctic", "southern"], zone: "reef", style: "fish", color: "#93c5fd", accentColor: "#e0f2fe", size: 0.9, speed: 0.9 },
  { id: "krill",       nameHebrew: "קריל",            emoji: "🦐", factHebrew: "הקריל זעיר — אבל להקות שלו נראות מהחלל!", oceans: ["southern", "arctic"], zone: "reef", style: "fish", color: "#fb923c", accentColor: "#fed7aa", size: 0.4, speed: 1.4 },

  // ── הים הפתוח 🐬 ─────────────────────────────────────────────────────────
  { id: "dolphin",     nameHebrew: "דולפין",          emoji: "🐬", factHebrew: "דולפינים קוראים זה לזה בשמות — לכל אחד שריקה משלו!", oceans: ["pacific", "atlantic", "indian"], zone: "open", style: "dolphin", color: "#60a5fa", accentColor: "#bfdbfe", size: 1.6, speed: 1.6 },
  { id: "blue-whale",  nameHebrew: "לווייתן כחול",    emoji: "🐋", factHebrew: "הלווייתן הכחול הוא החיה הכי גדולה שחיה אי פעם — גדול מדינוזאור!", oceans: ["pacific", "atlantic", "indian", "southern"], zone: "open", style: "whale", color: "#3b82f6", accentColor: "#93c5fd", size: 3.4, speed: 0.5 },
  { id: "orca",        nameHebrew: "אורקה",           emoji: "🐳", factHebrew: "האורקה נקראת 'לווייתן קטלן' — אבל היא בעצם דולפין ענק!", oceans: ["pacific", "atlantic", "arctic", "southern"], zone: "open", style: "whale", color: "#0f172a", accentColor: "#f8fafc", size: 2.4, speed: 1.2 },
  { id: "humpback",    nameHebrew: "לווייתן גדול-סנפיר", emoji: "🎵", factHebrew: "לווייתן גדול-הסנפיר שר שירים שנמשכים שעות — מתחת למים!", oceans: ["pacific", "atlantic"], zone: "open", style: "whale", color: "#475569", accentColor: "#94a3b8", size: 2.9, speed: 0.6 },
  { id: "swordfish",   nameHebrew: "דג חרב",          emoji: "⚔️", factHebrew: "דג החרב שוחה עד 100 קמ\"ש — מהדגים המהירים בעולם!", oceans: ["atlantic", "indian"], zone: "open", style: "fish", color: "#334155", accentColor: "#cbd5e1", size: 1.6, speed: 2.2 },
  { id: "tuna",        nameHebrew: "טונה",            emoji: "🍣", factHebrew: "הטונה שוחה כל החיים בלי להפסיק — אפילו כשהיא ישנה!", oceans: ["atlantic", "pacific", "indian"], zone: "open", style: "fish", color: "#1e40af", accentColor: "#e2e8f0", size: 1.3, speed: 1.8 },
  { id: "jellyfish",   nameHebrew: "מדוזה",           emoji: "🪼", factHebrew: "למדוזה אין מוח, אין לב ואין עצמות — והיא שוחה כבר 500 מיליון שנה!", oceans: ["pacific", "atlantic", "indian", "arctic", "southern"], zone: "open", style: "jellyfish", color: "#e879f9", accentColor: "#f5d0fe", size: 1.1, speed: 0.3 },
  { id: "flying-fish", nameHebrew: "דג מעופף",        emoji: "🛫", factHebrew: "הדג המעופף קופץ מהמים ודואה באוויר עשרות מטרים!", oceans: ["atlantic", "pacific"], zone: "open", style: "fish", color: "#0ea5e9", accentColor: "#e0f2fe", size: 0.8, speed: 2.0 },
  { id: "hammerhead",  nameHebrew: "כריש פטיש",       emoji: "🔨", factHebrew: "לכריש הפטיש יש עיניים בקצוות הראש — הוא רואה כמעט לכל הכיוונים!", oceans: ["pacific", "atlantic", "indian"], zone: "open", style: "shark", color: "#57534e", accentColor: "#d6d3d1", size: 1.9, speed: 1.1 },
  { id: "sea-lion",    nameHebrew: "אריה ים",         emoji: "🦭", factHebrew: "אריות הים משחקים בגלים בדיוק כמו ילדים בבריכה!", oceans: ["pacific", "southern"], zone: "open", style: "seal", color: "#92664a", accentColor: "#c8a27e", size: 1.4, speed: 1.0 },
  { id: "penguin",     nameHebrew: "פינגווין",        emoji: "🐧", factHebrew: "הפינגווין לא עף באוויר — אבל מתחת למים הוא 'עף' במהירות!", oceans: ["southern"], zone: "open", style: "penguin", color: "#111827", accentColor: "#f9fafb", size: 1.0, speed: 1.5 },
  { id: "polar-bear",  nameHebrew: "דוב קוטב",        emoji: "🐻‍❄️", factHebrew: "דוב הקוטב הוא שחיין אלוף — הוא יכול לשחות ימים שלמים בקרח!", oceans: ["arctic"], zone: "open", style: "bear", color: "#f1f5f9", accentColor: "#94a3b8", size: 1.9, speed: 0.7 },
  { id: "narwhal",     nameHebrew: "נרוול",           emoji: "🦄", factHebrew: "לנרוול יש 'חרב' ארוכה על האף — בעצם זו שן ענקית! חד-קרן הים!", oceans: ["arctic"], zone: "open", style: "narwhal", color: "#a8b8c8", accentColor: "#e2e8f0", size: 2.0, speed: 0.8 },
  { id: "beluga",      nameHebrew: "בלוגה",           emoji: "🤍", factHebrew: "הבלוגה הלבנה מצייצת ושורקת — קוראים לה 'הקנרית של הים'!", oceans: ["arctic"], zone: "open", style: "whale", color: "#f8fafc", accentColor: "#cbd5e1", size: 2.0, speed: 0.7 },
  { id: "seal",        nameHebrew: "כלב ים",          emoji: "🦭", factHebrew: "כלב הים יכול לעצור את הנשימה לשעה שלמה מתחת למים!", oceans: ["arctic", "southern"], zone: "open", style: "seal", color: "#6b7280", accentColor: "#d1d5db", size: 1.3, speed: 0.9 },

  // ── המצולות האפלות 🦑 ────────────────────────────────────────────────────
  { id: "anglerfish",  nameHebrew: "דג פנס",          emoji: "🔦", factHebrew: "לדג הפנס יש נורה זוהרת על הראש — כדי לצוד בחושך מוחלט!", oceans: ["atlantic", "pacific"], zone: "deep", style: "anglerfish", color: "#1c1917", accentColor: "#a8ff78", size: 1.0, speed: 0.5, glows: true },
  { id: "giant-squid", nameHebrew: "דיונון ענק",      emoji: "🦑", factHebrew: "לדיונון הענק יש עיניים בגודל של צלחת — הכי גדולות בעולם החי!", oceans: ["pacific", "atlantic"], zone: "deep", style: "squid", color: "#b91c1c", accentColor: "#fca5a5", size: 2.6, speed: 0.6 },
  { id: "lanternfish", nameHebrew: "דג פנסון",        emoji: "✨", factHebrew: "דגי הפנסון הזעירים נוצצים בחושך — יש יותר מהם מכל דג אחר בעולם!", oceans: ["pacific", "atlantic", "indian", "arctic", "southern"], zone: "deep", style: "fish", color: "#0c4a6e", accentColor: "#7dd3fc", size: 0.6, speed: 1.0, glows: true },
  { id: "viperfish",   nameHebrew: "דג צפע",          emoji: "🧛", factHebrew: "לדג הצפע שיניים כל כך ארוכות שהוא לא יכול לסגור את הפה!", oceans: ["pacific", "indian"], zone: "deep", style: "anglerfish", color: "#18181b", accentColor: "#67e8f9", size: 0.9, speed: 0.8, glows: true },
  { id: "dumbo",       nameHebrew: "תמנון דמבו",      emoji: "🐘", factHebrew: "לתמנון דמבו יש 'אוזני פיל' — הוא מנפנף בהן כדי לשחות!", oceans: ["pacific", "arctic"], zone: "deep", style: "octopus", color: "#f9a8d4", accentColor: "#fbcfe8", size: 0.9, speed: 0.4 },
  { id: "deep-jelly",  nameHebrew: "מדוזה זוהרת",     emoji: "💡", factHebrew: "המדוזה הזוהרת מייצרת אור משלה — כמו פנס חי במצולות!", oceans: ["pacific", "atlantic", "indian", "southern"], zone: "deep", style: "jellyfish", color: "#22d3ee", accentColor: "#a5f3fc", size: 1.0, speed: 0.3, glows: true },
  { id: "gulper-eel",  nameHebrew: "צלופח בלען",      emoji: "😮", factHebrew: "לצלופח הבלען יש פה ענק — הוא יכול לבלוע דג גדול ממנו!", oceans: ["atlantic", "indian"], zone: "deep", style: "fish", color: "#292524", accentColor: "#78716c", size: 1.3, speed: 0.6 },
  { id: "isopod",      nameHebrew: "איזופוד ענק",     emoji: "🪳", factHebrew: "האיזופוד הענק הוא כמו כדור-מגן משוריין שחי על קרקעית הים!", oceans: ["pacific", "atlantic", "arctic", "southern", "indian"], zone: "deep", style: "crab", color: "#a8a29e", accentColor: "#78716c", size: 0.9, speed: 0.2 },
  { id: "vampire-squid", nameHebrew: "דיונון ערפד",   emoji: "🧛‍♂️", factHebrew: "דיונון הערפד מתעטף בזרועות שלו כמו גלימה — ונוצץ בחושך!", oceans: ["pacific"], zone: "deep", style: "squid", color: "#450a0a", accentColor: "#f87171", size: 1.0, speed: 0.5, glows: true },
];

export const CREATURE_BY_ID = new Map(MARINE_LIFE.map((c) => [c.id, c]));
export const TOTAL_MARINE_CREATURES = MARINE_LIFE.length;

/** Creatures living in a given ocean + zone. */
export function creaturesFor(ocean: OceanId, zone: OceanZoneId): MarineCreature[] {
  return MARINE_LIFE.filter((c) => c.zone === zone && c.oceans.includes(ocean));
}
