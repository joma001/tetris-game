import { useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import { useKeyboard } from '../hooks/useKeyboard';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { Board } from './Board';
import { NextPiece } from './NextPiece';
import { ScoreBoard } from './ScoreBoard';
import { Leaderboard } from './Leaderboard';
import { GameOver } from './GameOver';
import { Controls } from './Controls';
import { StartScreen } from './StartScreen';
import { PauseOverlay } from './PauseOverlay';

export function Game() {
  const {
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
  } = useGame();

  const { leaderboard, isLoading, submitPlayerScore, getRank } = useLeaderboard();

  const handlePause = useCallback(() => {
    if (gameState.isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }, [gameState.isPaused, pauseGame, resumeGame]);

  useKeyboard({
    onMoveLeft: moveLeft,
    onMoveRight: moveRight,
    onMoveDown: moveDown,
    onRotateCW: () => rotate(1),
    onRotateCCW: () => rotate(-1),
    onHardDrop: hardDropPiece,
    onHold: holdPiece,
    onPause: handlePause,
    onStart: startGame,
    isPlaying: gameState.isPlaying,
    isPaused: gameState.isPaused,
    gameOver: gameState.gameOver,
  });

  const handleScoreSubmit = useCallback(
    async (playerName: string) => {
      await submitPlayerScore(
        playerName,
        gameState.score,
        gameState.lines,
        gameState.level
      );
    },
    [submitPlayerScore, gameState.score, gameState.lines, gameState.level]
  );

  const currentRank = getRank(gameState.score);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 pb-48 md:pb-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-6">
        <div className="hidden lg:flex flex-col gap-4">
          <NextPiece type={gameState.heldPiece} label="Hold" />
          <ScoreBoard
            score={gameState.score}
            level={gameState.level}
            lines={gameState.lines}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="lg:hidden flex justify-between w-full max-w-[320px] gap-2">
            <NextPiece type={gameState.heldPiece} label="Hold" />
            <ScoreBoard
              score={gameState.score}
              level={gameState.level}
              lines={gameState.lines}
            />
            <NextPiece type={gameState.nextPiece?.type || null} label="Next" />
          </div>

          <Board board={gameState.board} currentPiece={gameState.currentPiece} />

          <Controls
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
            onMoveDown={() => moveDown()}
            onRotate={() => rotate(1)}
            onHardDrop={hardDropPiece}
            onHold={holdPiece}
            disabled={!gameState.isPlaying || gameState.isPaused || gameState.gameOver}
          />
        </div>

        <div className="hidden lg:flex flex-col gap-4">
          <NextPiece type={gameState.nextPiece?.type || null} label="Next" />
          <Leaderboard
            entries={leaderboard}
            isLoading={isLoading}
            currentScore={gameState.gameOver ? gameState.score : undefined}
          />
        </div>

        <div className="lg:hidden fixed top-4 right-4 z-40">
          {gameState.isPlaying && !gameState.gameOver && (
            <button
              onClick={handlePause}
              className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-white text-xl active:scale-90 transition-transform"
            >
              {gameState.isPaused ? '▶' : '⏸'}
            </button>
          )}
        </div>
      </div>

      {!gameState.isPlaying && !gameState.gameOver && (
        <StartScreen onStart={startGame} />
      )}

      {gameState.isPaused && <PauseOverlay onResume={resumeGame} />}

      {gameState.gameOver && (
        <GameOver
          score={gameState.score}
          lines={gameState.lines}
          level={gameState.level}
          rank={currentRank}
          onSubmit={handleScoreSubmit}
          onRestart={startGame}
        />
      )}
    </div>
  );
}
