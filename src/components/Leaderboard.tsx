import type { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  currentScore?: number;
}

export function Leaderboard({ entries, isLoading, currentScore }: LeaderboardProps) {
  const topEntries = entries.slice(0, 10);

  if (isLoading) {
    return (
      <div className="glass-panel rounded-xl p-4 min-w-[180px]">
        <h3 className="text-sm font-bold text-purple-400 mb-4 text-center uppercase tracking-widest font-game">
          Leaderboard
        </h3>
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-4 min-w-[180px]">
      <h3 className="text-sm font-bold text-purple-400 mb-4 text-center uppercase tracking-widest font-game">
        Leaderboard
      </h3>

      {topEntries.length === 0 ? (
        <p className="text-gray-500 text-center text-xs py-4">
          No scores yet
        </p>
      ) : (
        <div className="space-y-1">
          {topEntries.map((entry, index) => {
            const isHighlighted = currentScore !== undefined && entry.score === currentScore;

            return (
              <div
                key={entry.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                  isHighlighted
                    ? 'bg-purple-500/30 ring-1 ring-purple-400 animate-pulse'
                    : index % 2 === 0
                    ? 'bg-black/20'
                    : ''
                }`}
              >
                <span
                  className={`w-5 text-center font-bold text-xs font-game ${
                    index === 0
                      ? 'text-yellow-400 neon-text'
                      : index === 1
                      ? 'text-gray-300'
                      : index === 2
                      ? 'text-orange-400'
                      : 'text-gray-600'
                  }`}
                >
                  {index + 1}
                </span>

                <span className="flex-1 text-white truncate text-xs">
                  {entry.player_name}
                </span>

                <span className="text-cyan-400 font-mono text-xs tabular-nums">
                  {entry.score.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
