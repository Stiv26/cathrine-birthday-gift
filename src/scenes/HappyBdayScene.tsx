import { useEffect } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../config";
import FloatingHearts from "../components/FloatingHearts";
import { burst, gentleRain } from "../components/ConfettiBurst";

type Props = {
  onRestart: () => void;
};

/** Layar terakhir: tulisan besar "Happy Birthday <nama>" + confetti. */
export default function HappyBdayScene({ onRestart }: Props) {
  useEffect(() => {
    burst(1.5);
    const t = window.setTimeout(() => gentleRain(3000), 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#2a0a10] via-tirai to-merah px-6 text-center">
      <FloatingHearts count={18} />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 font-display text-3xl font-bold tracking-wide text-krem drop-shadow sm:text-5xl"
      >
        Happy Birthday
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 140, damping: 12 }}
        className="z-10 mt-1 font-hand text-7xl font-bold text-emas drop-shadow-[0_4px_18px_rgba(0,0,0,0.4)] sm:text-8xl"
      >
        {CONFIG.nama} 🎂
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="z-10 mt-4 font-hand text-2xl text-krem/90"
      >
        sekali lagi... ❤️
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        whileTap={{ scale: 0.93 }}
        onClick={onRestart}
        className="z-10 mt-14 rounded-full border border-krem/40 bg-white/10 px-6 py-2.5 font-body text-sm font-semibold text-krem backdrop-blur-sm"
      >
        Ulangi dari awal 🔁
      </motion.button>
    </div>
  );
}
