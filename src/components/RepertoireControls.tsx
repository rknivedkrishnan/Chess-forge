"use client";

import { useChessStore } from "@/store/useChessStore";
import { Download, Upload, CloudDownload, Save, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { saveRepertoireAction } from "@/app/actions/repertoire";

export function RepertoireControls() {
  const { loadPgn, loadStudy, getGamePgn, setStudyColor, studyColor, chapters, repertoireId, setRepertoireId } = useChessStore();
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const handleImport = () => {
    const pgn = window.prompt("Paste PGN here:");
    if (pgn) {
      const success = loadPgn(pgn);
      if (!success) alert("Invalid PGN format");
    }
  };

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
    } catch (e) {
      alert("Error importing from Lichess. Ensure the study is public.");
      console.error(e);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveToCloud = async () => {
    if (chapters.length === 0) {
      alert("Please import a repertoire first.");
      return;
    }

    setSaveStatus("saving");
    setIsSaving(true);
    
    const res = await saveRepertoireAction({
      title: "My Repertoire", // Placeholder: implement title editing in a later version
      color: studyColor,
      chapters: chapters.map(c => ({ title: c.title, pgn: c.pgn })),
      repertoireId: repertoireId,
    });

    if (res.success) {
      setSaveStatus("success");
      setRepertoireId(res.repertoireId!);
      setTimeout(() => setSaveStatus("idle"), 2000);
    } else {
      setSaveStatus("error");
      alert(res.error || "Failed to save to account.");
    }
    setIsSaving(false);
  };

  const handleExport = () => {
    const pgn = getGamePgn();
    navigator.clipboard.writeText(pgn);
    alert("PGN copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Save Status / Main Action */}
      <button 
        onClick={handleSaveToCloud} 
        disabled={isSaving || chapters.length === 0}
        className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition shadow-lg ${
          saveStatus === "success" 
            ? "bg-primary text-base-900" 
            : saveStatus === "error"
            ? "bg-danger text-white"
            : "bg-white text-base-900 border border-base-300 hover:bg-white/90"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : saveStatus === "success" ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
        {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved to Cloud" : "Save to My Account"}
      </button>

      {/* Color Toggle for Repertoire */}
      <div className="flex items-center justify-between bg-base-900 border border-base-600 rounded-xl px-4 py-2 mt-2">
         <span className="text-sm font-semibold text-text-muted">Preparing as:</span>
         <div className="flex gap-2 bg-base-800 p-1 rounded-lg">
            <button 
              onClick={() => setStudyColor("white")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${studyColor === "white" ? "bg-white text-base-900 shadow-sm" : "text-text-muted hover:text-white"}`}
            >♔ White</button>
            <button 
              onClick={() => setStudyColor("black")}
               className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${studyColor === "black" ? "bg-base-600 text-white shadow-sm" : "text-text-muted hover:text-white"}`}
            >♚ Black</button>
         </div>
      </div>
      
      <div className="flex gap-2">
        <button onClick={handleImport} className="flex-1 flex items-center justify-center gap-2 bg-base-900 border border-base-600 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-base-700 transition hover:shadow-md">
            <Download className="w-4 h-4" /> Paste PGN
        </button>
        <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 bg-base-900 border border-base-600 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-base-700 transition hover:shadow-md">
            <Upload className="w-4 h-4" /> Export PGN
        </button>
      </div>
      <button onClick={handleLichessImport} disabled={isImporting} className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 text-sm font-bold px-4 py-3 rounded-xl transition hover:shadow-[0_0_15px_rgba(129,182,76,0.2)] disabled:opacity-50 tracking-wide">
          <CloudDownload className="w-5 h-5" /> 
          {isImporting ? "Fetching Study..." : "Import Lichess Study"}
      </button>
    </div>
  );
}
