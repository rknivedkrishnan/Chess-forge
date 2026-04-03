"use client";

import React from "react";
import { OpeningForgeBoard } from "@/components/ChessBoard";
import { MoveHistory } from "@/components/MoveHistory";
import { GraduationCap, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useChessStore } from "@/store/useChessStore";

export default function LearnModePage() {
  const { 
    activeChapterId, 
    trainingHistory, 
    currentTrainingIndex,
    minUserIndex,
    stepForward, 
    stepBackward, 
    resetTraining,
  } = useChessStore();
  
  // Show the user's next move (the one AT currentTrainingIndex since auto-played opponent moves
  // have already been applied — the store always leaves us at a user-move boundary)
  const nextMove = trainingHistory[currentTrainingIndex] ?? null;
  const isAtEnd = currentTrainingIndex >= trainingHistory.length;
  const isAtStart = currentTrainingIndex <= minUserIndex;

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") stepForward();
      else if (e.key === "ArrowLeft") stepBackward();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stepForward, stepBackward]);

  // Always start from the beginning of the line when entering Learn Mode
  React.useEffect(() => {
    resetTraining();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-6 self-start md:self-center text-center">
           <h1 className="text-3xl font-extrabold flex items-center gap-3 justify-center">
             <GraduationCap className="w-8 h-8 text-primary" />
             Learn Mode
           </h1>
           <p className="text-text-muted font-medium mt-1">Study and master the sequence step-by-step.</p>
        </div>
        
        <OpeningForgeBoard mode="learn" />

        {/* Playback Controls */}
        <div className="mt-8 flex items-center gap-4 bg-base-800 p-3 rounded-2xl border border-base-700 shadow-xl">
           <button 
             onClick={resetTraining}
             className="px-4 py-2 text-sm font-bold text-text-muted hover:text-white transition bg-base-900 rounded-xl border border-base-600"
           >
             Reset
           </button>
           <div className="h-8 w-[1px] bg-base-700" />
           <button 
             onClick={stepBackward}
             disabled={isAtStart}
             className="p-3 text-white bg-base-900 rounded-xl border border-base-600 disabled:opacity-30 hover:bg-base-700 transition"
           >
             <ArrowRight className="w-5 h-5 rotate-180" />
           </button>
           
           <div className="px-6 flex flex-col items-center min-w-[120px]">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Next Move</span>
              <span className="text-xl font-black text-primary font-mono tracking-tighter">
                {nextMove || "End"}
              </span>
           </div>

           <button 
             onClick={stepForward}
             disabled={isAtEnd}
             className="p-3 text-white bg-primary rounded-xl hover:bg-primary-hover shadow-[0_0_20px_rgba(255,215,0,0.2)] disabled:opacity-30 transition group"
           >
             <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
           </button>
        </div>
      </div>

      <div className="w-full md:w-96 flex flex-col bg-base-800 border border-base-700 rounded-3xl shadow-xl overflow-hidden mt-4 md:mt-20 h-[600px]">
        <div className="p-5 border-b border-base-700 bg-base-800/80 backdrop-blur-md">
            <h2 className="text-lg font-bold">Line Summary</h2>
        </div>
        <div className="flex-1 p-5 overflow-y-auto">
            <MoveHistory />
        </div>
        <div className="p-5 border-t border-base-700 bg-base-900/50 flex flex-col gap-3">
           <Link 
              href="/dashboard/practice" 
              className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl shadow-lg transition ${activeChapterId ? "bg-white text-base-900 hover:bg-white/90" : "bg-base-700 text-text-muted cursor-not-allowed"}`}
              style={{ pointerEvents: activeChapterId ? 'auto' : 'none' }}
           >
              Practice This Line <Play className="w-4 h-4 ml-1" />
           </Link>
        </div>
      </div>
    </div>
  );
}
