import { CONTINENTS } from "../../data/continents";
import { COUNTRIES } from "../../data/countries";
import { TOTAL_COUNTRY_CITIES } from "../../data/countryCities";
import { TOTAL_ISRAEL_CITIES } from "../../data/israelCities";

type GameMode = "continents" | "countries" | "country-cities" | "israel";

interface HomeScreenProps {
  onSelectMode: (mode: GameMode) => void;
  totalDiscovered: number;
  discoveredPerMode: Record<GameMode, number>;
}

const modes: {
  id: GameMode;
  emoji: string;
  label: string;
  total: number;
  gradient: string;
  shadow: string;
}[] = [
  {
    id: "continents",
    emoji: "🌍",
    label: "יבשות",
    total: CONTINENTS.length,
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    shadow: "0 8px 24px rgba(59, 130, 246, 0.45)",
  },
  {
    id: "countries",
    emoji: "🗺️",
    label: "מדינות",
    total: COUNTRIES.length,
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    shadow: "0 8px 24px rgba(16, 185, 129, 0.45)",
  },
  {
    id: "country-cities",
    emoji: "🏘️",
    label: "ערים במדינות",
    total: TOTAL_COUNTRY_CITIES,
    gradient: "linear-gradient(135deg, #ec4899, #be185d)",
    shadow: "0 8px 24px rgba(236, 72, 153, 0.45)",
  },
  {
    id: "israel",
    emoji: "🇮🇱",
    label: "ערי ישראל",
    total: TOTAL_ISRAEL_CITIES,
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    shadow: "0 8px 24px rgba(249, 115, 22, 0.45)",
  },
];

export default function HomeScreen({ onSelectMode, totalDiscovered, discoveredPerMode }: HomeScreenProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-5 p-5"
      style={{ direction: "rtl", overflowY: "auto" }}
    >
      {/* Title card */}
      <div
        className="text-center rounded-3xl px-8 py-4"
        style={{
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        <h1
          style={{
            fontFamily: "Heebo, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(32px, 7vw, 56px)",
            color: "#1a365d",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          🌍 מגלי העולם
        </h1>
        <p
          style={{
            fontFamily: "Heebo, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(14px, 2vw, 20px)",
            color: "#2d4a7a",
            marginTop: "4px",
          }}
        >
          בואו לגלות את העולם!
        </p>
      </div>

      {/* Grand total badge */}
      {totalDiscovered > 0 && (
        <div
          className="rounded-full px-5 py-1.5"
          style={{
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          <span
            style={{
              fontFamily: "Heebo, sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              color: "#1a365d",
            }}
          >
            ⭐ {totalDiscovered} גילויים בסך הכל
          </span>
        </div>
      )}

      {/* Mode buttons */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        {modes.map((m) => {
          const done = discoveredPerMode[m.id];
          const pct = Math.round((done / m.total) * 100);
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className="border-none rounded-2xl cursor-pointer text-right"
              style={{
                fontFamily: "Heebo, sans-serif",
                background: m.gradient,
                padding: "14px 18px",
                minHeight: "70px",
                boxShadow: m.shadow,
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {/* Progress fill bar */}
              {done > 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    height: "5px",
                    width: `${pct}%`,
                    background: "rgba(255,255,255,0.5)",
                    borderRadius: "0 0 0 4px",
                    transition: "width 0.5s ease",
                  }}
                />
              )}

              <div className="flex items-center gap-3 justify-end">
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "clamp(20px, 3.5vw, 28px)",
                      color: "white",
                      textShadow: "0 2px 6px rgba(0,0,0,0.25)",
                      lineHeight: 1.1,
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {done > 0 ? `${done} מתוך ${m.total} גולו` : `${m.total} לגלות`}
                  </span>
                </div>
                <span style={{ fontSize: "30px" }}>{m.emoji}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
