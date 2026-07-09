// Four-seasons mode for the globe: per-season visual params + the "why
// seasons happen" science, kid-style. The southern hemisphere always shows
// the opposite season — that IS the lesson.

export type SeasonId = "spring" | "summer" | "autumn" | "winter";

export interface SeasonSpec {
  id: SeasonId;
  nameHebrew: string;
  emoji: string;
  factHebrew: string;
  /** land tint for the NORTHERN hemisphere (rgba string) */
  tintNorth: string;
  /** land tint for the SOUTHERN hemisphere (opposite season, rgba string) */
  tintSouth: string;
  /** snow covers from this latitude up to the north pole */
  snowLatNorth: number;
  /** snow covers from the south pole up to this latitude */
  snowLatSouth: number;
  /** sun declination in degrees (+23.5 = northern summer) */
  sunDeclination: number;
}

export const SEASONS: SeasonSpec[] = [
  {
    id: "spring",
    nameHebrew: "אביב",
    emoji: "🌸",
    factHebrew: "באביב הכול פורח! היום והלילה שווים באורך — בדיוק באמצע.",
    tintNorth: "rgba(150,220,120,0.30)",
    tintSouth: "rgba(214,150,70,0.28)",
    snowLatNorth: 74,
    snowLatSouth: -64,
    sunDeclination: 0,
  },
  {
    id: "summer",
    nameHebrew: "קיץ",
    emoji: "☀️",
    factHebrew: "בקיץ כדור הארץ נוטה עם הצד שלנו אל השמש — לכן היום ארוך וחם!",
    tintNorth: "rgba(120,200,80,0.34)",
    tintSouth: "rgba(180,200,235,0.30)",
    snowLatNorth: 80,
    snowLatSouth: -52,
    sunDeclination: 23.5,
  },
  {
    id: "autumn",
    nameHebrew: "סתיו",
    emoji: "🍂",
    factHebrew: "בסתיו העלים מחליפים צבע לכתום וזהב — ונושרים מהעצים!",
    tintNorth: "rgba(224,150,60,0.34)",
    tintSouth: "rgba(150,220,120,0.28)",
    snowLatNorth: 68,
    snowLatSouth: -62,
    sunDeclination: 0,
  },
  {
    id: "winter",
    nameHebrew: "חורף",
    emoji: "❄️",
    factHebrew: "בחורף הצד שלנו נוטה הרחק מהשמש — היום קצר, קר, ולפעמים יורד שלג!",
    tintNorth: "rgba(200,220,245,0.36)",
    tintSouth: "rgba(120,200,80,0.30)",
    snowLatNorth: 52,
    snowLatSouth: -66,
    sunDeclination: -23.5,
  },
];

export const SEASON_BY_ID = new Map(SEASONS.map((s) => [s.id, s]));

/** The season the OTHER hemisphere is having (the core lesson!). */
export function oppositeSeason(id: SeasonId): SeasonId {
  switch (id) {
    case "spring": return "autumn";
    case "summer": return "winter";
    case "autumn": return "spring";
    case "winter": return "summer";
  }
}

export const WHY_SEASONS_HEBREW =
  "כדור הארץ מסתובב סביב השמש כשהוא נטוי קצת על הצד — כמו סביבון עקום. " +
  "כשהחצי שלנו נוטה אל השמש יש לנו קיץ, וכשהוא נוטה ממנה — חורף. " +
  "בגלל זה כשאצלנו קיץ, באוסטרליה חורף!";
