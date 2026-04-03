"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import { useChessStore } from "@/store/useChessStore";

const Chessboard = dynamic(() => import("react-chessboard").then((mod) => mod.Chessboard), {
  ssr: false,
  loading: () => <div style={{ width: 560, height: 560 }} className="bg-base-800 animate-pulse rounded-2xl" />,
});

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
    minUserIndex,
  } = useChessStore();

  const [boardWidth, setBoardWidth] = useState(560);
  const [mounted, setMounted] = useState(false);
  // wrong move flash state
  const [wrongMove, setWrongMove] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setBoardWidth(screenWidth < 640 ? screenWidth - 32 : 560);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

      if (!played) return false; // illegal move — snap back

      // If in learn or practice mode and the move was wrong, flash the board
      if ((mode === "learn" || mode === "practice") && correct === false) {
        setWrongMove(true);
        setTimeout(() => setWrongMove(false), 1000);
      }

      return true; // allow the move to visually land
    },
    [makeMove, mode]
  );

  // Build hint arrow for the user's next expected move
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

  if (!mounted) {
    return <div style={{ width: boardWidth, height: boardWidth }} className="bg-base-800 animate-pulse rounded-2xl" />;
  }

  const arrows = getNextMoveArrow() as any;
  const boardClass = wrongMove
    ? "ring-4 ring-red-500/80 rounded-xl transition-shadow"
    : "rounded-xl";

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-base-800 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-fit mx-auto border border-base-700">
      <div className={boardClass}>
        <Chessboard
          id="OpeningForgeBoardInstance"
          position={fen === "start" ? "start" : fen}
          onPieceDrop={onDrop}
          boardOrientation={orientation}
          boardWidth={boardWidth}
          customDarkSquareStyle={{ backgroundColor: "#4b5563" }}
          customLightSquareStyle={{ backgroundColor: "#d1d5db" }}
          customArrows={arrows}
          animationDuration={150}
        />
      </div>
      <button
        onClick={() => setOrientation(orientation === "white" ? "black" : "white")}
        className="mt-4 px-4 py-2 bg-base-900 border border-base-600 rounded-xl text-sm font-semibold text-text-muted hover:text-white hover:bg-base-700 transition"
      >
        Flip Board
      </button>
    </div>
  );
}
