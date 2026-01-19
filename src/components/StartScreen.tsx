interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative text-center px-4 animate-float">
        <h1 className="font-game text-6xl md:text-8xl font-black mb-6 text-gradient neon-text tracking-wider">
          TETRIS
        </h1>

        <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg">
          Clear lines. Score points. Climb the leaderboard.
        </p>

        <button
          onClick={onStart}
          className="btn-neon px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/40 font-game tracking-wide"
        >
          START GAME
        </button>

        <div className="mt-12 text-left max-w-sm mx-auto glass-panel rounded-xl p-6">
          <p className="text-sm text-purple-300 font-semibold mb-4 uppercase tracking-widest font-game">
            Controls
          </p>
          <div className="text-sm text-gray-400 space-y-2 grid grid-cols-2 gap-x-4">
            <p><span className="text-cyan-400 font-mono">← →</span> Move</p>
            <p><span className="text-cyan-400 font-mono">↓</span> Soft drop</p>
            <p><span className="text-cyan-400 font-mono">↑ X</span> Rotate CW</p>
            <p><span className="text-cyan-400 font-mono">Z</span> Rotate CCW</p>
            <p><span className="text-cyan-400 font-mono">Space</span> Hard drop</p>
            <p><span className="text-cyan-400 font-mono">C</span> Hold</p>
          </div>
        </div>
      </div>
    </div>
  );
}
