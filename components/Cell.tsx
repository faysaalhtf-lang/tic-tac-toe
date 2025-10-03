import React from 'react';
import type { Player } from '../types';
import { IconX, IconO } from './icons/PlayerIcons';

interface CellProps {
  value: Player | null;
  onClick: () => void;
  disabled: boolean;
  isWinningCell?: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, disabled, isWinningCell }) => {
  const winningAnimationClass = isWinningCell
    ? value === 'X' ? 'animate-winning-cell-x' : 'animate-winning-cell-o'
    : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || !!value}
      className={`w-24 h-24 md:w-32 md:h-32 bg-slate-800/50 rounded-lg flex items-center justify-center p-4 transition-all duration-300 ease-in-out transform border-2 border-transparent hover:scale-105 hover:bg-slate-700/80 hover:border-sky-400/70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-slate-800/50 disabled:hover:border-transparent ${winningAnimationClass}`}
    >
      {value === 'X' && <IconX />}
      {value === 'O' && <IconO />}
    </button>
  );
};

export default Cell;