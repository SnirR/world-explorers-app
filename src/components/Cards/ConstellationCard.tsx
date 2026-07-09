// Constellation info card: the star pattern drawn as SVG + name + story.

import { CONSTELLATION_BY_ID } from "../../data/constellations";
import InfoSheet from "./InfoSheet";

interface ConstellationCardProps {
  constellationId: string | null;
  onClose: () => void;
  speakHebrew: (text: string) => void;
  playSfx: (name: "pop") => void;
}

export default function ConstellationCard({
  constellationId,
  onClose,
  speakHebrew,
  playSfx,
}: ConstellationCardProps) {
  const c = constellationId ? CONSTELLATION_BY_ID.get(constellationId) : undefined;

  return (
    <InfoSheet open={!!c} onClose={onClose} accentColor="#6d6ff0">
      {c && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 46 }}>{c.emoji}</span>
            <div
              style={{ fontWeight: 900, fontSize: 28, color: "#0f172a", cursor: "pointer" }}
              onClick={() => speakHebrew(c.nameHebrew)}
            >
              {c.nameHebrew} 🔊
            </div>
          </div>

          {/* the star pattern itself */}
          <div
            style={{
              marginTop: 14,
              borderRadius: 18,
              background: "radial-gradient(ellipse at 50% 30%, #1c2a5e 0%, #0a1029 70%)",
              padding: 12,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <svg viewBox="-0.1 -0.1 1.2 1.2" width={210} height={210} aria-hidden>
              {c.lines.map(([i, j], k) => (
                <line
                  key={k}
                  x1={c.stars[i][0]}
                  y1={c.stars[i][1]}
                  x2={c.stars[j][0]}
                  y2={c.stars[j][1]}
                  stroke="#ffe08a"
                  strokeWidth={0.012}
                  strokeLinecap="round"
                  opacity={0.85}
                />
              ))}
              {c.stars.map(([x, y], k) => (
                <g key={k}>
                  <circle cx={x} cy={y} r={0.045} fill="#fff8dd" opacity={0.25} />
                  <circle cx={x} cy={y} r={0.022} fill="#ffffff" />
                </g>
              ))}
            </svg>
          </div>

          <div
            onClick={() => {
              playSfx("pop");
              speakHebrew(c.storyHebrew);
            }}
            style={{
              marginTop: 12,
              background: "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
              borderRadius: 16,
              padding: "12px 16px",
              fontWeight: 700,
              fontSize: 17,
              color: "#312e81",
              cursor: "pointer",
              lineHeight: 1.45,
            }}
          >
            💫 {c.storyHebrew} <span style={{ fontSize: 14 }}>🔊</span>
          </div>
        </div>
      )}
    </InfoSheet>
  );
}
