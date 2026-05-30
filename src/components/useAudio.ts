import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";

/**
 * Mengelola musik latar.
 * - Autoplay diblokir browser sampai ada gesture user, jadi `start()`
 *   dipanggil saat interaksi pertama (IntroScene).
 * - Semua pemanggilan play() dibungkus try/catch supaya file musik yang
 *   belum ada / gagal tidak memunculkan error ke user.
 */
export function useAudio() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio(CONFIG.musik);
    audio.loop = true;
    audio.volume = 0.55;
    audio.preload = "auto";
    ref.current = audio;
    return () => {
      audio.pause();
      ref.current = null;
    };
  }, []);

  const start = useCallback(async () => {
    const audio = ref.current;
    if (!audio || started) return;
    setStarted(true);
    try {
      await audio.play();
    } catch {
      /* autoplay diblokir / file belum ada — abaikan diam-diam */
    }
  }, [started]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      const audio = ref.current;
      if (audio) {
        audio.muted = next;
        if (!next && audio.paused) {
          audio.play().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  return { muted, started, start, toggleMute };
}
