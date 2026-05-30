import { useRef, useState } from "react";
import { motion } from "framer-motion";
import FloatingHearts from "../components/FloatingHearts";
import { burst, heartBurst } from "../components/ConfettiBurst";

type Props = {
  onAdvance: () => void;
};

const isCoarse = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

const NO_STYLE =
  "rounded-full bg-krem px-12 py-5 font-display text-2xl font-bold text-tirai shadow-2xl ring-2 ring-emas";

/** Pertanyaan besar: "Iya" mudah ditekan, "Ngak" selalu kabur. */
export default function QuestionScene({ onAdvance }: Props) {
  const [fled, setFled] = useState(false); // sudah pernah kabur?
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [gone, setGone] = useState(false);
  const [taunt, setTaunt] = useState<string | null>(null);
  const posRef = useRef({ left: 0, top: 0 });

  // pindah jauh ke posisi acak yang tetap di dalam layar
  const flee = () => {
    const padX = 80;
    const padY = 90;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const rangeX = Math.max(0, w - padX * 2 - 130);
    const rangeY = Math.max(0, h - padY * 2 - 70);
    // syarat lompatan minimal setengah layar biar gerakannya jauh
    const minDist = Math.min(w, h) * 0.55;
    let left = padX;
    let top = padY;
    for (let i = 0; i < 12; i++) {
      left = padX + Math.random() * rangeX;
      top = padY + Math.random() * rangeY;
      const dx = left - posRef.current.left;
      const dy = top - posRef.current.top;
      if (Math.hypot(dx, dy) >= minDist || rangeX + rangeY < minDist) break;
    }
    posRef.current = { left, top };
    setPos({ left, top });
    setFled(true);
  };

  // Desktop: kabur saat kursor mendekat
  const handleHover = () => {
    if (isCoarse()) return;
    flee();
  };

  // Mobile/touch: sekali sentuh → langsung hilang
  const handleTouch = (e: React.PointerEvent) => {
    if (!isCoarse()) return;
    e.preventDefault();
    setGone(true);
    setTaunt("yah, kaburrr 🙈 ya udah Iya aja yaa 😚");
  };

  const handleYes = () => {
    burst(1.4);
    heartBurst(0.5, 0.55);
    window.setTimeout(onAdvance, 700);
  };

  const noHandlers = {
    onPointerEnter: handleHover,
    onPointerDown: handleTouch,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      flee();
    },
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-rose via-merah to-tirai px-6 text-center">
      <FloatingHearts count={8} />

      <motion.h2
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
        className="z-10 max-w-md font-display text-4xl font-bold leading-tight text-krem drop-shadow-lg sm:text-5xl"
      >
        Kamu sayang aku gak? 🥺
      </motion.h2>

      {/* Dua tombol rapi bersebelahan saat pertama muncul */}
      <div className="z-10 mt-12 flex items-center justify-center gap-5">
        <motion.button
          onClick={handleYes}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="rounded-full bg-krem px-12 py-5 font-display text-2xl font-bold text-tirai shadow-2xl ring-2 ring-emas"
        >
          Iya 💗
        </motion.button>

        {/* "Ngak" di alur normal sampai pertama kali kabur */}
        {!gone && !fled && (
          <button {...noHandlers} className={NO_STYLE}>
            Ngak
          </button>
        )}
      </div>

      {/* Setelah kabur: posisi fixed yang melompat-lompat */}
      {!gone && fled && (
        <button
          {...noHandlers}
          className={`${NO_STYLE} fixed z-20 transition-all duration-200 ease-out`}
          style={{
            left: pos.left,
            top: pos.top,
          }}
        >
          Ngak
        </button>
      )}

      {taunt && (
        <motion.p
          key={taunt}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 mt-10 font-hand text-2xl text-krem"
        >
          {taunt}
        </motion.p>
      )}
    </div>
  );
}
