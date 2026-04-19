export interface Region {
  id: string;
  nameHebrew: string;
  color: string;
  audioFile: string;
}

export const CONTINENTS: Region[] = [
  { id: "asia",          nameHebrew: "אסיה",            color: "#4ade80", audioFile: "/audio/asia.mp3" },
  { id: "africa",        nameHebrew: "אפריקה",          color: "#fb923c", audioFile: "/audio/africa.mp3" },
  { id: "europe",        nameHebrew: "אירופה",          color: "#818cf8", audioFile: "/audio/europe.mp3" },
  { id: "north-america", nameHebrew: "אמריקה הצפונית",  color: "#f87171", audioFile: "/audio/north-america.mp3" },
  { id: "south-america", nameHebrew: "אמריקה הדרומית",  color: "#34d399", audioFile: "/audio/south-america.mp3" },
  { id: "australia",     nameHebrew: "אוסטרליה",        color: "#fbbf24", audioFile: "/audio/australia.mp3" },
  { id: "antarctica",    nameHebrew: "אנטארקטיקה",      color: "#93c5fd", audioFile: "/audio/antarctica.mp3" },
];
