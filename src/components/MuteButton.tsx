import { motion } from "framer-motion";

type Props = {
  muted: boolean;
  visible: boolean;
  onToggle: () => void;
};

/** Tombol kecil fixed di pojok untuk mute/unmute musik. */
export default function MuteButton({ muted, visible, onToggle }: Props) {
  if (!visible) return null;
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.85 }}
      onClick={onToggle}
      aria-label={muted ? "Nyalakan musik" : "Matikan musik"}
      className="fixed right-3 top-3 z-[150] flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-ink/40 text-lg text-krem shadow-lg backdrop-blur-sm"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 0.75rem)" }}
    >
      {muted ? "🔇" : "🎵"}
    </motion.button>
  );
}
