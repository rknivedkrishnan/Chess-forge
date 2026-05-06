"use client";

import { OpeningForgeBoard } from "@/components/ChessBoard";
import { SidebarControl } from "@/components/SidebarControl";
import { useChessStore } from "@/store/useChessStore";
import { Trophy, Flame, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PracticeModePage() {
  const { 
    activeChapterId, 
    chapters,
    groups,
    activeGroupId,
    xp, 
    streakCount, 
    resetTraining,
    markLineMastered,
    trainingHistory,
    currentTrainingIndex,
    setActiveChapter,
    setOrientation // Added
  } = useChessStore();
  
  const [mode, setMode] = useState<"learn" | "practice" | "drill">("learn");
  const router = useRouter();

  const activeChapter = chapters.find(c => c.id === activeChapterId);
  const activeGroup = groups.find(g => g.id === activeGroupId);
  
  const isComplete = trainingHistory.length > 0 && currentTrainingIndex >= trainingHistory.length;

  useEffect(() => {
    if (activeChapter) {
      setOrientation(activeChapter.studyColor);
      resetTraining();
    }
  }, [activeChapterId]);

  useEffect(() => {
    if (isComplete && activeChapterId) {
       markLineMastered(activeChapterId);
    }
  }, [isComplete]);

  return (
    <div className="h-screen bg-base-950 flex flex-col overflow-hidden">
      {/* Navbar */}
      <div className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-base-900/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-white/5 rounded-full transition text-text-muted hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-xl font-black text-white tracking-tighter">chessreps.com</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
             <Trophy className="w-4 h-4 text-accent" />
             <span className="text-xs font-black">{xp}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
             <Flame className="w-4 h-4 text-orange-500" />
             <span className="text-xs font-black">{streakCount}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Board Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-base-900/30">
           <OpeningForgeBoard mode={mode === "learn" ? "learn" : "practice"} />
        </div>

        {/* Control Sidebar */}
        <SidebarControl 
          activeMode={mode} 
          onModeChange={setMode} 
          title={activeGroup?.title || "Untitled Course"} 
        />
      </div>

      {/* Mastery Modal Overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
          >
             <motion.div 
               initial={{ scale: 0.8, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-primary text-base-900 px-12 py-8 rounded-[40px] shadow-glow-purple flex flex-col items-center gap-6"
             >
                <div className="flex items-center gap-4">
                  <Trophy className="w-10 h-10" />
                  <span className="text-4xl font-black uppercase italic tracking-tighter text-glow-purple">Line Mastered!</span>
                </div>
                
                <div className="text-xl font-bold uppercase tracking-widest opacity-80">+50 XP EARNED</div>

                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  <button 
                    onClick={resetTraining}
                    className="px-8 py-3 bg-base-900 text-white font-black rounded-2xl hover:scale-105 transition-transform"
                  >
                    Retry Line
                  </button>
                  <button 
                    onClick={() => {
                      setMode("practice");
                      resetTraining();
                    }}
                    className="px-8 py-3 bg-accent text-base-900 font-black rounded-2xl hover:scale-105 transition-transform shadow-glow-white"
                  >
                    Practice this Line
                  </button>
                  <button 
                    onClick={() => {
                      const currentIdx = chapters.findIndex(ch => ch.id === activeChapterId);
                      const nextChapter = chapters[currentIdx + 1];
                      
                      if (nextChapter) {
                         setActiveChapter(nextChapter.id, "train");
                         router.push(`/dashboard/practice?id=${nextChapter.id}`);
                      } else {
                         router.push("/dashboard");
                      }
                    }}
                    className="px-8 py-3 bg-white text-base-900 font-black rounded-2xl hover:scale-105 transition-transform shadow-lg"
                  >
                    Next Line
                  </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
