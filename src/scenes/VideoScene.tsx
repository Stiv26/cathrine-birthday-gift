import { motion } from "framer-motion";
import { CONFIG } from "../config";
import PrimaryButton from "../components/PrimaryButton";

type Props = {
  onAdvance: () => void;
};

/** Ambil ID file dari berbagai bentuk link Google Drive. */
function parseDriveId(url: string): string | null {
  const byPath = url.match(/\/file\/d\/([^/]+)/);
  if (byPath) return byPath[1];
  const byQuery = url.match(/[?&]id=([^&]+)/);
  if (byQuery) return byQuery[1];
  return null;
}

/**
 * Tayangan video penutup.
 * - URL video langsung (.mp4) → pakai <video>, auto lanjut saat selesai (onEnded).
 * - Link Google Drive → embed iframe preview (paling reliable utk playback);
 *   Drive tidak membocorkan event "selesai" ke halaman, jadi disediakan tombol
 *   "Selesai nonton →" untuk lanjut ke tulisan Happy Birthday.
 */
export default function VideoScene({ onAdvance }: Props) {
  const url = CONFIG.video.url.trim();
  const valid = url !== "" && !url.toUpperCase().startsWith("TODO");
  const isDrive = url.includes("drive.google.com");
  const driveId = valid && isDrive ? parseDriveId(url) : null;
  const useNative = valid && !isDrive;
  const embedUrl = driveId
    ? `https://drive.google.com/file/d/${driveId}/preview`
    : url;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-black px-4 py-6 text-center">
      {!valid ? (
        <div className="flex flex-col items-center gap-6">
          <p className="max-w-xs font-body text-sm text-krem/70">
            (Belum ada video — isi <code>video.url</code> di{" "}
            <code>src/config.ts</code>)
          </p>
          <PrimaryButton onClick={onAdvance}>Lanjut →</PrimaryButton>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10"
          >
            {useNative ? (
              <video
                src={url}
                autoPlay
                playsInline
                controls
                onEnded={onAdvance}
                className="h-full w-full bg-black"
              />
            ) : (
              <iframe
                src={embedUrl}
                title="Video ucapan"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6"
          >
            <PrimaryButton onClick={onAdvance}>Selesai nonton →</PrimaryButton>
          </motion.div>
        </>
      )}
    </div>
  );
}
