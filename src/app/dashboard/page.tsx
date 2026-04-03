import { RepertoireControls } from "@/components/RepertoireControls";
import { ChapterList } from "@/components/ChapterList";
import { FolderOpen } from "lucide-react";

export default function RepertoiresManagerPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Repertoire Manager</h1>
          <p className="text-text-muted font-medium text-lg">Import your studies, structure your lines, and organize your files.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-base-800 border border-base-700 rounded-3xl p-6 shadow-xl">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-700">
                <FolderOpen className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Active Repertoire Storage</h2>
             </div>
             
             {/* The Chapter list pulls state directly and shows imported variations */}
             <ChapterList />

             <div className="mt-8 pt-6 border-t border-base-700/50">
               <p className="text-sm text-text-muted mb-4 font-medium">To prepare your repertoire, import your variations via standard PGN or fetch an entire Lichess Study using the tools on the right.</p>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-base-800 border border-base-700 rounded-3xl p-6 shadow-xl">
             <h2 className="text-lg font-bold mb-4">Import Tools</h2>
             <RepertoireControls />
          </div>
        </div>
      </div>
    </div>
  );
}
