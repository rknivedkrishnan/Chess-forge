"use client";

import { useChessStore } from "@/store/useChessStore";
import { Zap } from "lucide-react";

export function MoveHistory() {
  const { history } = useChessStore();

  const pairs = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      white: history[i],
      black: history[i + 1] || ""
    });
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-base-700 rounded-lg opacity-50 mt-4 bg-base-800 transition hover:opacity-100 hover:border-primary/50">
         <Zap className="w-8 h-8 mb-3 text-primary animate-pulse" />
         <span className="text-sm font-semibold">Make a move on the board</span>
         <span className="text-xs mt-1 text-text-muted text-center max-w-[200px]">Begin forging your repertoire by playing moves</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4 max-h-[440px] overflow-y-auto pr-1">
      {pairs.map((pair, idx) => (
         <div key={idx} className="flex bg-base-900 rounded-lg border border-base-700/50 overflow-hidden text-sm">
            <div className="w-10 bg-base-800 text-text-muted flex items-center justify-center font-mono border-r border-base-700/50 font-semibold py-2.5">
               {idx + 1}.
            </div>
            <div className="flex-1 flex px-4 border-r border-base-700/20 group hover:bg-base-800 cursor-pointer transition">
               <span className="flex-1 flex items-center text-white font-semibold group-hover:text-primary transition">{pair.white}</span>
            </div>
            <div className="flex-1 flex px-4 group hover:bg-base-800 cursor-pointer transition">
               {pair.black && <span className="flex-1 flex items-center text-white font-semibold group-hover:text-primary transition">{pair.black}</span>}
            </div>
         </div>
      ))}
    </div>
  );
}
