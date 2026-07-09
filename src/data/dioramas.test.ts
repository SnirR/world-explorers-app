import { describe, it, expect } from "vitest";
import { DIORAMAS, FALLBACK_BIOME, STAR_DIORAMA_COUNT } from "./dioramas";
import { COUNTRY_BY_ID } from "./countries";
import { CONTINENTS } from "./continents";
import { LANDMARK_IDS, ANIMAL_IDS, NATURE_IDS } from "../three/dioramaKit";

describe("diorama recipes", () => {
  it("has 15+ star countries, all referencing real countries and builders", () => {
    expect(STAR_DIORAMA_COUNT).toBeGreaterThanOrEqual(15);
    for (const [countryId, r] of Object.entries(DIORAMAS)) {
      expect(COUNTRY_BY_ID.has(countryId), `unknown country ${countryId}`).toBe(true);
      expect(LANDMARK_IDS).toContain(r.landmark);
      expect(ANIMAL_IDS).toContain(r.animal);
      expect(NATURE_IDS).toContain(r.nature);
      expect(r.landmarkHebrew.length).toBeGreaterThan(2);
      expect(r.animalHebrew.length).toBeGreaterThan(2);
      expect(r.natureHebrew.length).toBeGreaterThan(2);
      expect(r.welcomeHebrew).toContain("ברוכים הבאים");
    }
  });

  it("every continent has a fallback biome so no country is left empty", () => {
    for (const c of CONTINENTS) {
      const fb = FALLBACK_BIOME[c.id];
      expect(fb, `missing fallback for ${c.id}`).toBeTruthy();
      expect(NATURE_IDS).toContain(fb.nature);
    }
  });
});
