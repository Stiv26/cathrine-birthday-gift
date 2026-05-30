import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONFIG } from "../config";
import PolaroidPhoto from "../components/PolaroidPhoto";

type Props = {
  onAdvance: () => void;
};

/** Carousel polaroid tanpa teks — hanya tombol Prev / Next (+ swipe). */
export default function GalleryScene({ onAdvance }: Props) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const fotos = CONFIG.foto;
  const last = idx === fotos.length - 1;

  const rotations = useMemo(
    () => fotos.map(() => (Math.random() * 2 - 1) * 4),
    [fotos]
  );

  // Next: di foto terakhir lanjut ke scene berikutnya
  const next = () => {
    if (last) {
      onAdvance();
      return;
    }
    setDir(1);
    setIdx((n) => n + 1);
  };

  const prev = () => {
    if (idx === 0) return;
    setDir(-1);
    setIdx((n) => n - 1);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-krem via-rose/30 to-krem px-6">
      <div className="relative flex h-[26rem] w-full items-center justify-center">
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            initial={{ opacity: 0, x: dir * 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -120 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) next();
              else if (info.offset.x > 60) prev();
            }}
            className="absolute cursor-grab active:cursor-grabbing"
          >
            <PolaroidPhoto src={fotos[idx]} rotate={rotations[idx]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hanya tombol Prev / Next */}
      <div className="mt-8 flex items-center gap-6">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl text-tirai shadow-md ring-1 ring-tirai/20 disabled:opacity-30"
          aria-label="Sebelumnya"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-merah to-tirai text-3xl text-krem shadow-md ring-1 ring-white/30"
          aria-label="Berikutnya"
        >
          ›
        </button>
      </div>
    </div>
  );
}
