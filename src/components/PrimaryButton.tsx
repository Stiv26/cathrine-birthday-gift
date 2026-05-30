import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

/** Tombol utama bergaya hangat, dipakai untuk "Lanjut →" dsb. */
export default function PrimaryButton({
  onClick,
  children,
  className = "",
}: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`rounded-full bg-gradient-to-b from-merah to-tirai px-8 py-3 font-body text-lg font-bold text-krem shadow-[0_8px_24px_-6px_rgba(194,18,46,0.7)] ring-1 ring-white/30 ${className}`}
    >
      {children}
    </motion.button>
  );
}
