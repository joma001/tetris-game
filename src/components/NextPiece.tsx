import { useRef, useEffect } from 'react';
import type { TetrominoType } from '../types';
import { COLORS, TETROMINOS, PREVIEW_CELL_SIZE } from '../types';

interface NextPieceProps {
  type: TetrominoType | null;
  label: string;
}

export function NextPiece({ type, label }: NextPieceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(10, 10, 30, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!type) return;

    const shape = TETROMINOS[type][0];
    const color = COLORS[type];

    const shapeWidth = shape[0].length;
    const shapeHeight = shape.length;

    const offsetX = (4 - shapeWidth) / 2;
    const offsetY = (4 - shapeHeight) / 2;

    for (let y = 0; y < shapeHeight; y++) {
      for (let x = 0; x < shapeWidth; x++) {
        if (shape[y][x]) {
          drawBlock(ctx, x + offsetX, y + offsetY, color);
        }
      }
    }
  }, [type]);

  function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    const px = x * PREVIEW_CELL_SIZE;
    const py = y * PREVIEW_CELL_SIZE;
    const size = PREVIEW_CELL_SIZE;
    const inset = 1;

    const gradient = ctx.createLinearGradient(px, py, px + size, py + size);
    gradient.addColorStop(0, lightenColor(color, 40));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, darkenColor(color, 40));

    ctx.fillStyle = gradient;
    ctx.fillRect(px + inset, py + inset, size - inset * 2, size - inset * 2);

    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = lightenColor(color, 60);
    ctx.lineWidth = 1;
    ctx.strokeRect(px + inset, py + inset, size - inset * 2, size - inset * 2);
    ctx.shadowBlur = 0;
  }

  function lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }

  function darkenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    const B = Math.max(0, (num & 0x0000ff) - amt);
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest font-game">
        {label}
      </span>
      <canvas
        ref={canvasRef}
        width={4 * PREVIEW_CELL_SIZE}
        height={4 * PREVIEW_CELL_SIZE}
        className="glass-panel rounded-lg"
      />
    </div>
  );
}
