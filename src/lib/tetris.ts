import type { Board, CellValue, Position, Tetromino, TetrominoType } from '../types';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINOS,
  WALL_KICKS,
  SCORE_TABLE,
  LEVEL_SPEEDS,
} from '../types';

export function createEmptyBoard(): Board {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null));
}

export function createBag(): TetrominoType[] {
  const pieces: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}

export function createTetromino(type: TetrominoType): Tetromino {
  const shape = TETROMINOS[type][0];
  const startX = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
  return {
    type,
    shape,
    position: { x: startX, y: 0 },
    rotation: 0,
  };
}

export function getRotatedShape(type: TetrominoType, rotation: number): number[][] {
  return TETROMINOS[type][rotation % 4];
}

export function checkCollision(
  board: Board,
  shape: number[][],
  position: Position
): boolean {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;

        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true;
        }

        if (newY >= 0 && board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

export function rotatePiece(
  board: Board,
  piece: Tetromino,
  direction: 1 | -1
): Tetromino | null {
  const newRotation = (piece.rotation + direction + 4) % 4;
  const newShape = getRotatedShape(piece.type, newRotation);

  const kickTable = piece.type === 'I' ? WALL_KICKS['I'] : WALL_KICKS['JLSTZ'];
  const kickIndex = direction === 1 ? piece.rotation : newRotation;
  const kicks = kickTable[kickIndex];

  for (const kick of kicks) {
    const newPosition = {
      x: piece.position.x + kick.x,
      y: piece.position.y - kick.y,
    };

    if (!checkCollision(board, newShape, newPosition)) {
      return {
        ...piece,
        shape: newShape,
        position: newPosition,
        rotation: newRotation,
      };
    }
  }

  return null;
}

export function movePiece(
  board: Board,
  piece: Tetromino,
  dx: number,
  dy: number
): Tetromino | null {
  const newPosition = {
    x: piece.position.x + dx,
    y: piece.position.y + dy,
  };

  if (!checkCollision(board, piece.shape, newPosition)) {
    return { ...piece, position: newPosition };
  }

  return null;
}

export function hardDrop(board: Board, piece: Tetromino): { piece: Tetromino; distance: number } {
  let distance = 0;
  let currentPiece = piece;

  while (true) {
    const newPosition = {
      x: currentPiece.position.x,
      y: currentPiece.position.y + 1,
    };

    if (checkCollision(board, currentPiece.shape, newPosition)) {
      break;
    }

    currentPiece = { ...currentPiece, position: newPosition };
    distance++;
  }

  return { piece: currentPiece, distance };
}

export function getGhostPosition(board: Board, piece: Tetromino): Position {
  const { piece: ghostPiece } = hardDrop(board, piece);
  return ghostPiece.position;
}

export function lockPiece(board: Board, piece: Tetromino): Board {
  const newBoard = board.map((row) => [...row]);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;

        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.type;
        }
      }
    }
  }

  return newBoard;
}

export function clearLines(board: Board): { board: Board; linesCleared: number; clearedRows: number[] } {
  const clearedRows: number[] = [];
  const newBoard: Board = [];

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every((cell) => cell !== null)) {
      clearedRows.push(y);
    } else {
      newBoard.push([...board[y]]);
    }
  }

  const linesCleared = clearedRows.length;

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { board: newBoard, linesCleared, clearedRows };
}

export function calculateScore(linesCleared: number, level: number): number {
  if (linesCleared === 0) return 0;
  const baseScore = SCORE_TABLE[linesCleared as keyof typeof SCORE_TABLE] || 0;
  return baseScore * level;
}

export function calculateLevel(totalLines: number, startLevel: number = 1): number {
  return Math.min(15, startLevel + Math.floor(totalLines / 10));
}

export function getDropInterval(level: number): number {
  return LEVEL_SPEEDS[Math.min(level, 15)] || LEVEL_SPEEDS[15];
}

export function isGameOver(board: Board, piece: Tetromino): boolean {
  return checkCollision(board, piece.shape, piece.position);
}

export function getBoardWithPiece(board: Board, piece: Tetromino | null): CellValue[][] {
  const displayBoard = board.map((row) => [...row]);

  if (piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.position.y + y;
          const boardX = piece.position.x + x;

          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            displayBoard[boardY][boardX] = piece.type;
          }
        }
      }
    }
  }

  return displayBoard;
}
