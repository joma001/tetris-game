import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, Tetromino, TetrominoType } from '../types';
import {
  createEmptyBoard,
  createBag,
  createTetromino,
  rotatePiece,
  movePiece,
  hardDrop,
  lockPiece,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropInterval,
  isGameOver,
} from '../lib/tetris';

const LOCK_DELAY = 500;

interface UseGameReturn {
  gameState: GameState;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => boolean;
  rotate: (direction: 1 | -1) => void;
  hardDropPiece: () => void;
  holdPiece: () => void;
}

export function useGame(): UseGameReturn {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    heldPiece: null,
    canHold: true,
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    isPaused: false,
    isPlaying: false,
  });

  const bagRef = useRef<TetrominoType[]>([]);
  const dropIntervalRef = useRef<number | null>(null);
  const lockTimeoutRef = useRef<number | null>(null);
  const isLockedRef = useRef(false);

  const getNextPiece = useCallback((): TetrominoType => {
    if (bagRef.current.length === 0) {
      bagRef.current = createBag();
    }
    return bagRef.current.pop()!;
  }, []);

  const clearDropInterval = useCallback(() => {
    if (dropIntervalRef.current) {
      clearInterval(dropIntervalRef.current);
      dropIntervalRef.current = null;
    }
  }, []);

  const clearLockTimeout = useCallback(() => {
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }
    isLockedRef.current = false;
  }, []);

  const lockCurrentPiece = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newBoard = lockPiece(prev.board, prev.currentPiece);
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);

      const newLines = prev.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const scoreGained = calculateScore(linesCleared, newLevel);
      const newScore = prev.score + scoreGained;

      const nextPieceType = getNextPiece();
      const newCurrentPiece = prev.nextPiece;
      const newNextPiece = createTetromino(nextPieceType);

      if (newCurrentPiece && isGameOver(clearedBoard, newCurrentPiece)) {
        return {
          ...prev,
          board: clearedBoard,
          currentPiece: null,
          score: newScore,
          lines: newLines,
          level: newLevel,
          gameOver: true,
          isPlaying: false,
        };
      }

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: newCurrentPiece,
        nextPiece: newNextPiece,
        canHold: true,
        score: newScore,
        lines: newLines,
        level: newLevel,
      };
    });

    clearLockTimeout();
  }, [getNextPiece, clearLockTimeout]);

  const scheduleLock = useCallback(() => {
    if (isLockedRef.current) return;

    clearLockTimeout();
    isLockedRef.current = true;
    lockTimeoutRef.current = window.setTimeout(() => {
      lockCurrentPiece();
    }, LOCK_DELAY);
  }, [clearLockTimeout, lockCurrentPiece]);

  const moveDown = useCallback((): boolean => {
    let moved = false;

    setGameState((prev) => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const movedPiece = movePiece(prev.board, prev.currentPiece, 0, 1);

      if (movedPiece) {
        clearLockTimeout();
        moved = true;
        return { ...prev, currentPiece: movedPiece };
      }

      scheduleLock();
      return prev;
    });

    return moved;
  }, [clearLockTimeout, scheduleLock]);

  const startDropInterval = useCallback(() => {
    clearDropInterval();

    const interval = getDropInterval(gameState.level);
    dropIntervalRef.current = window.setInterval(() => {
      moveDown();
    }, interval);
  }, [clearDropInterval, gameState.level, moveDown]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.gameOver) {
      startDropInterval();
    } else {
      clearDropInterval();
    }

    return () => clearDropInterval();
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, gameState.level, startDropInterval, clearDropInterval]);

  const startGame = useCallback(() => {
    clearDropInterval();
    clearLockTimeout();
    bagRef.current = createBag();

    const firstPiece = createTetromino(getNextPiece());
    const secondPiece = createTetromino(getNextPiece());

    setGameState({
      board: createEmptyBoard(),
      currentPiece: firstPiece,
      nextPiece: secondPiece,
      heldPiece: null,
      canHold: true,
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      isPaused: false,
      isPlaying: true,
    });
  }, [clearDropInterval, clearLockTimeout, getNextPiece]);

  const pauseGame = useCallback(() => {
    clearDropInterval();
    setGameState((prev) => ({ ...prev, isPaused: true }));
  }, [clearDropInterval]);

  const resumeGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  const moveLeft = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const movedPiece = movePiece(prev.board, prev.currentPiece, -1, 0);
      if (movedPiece) {
        if (isLockedRef.current) {
          clearLockTimeout();
          scheduleLock();
        }
        return { ...prev, currentPiece: movedPiece };
      }
      return prev;
    });
  }, [clearLockTimeout, scheduleLock]);

  const moveRight = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const movedPiece = movePiece(prev.board, prev.currentPiece, 1, 0);
      if (movedPiece) {
        if (isLockedRef.current) {
          clearLockTimeout();
          scheduleLock();
        }
        return { ...prev, currentPiece: movedPiece };
      }
      return prev;
    });
  }, [clearLockTimeout, scheduleLock]);

  const rotate = useCallback((direction: 1 | -1) => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const rotatedPiece = rotatePiece(prev.board, prev.currentPiece, direction);
      if (rotatedPiece) {
        if (isLockedRef.current) {
          clearLockTimeout();
          scheduleLock();
        }
        return { ...prev, currentPiece: rotatedPiece };
      }
      return prev;
    });
  }, [clearLockTimeout, scheduleLock]);

  const hardDropPiece = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const { piece: droppedPiece, distance } = hardDrop(prev.board, prev.currentPiece);
      const hardDropScore = distance * 2;

      const newBoard = lockPiece(prev.board, droppedPiece);
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);

      const newLines = prev.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const lineScore = calculateScore(linesCleared, newLevel);
      const newScore = prev.score + lineScore + hardDropScore;

      const nextPieceType = getNextPiece();
      const newCurrentPiece = prev.nextPiece;
      const newNextPiece = createTetromino(nextPieceType);

      if (newCurrentPiece && isGameOver(clearedBoard, newCurrentPiece)) {
        return {
          ...prev,
          board: clearedBoard,
          currentPiece: null,
          score: newScore,
          lines: newLines,
          level: newLevel,
          gameOver: true,
          isPlaying: false,
        };
      }

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: newCurrentPiece,
        nextPiece: newNextPiece,
        canHold: true,
        score: newScore,
        lines: newLines,
        level: newLevel,
      };
    });

    clearLockTimeout();
  }, [getNextPiece, clearLockTimeout]);

  const holdPiece = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || !prev.canHold || prev.gameOver || prev.isPaused) {
        return prev;
      }

      const currentType = prev.currentPiece.type;
      let newCurrentPiece: Tetromino;

      if (prev.heldPiece) {
        newCurrentPiece = createTetromino(prev.heldPiece);
      } else {
        newCurrentPiece = prev.nextPiece!;
        const nextPieceType = getNextPiece();
        return {
          ...prev,
          currentPiece: newCurrentPiece,
          nextPiece: createTetromino(nextPieceType),
          heldPiece: currentType,
          canHold: false,
        };
      }

      return {
        ...prev,
        currentPiece: newCurrentPiece,
        heldPiece: currentType,
        canHold: false,
      };
    });

    clearLockTimeout();
  }, [getNextPiece, clearLockTimeout]);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDropPiece,
    holdPiece,
  };
}
