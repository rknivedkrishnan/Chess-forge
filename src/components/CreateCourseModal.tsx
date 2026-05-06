"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CloudDownload, Download, Plus, Loader2 } from "lucide-react";
import { useChessStore } from "@/store/useChessStore";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCourseModal({ isOpen, onClose }: CreateCourseModalProps) {
  const { loadPgn, loadStudy } = useChessStore();
  const [isImporting, setIsImporting] = useState(false);

  const handleLichessImport = async () => {
    const url = window.prompt("Paste Lichess Study URL (e.g. lichess.org/study/xxxxxx):");
    if (!url) return;
    
    const match = url.match(/study\/([a-zA-Z0-9]+)/);
    if (!match) {
      alert("Invalid Lichess Study URL.");
      return;
    }
    
    setIsImporting(true);
    const studyId = match[1];
    try {
      const response = await fetch(`https://lichess.org/api/study/${studyId}.pgn`);
      if (!response.ok) throw new Error("Failed to fetch study");
      const pgnData = await response.text();
      loadStudy(pgnData);
      onClose();
    } catch (e) {
      alert("Error importing from Lichess. Ensure the study is public.");
      console.error(e);
    } finally {
      setIsImporting(false);
    }
  };

  const handlePgnImport = () => {
    const pgn = window.prompt("Paste PGN here:");
    if (pgn) {
      const success = loadPgn(pgn);
      if (success) {
        onClose();
      } else {
        alert("Invalid PGN format");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-base-800 border border-white/5 rounded-[40px] p-10 shadow-2xl overflow-hidden"
          >
             <button onClick={onClose} className="absolute top-8 right-8 text-text-muted hover:text-white transition">
                <X className="w-6 h-6" />
             </button>

             <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Create New Course</h2>
             <p className="text-text-muted mb-10 font-medium">Build your repertoire from scratch or import existing lines.</p>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleLichessImport}
                  disabled={isImporting}
                  className="flex flex-col items-center justify-center p-8 bg-primary/10 border border-primary/20 rounded-3xl hover:bg-primary/20 transition group"
                >
                   {isImporting ? <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" /> : <CloudDownload className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />}
                   <span className="text-sm font-black text-white uppercase tracking-widest text-center">Import Lichess Study</span>
                </button>

                <button 
                  onClick={handlePgnImport}
                  className="flex flex-col items-center justify-center p-8 bg-base-900 border border-white/5 rounded-3xl hover:bg-base-700 transition group"
                >
                   <Download className="w-10 h-10 text-text-muted mb-4 group-hover:text-white transition-colors" />
                   <span className="text-sm font-black text-white uppercase tracking-widest text-center">Paste PGN Text</span>
                </button>
             </div>

             <div className="mt-4">
                <button 
                  className="w-full flex items-center justify-center gap-3 p-6 bg-base-900 border border-white/5 rounded-3xl hover:bg-base-700 transition group opacity-50 grayscale cursor-not-allowed"
                >
                   <Plus className="w-6 h-6 text-text-muted group-hover:text-white transition-colors" />
                   <span className="text-sm font-black text-white uppercase tracking-widest">Start from Empty (Coming Soon)</span>
                </button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
