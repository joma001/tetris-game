import { useRef, useEffect } from 'react';
import type { CellValue, Tetromino, Position } from '../types';
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, COLORS } from '../types';
import { getGhostPosition } from '../lib/tetris';

interface BoardProps {
  board: CellValue[][];
  currentPiece: Tetromino | null;
}

export function Board({ board, currentPiece }: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)';
    ctx.lineWidth = 0.5;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = board[y][x];
        if (cell) {
          drawBlock(ctx, x, y, COLORS[cell], 1);
        }
      }
    }

    if (currentPiece) {
      const ghostPos = getGhostPosition(board, currentPiece);
      drawPiece(ctx, currentPiece, ghostPos, 0.25);
      drawPiece(ctx, currentPiece, currentPiece.position, 1);
    }
  }, [board, currentPiece]);

  function drawBlock(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    alpha: number
  ) {
    const px = x * CELL_SIZE;
    const py = y * CELL_SIZE;
    const size = CELL_SIZE;
    const inset = 2;

    ctx.globalAlpha = alpha;

    ctx.shadowColor = color;
    ctx.shadowBlur = alpha === 1 ? 15 : 0;

    const gradient = ctx.createLinearGradient(px, py, px + size, py + size);
    gradient.addColorStop(0, lightenColor(color, 50));
    gradient.addColorStop(0.3, lightenColor(color, 20));
    gradient.addColorStop(0.7, color);
    gradient.addColorStop(1, darkenColor(color, 40));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(px + inset, py + inset, size - inset * 2, size - inset * 2, 3);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.strokeStyle = lightenColor(color, 60);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(px + inset, py + inset, size - inset * 2, size - inset * 2, 3);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.roundRect(px + inset + 3, py + inset + 3, 6, 6, 2);
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  function drawPiece(
    ctx: CanvasRenderingContext2D,
    piece: Tetromino,
    position: Position,
    alpha: number
  ) {
    const color = COLORS[piece.type];

    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = position.x + x;
          const boardY = position.y + y;

          if (boardY >= 0) {
            drawBlock(ctx, boardX, boardY, color, alpha);
          }
        }
      }
    }
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
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 rounded-xl opacity-75 blur-sm animate-pulse" style={{ animationDuration: '3s' }} />
      <canvas
        ref={canvasRef}
        width={BOARD_WIDTH * CELL_SIZE}
        height={BOARD_HEIGHT * CELL_SIZE}
        className="relative rounded-lg game-board-glow"
      />
    </div>
  );
}
