import { GoogleGenAI, Type } from '@google/genai';
import type { BoardState, Player, Difficulty } from '../types';

// FIX: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getPrompt = (board: BoardState, aiPlayer: Player, difficulty: Difficulty): string => {
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  const boardString = JSON.stringify(board, null, 2);

  return `
You are an expert Tic-Tac-Toe AI. Your goal is to win the game.
The board is a 3x3 grid, represented by a 2D array. The cells are 0-indexed.
'X' and 'O' are players, and 'null' represents an empty cell.

Current board state:
\`\`\`json
${boardString}
\`\`\`

You are playing as '${aiPlayer}'. The opponent is '${humanPlayer}'.
The requested difficulty is '${difficulty}'.
- Easy: Make a valid, but random, move on an empty spot.
- Medium: Prioritize winning in one move. If not possible, block the opponent's winning move. Otherwise, make a strategic move.
- Hard: Play optimally. Find the best possible move to win or force a draw.

Based on the board state and difficulty, determine the single best move for player '${aiPlayer}'.
Your response must be a JSON object containing the 0-indexed 'row' and 'col' of your chosen move.
Example format: {"row": 1, "col": 2}
Only select a cell that is currently 'null'. Do not provide any explanation, just the JSON object.
  `;
};

// FIX: Convert getAIMove to an async function to call the Gemini API.
export const getAIMove = async (
  board: BoardState,
  aiPlayer: Player,
  difficulty: Difficulty
): Promise<{ row: number; col: number }> => {
  const prompt = getPrompt(board, aiPlayer, difficulty);

  try {
    // FIX: Use ai.models.generateContent to get AI move from Gemini.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            row: { type: Type.INTEGER, description: 'The row index of the move (0-2)' },
            col: { type: Type.INTEGER, description: 'The column index of the move (0-2)' },
          },
          required: ['row', 'col'],
        },
        // Adjust temperature for varied responses, especially for 'Easy' or 'Medium'
        temperature: difficulty === 'Hard' ? 0 : 0.7,
      },
    });
    
    // FIX: Parse the JSON response from the model.
    const jsonString = response.text.trim();
    const move = JSON.parse(jsonString);

    // Validate the move received from the AI
    if (
      typeof move.row === 'number' &&
      typeof move.col === 'number' &&
      move.row >= 0 && move.row < 3 &&
      move.col >= 0 && move.col < 3 &&
      board[move.row][move.col] === null
    ) {
      return move;
    } else {
      console.error('Gemini returned an invalid or occupied cell:', move);
      throw new Error('Invalid move received from AI.');
    }
  } catch (error) {
    console.error('Error getting move from Gemini API:', error);
    // Fallback strategy: find a random available spot if the API fails
    const availableSpots: { row: number, col: number }[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          availableSpots.push({ row: i, col: j });
        }
      }
    }
    if (availableSpots.length > 0) {
      console.log('Falling back to a random move.');
      return availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }
    // This should not happen in a valid game state where it's AI's turn
    throw new Error('No available moves on the board.');
  }
};
