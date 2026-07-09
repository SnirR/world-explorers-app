import { describe, it, expect } from "vitest";
import { MARINE_LIFE, TOTAL_MARINE_CREATURES, creaturesFor } from "./marineLife";
import { OCEANS, OCEAN_ZONES, oceanAt } from "./oceans";

describe("marine life data", () => {
  it("creatures are well-formed with unique ids", () => {
    expect(TOTAL_MARINE_CREATURES).toBeGreaterThanOrEqual(35);
    const ids = MARINE_LIFE.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    const oceanIds = new Set(OCEANS.map((o) => o.id));
    const zoneIds = new Set(OCEAN_ZONES.map((z) => z.id));
    for (const c of MARINE_LIFE) {
      expect(c.nameHebrew.length).toBeGreaterThan(1);
      expect(c.factHebrew.length).toBeGreaterThan(10);
      expect(c.oceans.length).toBeGreaterThan(0);
      for (const o of c.oceans) expect(oceanIds.has(o)).toBe(true);
      expect(zoneIds.has(c.zone)).toBe(true);
      expect(c.size).toBeGreaterThan(0);
    }
  });

  it("every ocean × zone has at least 3 creatures to find", () => {
    for (const o of OCEANS) {
      for (const z of OCEAN_ZONES) {
        const list = creaturesFor(o.id, z.id);
        expect(list.length, `${o.id}/${z.id}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("ocean classifier maps famous coordinates correctly", () => {
    expect(oceanAt(-70, 0)).toBe("southern");     // off Antarctica
    expect(oceanAt(80, -40)).toBe("arctic");      // near the north pole
    expect(oceanAt(30, -40)).toBe("atlantic");    // mid-Atlantic
    expect(oceanAt(-10, 80)).toBe("indian");      // Indian ocean
    expect(oceanAt(0, -150)).toBe("pacific");     // mid-Pacific
    expect(oceanAt(20, 160)).toBe("pacific");     // west Pacific
    expect(oceanAt(0, 340)).toBe("atlantic");     // wraps: 340 == -20
  });
});
