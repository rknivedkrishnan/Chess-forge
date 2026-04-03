"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import { useChessStore } from "@/store/useChessStore";
import { BoardSettings } from "./BoardSettings";

const Chessboard = dynamic(() => import("react-chessboard").then((mod) => mod.Chessboard), {
  ssr: false,
  loading: () => <div style={{ width: 560, height: 560 }} className="bg-base-800 animate-pulse rounded-2xl" />,
});

const THEMES = {
  dark: { dark: "#4b5563", light: "#d1d5db" },
  wood: { dark: "#b58863", light: "#f0d9b5" },
  blue: { dark: "#7296ba", light: "#ebecd0" },
  green: { dark: "#769656", light: "#eeeed2" },
};

interface BoardProps {
  mode?: "learn" | "practice" | "free";
}

export function OpeningForgeBoard({ mode = "free" }: BoardProps) {
  const {
    fen,
    makeMove,
    orientation,
    setOrientation,
    trainingHistory,
    currentTrainingIndex,
    boardSize,
    boardTheme,
    pieceTheme,
  } = useChessStore();

  const [mounted, setMounted] = useState(false);
  const [wrongMove, setWrongMove] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string, piece: string) => {
      const isPromotion =
        piece[1]?.toLowerCase() === "p" &&
        (targetSquare[1] === "8" || targetSquare[1] === "1");
      const movePayload = isPromotion
        ? { from: sourceSquare, to: targetSquare, promotion: "q" }
        : { from: sourceSquare, to: targetSquare };

      const { played, correct } = makeMove(movePayload);

      if (!played) return false;

      if ((mode === "learn" || mode === "practice") && correct === false) {
        setWrongMove(true);
        setTimeout(() => setWrongMove(false), 1000);
      }

      return true;
    },
    [makeMove, mode]
  );

  const getNextMoveArrow = (): [string, string, string][] => {
    if (mode !== "learn") return [];
    if (trainingHistory.length === 0) return [];
    if (currentTrainingIndex >= trainingHistory.length) return [];

    const currentFen = fen === "start" ? undefined : fen;
    const game = new Chess(currentFen);
    const isUsersTurn =
      (game.turn() === "w" && orientation === "white") ||
      (game.turn() === "b" && orientation === "black");

    if (!isUsersTurn) return [];

    const nextSan = trainingHistory[currentTrainingIndex];
    try {
      const moveDetails = game.move(nextSan);
      if (moveDetails) {
        return [[moveDetails.from, moveDetails.to, "rgba(255,255,255,0.55)"]];
      }
    } catch (e) {}
    return [];
  };

  // Custom piece theme helper
  const customPieces = useMemo(() => {
    if (pieceTheme === "standard") return undefined;
    
    // Map of pieces for react-chessboard customPieces prop
    const pieces = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];
    const themeName = pieceTheme === "alpha" ? "alpha" : "california";
    
    const custom: Record<string, any> = {};
    pieces.forEach(p => {
      custom[p] = ({ squareWidth }: { squareWidth: number }) => (
        <img 
          src={`https://lichess1.org/static/piece/${themeName}/${p}.svg`} 
          style={{ width: squareWidth, height: squareWidth }} 
          alt={p}
        />
      );
    });
    return custom;
  }, [pieceTheme]);

  if (!mounted) {
    return <div style={{ width: boardSize, height: boardSize }} className="bg-base-800 animate-pulse rounded-2xl" />;
  }

  const arrows = getNextMoveArrow() as any;
  const boardClass = wrongMove
    ? "ring-4 ring-red-500/80 rounded-xl transition-shadow"
    : "rounded-xl";

  const themeColors = THEMES[boardTheme] || THEMES.dark;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-base-800 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] w-fit mx-auto border border-base-700 relative">
      <BoardSettings />
      
      <div className={boardClass}>
        <Chessboard
          id="OpeningForgeBoardInstance"
          position={fen === "start" ? "start" : fen}
          onPieceDrop={onDrop}
          boardOrientation={orientation}
          boardWidth={boardSize}
          customDarkSquareStyle={{ backgroundColor: themeColors.dark }}
          customLightSquareStyle={{ backgroundColor: themeColors.light }}
          customPieces={customPieces}
          customArrows={arrows}
          animationDuration={150}
        />
      </div>
      
      <button
        onClick={() => setOrientation(orientation === "white" ? "black" : "white")}
        className="mt-6 px-6 py-2.5 bg-base-900 border border-base-600 rounded-2xl text-xs font-black uppercase tracking-widest text-text-muted hover:text-white hover:bg-base-700 transition-all hover:scale-105 active:scale-95"
      >
        Flip Board
      </button>
    </div>
  );
}
