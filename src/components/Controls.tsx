interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  disabled: boolean;
}

export function Controls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onHold,
  disabled,
}: ControlsProps) {
  const buttonClass = `
    w-16 h-16 flex items-center justify-center
    glass-panel rounded-2xl text-white text-2xl font-bold
    active:bg-purple-600/50 active:scale-90
    disabled:opacity-30 disabled:cursor-not-allowed
    transition-all duration-100 touch-manipulation select-none
    shadow-lg shadow-purple-500/20
  `;

  const handleTouch = (callback: () => void) => (e: React.TouchEvent) => {
    e.preventDefault();
    if (!disabled) callback();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black via-black/90 to-transparent">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
            <button
              className={`${buttonClass} text-lg font-game`}
              onTouchStart={handleTouch(onHold)}
              disabled={disabled}
            >
              HOLD
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              className={buttonClass}
              onTouchStart={handleTouch(onRotate)}
              disabled={disabled}
            >
              ↻
            </button>
            <div className="flex gap-2">
              <button
                className={buttonClass}
                onTouchStart={handleTouch(onMoveLeft)}
                disabled={disabled}
              >
                ←
              </button>
              <button
                className={buttonClass}
                onTouchStart={handleTouch(onMoveDown)}
                disabled={disabled}
              >
                ↓
              </button>
              <button
                className={buttonClass}
                onTouchStart={handleTouch(onMoveRight)}
                disabled={disabled}
              >
                →
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              className={`${buttonClass} h-[8.5rem] text-lg font-game`}
              onTouchStart={handleTouch(onHardDrop)}
              disabled={disabled}
            >
              DROP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
