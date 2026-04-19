export interface City {
  id: string;
  nameHebrew: string;
  countryNameHebrew: string;
  coordinates: [number, number]; // [longitude, latitude]
  continentId: string;
  audioFile: string;
}

export const CITIES: City[] = [
  // Israel
  { id: "jerusalem",    nameHebrew: "ירושלים",           countryNameHebrew: "ישראל",      coordinates: [35.5, 31.4],     continentId: "asia",          audioFile: "/audio/jerusalem.mp3" },
  { id: "tel-aviv",     nameHebrew: "תל אביב",            countryNameHebrew: "ישראל",      coordinates: [34.3, 32.5],     continentId: "asia",          audioFile: "/audio/tel-aviv.mp3" },

  // North America
  { id: "new-york",     nameHebrew: "ניו יורק",           countryNameHebrew: 'ארה"ב',      coordinates: [-74.01, 40.71],  continentId: "north-america", audioFile: "/audio/new-york.mp3" },
  { id: "los-angeles",  nameHebrew: "לוס אנג׳לס",         countryNameHebrew: 'ארה"ב',      coordinates: [-118.24, 34.05], continentId: "north-america", audioFile: "/audio/los-angeles.mp3" },

  // Europe
  { id: "london",       nameHebrew: "לונדון",             countryNameHebrew: "בריטניה",    coordinates: [-0.13, 51.51],   continentId: "europe",        audioFile: "/audio/london.mp3" },
  { id: "paris",        nameHebrew: "פריז",               countryNameHebrew: "צרפת",       coordinates: [2.35, 48.86],    continentId: "europe",        audioFile: "/audio/paris.mp3" },
  { id: "berlin",       nameHebrew: "ברלין",              countryNameHebrew: "גרמניה",     coordinates: [13.40, 52.52],   continentId: "europe",        audioFile: "/audio/berlin.mp3" },
  { id: "rome",         nameHebrew: "רומא",               countryNameHebrew: "איטליה",     coordinates: [12.50, 41.90],   continentId: "europe",        audioFile: "/audio/rome.mp3" },
  { id: "moscow",       nameHebrew: "מוסקבה",             countryNameHebrew: "רוסיה",      coordinates: [37.62, 55.75],   continentId: "europe",        audioFile: "/audio/moscow.mp3" },

  // Asia
  { id: "tokyo",        nameHebrew: "טוקיו",              countryNameHebrew: "יפן",        coordinates: [139.69, 35.69],  continentId: "asia",          audioFile: "/audio/tokyo.mp3" },
  { id: "beijing",      nameHebrew: "בייג׳ינג",           countryNameHebrew: "סין",        coordinates: [116.41, 39.91],  continentId: "asia",          audioFile: "/audio/beijing.mp3" },
  { id: "dubai",        nameHebrew: "דובאי",              countryNameHebrew: "איחוד האמירויות", coordinates: [55.30, 25.20], continentId: "asia",       audioFile: "/audio/dubai.mp3" },

  // South America
  { id: "rio",          nameHebrew: "ריו דה ז׳נרו",       countryNameHebrew: "ברזיל",      coordinates: [-43.18, -22.91], continentId: "south-america", audioFile: "/audio/rio.mp3" },

  // Africa
  { id: "cairo",        nameHebrew: "קהיר",               countryNameHebrew: "מצרים",      coordinates: [31.24, 30.04],   continentId: "africa",        audioFile: "/audio/cairo.mp3" },

  // Australia
  { id: "sydney",       nameHebrew: "סידני",              countryNameHebrew: "אוסטרליה",   coordinates: [151.21, -33.87], continentId: "australia",     audioFile: "/audio/sydney.mp3" },
];

// Fast lookup
export const CITY_BY_ID = new Map<string, City>(CITIES.map((c) => [c.id, c]));
