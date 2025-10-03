import React from 'react';
import type { GameMode, Difficulty, WinningInfo } from '../types';
import { playClickSound } from '../services/audioService';
import { hapticClick } from '../services/hapticService';

interface GameMenuProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  handleNewGame: () => void;
  status: string;
  winningInfo: WinningInfo | null;
  isGameActive: boolean;
}

const GameMenu: React.FC<GameMenuProps> = ({
  gameMode,
  setGameMode,
  difficulty,
  setDifficulty,
  handleNewGame,
  status,
  winningInfo,
  isGameActive,
}) => {
  
  const handleSoundAndHaptic = (callback: () => void) => {
    playClickSound();
    hapticClick();
    callback();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 bg-slate-900/50 rounded-xl shadow-2xl backdrop-blur-md border border-slate-700 w-full max-w-sm">
      <h1 className="text-4xl font-bold text-white tracking-wider" style={{ textShadow: '0 0 10px #0ea5e9, 0 0 20px #0ea5e9' }}>
        Tic-Tac-Toe
      </h1>
      
      {!isGameActive || winningInfo ? (
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="w-full">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="gameMode">
              Game Mode
            </label>
            <select
              id="gameMode"
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value as GameMode)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="vsAI">Player vs AI</option>
              <option value="2Player">2 Players</option>
            </select>
          </div>
          
          {gameMode === 'vsAI' && (
            <div className="w-full">
              <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="difficulty">
                AI Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          )}

          <button
            onClick={() => handleSoundAndHaptic(handleNewGame)}
            className="w-full px-6 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 transition-colors duration-300 transform hover:scale-105 shadow-lg"
          >
            {isGameActive ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      ) : null}

      {isGameActive && (
        <div className="text-center">
          <p className="text-2xl font-semibold text-white animate-pulse">{status}</p>
        </div>
      )}
    </div>
  );
};

export default GameMenu;
