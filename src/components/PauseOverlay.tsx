interface PauseOverlayProps {
  onResume: () => void;
}

export function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="text-center animate-float" style={{ animationDuration: '4s' }}>
        <h2 className="font-game text-5xl font-bold text-purple-400 mb-8 neon-text tracking-widest">
          PAUSED
        </h2>

        <button
          onClick={onResume}
          className="btn-neon px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all font-game text-lg"
        >
          RESUME
        </button>

        <p className="mt-6 text-gray-500 text-sm font-game">
          Press <span className="text-purple-400">ESC</span> to resume
        </p>
      </div>
    </div>
  );
}
