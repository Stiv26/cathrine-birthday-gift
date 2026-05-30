import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONFIG } from "../config";
import PolaroidPhoto from "../components/PolaroidPhoto";
import PrimaryButton from "../components/PrimaryButton";

type Props = {
  onAdvance: () => void;
};

/** Carousel polaroid 4 foto dengan tombol, dots, dan swipe. */
export default function GalleryScene({ onAdvance }: Props) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const fotos = CONFIG.foto;
  const last = idx === fotos.length - 1;

  const rotations = useMemo(
    () => fotos.map(() => (Math.random() * 2 - 1) * 4),
    [fotos]
  );

  const go = (delta: number) => {
    const nextIdx = idx + delta;
    if (nextIdx < 0 || nextIdx >= fotos.length) return;
    setDir(delta);
    setIdx(nextIdx);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-krem via-rose/30 to-krem px-6">
      <h3 className="mb-6 font-display text-3xl font-bold text-tirai">
        Momen kita 📸
      </h3>

      <div className="relative flex h-[26rem] w-full items-center justify-center">
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            initial={{ opacity: 0, x: dir * 120, rotate: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -120 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            className="absolute cursor-grab active:cursor-grabbing"
          >
            <PolaroidPhoto
              src={fotos[idx].src}
              caption={fotos[idx].caption}
              index={idx}
              rotate={rotations[idx]}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="mt-5 flex gap-2">
        {fotos.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDir(i > idx ? 1 : -1);
              setIdx(i);
            }}
            aria-label={`Foto ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === idx ? "w-6 bg-tirai" : "w-2.5 bg-tirai/30"
            }`}
          />
        ))}
      </div>

      {/* Navigasi */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={() => go(-1)}
          disabled={idx === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl text-tirai shadow-md ring-1 ring-tirai/20 disabled:opacity-30"
          aria-label="Sebelumnya"
        >
          ‹
        </button>

        {last ? (
          <PrimaryButton onClick={onAdvance}>Lihat pesan ❤️</PrimaryButton>
        ) : (
          <button
            onClick={() => go(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl text-tirai shadow-md ring-1 ring-tirai/20"
            aria-label="Berikutnya"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
