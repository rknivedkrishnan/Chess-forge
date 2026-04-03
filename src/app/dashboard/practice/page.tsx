"use client";

import { OpeningForgeBoard } from "@/components/ChessBoard";
import { useChessStore } from "@/store/useChessStore";
import { Target, RotateCcw, Clock, Zap, CheckCircle, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PracticeModePage() {
  const { activeChapterId, trainingHistory, currentTrainingIndex, resetTraining, getNextChapterId, setActiveChapter } = useChessStore();
  const [practiceMode, setPracticeMode] = useState<"Normal" | "Drill" | "Timed">("Normal");
  const router = useRouter();

  const isComplete = trainingHistory.length > 0 && currentTrainingIndex >= trainingHistory.length;
  const nextChapterId = getNextChapterId();
  
  useEffect(() => {
    resetTraining();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextLine = () => {
    if (nextChapterId) {
      setActiveChapter(nextChapterId, "train");
      router.push("/dashboard/learn");
    }
  };
  
  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center max-w-5xl mx-auto w-full text-center mt-8 md:mt-0 relative">
      <div className="mb-12">
         {isComplete ? (
           <div className="animate-in fade-in zoom-in duration-500">
             <div className="flex items-center justify-center gap-3 text-primary mb-2">
                <CheckCircle className="w-8 h-8" />
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">Line Mastered!</h1>
             </div>
             <p className="text-text-muted font-medium text-lg">You've successfully completed this variation from memory.</p>
             
             <div className="mt-8 flex justify-center gap-4">
                <button 
                  onClick={resetTraining}
                  className="flex items-center gap-2 px-6 py-3 bg-base-800 border border-base-700 rounded-2xl font-bold text-white hover:bg-base-700 transition"
                >
                  <RotateCcw className="w-5 h-5" /> Retry
                </button>
                {nextChapterId && (
                  <button 
                    onClick={handleNextLine}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-base-900 rounded-2xl font-black shadow-[0_0_30px_rgba(129,182,76,0.3)] hover:scale-105 transition-transform"
                  >
                    Learn Next Line <GraduationCap className="w-5 h-5" />
                  </button>
                )}
             </div>
           </div>
         ) : (
           <>
             <h1 className="text-4xl font-black flex items-center justify-center gap-4 drop-shadow-md">
               <Target className="w-10 h-10 text-danger drop-shadow-[0_0_15px_rgba(226,62,62,0.5)]" />
               Practice Mode
             </h1>
             <p className="text-text-muted font-medium mt-3 text-lg">Test your memory against the opponent's responses. No hints provided.</p>
             
             <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => setPracticeMode("Normal")} className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${practiceMode === "Normal" ? "bg-white text-base-900 border-white shadow-md" : "bg-base-800 border-base-700 text-text-muted hover:bg-base-700 hover:text-white"}`}>
                  Normal
                </button>
                <button onClick={() => setPracticeMode("Drill")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition ${practiceMode === "Drill" ? "bg-accent/20 text-accent border-accent/50 shadow-[0_0_15px_rgba(196,161,97,0.2)]" : "bg-base-800 border-base-700 text-text-muted hover:bg-base-700 hover:text-white"}`}>
                  <Zap className="w-4 h-4" /> Drill
                </button>
                <button onClick={() => setPracticeMode("Timed")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition ${practiceMode === "Timed" ? "bg-danger/20 text-danger border-danger/50 shadow-[0_0_15px_rgba(226,62,62,0.2)]" : "bg-base-800 border-base-700 text-text-muted hover:bg-base-700 hover:text-white"}`}>
                  <Clock className="w-4 h-4" /> Timed (5m)
                </button>
             </div>
           </>
         )}

         {!activeChapterId && (
           <div className="mt-8 inline-block bg-danger/10 text-danger px-5 py-2.5 rounded-xl text-sm font-bold border border-danger/30">
             No line selected. Go to Manager to select a variation.
           </div>
         )}
      </div>
      
      <div className="relative">
        <OpeningForgeBoard mode="practice" />
        
        {/* Practice Controls */}
        {!isComplete && (
          <div className="absolute -right-20 top-0 bottom-0 flex flex-col justify-center gap-4 hidden lg:flex">
             <button 
               onClick={resetTraining}
               className="bg-base-800 border border-base-700 p-4 rounded-xl hover:bg-base-700 transition shadow-lg group" title="Restart Training"
             >
               <RotateCcw className="w-6 h-6 text-text-muted group-hover:text-white transition" />
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
