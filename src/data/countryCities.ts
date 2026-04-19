export interface CountryCity {
  id: string;                    // globally unique: "il-haifa", "us-chicago"
  nameHebrew: string;
  coordinates: [number, number]; // [longitude, latitude]
  audioFile: string;
}

export interface CountryWithCities {
  countryId: string;             // ISO numeric code, matches countries.ts
  countryNameHebrew: string;
  center: [number, number];      // zoom target for the map
  zoomLevel: number;             // recommended zoom (2-5)
  cities: CountryCity[];
}

export const COUNTRY_CITIES: CountryWithCities[] = [
  // ── ישראל ───────────────────────────────────────────────────────────────────
  {
    countryId: "376",
    countryNameHebrew: "ישראל",
    center: [35.0, 31.5],
    zoomLevel: 5,
    cities: [
      { id: "il-jerusalem",  nameHebrew: "ירושלים",    coordinates: [35.22, 31.77],  audioFile: "/audio/jerusalem.mp3" },
      { id: "il-tel-aviv",   nameHebrew: "תל אביב",     coordinates: [34.78, 32.08],  audioFile: "/audio/tel-aviv.mp3" },
      { id: "il-haifa",      nameHebrew: "חיפה",        coordinates: [34.99, 32.79],  audioFile: "/audio/haifa.mp3" },
      { id: "il-beer-sheva", nameHebrew: "באר שבע",     coordinates: [34.79, 31.25],  audioFile: "/audio/beer-sheva.mp3" },
      { id: "il-eilat",      nameHebrew: "אילת",        coordinates: [34.95, 29.56],  audioFile: "/audio/eilat.mp3" },
      { id: "il-nazareth",   nameHebrew: "נצרת",        coordinates: [35.30, 32.70],  audioFile: "/audio/nazareth.mp3" },
    ],
  },

  // ── ארה"ב ───────────────────────────────────────────────────────────────────
  {
    countryId: "840",
    countryNameHebrew: 'ארה"ב',
    center: [-98, 38],
    zoomLevel: 2.5,
    cities: [
      { id: "us-new-york",     nameHebrew: "ניו יורק",      coordinates: [-74.01, 40.71],  audioFile: "/audio/new-york.mp3" },
      { id: "us-los-angeles",  nameHebrew: "לוס אנג׳לס",    coordinates: [-118.24, 34.05], audioFile: "/audio/los-angeles.mp3" },
      { id: "us-washington",   nameHebrew: "וושינגטון",      coordinates: [-77.04, 38.91],  audioFile: "/audio/washington.mp3" },
      { id: "us-chicago",      nameHebrew: "שיקגו",         coordinates: [-87.63, 41.88],  audioFile: "/audio/chicago.mp3" },
      { id: "us-houston",      nameHebrew: "יוסטון",        coordinates: [-95.37, 29.76],  audioFile: "/audio/houston.mp3" },
      { id: "us-miami",        nameHebrew: "מיאמי",         coordinates: [-80.19, 25.76],  audioFile: "/audio/miami.mp3" },
    ],
  },

  // ── צרפת ────────────────────────────────────────────────────────────────────
  {
    countryId: "250",
    countryNameHebrew: "צרפת",
    center: [2.5, 46.5],
    zoomLevel: 3.8,
    cities: [
      { id: "fr-paris",      nameHebrew: "פריז",       coordinates: [2.35, 48.86],   audioFile: "/audio/paris.mp3" },
      { id: "fr-lyon",       nameHebrew: "ליון",       coordinates: [4.83, 45.76],   audioFile: "/audio/lyon.mp3" },
      { id: "fr-marseille",  nameHebrew: "מרסיי",      coordinates: [5.37, 43.30],   audioFile: "/audio/marseille.mp3" },
      { id: "fr-nice",       nameHebrew: "ניס",        coordinates: [7.27, 43.71],   audioFile: "/audio/nice.mp3" },
      { id: "fr-toulouse",   nameHebrew: "טולוז",      coordinates: [1.44, 43.60],   audioFile: "/audio/toulouse.mp3" },
    ],
  },

  // ── יפן ─────────────────────────────────────────────────────────────────────
  {
    countryId: "392",
    countryNameHebrew: "יפן",
    center: [137, 37],
    zoomLevel: 3.5,
    cities: [
      { id: "jp-tokyo",      nameHebrew: "טוקיו",      coordinates: [139.69, 35.69],  audioFile: "/audio/tokyo.mp3" },
      { id: "jp-osaka",      nameHebrew: "אוסקה",      coordinates: [135.50, 34.69],  audioFile: "/audio/osaka.mp3" },
      { id: "jp-kyoto",      nameHebrew: "קיוטו",      coordinates: [135.77, 35.01],  audioFile: "/audio/kyoto.mp3" },
      { id: "jp-hiroshima",  nameHebrew: "הירושימה",    coordinates: [132.46, 34.39],  audioFile: "/audio/hiroshima.mp3" },
      { id: "jp-sapporo",    nameHebrew: "סאפורו",     coordinates: [141.35, 43.06],  audioFile: "/audio/sapporo.mp3" },
    ],
  },

  // ── ברזיל ───────────────────────────────────────────────────────────────────
  {
    countryId: "076",
    countryNameHebrew: "ברזיל",
    center: [-52, -12],
    zoomLevel: 2.5,
    cities: [
      { id: "br-rio",        nameHebrew: "ריו דה ז׳נרו",  coordinates: [-43.18, -22.91], audioFile: "/audio/rio.mp3" },
      { id: "br-sao-paulo",  nameHebrew: "סאו פאולו",    coordinates: [-46.63, -23.55], audioFile: "/audio/sao-paulo.mp3" },
      { id: "br-brasilia",   nameHebrew: "ברזיליה",      coordinates: [-47.88, -15.79], audioFile: "/audio/brasilia.mp3" },
      { id: "br-salvador",   nameHebrew: "סלבדור",       coordinates: [-38.51, -12.97], audioFile: "/audio/salvador.mp3" },
      { id: "br-manaus",     nameHebrew: "מנאוס",        coordinates: [-60.02, -3.12],  audioFile: "/audio/manaus.mp3" },
    ],
  },

  // ── אוסטרליה ────────────────────────────────────────────────────────────────
  {
    countryId: "036",
    countryNameHebrew: "אוסטרליה",
    center: [134, -26],
    zoomLevel: 2.5,
    cities: [
      { id: "au-sydney",     nameHebrew: "סידני",       coordinates: [151.21, -33.87], audioFile: "/audio/sydney.mp3" },
      { id: "au-melbourne",  nameHebrew: "מלבורן",      coordinates: [144.96, -37.81], audioFile: "/audio/melbourne.mp3" },
      { id: "au-brisbane",   nameHebrew: "בריסביין",     coordinates: [153.03, -27.47], audioFile: "/audio/brisbane.mp3" },
      { id: "au-perth",      nameHebrew: "פרת׳",        coordinates: [115.86, -31.95], audioFile: "/audio/perth.mp3" },
      { id: "au-canberra",   nameHebrew: "קנברה",       coordinates: [149.13, -35.28], audioFile: "/audio/canberra.mp3" },
    ],
  },
];

// Total cities across all countries
export const TOTAL_COUNTRY_CITIES = COUNTRY_CITIES.reduce(
  (sum, c) => sum + c.cities.length, 0
);

// Fast lookup by country ISO id
export const COUNTRY_CITIES_BY_ID = new Map<string, CountryWithCities>(
  COUNTRY_CITIES.map((c) => [c.countryId, c])
);
