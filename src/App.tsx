import { useState, useCallback } from "react";
import HomeScreen from "./components/UI/HomeScreen";
import WorldMap from "./components/WorldMap/WorldMap";
import IsraelMap from "./components/WorldMap/IsraelMap";
import DiscoveryCounter from "./components/UI/DiscoveryCounter";
import AudioToggle from "./components/UI/AudioToggle";
import { useDiscovery } from "./hooks/useDiscovery";
import { useAudio } from "./hooks/useAudio";
import { CONTINENTS } from "./data/continents";
import { COUNTRIES } from "./data/countries";
import { TOTAL_ISRAEL_CITIES } from "./data/israelCities";

type GameMode = "continents" | "countries" | "israel";
type Screen = "home" | "map";

const MODE_TOTALS: Record<GameMode, number> = {
  continents: CONTINENTS.length,
  countries:  COUNTRIES.length,
  israel:     TOTAL_ISRAEL_CITIES,
};

const MODE_LABELS: Record<GameMode, string> = {
  continents: "יבשות",
  countries:  "מדינות",
  israel:     "ערי ישראל",
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<GameMode>("continents");

  const { isMuted, toggleMute, speakHebrew } = useAudio();

  const continentsDiscovery = useDiscovery("continents");
  const countriesDiscovery  = useDiscovery("countries");
  const israelDiscovery     = useDiscovery("israel");

  const activeDiscovery =
    mode === "continents" ? continentsDiscovery :
    mode === "countries"  ? countriesDiscovery  :
    israelDiscovery;

  const grandTotal =
    continentsDiscovery.totalDiscovered +
    countriesDiscovery.totalDiscovered +
    israelDiscovery.totalDiscovered;

  const handleSelectMode = useCallback((selectedMode: GameMode) => {
    setMode(selectedMode);
    setScreen("map");
  }, []);

  const handleBack = useCallback(() => {
    setScreen("home");
  }, []);

  // ── Home screen ─────────────────────────────────────────────────────────────
  if (screen === "home") {
    return (
      <div className="h-full w-full" style={{ fontFamily: "Heebo, sans-serif" }}>
        <HomeScreen
          onSelectMode={handleSelectMode}
          totalDiscovered={grandTotal}
          discoveredPerMode={{
            continents: continentsDiscovery.totalDiscovered,
            countries:  countriesDiscovery.totalDiscovered,
            israel:     israelDiscovery.totalDiscovered,
          }}
        />
      </div>
    );
  }

  // ── Map screen ───────────────────────────────────────────────────────────────
  return (
    <div className="h-full w-full relative overflow-hidden" style={{ fontFamily: "Heebo, sans-serif" }}>
      {/* Top bar */}
      <div
        className="absolute top-0 right-0 left-0 z-30 flex items-center justify-between p-3"
        style={{ direction: "rtl" }}
      >
        <button
          onClick={handleBack}
          className="border-none rounded-full cursor-pointer flex items-center justify-center"
          style={{
            width: "48px",
            height: "48px",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontSize: "24px",
          }}
          aria-label="חזרה"
        >
          🏠
        </button>

        <div className="flex flex-col items-center gap-1">
          <div
            style={{
              fontFamily: "Heebo, sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              color: "#64748b",
              letterSpacing: "0.5px",
            }}
          >
            {MODE_LABELS[mode]}
          </div>
          <DiscoveryCounter
            count={activeDiscovery.totalDiscovered}
            total={MODE_TOTALS[mode]}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm(`לאפס את כל הגילויים של "${MODE_LABELS[mode]}"?`)) {
                activeDiscovery.resetProgress();
              }
            }}
            className="border-none rounded-full cursor-pointer flex items-center justify-center"
            style={{
              width: "48px",
              height: "48px",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontSize: "20px",
            }}
            title="איפוס גילויים"
            aria-label="איפוס גילויים"
          >
            🗑️
          </button>
          <AudioToggle isMuted={isMuted} onToggle={toggleMute} />
        </div>
      </div>

      {mode === "israel" ? (
        <IsraelMap
          discoveredSet={israelDiscovery.discovered}
          onDiscover={israelDiscovery.discover}
          speakHebrew={speakHebrew}
        />
      ) : (
        <WorldMap
          mode={mode}
          discoveredSet={activeDiscovery.discovered}
          onDiscover={activeDiscovery.discover}
          speakHebrew={speakHebrew}
        />
      )}
    </div>
  );
}
