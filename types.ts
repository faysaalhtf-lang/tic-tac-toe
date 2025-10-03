export type Player = 'X' | 'O';
export type BoardState = (Player | null)[][];

export interface WinningInfo {
  winner: Player;
  line: number[][];
  direction: 'horizontal' | 'vertical' | 'diagonal-1' | 'diagonal-2';
}

export type GameMode = 'vsAI' | '2Player';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
