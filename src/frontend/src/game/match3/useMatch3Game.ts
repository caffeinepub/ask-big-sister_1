import { useState, useCallback } from 'react';
import { Board, Position, GRID_SIZE } from './types';
import * as engine from './engine';

export function useMatch3Game() {
  const [board, setBoard] = useState<Board>(() => engine.initializeBoard());
  const [selectedTile, setSelectedTile] = useState<Position | null>(null);
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const selectTile = useCallback((position: Position) => {
    if (isAnimating) return;

    if (!selectedTile) {
      setSelectedTile(position);
    } else {
      // Try to swap
      if (selectedTile.row === position.row && selectedTile.col === position.col) {
        // Deselect if clicking the same tile
        setSelectedTile(null);
        return;
      }

      const result = engine.attemptSwap(board, selectedTile, position);
      
      if (result.success) {
        setIsAnimating(true);
        let swappedBoard = engine.swapTiles(board, selectedTile, position);
        
        // Clear initial matches
        swappedBoard = engine.clearMatches(swappedBoard, result.matches);
        swappedBoard = engine.applyGravityAndRefill(swappedBoard);
        
        // Resolve cascades
        setTimeout(() => {
          const { board: finalBoard, totalMatches } = engine.resolveCascades(swappedBoard);
          
          // Calculate score: initial matches + cascades
          const allMatches = [...result.matches, ...totalMatches];
          const tilesCleared = allMatches.reduce((sum, match) => sum + match.positions.length, 0);
          setScore(prev => prev + tilesCleared * 10);
          
          setBoard(finalBoard);
          setSelectedTile(null);
          setIsAnimating(false);
        }, 300);
      } else {
        // Invalid swap, just deselect
        setSelectedTile(null);
      }
    }
  }, [board, selectedTile, isAnimating]);

  const restart = useCallback(() => {
    setBoard(engine.initializeBoard());
    setScore(0);
    setSelectedTile(null);
    setIsAnimating(false);
  }, []);

  return {
    board,
    selectedTile,
    score,
    isAnimating,
    selectTile,
    restart,
  };
}
