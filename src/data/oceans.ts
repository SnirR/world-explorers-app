// The five oceans + the three dive zones, and a simple lat/lng classifier so
// tapping water on the globe knows which ocean the child touched.

export type OceanId = "pacific" | "atlantic" | "indian" | "arctic" | "southern";
export type OceanZoneId = "reef" | "open" | "deep";

export interface OceanSpec {
  id: OceanId;
  nameHebrew: string;
  emoji: string;
  factHebrew: string;
  /** theme color for cards/bubbles */
  color: string;
  /** water tint per zone (background colors for the dive scene) */
  waterColors: { reef: string; open: string; deep: string };
}

export const OCEANS: OceanSpec[] = [
  {
    id: "pacific",
    nameHebrew: "האוקיינוס השקט",
    emoji: "🌊",
    factHebrew: "האוקיינוס השקט הוא הכי גדול בעולם — כל היבשות ביחד נכנסות בו!",
    color: "#0e7490",
    waterColors: { reef: "#1899c9", open: "#0a5f96", deep: "#03121f" },
  },
  {
    id: "atlantic",
    nameHebrew: "האוקיינוס האטלנטי",
    emoji: "⛵",
    factHebrew: "באוקיינוס האטלנטי נמצא רכס הרים ענק — מתחת למים!",
    color: "#1d4ed8",
    waterColors: { reef: "#2394cf", open: "#0d549c", deep: "#041224" },
  },
  {
    id: "indian",
    nameHebrew: "האוקיינוס ההודי",
    emoji: "🐠",
    factHebrew: "האוקיינוס ההודי הוא הכי חמים — ויש בו שוניות אלמוגים צבעוניות!",
    color: "#0d9488",
    waterColors: { reef: "#17a9b8", open: "#0b6a8f", deep: "#04141c" },
  },
  {
    id: "arctic",
    nameHebrew: "אוקיינוס הקרח הצפוני",
    emoji: "🧊",
    factHebrew: "אוקיינוס הקרח הצפוני קפוא בחלקו כל השנה — ודובי קוטב שוחים בו!",
    color: "#0284c7",
    waterColors: { reef: "#5fb7dd", open: "#12639c", deep: "#051526" },
  },
  {
    id: "southern",
    nameHebrew: "האוקיינוס הדרומי",
    emoji: "🐧",
    factHebrew: "האוקיינוס הדרומי מקיף את אנטארקטיקה — ופינגווינים צוללים בו כל יום!",
    color: "#0369a1",
    waterColors: { reef: "#4cabd4", open: "#0f5c94", deep: "#04121f" },
  },
];

export const OCEAN_BY_ID = new Map(OCEANS.map((o) => [o.id, o]));

export interface OceanZoneSpec {
  id: OceanZoneId;
  nameHebrew: string;
  emoji: string;
  depthHebrew: string;
}

export const OCEAN_ZONES: OceanZoneSpec[] = [
  { id: "reef", nameHebrew: "המים הרדודים", emoji: "🪸", depthHebrew: "0–40 מטר" },
  { id: "open", nameHebrew: "הים הפתוח", emoji: "🐬", depthHebrew: "40–1,000 מטר" },
  { id: "deep", nameHebrew: "המצולות האפלות", emoji: "🦑", depthHebrew: "יותר מ-1,000 מטר" },
];

export const ZONE_BY_ID = new Map(OCEAN_ZONES.map((z) => [z.id, z]));

/**
 * Rough kid-friendly ocean classifier for a water tap on the globe.
 * Not nautical-chart accurate — just "which ocean did I touch".
 */
export function oceanAt(lat: number, lng: number): OceanId {
  if (lat < -60) return "southern";
  if (lat > 66) return "arctic";
  // normalize lng to [-180, 180)
  let l = lng;
  while (l < -180) l += 360;
  while (l >= 180) l -= 360;
  if (l >= -70 && l < 20) return "atlantic";
  if (l >= 20 && l < 146) return "indian";
  return "pacific";
}
