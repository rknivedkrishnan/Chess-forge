"use client";

import { useChessStore } from "@/store/useChessStore";
import { Settings, X, Maximize2, Palette, Box } from "lucide-react";
import { useState } from "react";

const THEMES = {
  dark: { dark: "#4b5563", light: "#d1d5db" },
  wood: { dark: "#b58863", light: "#f0d9b5" },
  blue: { dark: "#7296ba", light: "#ebecd0" },
  green: { dark: "#769656", light: "#eeeed2" },
};

export function BoardSettings() {
  const { boardSize, boardTheme, pieceTheme, setBoardSettings } = useChessStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 p-3 bg-base-900/80 backdrop-blur-md border border-base-700 rounded-2xl text-text-muted hover:text-white hover:border-primary/50 transition-all shadow-xl z-20 group"
      >
        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 w-72 bg-base-900/95 backdrop-blur-xl border border-base-700 rounded-3xl shadow-2xl p-6 z-30 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" /> Board Settings
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-8">
        {/* Size Control */}
        <section>
          <div className="flex items-center justify-between mb-3">
             <label className="text-[10px] font-black uppercase tracking-wider text-text-muted flex items-center gap-2">
               <Maximize2 className="w-3 h-3" /> Board Size
             </label>
             <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{boardSize}px</span>
          </div>
          <input 
            type="range" 
            min="300" 
            max="800" 
            step="20"
            value={boardSize}
            onChange={(e) => setBoardSettings({ boardSize: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-base-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </section>

        {/* Theme Selection */}
        <section>
          <label className="text-[10px] font-black uppercase tracking-wider text-text-muted flex items-center gap-2 mb-4">
             <Palette className="w-3 h-3" /> Color Theme
          </label>
          <div className="grid grid-cols-4 gap-3">
             {Object.entries(THEMES).map(([id, colors]) => (
                <button 
                  key={id}
                  onClick={() => setBoardSettings({ boardTheme: id as any })}
                  className={`relative group p-1 rounded-xl border-2 transition-all ${boardTheme === id ? "border-primary bg-primary/10" : "border-transparent hover:bg-base-800"}`}
                >
                   <div className="aspect-square rounded-lg overflow-hidden grid grid-cols-2">
                      <div style={{ backgroundColor: colors.light }} />
                      <div style={{ backgroundColor: colors.dark }} />
                      <div style={{ backgroundColor: colors.dark }} />
                      <div style={{ backgroundColor: colors.light }} />
                   </div>
                   <span className="sr-only">{id}</span>
                </button>
             ))}
          </div>
        </section>

        {/* Piece Selection */}
        <section>
          <label className="text-[10px] font-black uppercase tracking-wider text-text-muted flex items-center gap-2 mb-4">
             <Box className="w-3 h-3" /> Piece Style
          </label>
          <div className="grid grid-cols-1 gap-2">
             {(["standard", "alpha", "california"] as const).map((style) => (
                <button 
                  key={style}
                  onClick={() => setBoardSettings({ pieceTheme: style })}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                    pieceTheme === style 
                      ? "bg-primary text-base-900 border-primary shadow-[0_0_15px_rgba(129,182,76,0.3)]" 
                      : "bg-base-800 border-base-700 text-text-muted hover:text-white hover:border-base-500"
                  }`}
                >
                  {style}
                  {pieceTheme === style && <div className="w-1.5 h-1.5 bg-base-900 rounded-full" />}
                </button>
             ))}
          </div>
        </section>
      </div>

      <p className="mt-8 pt-4 border-t border-base-800 text-[9px] text-text-muted font-bold text-center italic">
        Settings are saved to your browser automatically.
      </p>
    </div>
  );
}
