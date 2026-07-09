// Country diorama recipes: which landmark/animal/nature/biome/sky to build
// when the child "visits" a country. Star countries get a full 3D diorama;
// every other country gets an emoji diorama fallback (see DioramaScene).

import type { LandmarkId, AnimalId, NatureId, BiomeId, SkyId } from "../three/dioramaKit";

export interface DioramaRecipe {
  landmark: LandmarkId;
  landmarkHebrew: string;
  animal: AnimalId;
  animalHebrew: string;
  nature: NatureId;
  natureHebrew: string;
  biome: BiomeId;
  sky: SkyId;
  welcomeHebrew: string;
}

/** keyed by ISO numeric country id (same ids as countries.ts) */
export const DIORAMAS: Record<string, DioramaRecipe> = {
  // צרפת
  "250": {
    landmark: "eiffel", landmarkHebrew: "מגדל אייפל",
    animal: "rooster", animalHebrew: "התרנגול הגאלי",
    nature: "cherry", natureHebrew: "גני פריז הפורחים",
    biome: "grass", sky: "sunset",
    welcomeHebrew: "ברוכים הבאים לצרפת! הנה מגדל אייפל המפורסם!",
  },
  // מצרים
  "818": {
    landmark: "pyramid", landmarkHebrew: "הפירמידות של גיזה",
    animal: "camel", animalHebrew: "גמל",
    nature: "palms", natureHebrew: "דקלי הנילוס",
    biome: "sand", sky: "sunset",
    welcomeHebrew: "ברוכים הבאים למצרים! הפירמידות מחכות לכם במדבר!",
  },
  // איטליה
  "380": {
    landmark: "colosseum", landmarkHebrew: "הקולוסאום",
    animal: "wolf", animalHebrew: "זאבת רומא",
    nature: "cypress", natureHebrew: "ברושי טוסקנה",
    biome: "grass", sky: "day",
    welcomeHebrew: "ברוכים הבאים לאיטליה! הקולוסאום העתיק של רומא!",
  },
  // בריטניה
  "826": {
    landmark: "bigben", landmarkHebrew: "הביג בן",
    animal: "sheep", animalHebrew: "כבשה בריטית",
    nature: "forest", natureHebrew: "יערות אנגליה הירוקים",
    biome: "grass", sky: "day",
    welcomeHebrew: "ברוכים הבאים לבריטניה! השעון הענק ביג בן מצלצל!",
  },
  // ארה"ב
  "840": {
    landmark: "liberty", landmarkHebrew: "פסל החירות",
    animal: "eagle", animalHebrew: "עיטם לבן-ראש",
    nature: "mountain", natureHebrew: "ההרים הגדולים",
    biome: "grass", sky: "day",
    welcomeHebrew: "ברוכים הבאים לארצות הברית! פסל החירות מרים את הלפיד!",
  },
  // אוסטרליה
  "036": {
    landmark: "operaHouse", landmarkHebrew: "בית האופרה של סידני",
    animal: "kangaroo", animalHebrew: "קנגורו",
    nature: "palms", natureHebrew: "חופי אוסטרליה",
    biome: "sand", sky: "day",
    welcomeHebrew: "ברוכים הבאים לאוסטרליה! קנגורו מקפץ ליד בית האופרה!",
  },
  // סין
  "156": {
    landmark: "greatWall", landmarkHebrew: "החומה הגדולה של סין",
    animal: "panda", animalHebrew: "דוב פנדה",
    nature: "cherry", natureHebrew: "עצי הפריחה",
    biome: "grass", sky: "day",
    welcomeHebrew: "ברוכים הבאים לסין! החומה הגדולה נמתחת עד האופק!",
  },
  // הודו
  "356": {
    landmark: "tajMahal", landmarkHebrew: "הטאג' מהאל",
    animal: "elephant", animalHebrew: "פיל הודי",
    nature: "palms", natureHebrew: "עצי הודו",
    biome: "grass", sky: "sunset",
    welcomeHebrew: "ברוכים הבאים להודו! ארמון הטאג' מהאל הלבן נוצץ!",
  },
  // רוסיה
  "643": {
    landmark: "kremlin", landmarkHebrew: "כיפות הקרמלין",
    animal: "bear", animalHebrew: "דוב חום",
    nature: "forest", natureHebrew: "יערות הטייגה",
    biome: "snow", sky: "dusk",
    welcomeHebrew: "ברוכים הבאים לרוסיה! הכיפות הצבעוניות של מוסקבה!",
  },
  // יפן
  "392": {
    landmark: "torii", landmarkHebrew: "שער טוֹרִי יפני",
    animal: "crane", animalHebrew: "עגור יפני",
    nature: "cherry", natureHebrew: "פריחת הדובדבן",
    biome: "grass", sky: "sunset",
    welcomeHebrew: "ברוכים הבאים ליפן! שער אדום ופריחת דובדבן ורודה!",
  },
  // ברזיל
  "076": {
    landmark: "christRedeemer", landmarkHebrew: "פסל הגואל בריו",
    animal: "toucan", animalHebrew: "טוקן",
    nature: "forest", natureHebrew: "יער האמזונס",
    biome: "grass", sky: "day",
    welcomeHebrew: "ברוכים הבאים לברזיל! הפסל הענק משקיף על ריו!",
  },
  // פרו
  "604": {
    landmark: "machuPicchu", landmarkHebrew: "מאצ'ו פיצ'ו",
    animal: "llama", animalHebrew: "למה",
    nature: "mountain", natureHebrew: "הרי האנדים",
    biome: "grass", sky: "day",
    welcomeHebrew: "ברוכים הבאים לפרו! העיר העתיקה על ראש ההר!",
  },
  // קניה
  "404": {
    landmark: "kilimanjaro", landmarkHebrew: "הר הקילימנג'רו",
    animal: "lion", animalHebrew: "אריה",
    nature: "savannaTree", natureHebrew: "עצי הסוואנה",
    biome: "savanna", sky: "sunset",
    welcomeHebrew: "ברוכים הבאים לקניה! אריה נח מתחת לעץ הסוואנה!",
  },
  // הולנד
  "528": {
    landmark: "windmill", landmarkHebrew: "טחנת רוח הולנדית",
    animal: "cow", animalHebrew: "פרה הולנדית",
    nature: "tulips", natureHebrew: "שדות הצבעונים",
    biome: "grass", sky: "day",
    welcomeHebrew: "ברוכים הבאים להולנד! טחנת הרוח מסתובבת מעל הצבעונים!",
  },
  // ישראל
  "376": {
    landmark: "azrieli", landmarkHebrew: "מגדלי עזריאלי",
    animal: "ibex", animalHebrew: "יעל מצוי",
    nature: "palms", natureHebrew: "דקלי הערבה",
    biome: "sand", sky: "day",
    welcomeHebrew: "ברוכים הבאים לישראל! הבית שלנו — מגדלים, מדבר ויעלים!",
  },
  // צ'ילה
  "152": {
    landmark: "moai", landmarkHebrew: "פסלי המואי מאי הפסחא",
    animal: "llama", animalHebrew: "גואנקו",
    nature: "mountain", natureHebrew: "הרי האנדים",
    biome: "rock", sky: "dusk",
    welcomeHebrew: "ברוכים הבאים לצ'ילה! פסלי האבן המסתוריים של אי הפסחא!",
  },
  // מקסיקו
  "484": {
    landmark: "pyramid", landmarkHebrew: "פירמידת המאיה",
    animal: "eagle", animalHebrew: "עיט מקסיקני",
    nature: "cactus", natureHebrew: "קקטוסי המדבר",
    biome: "sand", sky: "sunset",
    welcomeHebrew: "ברוכים הבאים למקסיקו! פירמידות עתיקות וקקטוסים ענקיים!",
  },
};

/** default biome per continent for the emoji-diorama fallback */
export const FALLBACK_BIOME: Record<string, { biome: BiomeId; sky: SkyId; nature: NatureId }> = {
  africa:          { biome: "savanna", sky: "sunset", nature: "savannaTree" },
  asia:            { biome: "grass",   sky: "day",    nature: "cherry" },
  europe:          { biome: "grass",   sky: "day",    nature: "forest" },
  "north-america": { biome: "grass",   sky: "day",    nature: "mountain" },
  "south-america": { biome: "grass",   sky: "day",    nature: "forest" },
  australia:       { biome: "sand",    sky: "day",    nature: "palms" },
  antarctica:      { biome: "snow",    sky: "dusk",   nature: "icebergs" },
};

export const STAR_DIORAMA_COUNT = Object.keys(DIORAMAS).length;
