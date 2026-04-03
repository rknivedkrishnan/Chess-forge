import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Chess } from "chess.js";

export interface RepertoireGroup {
  id: string;
  title: string;
  color: "white" | "black";
  chapterIds: string[];
}

export interface Chapter {
  id: string;
  title: string;
  history: string[];
  pgn: string;
  studyColor: "white" | "black";
  groupId: string;
}

interface ChessState {
  fen: string;
  history: string[];
  chapters: Chapter[];
  groups: RepertoireGroup[];
  activeChapterId: string | null;
  activeGroupId: string | null;
  orientation: "white" | "black";
  studyColor: "white" | "black"; // The color the user is preparing (set before import)
  repertoireId: string | null;

  trainingHistory: string[];
  currentTrainingIndex: number;
  minUserIndex: number;
  isThinking: boolean;

  makeMove: (move: { from: string; to: string; promotion?: string }) => { played: boolean; correct: boolean | null };
  createGroup: (title: string) => void;
  deleteGroup: (id: string, deleteChapters?: boolean) => void;
  deleteChapter: (id: string) => void;
  moveChaptersToGroup: (chapterIds: string[], targetGroupId: string) => void;
  renameGroup: (id: string, title: string) => void;
  renameChapter: (id: string, title: string) => void;
  resetGame: () => void;
  undoMove: () => void;
  loadPgn: (pgn: string) => boolean;
  getGamePgn: () => string;
  loadStudy: (multiPgn: string) => void;
  setActiveChapter: (id: string, mode?: "view" | "train") => void;
  setActiveGroup: (id: string) => void;
  setOrientation: (orientation: "white" | "black") => void;
  setStudyColor: (color: "white" | "black") => void;
  setRepertoireId: (id: string | null) => void;

  stepForward: () => void;
  stepBackward: () => void;
  resetTraining: () => void;
  getNextChapterId: () => string | null;
}

// Derive which color the study is for from a PGN string
function detectStudyColor(pgn: string, history: string[]): "white" | "black" {
  // Check for [Color] tag (used by some exporters)
  const colorTag = pgn.match(/\[Color\s+"(White|Black)"\]/i);
  if (colorTag) return colorTag[1].toLowerCase() as "white" | "black";

  // Heuristic: look at which moves are made. If the study has an odd number of moves,
  // the last player to move is the study colour. But the most reliable signal is
  // whether the PGN was exported "for Black" — in Lichess studies this is stored in
  // the [Orientation] tag.
  const orientationTag = pgn.match(/\[Orientation\s+"(White|Black)"\]/i);
  if (orientationTag) return orientationTag[1].toLowerCase() as "white" | "black";

  // Default: white
  return "white";
}

// Given a trainingHistory and a studyColor, compute where the first user move is
function computeMinUserIndex(trainingHistory: string[], studyColor: "white" | "black"): number {
  // In standard chess, move index 0 is White's first move, 1 is Black's, etc.
  // If studyColor is Black, their first move is at index 1.
  if (studyColor === "black" && trainingHistory.length > 0) return 1;
  return 0;
}

// Play all opponent moves up to (and including) before the user's first move
function buildInitialState(trainingHistory: string[], minUserIndex: number): { fen: string; history: string[] } {
  const game = new Chess();
  for (let i = 0; i < minUserIndex; i++) {
    try { game.move(trainingHistory[i]); } catch (e) {}
  }
  return { fen: game.fen(), history: game.history() };
}

export const useChessStore = create<ChessState>()(
  persist(
    (set, get) => ({
      fen: "start",
      history: [],
      chapters: [],
      groups: [],
      activeChapterId: null,
      activeGroupId: null,
      orientation: "white",
      studyColor: "white",
      repertoireId: null,
      trainingHistory: [],
      currentTrainingIndex: 0,
      minUserIndex: 0,
      isThinking: false,

      renameGroup: (id, title) => {
        set((state) => ({
          groups: state.groups.map(g => g.id === id ? { ...g, title } : g)
        }));
      },

      renameChapter: (id, title) => {
        set((state) => ({
          chapters: state.chapters.map(c => c.id === id ? { ...c, title } : c)
        }));
      },

      createGroup: (title) => {
        const { studyColor } = get();
        const newGroup: RepertoireGroup = {
          id: Math.random().toString(36).substring(7),
          title,
          color: studyColor,
          chapterIds: [],
        };
        set((state) => ({
          groups: [...state.groups, newGroup]
        }));
      },

      deleteGroup: (id, deleteChapters = false) => {
        set((state) => {
          if (deleteChapters) {
            const updatedChapters = state.chapters.filter(c => c.groupId !== id);
            return {
              groups: state.groups.filter(g => g.id !== id),
              chapters: updatedChapters,
              activeChapterId: updatedChapters.find(c => c.id === state.activeChapterId) ? state.activeChapterId : null
            };
          }
          // Reassign chapters to legacy group (groupId = "")
          const updatedChapters = state.chapters.map(c => c.groupId === id ? { ...c, groupId: "" } : c);
          return {
            groups: state.groups.filter(g => g.id !== id),
            chapters: updatedChapters
          };
        });
      },

      deleteChapter: (id) => {
        set((state) => {
          const updatedChapters = state.chapters.filter(c => c.id !== id);
          const updatedGroups = state.groups.map(g => ({
            ...g,
            chapterIds: g.chapterIds.filter(cid => cid !== id)
          }));
          return {
            chapters: updatedChapters,
            groups: updatedGroups,
            activeChapterId: state.activeChapterId === id ? null : state.activeChapterId
          };
        });
      },

      moveChaptersToGroup: (chapterIds, targetGroupId) => {
        set((state) => {
          const updatedChapters = state.chapters.map(c => 
            chapterIds.includes(c.id) ? { ...c, groupId: targetGroupId } : c
          );
          
          const updatedGroups = state.groups.map(g => {
            // Remove moved chapters from their current groups
            const filtered = g.chapterIds.filter(id => !chapterIds.includes(id));
            // Add to target group
            if (g.id === targetGroupId) {
              return { ...g, chapterIds: Array.from(new Set([...filtered, ...chapterIds])) };
            }
            return { ...g, chapterIds: filtered };
          });

          return {
            chapters: updatedChapters,
            groups: updatedGroups
          };
        });
      },

      setOrientation: (orientation) => set({ orientation }),
      setStudyColor: (color) => set({ studyColor: color, orientation: color }),
      setRepertoireId: (id) => set({ repertoireId: id }),
      setActiveGroup: (id) => set({ activeGroupId: id }),

      getGamePgn: () => {
        const game = new Chess();
        get().history.forEach(m => game.move(m));
        return game.pgn();
      },

      // makeMove can be called from EITHER learn or practice mode.
      // It always plays the move if it is legal.
      // Returns { played: true/false, correct: true/false/null }
      // correct = null means "we're not in a line context"
      // makeMove: allows any legal move, returns {played, correct}
      // 'correct' is null if no training line is active
      makeMove: (move) => {
        const { fen, trainingHistory, currentTrainingIndex, isThinking } = get();
        if (isThinking) return { played: false, correct: null };

        try {
          const game = new Chess(fen === "start" ? undefined : fen);
          const result = game.move(move);
          if (!result) return { played: false, correct: null };

          let correct: boolean | null = null;
          if (trainingHistory.length > 0 && currentTrainingIndex < trainingHistory.length) {
            correct = result.san === trainingHistory[currentTrainingIndex];
          }

          let nextIndexAfterUser = currentTrainingIndex + 1;

          // Update state with user move first
          set({ fen: game.fen(), history: game.history(), currentTrainingIndex: nextIndexAfterUser });

          // If correct and not at the end, play opponent move after a delay
          if (correct === true && nextIndexAfterUser < trainingHistory.length) {
            set({ isThinking: true });
            
            setTimeout(() => {
              const { fen, trainingHistory } = get(); 
              const delayedGame = new Chess(fen);
              try {
                 delayedGame.move(trainingHistory[nextIndexAfterUser]);
                 set({ 
                   fen: delayedGame.fen(), 
                   history: delayedGame.history(), 
                   currentTrainingIndex: nextIndexAfterUser + 1,
                   isThinking: false 
                 });
              } catch (e) {
                set({ isThinking: false });
              }
            }, 600); // 600ms latency
          }

          return { played: true, correct };
        } catch {
          return { played: false, correct: null };
        }
      },

      stepForward: () => {
        const { trainingHistory, currentTrainingIndex, isThinking } = get();
        if (isThinking || currentTrainingIndex >= trainingHistory.length) return;

        const { fen } = get();
        const game = new Chess(fen === "start" ? undefined : fen);

        try { game.move(trainingHistory[currentTrainingIndex]); } catch (e) { return; }
        let newIndex = currentTrainingIndex + 1;

        // If next move is opponent, set isThinking and delay it
        const { minUserIndex } = get();
        const isNextOpponent = (newIndex < trainingHistory.length) && (newIndex % 2) === (minUserIndex % 2);

        if (isNextOpponent) {
           set({ fen: game.fen(), history: game.history(), currentTrainingIndex: newIndex, isThinking: true });
           
           setTimeout(() => {
              const { fen, trainingHistory } = get();
              const delayedGame = new Chess(fen);
              try {
                 delayedGame.move(trainingHistory[newIndex]);
                 set({ 
                   fen: delayedGame.fen(), 
                   history: delayedGame.history(), 
                   currentTrainingIndex: newIndex + 1,
                   isThinking: false 
                 });
              } catch (e) {
                 set({ isThinking: false });
              }
           }, 400); 
        } else {
           set({ fen: game.fen(), history: game.history(), currentTrainingIndex: newIndex });
        }
      },

      stepBackward: () => {
        const { currentTrainingIndex, trainingHistory, minUserIndex } = get();
        const min = minUserIndex;
        if (currentTrainingIndex <= min) return;

        // Step back two moves (undo user's move AND the preceding auto-played opponent move)
        // unless we're at the start of user moves
        let newIndex = currentTrainingIndex - 1;

        // If landing on an opponent move, step back one more
        const landingIsOpponent = newIndex > 0 && (newIndex % 2) === (minUserIndex % 2);
        if (landingIsOpponent && newIndex > min) {
          newIndex -= 1;
        }
        newIndex = Math.max(newIndex, min);

        const game = new Chess();
        for (let i = 0; i < newIndex; i++) {
          try { game.move(trainingHistory[i]); } catch (e) {}
        }

        set({ fen: game.fen(), history: game.history(), currentTrainingIndex: newIndex });
      },

      resetTraining: () => {
        const { trainingHistory, minUserIndex, studyColor } = get();
        const initial = buildInitialState(trainingHistory, minUserIndex);
        set({ 
          ...initial, 
          currentTrainingIndex: minUserIndex,
          orientation: studyColor 
        });
      },

      getNextChapterId: () => {
        const { chapters, activeChapterId, groups, activeGroupId } = get();
        if (!activeChapterId || !activeGroupId) return null;
        
        const group = groups.find(g => g.id === activeGroupId);
        if (!group) return null;
        
        const currentIndex = group.chapterIds.indexOf(activeChapterId);
        if (currentIndex !== -1 && currentIndex < group.chapterIds.length - 1) {
          return group.chapterIds[currentIndex + 1];
        }
        
        return null;
      },

      resetGame: () => {
        set({ fen: "start", history: [], currentTrainingIndex: 0 });
      },

      undoMove: () => {
        try {
          const { history, minUserIndex } = get();
          if (history.length <= minUserIndex) return;
          const newHistory = history.slice(0, -1);
          const game = new Chess();
          newHistory.forEach(m => game.move(m));
          set({
            fen: game.fen(),
            history: game.history(),
            currentTrainingIndex: Math.max(minUserIndex, get().currentTrainingIndex - 1)
          });
        } catch (e) {
          console.error(e);
        }
      },

      loadPgn: (pgn: string) => {
        try {
          const game = new Chess();
          game.loadPgn(pgn);
          const history = game.history();
          const { studyColor } = get();
          const minUserIndex = computeMinUserIndex(history, studyColor);
          const initial = buildInitialState(history, minUserIndex);
          set({
            ...initial,
            trainingHistory: history,
            currentTrainingIndex: minUserIndex,
            minUserIndex,
            orientation: studyColor,
          });
          return true;
        } catch (e) {
          console.error("PGN load error:", e);
          return false;
        }
      },

      loadStudy: (multiPgn) => {
        const { studyColor } = get();
        const rawChapters = multiPgn.split(/(?=\[Event ")/g).filter(p => p.trim() !== "");

        // Derive study title from PGN
        const studyMatch = rawChapters[0]?.match(/\[Study "(.*?)"\]/);
        const studyTitle = studyMatch ? studyMatch[1] : `Import ${new Date().toLocaleDateString()}`;
        const groupId = Math.random().toString(36).substring(7);

        const chapters: Chapter[] = rawChapters.map((pgn, idx) => {
          const match = pgn.match(/\[Event "(.*?)"\]/);
          let title = match ? match[1] : `Line ${idx + 1}`;
          if (title.includes(": ")) title = title.split(": ").slice(1).join(": ");

          const tempGame = new Chess();
          try { tempGame.loadPgn(pgn); } catch (e) {}
          const history = tempGame.history();

          return {
            id: Math.random().toString(36).substring(7),
            title,
            history,
            pgn: tempGame.pgn(),
            studyColor,
            groupId,
          };
        });

        const group: RepertoireGroup = {
          id: groupId,
          title: studyTitle,
          color: studyColor,
          chapterIds: chapters.map(c => c.id),
        };

        if (chapters.length > 0) {
          const firstChapter = chapters[0];
          const minUserIndex = computeMinUserIndex(firstChapter.history, studyColor);
          const initial = buildInitialState(firstChapter.history, minUserIndex);
          const existingGroups = get().groups;
          const existingChapters = get().chapters;
          set({
            chapters: [...existingChapters, ...chapters],
            groups: [...existingGroups, group],
            activeGroupId: groupId,
            activeChapterId: firstChapter.id,
            trainingHistory: firstChapter.history,
            currentTrainingIndex: minUserIndex,
            minUserIndex,
            orientation: studyColor,
            ...initial,
          });
        }
      },

      setActiveChapter: (id, mode = "view") => {
        set((state) => {
          const chapter = state.chapters.find((c) => c.id === id);
          if (!chapter) return state;

          const minUserIndex = computeMinUserIndex(chapter.history, chapter.studyColor);

          if (mode === "train") {
            const initial = buildInitialState(chapter.history, minUserIndex);
            return {
              activeChapterId: id,
              trainingHistory: chapter.history,
              currentTrainingIndex: minUserIndex,
              minUserIndex,
              orientation: chapter.studyColor,
              ...initial,
            };
          } else {
            const game = new Chess();
            chapter.history.forEach(m => { try { game.move(m); } catch (e) {} });
            return {
              activeChapterId: id,
              trainingHistory: chapter.history,
              currentTrainingIndex: chapter.history.length,
              minUserIndex,
              orientation: chapter.studyColor,
              fen: game.fen(),
              history: chapter.history,
            };
          }
        });
      },
    }),
    {
      name: "openingforge-repertoire-storage",
    }
  )
);
