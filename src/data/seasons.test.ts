import { describe, it, expect } from "vitest";
import { SEASONS, SEASON_BY_ID, oppositeSeason, WHY_SEASONS_HEBREW } from "./seasons";

describe("seasons data", () => {
  it("has exactly the four seasons with valid params", () => {
    expect(SEASONS.map((s) => s.id)).toEqual(["spring", "summer", "autumn", "winter"]);
    for (const s of SEASONS) {
      expect(s.nameHebrew.length).toBeGreaterThan(1);
      expect(s.factHebrew.length).toBeGreaterThan(10);
      expect(s.snowLatNorth).toBeGreaterThan(0);
      expect(s.snowLatNorth).toBeLessThanOrEqual(90);
      expect(s.snowLatSouth).toBeLessThan(0);
      expect(s.snowLatSouth).toBeGreaterThanOrEqual(-90);
      expect(Math.abs(s.sunDeclination)).toBeLessThanOrEqual(23.5);
    }
  });

  it("solstices tilt the sun, equinoxes do not", () => {
    expect(SEASON_BY_ID.get("summer")!.sunDeclination).toBeCloseTo(23.5);
    expect(SEASON_BY_ID.get("winter")!.sunDeclination).toBeCloseTo(-23.5);
    expect(SEASON_BY_ID.get("spring")!.sunDeclination).toBe(0);
    expect(SEASON_BY_ID.get("autumn")!.sunDeclination).toBe(0);
  });

  it("winter has more snow than summer in the north (and vice versa in the south)", () => {
    const summer = SEASON_BY_ID.get("summer")!;
    const winter = SEASON_BY_ID.get("winter")!;
    expect(winter.snowLatNorth).toBeLessThan(summer.snowLatNorth);   // snow reaches further south
    expect(winter.snowLatSouth).toBeLessThan(summer.snowLatSouth);   // southern summer melts ice
  });

  it("opposite-season mapping is a perfect two-way swap", () => {
    for (const s of SEASONS) {
      expect(oppositeSeason(oppositeSeason(s.id))).toBe(s.id);
      expect(oppositeSeason(s.id)).not.toBe(s.id);
    }
    expect(oppositeSeason("summer")).toBe("winter");
    expect(WHY_SEASONS_HEBREW.length).toBeGreaterThan(40);
  });
});
