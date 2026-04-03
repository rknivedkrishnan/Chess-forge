"use client";

import { useChessStore } from "@/store/useChessStore";
import { BookOpen, Folder, ChevronDown, ChevronRight, Edit2, Check, Plus, Trash2, ArrowRightLeft, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function ChapterList() {
  const { 
    chapters, 
    groups, 
    activeChapterId, 
    setActiveChapter, 
    renameGroup, 
    renameChapter,
    createGroup,
    deleteGroup,
    deleteChapter,
    moveChaptersToGroup
  } = useChessStore();
  
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const startEditing = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(currentTitle);
  };

  const saveEdit = (e: React.MouseEvent, type: "group" | "chapter") => {
    e.stopPropagation();
    if (!editingId || !editValue.trim()) return;
    if (type === "group") renameGroup(editingId, editValue);
    else renameChapter(editingId, editValue);
    setEditingId(null);
  };

  const handleCreateGroup = () => {
    const name = window.prompt("Enter folder name:");
    if (name) createGroup(name);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMove = (targetGroupId: string) => {
    if (selectedIds.length === 0) return;
    moveChaptersToGroup(selectedIds, targetGroupId);
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  const isTrainingMode = pathname.includes("/learn") || pathname.includes("/practice");
  const fallbackChapters = chapters || [];
  const fallbackGroups = groups || [];
  const legacyChapters = fallbackChapters.filter(c => !c.groupId);

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between px-1 mb-2">
         <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Repertoire Lines</h3>
         <div className="flex gap-2">
            <button 
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className={`p-1.5 rounded-lg transition ${isSelectionMode ? "bg-primary text-base-900" : "text-text-muted hover:bg-base-900"}`}
              title="Select Multiple"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleCreateGroup}
              className="p-1.5 text-text-muted hover:bg-base-900 hover:text-white rounded-lg transition"
              title="New Folder"
            >
              <Plus className="w-4 h-4" />
            </button>
         </div>
      </div>

      {/* Selection Toolbar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 p-3 bg-primary/95 text-base-900 rounded-xl shadow-2xl animate-in slide-in-from-top-4">
           <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2 py-1 bg-base-900 text-white rounded-md">{selectedIds.length}</span>
              <span className="text-xs font-bold">Lines selected</span>
           </div>
           <div className="flex gap-1">
              <select 
                className="bg-base-900 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg outline-none border-none"
                onChange={(e) => handleMove(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Move to...</option>
                {fallbackGroups.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
                <option value="">Ungrouped</option>
              </select>
              <button 
                onClick={() => setSelectedIds([])}
                className="p-1.5 hover:bg-base-900/10 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
           </div>
        </div>
      )}

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {fallbackGroups.map(group => (
          <div key={group.id} className="bg-base-900/30 rounded-2xl border border-base-700/50 overflow-hidden shadow-sm">
            <div className="flex items-center group/folder pr-2">
              <button 
                onClick={() => toggleGroup(group.id)}
                className="flex-1 flex items-center gap-3 p-4 hover:bg-base-700/30 transition text-left"
              >
                {expandedGroups[group.id] ? (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                )}
                <Folder className={`w-5 h-5 ${group.color === "white" ? "text-primary" : "text-danger"}`} />
                <div className="flex-1 min-w-0">
                   {editingId === group.id ? (
                     <input 
                       autoFocus
                       value={editValue}
                       onChange={(e) => setEditValue(e.target.value)}
                       className="bg-base-700 text-white text-sm font-bold px-2 py-0.5 rounded outline-none border border-primary/50 w-full"
                       onClick={(e) => e.stopPropagation()}
                     />
                   ) : (
                     <h4 className="text-sm font-bold truncate">{group.title}</h4>
                   )}
                   <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                     {group.chapterIds.length} Lines • {group.color.toUpperCase()}
                   </p>
                </div>
              </button>
              
              <div className="flex items-center">
                {editingId === group.id ? (
                  <button onClick={(e) => saveEdit(e, "group")} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button onClick={(e) => startEditing(e, group.id, group.title)} className="p-2 text-text-muted opacity-0 group-hover/folder:opacity-100 hover:text-white rounded-lg transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (group.chapterIds.length > 0) {
                          if (window.confirm(`Delete folder "${group.title}" and all its variations?`)) {
                             deleteGroup(group.id, true);
                          }
                        } else if (window.confirm(`Delete empty folder "${group.title}"?`)) {
                           deleteGroup(group.id);
                        }
                      }} 
                      className="p-2 text-danger opacity-0 group-hover/folder:opacity-100 hover:bg-danger/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {expandedGroups[group.id] && (
              <div className="px-2 pb-2 space-y-1 bg-base-900/20">
                {fallbackChapters.filter(c => c.groupId === group.id).map(chapter => (
                  <div key={chapter.id} className="flex items-center group/line pr-2">
                    <div className="flex-1 flex items-center gap-2">
                      {isSelectionMode && (
                        <button 
                          onClick={() => toggleSelect(chapter.id)}
                          className={`ml-2 w-5 h-5 rounded-md border transition flex items-center justify-center ${selectedIds.includes(chapter.id) ? "bg-primary border-primary" : "border-base-600 hover:border-base-400"}`}
                        >
                          {selectedIds.includes(chapter.id) && <Check className="w-3 h-3 text-base-900" />}
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          if (isSelectionMode) toggleSelect(chapter.id);
                          else setActiveChapter(chapter.id, isTrainingMode ? "train" : "view");
                        }}
                        className={`flex-1 text-left px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-3 ${
                          activeChapterId === chapter.id 
                            ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_10px_rgba(129,182,76,0.1)]" 
                            : "text-text-muted hover:bg-base-800 hover:text-white"
                        }`}
                      >
                        <BookOpen className={`w-4 h-4 flex-shrink-0 ${activeChapterId === chapter.id ? "text-primary" : "opacity-40"}`} />
                        {editingId === chapter.id ? (
                          <input 
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-base-700 text-white text-sm font-medium px-2 py-0.5 rounded outline-none border border-primary/50 w-full"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="truncate flex-1">{chapter.title}</span>
                        )}
                      </button>
                    </div>

                    {editingId === chapter.id ? (
                      <button onClick={(e) => saveEdit(e, "chapter")} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                        <Check className="w-4 h-4" />
                      </button>
                    ) : !isSelectionMode && (
                      <div className="flex items-center opacity-0 group-hover/line:opacity-100 transition">
                        <button onClick={(e) => startEditing(e, chapter.id, chapter.title)} className="p-2 text-text-muted hover:text-white rounded-lg transition">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete variation "${chapter.title}"?`)) {
                              deleteChapter(chapter.id);
                            }
                          }} 
                          className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {legacyChapters.length > 0 && (
          <div className="mt-6">
            <h3 className="px-4 text-[10px] font-black text-text-muted mb-3 uppercase tracking-widest leading-none">Other Lines</h3>
            <div className="space-y-1">
              {legacyChapters.map(chapter => (
                <div key={chapter.id} className="flex items-center group/legacy pr-2">
                  <div className="flex-1 flex items-center gap-2">
                    {isSelectionMode && (
                      <button 
                        onClick={() => toggleSelect(chapter.id)}
                        className={`ml-2 w-5 h-5 rounded-md border transition flex items-center justify-center ${selectedIds.includes(chapter.id) ? "bg-primary border-primary" : "border-base-600 hover:border-base-400"}`}
                      >
                        {selectedIds.includes(chapter.id) && <Check className="w-3 h-3 text-base-900" />}
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        if (isSelectionMode) toggleSelect(chapter.id);
                        else setActiveChapter(chapter.id, isTrainingMode ? "train" : "view");
                      }}
                      className={`flex-1 text-left px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-3 ${
                        activeChapterId === chapter.id 
                          ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_10px_rgba(129,182,76,0.1)]" 
                          : "bg-base-900 border border-base-700/50 text-white hover:bg-base-800"
                      }`}
                    >
                      <BookOpen className={`w-4 h-4 ${activeChapterId === chapter.id ? "text-primary" : "text-text-muted"}`} />
                      {editingId === chapter.id ? (
                        <input 
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-base-700 text-white text-sm font-medium px-2 py-0.5 rounded outline-none border border-primary/50 w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="truncate flex-1">{chapter.title}</span>
                      )}
                    </button>
                  </div>

                  {editingId === chapter.id ? (
                    <button onClick={(e) => saveEdit(e, "chapter")} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                      <Check className="w-4 h-4" />
                    </button>
                  ) : !isSelectionMode && (
                    <div className="flex items-center opacity-0 group-hover/legacy:opacity-100 transition">
                      <button onClick={(e) => startEditing(e, chapter.id, chapter.title)} className="p-2 text-text-muted hover:text-white rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete variation "${chapter.title}"?`)) {
                            deleteChapter(chapter.id);
                          }
                        }} 
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

