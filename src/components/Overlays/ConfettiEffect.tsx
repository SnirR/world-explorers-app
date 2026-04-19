import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiEffectProps {
  trigger: number; // increment to re-fire
  originX?: number; // 0-1 fraction of screen width
  originY?: number; // 0-1 fraction of screen height
}

export default function ConfettiEffect({ trigger, originX = 0.5, originY = 0.5 }: ConfettiEffectProps) {
  useEffect(() => {
    if (trigger === 0) return;

    // Fire a burst of confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: ["#4ade80", "#fb923c", "#818cf8", "#f87171", "#34d399", "#fbbf24", "#93c5fd"],
      startVelocity: 30,
      gravity: 0.8,
      ticks: 60,
      disableForReducedMotion: true,
    });

    // A second delayed burst for extra fun
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { x: originX, y: originY },
        colors: ["#fbbf24", "#f87171", "#818cf8"],
        startVelocity: 20,
        gravity: 0.6,
        ticks: 50,
        disableForReducedMotion: true,
      });
    }, 200);
  }, [trigger, originX, originY]);

  return null; // confetti renders on its own canvas
}
