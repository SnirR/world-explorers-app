// Extra space objects beyond the planets: asteroid belt, comet, and the ISS.
// They share the planet-card field shape so PlanetCard can show them too,
// and they count toward the space discovery total (astronaut sticker).

export interface SpaceObjectSpec {
  id: string;
  nameHebrew: string;
  emoji: string;
  factHebrew: string;
  extraHebrew: string;
  baseColor: string;
  accentColor: string;
  kind: "asteroid-belt" | "comet" | "iss";
}

export const SPACE_OBJECTS: SpaceObjectSpec[] = [
  {
    id: "asteroid-belt",
    nameHebrew: "חגורת האסטרואידים",
    emoji: "🪨",
    factHebrew: "בין מאדים לצדק מסתובבים מיליוני סלעי חלל — חגורה שלמה של אסטרואידים!",
    extraHebrew: "האסטרואיד הכי גדול, קרס, הוא כמעט כוכב לכת קטן בעצמו.",
    baseColor: "#8d7f6d",
    accentColor: "#5f5548",
    kind: "asteroid-belt",
  },
  {
    id: "comet",
    nameHebrew: "שביט האלי",
    emoji: "☄️",
    factHebrew: "לשביט יש זנב זוהר שתמיד בורח מהשמש — לא משנה לאן הוא טס!",
    extraHebrew: "שביט האלי חוזר לבקר אותנו רק פעם ב-76 שנים.",
    baseColor: "#bcd8f0",
    accentColor: "#7aa8d8",
    kind: "comet",
  },
  {
    id: "iss",
    nameHebrew: "תחנת החלל",
    emoji: "🛰️",
    factHebrew: "בתחנת החלל הבינלאומית חיים אסטרונאוטים — הם ישנים כשהם מרחפים!",
    extraHebrew: "התחנה מקיפה את כדור הארץ 16 פעמים בכל יום.",
    baseColor: "#cfd8e6",
    accentColor: "#f2b134",
    kind: "iss",
  },
];

export const SPACE_OBJECT_BY_ID = new Map(SPACE_OBJECTS.map((o) => [o.id, o]));
