import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONFIG } from "../config";

type Props = {
  onAdvance: () => void;
};

/** Kuis gemes: tiap pertanyaan harus dijawab benar untuk lanjut. */
export default function QuizScene({ onAdvance }: Props) {
  const [idx, setIdx] = useState(0);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [correctIdx, setCorrectIdx] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const q = CONFIG.quiz[idx];

  const handlePick = (i: number) => {
    if (locked) return;
    if (i === q.jawabanBenar) {
      setCorrectIdx(i);
      setToast(null);
      setLocked(true);
      window.setTimeout(() => {
        setCorrectIdx(null);
        setLocked(false);
        if (idx + 1 < CONFIG.quiz.length) {
          setIdx((n) => n + 1);
        } else {
          onAdvance();
        }
      }, 800);
    } else {
      setWrongIdx(i);
      setToast(q.pesanSalah);
      window.setTimeout(() => setWrongIdx(null), 500);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-tirai via-merah to-rose px-6 py-8">
      <p className="font-body text-sm font-semibold uppercase tracking-widest text-krem/70">
        Kuis · {idx + 1}/{CONFIG.quiz.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
          className="flex w-full max-w-md flex-col items-center"
        >
          <h2 className="mt-3 text-center font-display text-3xl font-bold leading-tight text-krem drop-shadow sm:text-4xl">
            {q.pertanyaan}
          </h2>

          <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            {q.opsi.map((opsi, i) => {
              const isWrong = wrongIdx === i;
              const isCorrect = correctIdx === i;
              return (
                <motion.button
                  key={i}
                  onClick={() => handlePick(i)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className={`${isWrong ? "anim-shake" : ""} rounded-2xl px-5 py-4 text-center font-body text-lg font-semibold shadow-lg ring-1 transition-colors ${
                    isCorrect
                      ? "bg-emerald-400 text-white ring-white/60"
                      : "bg-krem text-ink ring-white/40 hover:bg-white"
                  }`}
                >
                  {opsi}
                  {isCorrect ? " ✨" : ""}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-7 rounded-full bg-ink/40 px-5 py-2 font-hand text-xl text-krem backdrop-blur-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
