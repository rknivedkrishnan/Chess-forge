"use client";

import { useChessStore } from "@/store/useChessStore";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Check, X } from "lucide-react";

export function StreakModal() {
  const { streakCount, weeklyProgress, showStreakModal, setShowStreakModal } = useChessStore();

  if (!showStreakModal) return null;

  const days = ["M", "T", "W", "Th", "F", "Sa", "Su"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowStreakModal(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-base-800 border-2 border-accent/30 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/20 blur-[60px] rounded-full" />

          <div className="flex flex-col items-center text-center relative z-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="relative">
                <Flame className="w-24 h-24 text-accent fill-accent" />
                <motion.div 
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute inset-0 bg-accent/30 blur-2xl rounded-full -z-10"
                />
              </div>
            </motion.div>

            <motion.h2 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-7xl font-black text-accent mb-2"
            >
              {streakCount}
            </motion.h2>
            
            <p className="text-xl font-bold text-accent uppercase tracking-widest mb-10">
              {streakCount} day streak
            </p>

            <div className="flex justify-between w-full gap-2 mb-10 bg-base-900/50 p-4 rounded-3xl border border-white/5">
              {days.map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-text-muted">{day}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    weeklyProgress[i] 
                      ? "bg-accent border-accent text-base-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
                      : "bg-base-700/50 border-white/10 text-text-muted"
                  }`}>
                    {weeklyProgress[i] ? (
                      <Check className="w-5 h-5 stroke-[3px]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowStreakModal(false)}
              className="w-full py-5 bg-accent hover:bg-accent-hover text-base-900 text-lg font-black rounded-2xl transition-all shadow-[0_10px_20px_rgba(245,158,11,0.3)] active:scale-[0.98] uppercase tracking-widest"
            >
              Continue
            </button>
          </div>

          <button 
            onClick={() => setShowStreakModal(false)}
            className="absolute top-6 right-6 p-2 text-text-muted hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
