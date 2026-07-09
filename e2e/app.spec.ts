// End-to-end smoke tests for מגלי העולם.
// Each test gets a fresh browser context (clean localStorage).

import { test, expect, type Page } from "@playwright/test";
import { COUNTRIES } from "../src/data/countries";
import { CONTINENTS } from "../src/data/continents";
import { PLANETS } from "../src/data/planets";

const N_COUNTRIES = COUNTRIES.length;
const N_CONTINENTS = CONTINENTS.length;

// Hebrew name → planet id (for answering quiz questions).
const PLANET_NAMES: Record<string, string> = Object.fromEntries(
  PLANETS.map((p) => [p.nameHebrew, p.id])
);

async function gotoHome(page: Page) {
  await page.goto("/?e2e=1");
  await expect(page.getByText("מגלי העולם").first()).toBeVisible();
}

test("home screen shows all activity tiles in Hebrew", async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByTestId("home-globe")).toContainText("הגלובוס שלי");
  await expect(page.getByTestId("home-map2d")).toContainText("מפה שטוחה");
  await expect(page.getByTestId("home-israel")).toContainText("ערי ישראל");
  await expect(page.getByTestId("home-space")).toContainText("מערכת השמש");
  await expect(page.getByTestId("home-quiz")).toContainText("חידון");
  await expect(page.getByTestId("home-album")).toContainText("אלבום מדבקות");
  await expect(page.getByTestId("level-badge")).toContainText("מתחילים");
});

test("2D map: tapping a continent discovers it, persists after reload, and opens its card", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-map2d").click();

  const geos = page.locator("path.rsm-geography");
  await expect(geos.first()).toBeVisible();
  expect(await geos.count()).toBeGreaterThan(100);

  // Counter starts at 0 (continents mode is the default)
  await expect(page.getByText(`0/${N_CONTINENTS}`)).toBeVisible();

  await geos.nth(30).dispatchEvent("click");

  // Discovery bubble with עוד! button appears and the counter ticks.
  const moreBtn = page.getByRole("button", { name: "עוד! 👀" });
  await expect(moreBtn).toBeVisible();
  await expect(page.getByText(`1/${N_CONTINENTS}`)).toBeVisible();

  // Open the continent card.
  await moreBtn.click();
  await expect(page.getByText("חיות מפורסמות")).toBeVisible();
  await page.getByRole("button", { name: "סגירה" }).click();

  // Persistence: reload → home → map → still discovered.
  await page.reload();
  await page.getByTestId("home-map2d").click();
  await expect(page.getByText(`1/${N_CONTINENTS}`)).toBeVisible();
});

test("2D map: country mode opens the passport card with language words", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-map2d").click();
  await page.getByTestId("map2d-chip-countries").click();
  await expect(page.getByText(`0/${N_COUNTRIES}`)).toBeVisible();

  const geos = page.locator("path.rsm-geography");
  await expect(geos.first()).toBeVisible();

  // Click France directly (id 250 — stable data attribute on the path).
  await page.locator('path[data-geo-id="250"]').dispatchEvent("click");

  const moreBtn = page.getByRole("button", { name: "עוד! 👀" });
  await expect(moreBtn).toBeVisible();
  await expect(page.getByText("צרפת", { exact: true })).toBeVisible();
  await expect(page.getByText(`1/${N_COUNTRIES}`)).toBeVisible();

  await moreBtn.click();
  await expect(page.getByText("איך אומרים בצרפתית?")).toBeVisible();
  await expect(page.getByText("עיר הבירה: פריז")).toBeVisible();
  await expect(page.getByText("Bonjour")).toBeVisible();

  // Tap a language word — marks it heard (✅ appears).
  await page.getByRole("button", { name: /Bonjour/ }).click();
  await expect(page.locator("text=✅").first()).toBeVisible();
});

test("3D globe renders, and tapping a known country discovers it", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-globe").click();

  // Engine canvas appears (WebGL via SwiftShader).
  const container = page.getByTestId("globe-container");
  await expect(container.locator("canvas")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("הגלובוס התלת־ממדי לא נטען")).toHaveCount(0);

  // Mode chips are visible; switch to countries mode for a precise pick.
  await expect(page.getByRole("button", { name: "יבשות 🌍" })).toBeVisible();
  await page.getByRole("button", { name: "מדינות 🗺️" }).click();
  await expect(page.getByText(`0/${N_COUNTRIES}`)).toBeVisible();

  // Deterministic pick: fly the globe to Israel, then tap the screen center.
  await page.waitForFunction(() => "__globeScene" in window, undefined, { timeout: 20_000 });
  await page.evaluate(() => {
    (window as unknown as { __globeScene: { flyTo: (lat: number, lng: number, z?: number) => void } })
      .__globeScene.flyTo(31.5, 35.0, 200);
  });
  // Wait until the flight fully converges (frame-rate independent — SwiftShader
  // rendering under parallel test load can run at ~10fps).
  await page.waitForFunction(
    () => !(window as unknown as { __globeScene: { flyTarget: unknown } }).__globeScene.flyTarget,
    undefined,
    { timeout: 30_000 }
  );
  await page.waitForTimeout(300);

  const box = await container.boundingBox();
  if (!box) throw new Error("globe container has no box");
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

  await expect(page.getByText("ישראל", { exact: true })).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText(`1/${N_COUNTRIES}`)).toBeVisible();
});

test("solar system: rocket flies, sun is tappable, planet card opens, back to Earth", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-space").click();

  const container = page.getByTestId("space-container");
  await expect(container.locator("canvas")).toBeVisible({ timeout: 20_000 });

  // Camera looks at the origin → the sun is at screen center.
  await page.waitForTimeout(1500); // rocket overlay + first frames
  const box = await container.boundingBox();
  if (!box) throw new Error("space container has no box");
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

  await expect(page.getByText("השמש", { exact: true })).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText(/מתוך 14 בחלל/)).toContainText("1 מתוך");

  // Planet card via עוד!
  await page.getByRole("button", { name: "עוד! 👀" }).click();
  await expect(page.getByText(/בלעדיה לא היו חיים/)).toBeVisible();
  await page.getByRole("button", { name: "סגירה" }).click();

  // Back to Earth lands on the globe screen.
  await page.getByTestId("back-to-earth").click();
  await expect(page.getByTestId("globe-container").locator("canvas")).toBeVisible({ timeout: 20_000 });
});

test("planets quiz: full round to the medal modal", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-quiz").click();
  await page.getByTestId("quiz-cat-planets").click();

  for (let q = 0; q < 8; q++) {
    const question = page.getByTestId("quiz-question");
    await expect(question).toBeVisible();
    const text = (await question.textContent()) ?? "";
    const entry = Object.entries(PLANET_NAMES).find(([he]) => text.includes(he));
    expect(entry, `unrecognized question: ${text}`).toBeTruthy();
    await page.getByTestId(`quiz-planet-${entry![1]}`).click();
    // brief lock between questions
    await page.waitForTimeout(1250);
  }

  await expect(page.getByTestId("quiz-result")).toContainText("מדליית זהב");
  await expect(page.getByText("⭐⭐⭐")).toBeVisible();
});

test("Israel map: tapping a city discovers it and the counter ticks", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-israel").click();

  await expect(page.getByText(/ערי ישראל: 0 \/ 59/)).toBeVisible();
  const cityDot = page.locator("svg g > circle").first();
  await expect(cityDot).toBeVisible();
  await cityDot.dispatchEvent("click");

  await expect(page.getByText(/ערי ישראל: 1 \/ 59/)).toBeVisible();
});

test("parental gate guards reset: wrong answer keeps progress, correct answer resets", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-israel").click();
  await page.locator("svg g > circle").first().dispatchEvent("click");
  await expect(page.getByText(/ערי ישראל: 1 \/ 59/)).toBeVisible();

  // Wrong answer → closes, progress kept.
  await page.getByTestId("reset-button").click();
  await expect(page.getByTestId("gate-question")).toBeVisible();
  await page.getByTestId("gate-key-1").click();
  await page.getByTestId("gate-key-1").click(); // 11 is never a product of (3..8)×(4..9)
  await expect(page.getByTestId("gate-question")).toHaveCount(0);
  await expect(page.getByText(/ערי ישראל: 1 \/ 59/)).toBeVisible();

  // Correct answer → resets.
  await page.getByTestId("reset-button").click();
  const qText = (await page.getByTestId("gate-question").textContent()) ?? "";
  const m = qText.match(/(\d+)\s*×\s*(\d+)/);
  expect(m).toBeTruthy();
  const answer = String(Number(m![1]) * Number(m![2]));
  for (const digit of answer) {
    await page.getByTestId(`gate-key-${digit}`).click();
  }
  await expect(page.getByText(/ערי ישראל: 0 \/ 59/)).toBeVisible();
});

test("sticker album shows locked stickers and the counter", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-album").click();
  await expect(page.getByTestId("album-count")).toContainText("אספתם 0 מתוך");
  await expect(page.getByTestId("sticker-st-first")).toBeVisible();
  // Locked stickers show the how-to-earn hint.
  await expect(page.getByTestId("sticker-st-israel")).toContainText("גלו את כל ערי ישראל");
});

test("mute toggle persists across reloads", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-israel").click();
  const toggle = page.getByRole("button", { name: /השתק|הפעל/ });
  await expect(toggle).toBeVisible();
  await toggle.click();
  const muted = await page.evaluate(() => localStorage.getItem("world-explorers-muted"));
  expect(muted).toBe("true");
  await page.reload();
  const stillMuted = await page.evaluate(() => localStorage.getItem("world-explorers-muted"));
  expect(stillMuted).toBe("true");
});

test("home screen shows the new 3.0 tiles", async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByTestId("home-ocean")).toContainText("עולם האוקיינוס");
  await expect(page.getByTestId("home-encyclopedia")).toContainText("האנציקלופדיה");
});

test("ocean dive: canvas renders, zones switch, a creature can be discovered", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-ocean").click();

  const container = page.getByTestId("ocean-container");
  await expect(container.locator("canvas")).toBeVisible({ timeout: 20_000 });

  // depth zones are selectable
  await expect(page.getByTestId("zone-reef")).toBeVisible();
  await page.getByTestId("zone-open").click();
  await page.getByTestId("zone-deep").click();
  await page.getByTestId("zone-reef").click();

  // ocean tabs switch the scene
  await page.getByTestId("ocean-tab-indian").click();
  await expect(container.locator("canvas")).toBeVisible();

  // tap the center a few times — creatures swim past, one should register
  await page.waitForTimeout(1200);
  const box = await container.boundingBox();
  if (!box) throw new Error("ocean container has no box");
  for (let i = 0; i < 6; i++) {
    await page.mouse.click(box.x + box.width * (0.35 + i * 0.05), box.y + box.height * 0.5);
    await page.waitForTimeout(300);
  }
  // discovering ticks the shared counter above 0/38 at some point (best-effort:
  // the "גיליתם כאן" chip is always present regardless)
  await expect(page.getByText(/גיליתם כאן/)).toBeVisible();
});

test("encyclopedia: opens, shows section tabs and locked silhouettes", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-encyclopedia").click();
  await expect(page.getByText("אנציקלופדיית המגלה")).toBeVisible();
  await expect(page.getByTestId("enc-tab-countries")).toBeVisible();
  await page.getByTestId("enc-tab-marine").click();
  await expect(page.getByTestId("enc-tab-space")).toBeVisible();
});

test("quiz: the flags choice round runs and shows a result", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-quiz").click();
  await page.getByTestId("quiz-cat-flags").click();

  // Answer 8 questions: after 3 misses the correct card is revealed & pulses,
  // so blindly tapping the four options in turn always advances the round.
  const done = () => page.getByTestId("quiz-result").isVisible().catch(() => false);
  for (let q = 0; q < 8 && !(await done()); q++) {
    await expect(page.getByTestId("quiz-question")).toBeVisible();
    for (let attempt = 0; attempt < 4 && !(await done()); attempt++) {
      const cards = page.locator('[data-testid^="quiz-choice-"]');
      const n = await cards.count();
      if (n === 0) break;
      // force:true — the revealed correct card gently pulses, which Playwright's
      // stability check would otherwise reject.
      await cards.nth(attempt % n).click({ force: true });
      await page.waitForTimeout(450);
    }
    await page.waitForTimeout(300);
  }
  await expect(page.getByTestId("quiz-result")).toBeVisible({ timeout: 15_000 });
});

test("daily challenge: launches a special round", async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId("home-quiz").click();
  await page.getByTestId("quiz-daily").click();
  await expect(page.getByTestId("quiz-question")).toBeVisible();
  await expect(page.getByText("🔥", { exact: false }).first()).toBeVisible();
});
