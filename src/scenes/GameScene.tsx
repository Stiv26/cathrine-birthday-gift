import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONFIG } from "../config";
import PrimaryButton from "../components/PrimaryButton";
import { burst } from "../components/ConfettiBurst";

type Props = {
  onAdvance: () => void;
};

type FallingItem = {
  id: number;
  x: number; // 0..1 (rasio lebar)
  y: number; // px dari atas
  speed: number; // px / detik
  emoji: string;
  bomb: boolean;
};

const HEARTS = ["❤️", "💖", "🌹", "🎁"];
const BOMB = "💣";
const BOMB_CHANCE = 0.6; // 60% bom : 40% hati
const TIME_LIMIT = 35; // detik (time attack)
const SPAWN_MS = 420; // jeda spawn (makin sering)
const SPAWN_BATCH = 2; // jumlah item per spawn (makin ramai)
const BASKET_W = 84;
const ITEM_SIZE = 40;

/**
 * Mini-game time attack: tangkap hati (+1), hindari bom (-1).
 * Kejar target sebelum waktu habis. Keranjang mengikuti pointer.
 */
export default function GameScene({ onAdvance }: Props) {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const basketX = useRef(0.5); // rasio
  const itemsRef = useRef<FallingItem[]>([]);
  const rafRef = useRef<number>(0);
  const lastSpawn = useRef(0);
  const lastTs = useRef(0);
  const startRef = useRef(0);
  const idSeq = useRef(0);
  const scoreRef = useRef(0);
  const wonRef = useRef(false);
  const lostRef = useRef(false);

  const [, force] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [boom, setBoom] = useState(0); // pemicu animasi feedback bom

  const target = CONFIG.game.target;

  const handlePointer = useCallback((clientX: number) => {
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    basketX.current = Math.min(1, Math.max(0, ratio));
  }, []);

  const resetGame = useCallback(() => {
    itemsRef.current = [];
    scoreRef.current = 0;
    wonRef.current = false;
    lostRef.current = false;
    lastSpawn.current = 0;
    lastTs.current = 0;
    startRef.current = 0;
    setScore(0);
    setTimeLeft(TIME_LIMIT);
    setWon(false);
    setLost(false);
  }, []);

  useEffect(() => {
    const loop = (ts: number) => {
      const el = areaRef.current;
      if (!el) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const h = el.clientHeight;
      const w = el.clientWidth;
      if (!startRef.current) startRef.current = ts;
      if (!lastTs.current) lastTs.current = ts;
      const dt = Math.min(0.05, (ts - lastTs.current) / 1000);
      lastTs.current = ts;

      const active = !wonRef.current && !lostRef.current;

      // timer
      if (active) {
        const remain = Math.max(0, TIME_LIMIT - (ts - startRef.current) / 1000);
        setTimeLeft(remain);
        if (remain <= 0) {
          lostRef.current = true;
          setLost(true);
        }
      }

      // spawn (beberapa item sekaligus biar ramai)
      if (active && ts - lastSpawn.current > SPAWN_MS) {
        lastSpawn.current = ts;
        for (let n = 0; n < SPAWN_BATCH; n++) {
          idSeq.current += 1;
          const bomb = Math.random() < BOMB_CHANCE;
          itemsRef.current.push({
            id: idSeq.current,
            x: 0.07 + Math.random() * 0.86,
            y: -ITEM_SIZE - n * 60, // sebar sedikit di sumbu vertikal
            speed: 260 + Math.random() * 220, // lebih cepat
            emoji: bomb
              ? BOMB
              : HEARTS[Math.floor(Math.random() * HEARTS.length)],
            bomb,
          });
        }
      }

      const basketPx = basketX.current * w;
      const basketTop = h - 70;

      let gained = 0; // hati tertangkap
      let bombed = 0; // bom tertangkap
      const next: FallingItem[] = [];
      for (const it of itemsRef.current) {
        const y = it.y + it.speed * dt;
        const itemPx = it.x * w;
        if (
          active &&
          y + ITEM_SIZE >= basketTop &&
          y <= basketTop + 40 &&
          Math.abs(itemPx - basketPx) < BASKET_W / 2 + ITEM_SIZE / 2
        ) {
          if (it.bomb) bombed += 1;
          else gained += 1;
          continue; // tertangkap → hilang (hati lolos tanpa penalti)
        }
        if (y < h + ITEM_SIZE) next.push({ ...it, y });
      }
      itemsRef.current = next;

      if (active && (gained > 0 || bombed > 0)) {
        const delta = gained - bombed;
        scoreRef.current = Math.max(0, Math.min(target, scoreRef.current + delta));
        setScore(scoreRef.current);
        if (bombed > 0) setBoom((b) => b + 1);
        if (scoreRef.current >= target) {
          wonRef.current = true;
          setWon(true);
          burst(1.3);
        }
      }

      force((n) => n + 1);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  const pct = Math.round((score / target) * 100);
  const lowTime = timeLeft <= 10;

  return (
    <div className="relative flex h-full w-full flex-col bg-gradient-to-b from-rose/30 via-krem to-rose/20">
      {/* Header / progress */}
      <div
        className="z-10 px-5 pt-5"
        style={{ paddingTop: "calc(env(safe-area-inset-top,0px) + 1.25rem)" }}
      >
        <h3 className="text-center font-display text-2xl font-bold text-tirai">
          Tangkap Hati! 🧺
        </h3>
        <p className="mt-1 text-center font-body text-sm text-ink/70">
          Tangkap hati ❤️ — hindari bom 💣 (−1) — kejar waktu!
        </p>

        <div className="mx-auto mt-3 flex w-full max-w-xs items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/70 ring-1 ring-tirai/20">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-merah to-tirai"
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <span
            className={`min-w-[3.2rem] rounded-full px-2 py-0.5 text-center font-body text-sm font-bold tabular-nums ${
              lowTime ? "bg-tirai text-krem" : "text-tirai"
            }`}
          >
            ⏱ {Math.ceil(timeLeft)}s
          </span>
        </div>
        <p className="mt-1 text-center font-body text-sm font-bold text-tirai">
          {score} / {target}
        </p>
      </div>

      {/* Arena */}
      <div
        ref={areaRef}
        className="relative mt-2 flex-1 touch-none overflow-hidden"
        onPointerMove={(e) => handlePointer(e.clientX)}
        onPointerDown={(e) => handlePointer(e.clientX)}
      >
        {itemsRef.current.map((it) => (
          <span
            key={it.id}
            className="pointer-events-none absolute select-none"
            style={{
              left: `${it.x * 100}%`,
              top: `${it.y}px`,
              fontSize: `${ITEM_SIZE}px`,
              transform: "translateX(-50%)",
              lineHeight: 1,
            }}
          >
            {it.emoji}
          </span>
        ))}

        {/* Feedback "-1" saat kena bom */}
        <AnimatePresence>
          {boom > 0 && (
            <motion.div
              key={boom}
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.2, y: -30 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-5xl font-bold text-tirai drop-shadow"
            >
              💥 −1
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keranjang */}
        <div
          className="pointer-events-none absolute bottom-[30px] flex items-center justify-center text-5xl"
          style={{
            left: `${basketX.current * 100}%`,
            width: `${BASKET_W}px`,
            transform: "translateX(-50%)",
          }}
        >
          🧺
        </div>

        {/* Overlay menang */}
        {won && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-ink/55 px-6 text-center backdrop-blur-sm"
          >
            <motion.h3
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 12 }}
              className="font-display text-4xl font-bold text-krem"
            >
              Yeay, kamu menang! 🏆
            </motion.h3>
            <p className="mt-2 font-hand text-2xl text-emas">
              hati kamu penuh ❤️
            </p>
            <div className="mt-8">
              <PrimaryButton onClick={onAdvance}>Lanjut →</PrimaryButton>
            </div>
          </motion.div>
        )}

        {/* Overlay kalah (waktu habis) */}
        {lost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-ink/60 px-6 text-center backdrop-blur-sm"
          >
            <motion.h3
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 12 }}
              className="font-display text-4xl font-bold text-krem"
            >
              Waktu habis! ⏰
            </motion.h3>
            <p className="mt-2 font-hand text-2xl text-emas">
              dapat {score} dari {target} hati
            </p>
            <p className="mt-4 font-body text-sm text-krem/70">
              mau main lagi atau lanjut aja? bebas kok 😊
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={resetGame}
                className="rounded-full border border-krem/50 bg-white/10 px-7 py-3 font-body text-lg font-semibold text-krem backdrop-blur-sm"
              >
                Main lagi 🔁
              </button>
              <PrimaryButton onClick={onAdvance}>Lanjut →</PrimaryButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
