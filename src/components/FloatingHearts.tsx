import { useMemo } from "react";

type Props = {
  /** jumlah hati melayang (jaga tetap kecil demi performa) */
  count?: number;
  /** emoji yang dipakai */
  emojis?: string[];
};

type Bit = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rot: number;
  opacity: number;
  emoji: string;
};

/** Latar dekoratif: hati/emoji melayang naik dari bawah layar. */
export default function FloatingHearts({
  count = 12,
  emojis = ["❤️", "💖", "🌹", "💕"],
}: Props) {
  const bits = useMemo<Bit[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      size: 14 + Math.random() * 26,
      duration: 7 + Math.random() * 8,
      delay: -Math.random() * 12,
      drift: (Math.random() - 0.5) * 120,
      rot: (Math.random() - 0.5) * 80,
      opacity: 0.4 + Math.random() * 0.5,
      emoji: emojis[i % emojis.length],
    }));
  }, [count, emojis]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {bits.map((b, i) => (
        <span
          key={i}
          className="anim-float-up absolute bottom-[-40px] select-none"
          style={
            {
              left: `${b.left}%`,
              fontSize: `${b.size}px`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              "--drift": `${b.drift}px`,
              "--rot": `${b.rot}deg`,
              "--o": b.opacity,
            } as React.CSSProperties
          }
        >
          {b.emoji}
        </span>
      ))}
    </div>
  );
}
