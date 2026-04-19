interface DiscoveryCounterProps {
  count: number;
  total: number;
}

export default function DiscoveryCounter({ count, total }: DiscoveryCounterProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-full px-4 py-2"
      style={{
        background: "rgba(255,255,255,0.9)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <span style={{ fontSize: "20px" }}>⭐</span>
      <span
        style={{
          fontFamily: "Heebo, sans-serif",
          fontWeight: 800,
          fontSize: "20px",
          color: "#1a365d",
        }}
      >
        {count}/{total}
      </span>
      <span
        style={{
          fontFamily: "Heebo, sans-serif",
          fontWeight: 700,
          fontSize: "16px",
          color: "#64748b",
        }}
      >
        גילויים
      </span>
    </div>
  );
}
