import React from 'react';
import type { BoardState, WinningInfo } from '../types';
import Cell from './Cell';

interface GameBoardProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
  winningInfo: WinningInfo | null;
}

// A self-contained component to render the winning line.
// It uses a nested div structure to prevent the CSS animation 'transform' from
// overriding the 'transform: rotate(...)' style for diagonal and vertical lines.
const WinningLine: React.FC<{ winningInfo: WinningInfo; cellSize: number }> = ({ winningInfo, cellSize }) => {
  // The outer div is for positioning and rotation.
  const outerDivBaseStyle = 'absolute';
  // The inner div has the visual style and the drawing animation.
  const innerDivStyle = 'w-full h-full bg-white/80 rounded-full animate-draw-line origin-left';
  
  let outerDivInlineStyle: React.CSSProperties = {};
  
  const gap = 16;       // Corresponds to gap-4 (1rem)
  const padding = 16;   // Corresponds to p-4 (1rem)
  const lineHeight = 8; // Corresponds to h-2 (0.5rem)
  
  // Total dimension of the 3x3 grid area (cells + gaps)
  const boardDimension = 3 * cellSize + 2 * gap;
  // The length of the line for a diagonal win, from corner to corner of the board area.
  const diagonalLength = Math.sqrt(Math.pow(boardDimension, 2) * 2);

  const [startRow, startCol] = winningInfo.line[0];

  switch (winningInfo.direction) {
    case 'horizontal':
      outerDivInlineStyle = {
        width: `${boardDimension}px`,
        height: `${lineHeight}px`,
        top: `${padding + startRow * (cellSize + gap) + cellSize / 2 - (lineHeight / 2)}px`,
        left: `${padding}px`,
      };
      break;
    case 'vertical':
      outerDivInlineStyle = {
        width: `${boardDimension}px`,
        height: `${lineHeight}px`,
        top: `${padding}px`,
        left: `${padding + startCol * (cellSize + gap) + cellSize / 2 - (lineHeight / 2)}px`,
        transform: 'rotate(90deg)',
        transformOrigin: 'top left',
      };
      break;
    case 'diagonal-1': // Top-left to bottom-right
      outerDivInlineStyle = {
        width: `${diagonalLength}px`,
        height: `${lineHeight}px`,
        top: `${padding}px`,
        left: `${padding}px`,
        transform: 'rotate(45deg)',
        transformOrigin: 'top left',
      };
      break;
    case 'diagonal-2': // Top-right to bottom-left
      outerDivInlineStyle = {
        width: `${diagonalLength}px`,
        height: `${lineHeight}px`,
        top: `${padding}px`,
        right: `${padding}px`,
        transform: 'rotate(-45deg)',
        transformOrigin: 'top right',
      };
      break;
  }
  
  return (
    <div className={outerDivBaseStyle} style={outerDivInlineStyle}>
      <div className={innerDivStyle} />
    </div>
  );
};


const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, disabled, winningInfo }) => {
  // These constants must match the Tailwind classes in Cell.tsx
  const CELL_SIZE_SM = 96;  // w-24
  const CELL_SIZE_MD = 128; // md:w-32

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-4 p-4 bg-black/20 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isWinningCell = winningInfo?.line.some(
              ([winRow, winCol]) => winRow === rowIndex && winCol === colIndex
            );
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                onClick={() => onCellClick(rowIndex, colIndex)}
                disabled={disabled}
                isWinningCell={isWinningCell}
              />
            );
          })
        )}
      </div>
      {winningInfo && (
        <>
          {/* Line for small screens, hidden on medium and up */}
          <div className="md:hidden">
            <WinningLine winningInfo={winningInfo} cellSize={CELL_SIZE_SM} />
          </div>
          {/* Line for medium screens and up, hidden on small */}
          <div className="hidden md:block">
            <WinningLine winningInfo={winningInfo} cellSize={CELL_SIZE_MD} />
          </div>
        </>
      )}
    </div>
  );
};

export default GameBoard;