import { useState } from 'react';

interface GameOverProps {
  score: number;
  lines: number;
  level: number;
  rank: number;
  onSubmit: (playerName: string) => Promise<void>;
  onRestart: () => void;
}

export function GameOver({ score, lines, level, rank, onSubmit, onRestart }: GameOverProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await onSubmit(playerName.trim());
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const getRankColor = () => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    if (rank <= 10) return 'text-purple-400';
    return 'text-gray-400';
  };

  const getRankLabel = () => {
    if (rank === 1) return '1st Place!';
    if (rank === 2) return '2nd Place!';
    if (rank === 3) return '3rd Place!';
    return `Rank #${rank}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative glass-panel rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-purple-500/20 animate-float" style={{ animationDuration: '4s' }}>
        <h2 className="font-game text-4xl font-bold text-center mb-2 text-gradient">
          GAME OVER
        </h2>

        <p className={`text-center text-2xl font-bold mb-6 font-game ${getRankColor()} neon-text`}>
          {getRankLabel()}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center glass-panel rounded-lg p-3">
            <p className="text-[10px] text-purple-400 uppercase tracking-widest font-game">Score</p>
            <p className="text-xl font-bold text-white font-game">{score.toLocaleString()}</p>
          </div>
          <div className="text-center glass-panel rounded-lg p-3">
            <p className="text-[10px] text-purple-400 uppercase tracking-widest font-game">Level</p>
            <p className="text-xl font-bold text-cyan-400 font-game">{level}</p>
          </div>
          <div className="text-center glass-panel rounded-lg p-3">
            <p className="text-[10px] text-purple-400 uppercase tracking-widest font-game">Lines</p>
            <p className="text-xl font-bold text-green-400 font-game">{lines}</p>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="playerName" className="block text-sm text-purple-300 mb-2 font-game">
                Enter your name:
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
                placeholder="Your name"
                maxLength={20}
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-game"
                autoFocus
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!playerName.trim() || isSubmitting}
                className="btn-neon flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-game"
              >
                {isSubmitting ? 'Saving...' : 'Save Score'}
              </button>

              <button
                type="button"
                onClick={onRestart}
                className="btn-neon flex-1 py-3 px-6 bg-gray-800 border border-gray-600 text-white font-bold rounded-xl hover:bg-gray-700 transition-all font-game"
              >
                Skip
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-green-400 font-semibold font-game">
              Score saved!
            </p>

            <button
              onClick={onRestart}
              className="btn-neon w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all font-game text-lg"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
