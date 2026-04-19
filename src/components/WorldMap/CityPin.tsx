interface CityPinProps {
  isFound: boolean;
  color: string;
}

/**
 * Reusable SVG city pin — used inside a react-simple-maps <Marker>.
 * Renders: invisible hit area → pulse ring (if undiscovered) → main circle → star/dot.
 */
export default function CityPin({ isFound, color }: CityPinProps) {
  return (
    <>
      {/* Invisible large hit area for easy tapping */}
      <circle r={16} fill="transparent" style={{ cursor: "pointer" }} />

      {/* Pulse ring for undiscovered cities */}
      {!isFound && (
        <circle
          r={11}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeOpacity={0.5}
          style={{ animation: "cityPulse 2s ease-out infinite", pointerEvents: "none" }}
        />
      )}

      {/* Main pin circle */}
      <circle
        r={isFound ? 9 : 8}
        fill={isFound ? color : "#fff"}
        stroke={color}
        strokeWidth={2.5}
        style={{
          cursor: "pointer",
          filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.35))",
        }}
      />

      {/* ⭐ inside if found */}
      {isFound && (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: "9px", pointerEvents: "none" }}
        >
          ⭐
        </text>
      )}

      {/* Dot inside if not found */}
      {!isFound && (
        <circle r={3} fill={color} style={{ pointerEvents: "none" }} />
      )}
    </>
  );
}
