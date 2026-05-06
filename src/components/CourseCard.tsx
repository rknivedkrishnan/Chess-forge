"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ChevronRight, Layers } from "lucide-react";
import { motion } from "framer-motion";

const Chessboard = dynamic(() => import("react-chessboard").then((mod) => mod.Chessboard), {
  ssr: false,
});

interface CourseCardProps {
  title: string;
  description: string;
  lineCount: number;
  progress?: number;
  isNew?: boolean;
  onClick: () => void;
  fen?: string;
}

export function CourseCard({ title, description, lineCount, progress = 0, isNew, onClick, fen }: CourseCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="glass-card group cursor-pointer rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-glow-purple border border-white/5 p-5"
    >
      <div className="flex gap-5 h-full">
        {/* Board Thumbnail */}
        <div className="w-36 h-36 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/5 grayscale-[0.3] group-hover:grayscale-0 transition-all">
          <Chessboard 
            position={fen || "start"} 
            boardWidth={144} 
            arePiecesDraggable={false}
            customDarkSquareStyle={{ backgroundColor: "#4b5563" }}
            customLightSquareStyle={{ backgroundColor: "#d1d5db" }}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-black text-white">{title}</h3>
            {isNew && (
              <span className="px-2 py-0.5 bg-accent text-base-900 text-[10px] font-black rounded uppercase">New</span>
            )}
          </div>
          <p className="text-sm text-text-muted font-medium leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">
              <span>{lineCount} lines total</span>
            </div>
            
            <div className="w-full h-1 bg-base-950 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-text-muted group-hover:text-white transition-colors flex items-center gap-1">
                Try the first line <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
