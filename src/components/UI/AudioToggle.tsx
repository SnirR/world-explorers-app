interface AudioToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export default function AudioToggle({ isMuted, onToggle }: AudioToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="border-none rounded-full cursor-pointer flex items-center justify-center"
      style={{
        width: "48px",
        height: "48px",
        background: "rgba(255,255,255,0.9)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontSize: "24px",
        transition: "transform 0.15s ease",
      }}
      aria-label={isMuted ? "הפעל צליל" : "השתק צליל"}
    >
      {isMuted ? "🔇" : "🔊"}
    </button>
  );
}
