// Full-screen "visit the country" diorama overlay: a rotating 3D island with
// the country's landmark, animal and nature. Tapping a piece names it aloud.

import { useCallback, useEffect, useRef } from "react";
import { DioramaScene, type DioramaPickKind } from "../../three/DioramaScene";
import { DIORAMAS, FALLBACK_BIOME } from "../../data/dioramas";
import { COUNTRY_BY_ID } from "../../data/countries";
import { getCountryDetails, flagEmoji } from "../../data/countryDetails";
import type { SfxName } from "../../hooks/useSfx";

interface DioramaViewProps {
  countryId: string;
  onClose: () => void;
  speakHebrew: (text: string) => void;
  playSfx: (name: SfxName) => void;
  markVisited: (countryId: string) => void;
}

export default function DioramaView({
  countryId,
  onClose,
  speakHebrew,
  playSfx,
  markVisited,
}: DioramaViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const country = COUNTRY_BY_ID.get(countryId);
  const details = getCountryDetails(countryId);
  const recipe = DIORAMAS[countryId] ?? null;

  const stateRef = useRef({ speakHebrew, playSfx });
  useEffect(() => {
    stateRef.current = { speakHebrew, playSfx };
  }, [speakHebrew, playSfx]);

  const handlePick = useCallback(
    (kind: DioramaPickKind | null) => {
      const s = stateRef.current;
      if (!kind) return;
      s.playSfx("pop");
      if (recipe) {
        const label =
          kind === "landmark" ? recipe.landmarkHebrew : kind === "animal" ? recipe.animalHebrew : recipe.natureHebrew;
        s.speakHebrew(`זה ${label}!`);
      } else if (country) {
        s.speakHebrew(`זה מ${country.nameHebrew}!`);
      }
    },
    [recipe, country]
  );

  useEffect(() => {
    if (!containerRef.current || !country) return;
    markVisited(countryId);
    const s = stateRef.current;
    s.playSfx("chime");
    s.speakHebrew(recipe?.welcomeHebrew ?? `ברוכים הבאים ל${country.nameHebrew}!`);

    let scene: DioramaScene | null = null;
    try {
      const fb = FALLBACK_BIOME[country.continentId] ?? FALLBACK_BIOME.europe;
      scene = new DioramaScene(containerRef.current, {
        recipe,
        fallback: recipe
          ? undefined
          : {
              emojis: details?.emojis ?? "🌍",
              flagEmoji: details ? flagEmoji(details.alpha2) : "🏳️",
              biome: fb.biome,
              sky: fb.sky,
              nature: fb.nature,
            },
        reducedMotion:
          typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        onPick: handlePick,
      });
    } catch {
      /* WebGL failed — the close button still works */
    }
    return () => scene?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  if (!country) return null;

  const chips: { emoji: string; label: string }[] = recipe
    ? [
        { emoji: "🏛️", label: recipe.landmarkHebrew },
        { emoji: "🐾", label: recipe.animalHebrew },
        { emoji: "🌿", label: recipe.natureHebrew },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50" style={{ background: "#0a1029" }} data-testid="diorama-view">
      <div ref={containerRef} className="absolute inset-0" data-testid="diorama-container" />

      {/* header */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.94)",
            borderRadius: 999,
            padding: "8px 22px",
            fontFamily: "Heebo, sans-serif",
            fontWeight: 900,
            fontSize: 19,
            color: "#0f172a",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            direction: "rtl",
          }}
        >
          {details ? flagEmoji(details.alpha2) : "🌍"} מבקרים ב{country.nameHebrew}
        </div>
      </div>

      {/* close */}
      <button
        onClick={() => {
          playSfx("pop");
          onClose();
        }}
        aria-label="סגירה"
        data-testid="diorama-close"
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          zIndex: 11,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.92)",
          fontSize: 20,
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
        }}
      >
        ✕
      </button>

      {/* what's on the island */}
      {chips.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 10,
            direction: "rtl",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "94vw",
          }}
        >
          {chips.map((chip, i) => (
            <button
              key={i}
              onClick={() => {
                playSfx("pop");
                speakHebrew(chip.label);
              }}
              style={{
                border: "none",
                borderRadius: 999,
                background: "rgba(255,255,255,0.92)",
                padding: "8px 16px",
                fontFamily: "Heebo, sans-serif",
                fontWeight: 800,
                fontSize: 14.5,
                color: "#1e293b",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                whiteSpace: "nowrap",
              }}
            >
              {chip.emoji} {chip.label} 🔊
            </button>
          ))}
        </div>
      )}

      {/* hint */}
      <div
        style={{
          position: "absolute",
          bottom: chips.length > 0 ? 72 : 26,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9,
          background: "rgba(2,10,40,0.55)",
          borderRadius: 999,
          padding: "5px 16px",
          fontFamily: "Heebo, sans-serif",
          fontWeight: 700,
          fontSize: 12.5,
          color: "#c7d2fe",
          direction: "rtl",
          whiteSpace: "nowrap",
        }}
      >
        סובבו עם האצבע · הקישו על מה שמעניין אתכם 👆
      </div>
    </div>
  );
}
