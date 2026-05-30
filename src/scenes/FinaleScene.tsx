import { useEffect } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../config";
import FloatingHearts from "../components/FloatingHearts";
import PrimaryButton from "../components/PrimaryButton";
import { gentleRain } from "../components/ConfettiBurst";

type Props = {
  onAdvance: () => void;
};

/** Penutup hangat: ucapan reveal bertahap + hati melayang. */
export default function FinaleScene({ onAdvance }: Props) {
  useEffect(() => {
    gentleRain(2600);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-gradient-to-b from-tirai via-merah to-[#2a0a10] px-7 py-12 text-center">
      <FloatingHearts count={16} />

      <div className="z-10 flex max-w-lg flex-col gap-5">
        {CONFIG.ucapanPenutup.map((baris, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.7, duration: 0.8 }}
            className={
              i === 0
                ? "font-display text-3xl font-bold text-krem drop-shadow sm:text-4xl"
                : "font-body text-xl leading-relaxed text-krem/95 sm:text-2xl"
            }
          >
            {baris}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 + CONFIG.ucapanPenutup.length * 0.7 }}
        className="z-10 mt-12"
      >
        <PrimaryButton onClick={onAdvance}>Putar video 🎬</PrimaryButton>
      </motion.div>
    </div>
  );
}
