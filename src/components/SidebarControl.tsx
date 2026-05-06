"use client";

import React from "react";
import { 
  BookOpen, 
  Target, 
  Flame, 
  Clock, 
  Puzzle, 
  Swords, 
  Lightbulb, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lock
} from "lucide-react";
import { useChessStore } from "@/store/useChessStore";
import { motion } from "framer-motion";

interface SidebarControlProps {
  activeMode: string;
  onModeChange: (mode: any) => void;
  title: string;
}

export function SidebarControl({ activeMode, onModeChange, title }: SidebarControlProps) {
  const { linesMastered, activeChapterId, resetTraining, stepBackward, stepForward } = useChessStore();
  
  const isLineMastered = activeChapterId ? linesMastered.includes(activeChapterId) : false;

  const modes = [
    { id: "learn", label: "Learn", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10", locked: false },
    { id: "practice", label: "Practice", icon: Target, color: "text-primary", bg: "bg-primary/10", locked: !isLineMastered, unlockMsg: "Learn 1 line to unlock" },
    { id: "drill", label: "Drill", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", locked: true, unlockMsg: "Learn 3 lines to unlock" },
    { id: "time", label: "Time", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", locked: true, unlockMsg: "Learn 5 lines to unlock" },
    { id: "puzzles", label: "Puzzles", icon: Puzzle, color: "text-green-500", bg: "bg-green-500/10", locked: true, unlockMsg: "Learn 2 lines to unlock" },
    { id: "arena", label: "Arena", icon: Swords, color: "text-red-500", bg: "bg-red-500/10", locked: true, unlockMsg: "Learn 2 lines to unlock" },
  ];

  return (
    <div className="w-[400px] flex flex-col h-full bg-base-800 border-l border-white/5 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xs font-black text-text-muted uppercase tracking-widest">Learn • {title}</h2>
        </div>
      </div>

      {/* Coach Chat */}
      <div className="mb-8 relative">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
             <img src="https://www.svgrepo.com/show/496924/chess-king.svg" className="w-6 h-6" alt="coach" />
          </div>
          <div className="flex-1 bg-white rounded-2xl rounded-tl-none p-4 shadow-xl">
             <p className="text-base-900 text-sm font-bold leading-relaxed">
               Let's learn the {title}! Before we get started, I have to warn you: this opening is basically the same 5 boring moves over and over and nobody will be your friend. If you're ok with that, then let's get started with pawn to d4.
             </p>
          </div>
        </div>
      </div>

      {/* Mode Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {modes.map((mode) => (
          <button
            key={mode.id}
            disabled={mode.locked}
            onClick={() => onModeChange(mode.id)}
            className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
              activeMode === mode.id 
                ? "bg-base-700 border-primary shadow-glow-purple scale-[1.02]" 
                : mode.locked 
                  ? "bg-base-900/50 border-white/5 opacity-50 grayscale cursor-not-allowed" 
                  : "bg-base-900 border-white/5 hover:bg-base-700 hover:border-white/10"
            }`}
          >
            <mode.icon className={`w-6 h-6 mb-2 ${mode.color}`} />
            <span className="text-xs font-black uppercase tracking-wider text-white">{mode.label}</span>
            {mode.locked && (
              <div className="mt-1 flex flex-col items-center">
                <Lock className="w-3 h-3 text-text-muted mb-1" />
                <span className="text-[8px] font-bold text-text-muted text-center">{mode.unlockMsg}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <button onClick={resetTraining} className="p-3 bg-base-900 hover:bg-base-700 rounded-xl border border-white/5 transition">
              <RotateCcw className="w-4 h-4 text-text-muted" />
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-base-900 hover:bg-base-700 rounded-xl border border-white/5 transition group">
              <Lightbulb className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">Hint</span>
           </button>
        </div>

        <div className="flex items-center gap-2 bg-base-900 p-1.5 rounded-2xl border border-white/5">
           <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-base-700 rounded-xl">Mode</button>
           <div className="flex items-center gap-1 px-2">
              <button onClick={stepBackward} className="p-1.5 text-text-muted hover:text-white transition"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={stepForward} className="p-1.5 text-text-muted hover:text-white transition"><ChevronRight className="w-5 h-5" /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
