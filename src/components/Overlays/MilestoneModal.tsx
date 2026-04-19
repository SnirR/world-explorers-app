import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function MilestoneModal({ isOpen, onClose, message }: MilestoneModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Big celebration confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 30,
        spread: 120,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ["#fbbf24", "#f87171", "#818cf8", "#4ade80", "#fb923c"],
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="rounded-3xl p-8 text-center max-w-sm mx-4"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: "Heebo, sans-serif",
                fontWeight: 900,
                fontSize: "36px",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {message}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xl font-bold rounded-2xl px-8 py-3 border-none cursor-pointer"
              style={{
                fontFamily: "Heebo, sans-serif",
                background: "white",
                color: "#f59e0b",
              }}
              onClick={onClose}
            >
              🎉 יופי!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
