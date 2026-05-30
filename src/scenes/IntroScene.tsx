import { useEffect } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../config";
import FloatingHearts from "../components/FloatingHearts";

type Props = {
  onAdvance: () => void;
  onFirstInteraction: () => void;
};

/**
 * Layar pembuka gelap-merah. Klik/tap/keydown apa pun memicu musik
 * (gesture pertama) lalu lanjut ke tirai.
 */
export default function IntroScene({ onAdvance, onFirstInteraction }: Props) {
  useEffect(() => {
    const go = () => {
      onFirstInteraction();
      onAdvance();
    };
    window.addEventListener("keydown", go, { once: true });
    return () => window.removeEventListener("keydown", go);
  }, [onAdvance, onFirstInteraction]);

  const handlePress = () => {
    onFirstInteraction();
    onAdvance();
  };

  return (
    <button
      onClick={handlePress}
      className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#2a0a10] via-tirai to-[#2a0a10] px-6 text-center"
      aria-label="Ketuk untuk mulai"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <FloatingHearts count={9} />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="font-hand text-3xl text-emas/90"
      >
        Untuk {CONFIG.nama}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1, type: "spring" }}
        className="mt-2 font-hand text-7xl font-bold text-krem drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)] sm:text-8xl"
      >
        {CONFIG.panggilan}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="anim-soft-pulse mt-14 font-body text-base font-medium text-krem/80"
      >
        Ketuk layar / tekan tombol apa saja ✨
      </motion.div>
    </button>
  );
}
