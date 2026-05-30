import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../config";
import FloatingHearts from "../components/FloatingHearts";
import PrimaryButton from "../components/PrimaryButton";
import { burst } from "../components/ConfettiBurst";

type Props = {
  onAdvance: () => void;
};

/** Dua tirai velvet menutup penuh lalu membuka ke kiri & kanan. */
export default function CurtainScene({ onAdvance }: Props) {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setOpen(true), 700);
    const t2 = window.setTimeout(() => {
      setRevealed(true);
      burst(1.2);
    }, 2300);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const curtainTransition = { duration: 1.6, ease: [0.76, 0, 0.24, 1] as const };

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#2a0a10] to-ink">
      {/* Konten di balik tirai */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <FloatingHearts count={revealed ? 14 : 0} />
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={revealed ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 160, damping: 14 }}
          className="font-display text-5xl font-bold text-krem drop-shadow-lg sm:text-6xl"
        >
          Happy Birthday,
          <br />
          <span className="font-hand text-emas">{CONFIG.panggilan}! 🎉</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <PrimaryButton onClick={onAdvance}>Lanjut →</PrimaryButton>
        </motion.div>
      </div>

      {/* Panel tirai kiri */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: open ? "-102%" : "0%" }}
        transition={curtainTransition}
        className="velvet absolute inset-y-0 left-0 z-20 w-1/2 shadow-[8px_0_30px_rgba(0,0,0,0.5)]"
      >
        <Tieback side="right" />
      </motion.div>

      {/* Panel tirai kanan */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: open ? "102%" : "0%" }}
        transition={curtainTransition}
        className="velvet absolute inset-y-0 right-0 z-20 w-1/2 shadow-[-8px_0_30px_rgba(0,0,0,0.5)]"
      >
        <Tieback side="left" />
      </motion.div>

      {/* Pelmet / kain atas dengan rumbai emas */}
      <div className="absolute inset-x-0 top-0 z-30 h-14 velvet shadow-[0_6px_16px_rgba(0,0,0,0.5)]">
        <div className="anim-shimmer absolute inset-x-0 bottom-0 h-2 bg-gradient-to-b from-emas to-amber-700" />
      </div>
    </div>
  );
}

/** Tali tirai emas dekoratif di tepi dalam tiap panel. */
function Tieback({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`anim-shimmer absolute top-1/2 h-24 w-2 -translate-y-1/2 rounded-full bg-gradient-to-b from-emas to-amber-600 ${
        side === "left" ? "left-1" : "right-1"
      }`}
    />
  );
}
