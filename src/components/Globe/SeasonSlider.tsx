// Season chip row for the globe + the "why do seasons happen?" card.

import { useState } from "react";
import {
  SEASONS,
  SEASON_BY_ID,
  oppositeSeason,
  WHY_SEASONS_HEBREW,
  type SeasonId,
} from "../../data/seasons";
import InfoSheet from "../Cards/InfoSheet";

interface SeasonSliderProps {
  season: SeasonId | null;
  onSeasonChange: (s: SeasonId | null) => void;
  speakHebrew: (text: string) => void;
  playSfx: (name: "pop") => void;
  markSeasonSeen: (id: SeasonId) => void;
}

export default function SeasonSlider({
  season,
  onSeasonChange,
  speakHebrew,
  playSfx,
  markSeasonSeen,
}: SeasonSliderProps) {
  const [whyOpen, setWhyOpen] = useState(false);
  const active = season ? SEASON_BY_ID.get(season) : undefined;
  const opposite = season ? SEASON_BY_ID.get(oppositeSeason(season)) : undefined;

  return (
    <>
      <div
        data-testid="season-slider"
        style={{
          position: "absolute",
          bottom: 84,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          direction: "rtl",
        }}
      >
        {active && (
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: 14,
              padding: "6px 14px",
              fontFamily: "Heebo, sans-serif",
              fontWeight: 800,
              fontSize: 13.5,
              color: "#334155",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              maxWidth: 320,
              textAlign: "center",
            }}
          >
            {active.emoji} אצלנו {active.nameHebrew} — ובחצי הדרומי {opposite?.nameHebrew}
            {opposite?.emoji}!
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 999,
            padding: 4,
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          }}
        >
          {SEASONS.map((s) => (
            <button
              key={s.id}
              data-testid={`season-${s.id}`}
              onClick={() => {
                playSfx("pop");
                const next = season === s.id ? null : s.id;
                onSeasonChange(next);
                if (next) {
                  markSeasonSeen(s.id);
                  speakHebrew(`${s.nameHebrew}. ${s.factHebrew}`);
                }
              }}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "7px 12px",
                fontFamily: "Heebo, sans-serif",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                background:
                  season === s.id ? "linear-gradient(135deg,#0ea5e9,#6366f1)" : "transparent",
                color: season === s.id ? "white" : "#475569",
              }}
            >
              {s.emoji} {s.nameHebrew}
            </button>
          ))}
          <button
            onClick={() => {
              playSfx("pop");
              setWhyOpen(true);
              speakHebrew(WHY_SEASONS_HEBREW);
            }}
            aria-label="למה יש עונות?"
            style={{
              border: "none",
              borderRadius: 999,
              padding: "7px 12px",
              fontFamily: "Heebo, sans-serif",
              fontWeight: 900,
              fontSize: 14,
              cursor: "pointer",
              background: "#fde68a",
              color: "#713f12",
            }}
          >
            למה? 🤔
          </button>
        </div>
      </div>

      <InfoSheet open={whyOpen} onClose={() => setWhyOpen(false)} accentColor="#0ea5e9">
        <div style={{ direction: "rtl" }}>
          <div style={{ fontWeight: 900, fontSize: 26, color: "#0f172a" }}>
            למה יש עונות שנה? 🌍
          </div>

          {/* tilted-earth-around-the-sun mini diagram */}
          <div
            style={{
              marginTop: 14,
              borderRadius: 18,
              background: "radial-gradient(ellipse at 50% 45%, #12204e 0%, #070d24 75%)",
              padding: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 220 120" width="100%" style={{ maxWidth: 340 }} aria-hidden>
              <ellipse cx="110" cy="60" rx="88" ry="34" fill="none" stroke="#3b4a7a" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="110" cy="60" r="16" fill="#fdb813" />
              <circle cx="110" cy="60" r="22" fill="#fdb81333" />
              {/* two tilted earths: summer side + winter side */}
              {[
                { x: 22, y: 60, label: "קיץ ☀️" },
                { x: 198, y: 60, label: "חורף ❄️" },
              ].map((e, i) => (
                <g key={i}>
                  <g transform={`translate(${e.x} ${e.y}) rotate(-23)`}>
                    <circle r="10" fill="#2470b8" />
                    <path d="M -4 -6 Q 2 -2 -1 4 Q -6 2 -4 -6" fill="#3fa060" />
                    <line x1="0" y1="-13" x2="0" y2="13" stroke="#ffffff88" strokeWidth="1.4" />
                  </g>
                  <text x={e.x} y={e.y + 28} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="800" fontFamily="Heebo, sans-serif">
                    {e.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div
            onClick={() => {
              playSfx("pop");
              speakHebrew(WHY_SEASONS_HEBREW);
            }}
            style={{
              marginTop: 12,
              background: "linear-gradient(135deg,#fef9c3,#fde68a)",
              borderRadius: 16,
              padding: "12px 16px",
              fontWeight: 700,
              fontSize: 16.5,
              color: "#713f12",
              cursor: "pointer",
              lineHeight: 1.5,
            }}
          >
            💡 {WHY_SEASONS_HEBREW} <span style={{ fontSize: 14 }}>🔊</span>
          </div>
        </div>
      </InfoSheet>
    </>
  );
}
