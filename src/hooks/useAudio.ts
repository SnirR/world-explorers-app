import { useState, useCallback, useEffect } from "react";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

const MUTE_KEY = "world-explorers-muted";

// Detect whether native Capacitor TTS is available (i.e. we're running inside a Capacitor app).
const isCapacitor = typeof (window as unknown as Record<string, unknown>)["Capacitor"] !== "undefined";

export interface AudioControls {
  isMuted: boolean;
  toggleMute: () => void;
  speakHebrew: (text: string) => void;
}

export function useAudio(): AudioControls {
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MUTE_KEY, String(isMuted));
    } catch {
      // ignore
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const speakHebrew = useCallback(
    (text: string) => {
      if (isMuted) return;

      // Strip quotation marks that confuse Hebrew TTS (e.g. ארה"ב)
      const sanitized = text.replace(/["""״׳']/g, "");

      if (isCapacitor) {
        // Native Android/iOS TTS
        TextToSpeech.stop().catch(() => {});
        TextToSpeech.speak({
          text: sanitized,
          lang: "he-IL",
          rate: 0.85,
          pitch: 1.1,
          volume: 1.0,
          category: "ambient",
        }).catch(() => {});
      } else if (window.speechSynthesis) {
        // Browser fallback
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(sanitized);
        utterance.lang = "he-IL";
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        const voices = window.speechSynthesis.getVoices();
        const hebrewVoice = voices.find((v) => v.lang.startsWith("he"));
        if (hebrewVoice) utterance.voice = hebrewVoice;
        window.speechSynthesis.speak(utterance);
      }
    },
    [isMuted]
  );

  // Pre-load browser voices (no-op on Android WebView)
  useEffect(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
    const handleVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
  }, []);

  return { isMuted, toggleMute, speakHebrew };
}
