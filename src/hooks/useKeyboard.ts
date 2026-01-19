import { useEffect, useCallback, useRef } from 'react';

interface KeyboardConfig {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => boolean;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  onPause: () => void;
  onStart: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
}

const DAS_DELAY = 170;
const ARR_DELAY = 50;
const SOFT_DROP_DELAY = 50;

export function useKeyboard(config: KeyboardConfig) {
  const {
    onMoveLeft,
    onMoveRight,
    onMoveDown,
    onRotateCW,
    onRotateCCW,
    onHardDrop,
    onHold,
    onPause,
    onStart,
    isPlaying,
    isPaused,
    gameOver,
  } = config;

  const keysPressed = useRef<Set<string>>(new Set());
  const dasTimerRef = useRef<number | null>(null);
  const arrTimerRef = useRef<number | null>(null);
  const softDropTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (dasTimerRef.current) {
      clearTimeout(dasTimerRef.current);
      dasTimerRef.current = null;
    }
    if (arrTimerRef.current) {
      clearInterval(arrTimerRef.current);
      arrTimerRef.current = null;
    }
    if (softDropTimerRef.current) {
      clearInterval(softDropTimerRef.current);
      softDropTimerRef.current = null;
    }
  }, []);

  const startDAS = useCallback((action: () => void) => {
    clearTimers();
    action();

    dasTimerRef.current = window.setTimeout(() => {
      arrTimerRef.current = window.setInterval(() => {
        action();
      }, ARR_DELAY);
    }, DAS_DELAY);
  }, [clearTimers]);

  const startSoftDrop = useCallback(() => {
    if (softDropTimerRef.current) return;

    onMoveDown();
    softDropTimerRef.current = window.setInterval(() => {
      onMoveDown();
    }, SOFT_DROP_DELAY);
  }, [onMoveDown]);

  const stopSoftDrop = useCallback(() => {
    if (softDropTimerRef.current) {
      clearInterval(softDropTimerRef.current);
      softDropTimerRef.current = null;
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat && (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'x' || e.key === ' ' || e.key === 'c')) {
      return;
    }

    if (keysPressed.current.has(e.key)) {
      return;
    }

    keysPressed.current.add(e.key);

    if (!isPlaying && !gameOver && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onStart();
      return;
    }

    if (gameOver && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Escape' || e.key === 'p') {
      e.preventDefault();
      onPause();
      return;
    }

    if (!isPlaying || isPaused) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        startDAS(onMoveLeft);
        break;
      case 'ArrowRight':
        e.preventDefault();
        startDAS(onMoveRight);
        break;
      case 'ArrowDown':
        e.preventDefault();
        startSoftDrop();
        break;
      case 'ArrowUp':
      case 'x':
        e.preventDefault();
        onRotateCW();
        break;
      case 'z':
      case 'Control':
        e.preventDefault();
        onRotateCCW();
        break;
      case ' ':
        e.preventDefault();
        onHardDrop();
        break;
      case 'c':
      case 'Shift':
        e.preventDefault();
        onHold();
        break;
    }
  }, [isPlaying, isPaused, gameOver, onStart, onPause, onMoveLeft, onMoveRight, onRotateCW, onRotateCCW, onHardDrop, onHold, startDAS, startSoftDrop]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key);

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        if (dasTimerRef.current) {
          clearTimeout(dasTimerRef.current);
          dasTimerRef.current = null;
        }
        if (arrTimerRef.current) {
          clearInterval(arrTimerRef.current);
          arrTimerRef.current = null;
        }
        break;
      case 'ArrowDown':
        stopSoftDrop();
        break;
    }
  }, [stopSoftDrop]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimers();
    };
  }, [handleKeyDown, handleKeyUp, clearTimers]);

  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) {
      clearTimers();
      keysPressed.current.clear();
    }
  }, [isPlaying, isPaused, gameOver, clearTimers]);
}
