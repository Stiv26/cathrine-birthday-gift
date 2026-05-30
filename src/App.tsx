import { AnimatePresence, motion } from "framer-motion";
import type { Scene } from "./config";
import { useState } from "react";
import { useAudio } from "./components/useAudio";
import MuteButton from "./components/MuteButton";
import IntroScene from "./scenes/IntroScene";
import CurtainScene from "./scenes/CurtainScene";
import GameScene from "./scenes/GameScene";
import QuizScene from "./scenes/QuizScene";
import QuestionScene from "./scenes/QuestionScene";
import GalleryScene from "./scenes/GalleryScene";
import FinaleScene from "./scenes/FinaleScene";
import VideoScene from "./scenes/VideoScene";
import HappyBdayScene from "./scenes/HappyBdayScene";

const ORDER: Scene[] = [
  "intro",
  "curtain",
  "game",
  "quiz",
  "question",
  "gallery",
  "finale",
  "video",
  "happybday",
];

export default function App() {
  const [scene, setScene] = useState<Scene>("intro");
  const { muted, started, start, toggleMute } = useAudio();

  const next = () => {
    setScene((cur) => {
      const i = ORDER.indexOf(cur);
      return ORDER[Math.min(ORDER.length - 1, i + 1)];
    });
  };

  const restart = () => setScene("intro");

  const renderScene = () => {
    switch (scene) {
      case "intro":
        return <IntroScene onAdvance={next} onFirstInteraction={start} />;
      case "curtain":
        return <CurtainScene onAdvance={next} />;
      case "game":
        return <GameScene onAdvance={next} />;
      case "quiz":
        return <QuizScene onAdvance={next} />;
      case "question":
        return <QuestionScene onAdvance={next} />;
      case "gallery":
        return <GalleryScene onAdvance={next} />;
      case "finale":
        return <FinaleScene onAdvance={next} />;
      case "video":
        return <VideoScene onAdvance={next} />;
      case "happybday":
        return <HappyBdayScene onRestart={restart} />;
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <MuteButton muted={muted} visible={started} onToggle={toggleMute} />

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 h-full w-full"
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
