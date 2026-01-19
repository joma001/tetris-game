interface ScoreBoardProps {
  score: number;
  level: number;
  lines: number;
}

export function ScoreBoard({ score, level, lines }: ScoreBoardProps) {
  return (
    <div className="glass-panel rounded-xl p-4 min-w-[120px]">
      <div className="flex flex-col items-center mb-3">
        <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest font-game">
          Score
        </span>
        <span className="text-2xl font-bold text-white tabular-nums font-game tracking-wide">
          {score.toLocaleString()}
        </span>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-3" />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest font-game">
            Level
          </span>
          <span className="text-lg font-bold text-cyan-400 tabular-nums font-game neon-text">
            {level}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest font-game">
            Lines
          </span>
          <span className="text-lg font-bold text-green-400 tabular-nums font-game">
            {lines}
          </span>
        </div>
      </div>
    </div>
  );
}
