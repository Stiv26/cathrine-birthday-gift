import confetti from "canvas-confetti";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COLORS = ["#FF3B5C", "#C2122E", "#FF7A93", "#FFC857", "#FFF4EE"];

/** Ledakan confetti di tengah-atas layar (momen reveal / menang / YES). */
export function burst(power = 1) {
  if (prefersReduced()) return;
  const count = Math.round(120 * power);
  const defaults = { origin: { y: 0.6 }, colors: COLORS, zIndex: 200 };

  const fire = (ratio: number, opts: confetti.Options) =>
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * ratio) });

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

/** Hujan confetti pelan & hangat untuk finale. */
export function gentleRain(durationMs = 2500) {
  if (prefersReduced()) return;
  const end = Date.now() + durationMs;
  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: COLORS,
      zIndex: 200,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: COLORS,
      zIndex: 200,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/** Semburan hati dari satu titik (dipakai saat YES ditekan). */
export function heartBurst(x = 0.5, y = 0.5) {
  if (prefersReduced()) return;
  const heart = confetti.shapeFromText({ text: "❤️", scalar: 2.4 });
  confetti({
    shapes: [heart],
    scalar: 2.4,
    particleCount: 40,
    spread: 90,
    startVelocity: 45,
    origin: { x, y },
    zIndex: 200,
  });
}
