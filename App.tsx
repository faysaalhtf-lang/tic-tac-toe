import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import GameMenu from './components/GameMenu';
import type { BoardState, Player, WinningInfo, GameMode, Difficulty } from './types';
import { getAIMove } from './services/geminiService';
import { playMoveSound, playWinSound, playDrawSound } from './services/audioService';
import { hapticMove, hapticWin, hapticDraw } from './services/hapticService';

const INITIAL_BOARD: BoardState = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const checkWinner = (board: BoardState): WinningInfo | null => {
  const lines = [
    [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]],
  ];
  const directions: ('horizontal' | 'vertical' | 'diagonal-1' | 'diagonal-2')[] = [
    'horizontal', 'horizontal', 'horizontal', 'vertical', 'vertical', 'vertical', 'diagonal-1', 'diagonal-2'
  ];
  for (let i = 0; i < lines.length; i++) {
    const [[r1, c1], [r2, c2], [r3, c3]] = lines[i];
    if (board[r1][c1] && board[r1][c1] === board[r2][c2] && board[r1][c1] === board[r3][c3]) {
      return { winner: board[r1][c1] as Player, line: lines[i], direction: directions[i] };
    }
  }
  return null;
};

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winningInfo, setWinningInfo] = useState<WinningInfo | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('vsAI');
  const [difficulty, setDifficulty] = useState<Difficulty>('Hard');
  const [status, setStatus] = useState('Start a new game!');

  const aiPlayer: Player = 'O';

  const handleNewGame = useCallback(() => {
    if (gameMode === 'vsAI') {
      if (!process.env.API_KEY || process.env.API_KEY.includes('YOUR_API_KEY')) {
        alert('API Key not found. Please edit the `env.js` file and add your Gemini API key to play against the AI. Refer to README.md for instructions.');
        return; // Prevent game from starting in AI mode without a key
      }
    }
    
    setBoard(INITIAL_BOARD);
    const firstPlayer = 'X';
    setCurrentPlayer(firstPlayer);
    setWinningInfo(null);
    setIsGameActive(true);
    setStatus(`Player ${firstPlayer}'s turn`);
  }, [gameMode]);

  const handleAIMove = useCallback(async (currentBoard: BoardState) => {
    setStatus('AI is thinking...');
    try {
      const { row, col } = await getAIMove(currentBoard, aiPlayer, difficulty);
      
      if (currentBoard[row][col] === null) {
        const newBoard = currentBoard.map(r => [...r]);
        newBoard[row][col] = aiPlayer;
        setBoard(newBoard);
        playMoveSound();
        hapticMove();

        const winnerCheck = checkWinner(newBoard);
        if (winnerCheck) {
          setWinningInfo(winnerCheck);
          setIsGameActive(false);
          setStatus(`Player ${winnerCheck.winner} wins!`);
          playWinSound();
          hapticWin();
        } else if (newBoard.flat().every(cell => cell !== null)) {
          setIsGameActive(false);
          setStatus("It's a draw!");
          playDrawSound();
          hapticDraw();
        } else {
          setCurrentPlayer('X');
          setStatus("Player X's turn");
        }
      }
    } catch (error) {
      console.error("AI failed to make a move:", error);
      setStatus("AI error. Your turn!");
      setCurrentPlayer('X'); // Give control back to player
    }
  }, [aiPlayer, difficulty]);

  useEffect(() => {
    if (gameMode === 'vsAI' && currentPlayer === aiPlayer && isGameActive && !winningInfo) {
      const timeoutId = setTimeout(() => handleAIMove(board), 500);
      return () => clearTimeout(timeoutId);
    }
  }, [currentPlayer, board, gameMode, isGameActive, winningInfo, aiPlayer, handleAIMove]);

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || winningInfo || !isGameActive || (gameMode === 'vsAI' && currentPlayer === aiPlayer)) {
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    playMoveSound();
    hapticMove();

    const winnerCheck = checkWinner(newBoard);
    if (winnerCheck) {
      setWinningInfo(winnerCheck);
      setIsGameActive(false);
      setStatus(`Player ${winnerCheck.winner} wins!`);
      playWinSound();
      hapticWin();
      return;
    }

    if (newBoard.flat().every(cell => cell !== null)) {
      setIsGameActive(false);
      setStatus("It's a draw!");
      playDrawSound();
      hapticDraw();
      return;
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
    setStatus(`Player ${nextPlayer}'s turn`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 font-sans gap-8">
      <GameMenu
        gameMode={gameMode}
        setGameMode={setGameMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        handleNewGame={handleNewGame}
        status={status}
        winningInfo={winningInfo}
        isGameActive={isGameActive}
      />
      <GameBoard
        board={board}
        onCellClick={handleCellClick}
        disabled={!!winningInfo || !isGameActive || (gameMode === 'vsAI' && currentPlayer === aiPlayer)}
        winningInfo={winningInfo}
      />
    </main>
  );
};

export default App;