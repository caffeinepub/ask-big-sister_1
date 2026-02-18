import { useState, useCallback, useRef } from 'react';
import { Board, Position } from './types';
import * as engine from './engine';

export function useMatch3Game() {
  const [board, setBoard] = useState<Board>(() => engine.initializeBoard());
  const [selectedTile, setSelectedTile] = useState<Position | null>(null);
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Use refs to avoid stale closures
  const boardRef = useRef(board);
  const isAnimatingRef = useRef(isAnimating);
  
  // Keep refs in sync
  boardRef.current = board;
  isAnimatingRef.current = isAnimating;

  const selectTile = useCallback((position: Position) => {
    // Check animation state from ref to avoid stale closure
    if (isAnimatingRef.current) return;

    setSelectedTile(currentSelected => {
      if (!currentSelected) {
        // First selection
        return position;
      }
      
      // Second selection - attempt swap
      if (currentSelected.row === position.row && currentSelected.col === position.col) {
        // Deselect if clicking the same tile
        return null;
      }

      // Use functional update to get latest board state
      setBoard(currentBoard => {
        const result = engine.attemptSwap(currentBoard, currentSelected, position);
        
        if (result.success) {
          // Start animation
          setIsAnimating(true);
          isAnimatingRef.current = true;
          
          // Perform swap
          const swappedBoard = engine.swapTiles(currentBoard, currentSelected, position);
          
          // Resolve all matches and cascades
          setTimeout(() => {
            const { board: finalBoard, clearedTileIds } = engine.resolveCascades(swappedBoard, result.matches);
            
            // Calculate score: 10 points per unique cleared tile
            const tilesCleared = clearedTileIds.size;
            setScore(prev => prev + tilesCleared * 10);
            
            setBoard(finalBoard);
            boardRef.current = finalBoard;
            setIsAnimating(false);
            isAnimatingRef.current = false;
          }, 600);
          
          return swappedBoard;
        }
        
        // Invalid swap - no board change
        return currentBoard;
      });
      
      // Clear selection after swap attempt
      return null;
    });
  }, []);

  const restart = useCallback(() => {
    const newBoard = engine.initializeBoard();
    setBoard(newBoard);
    boardRef.current = newBoard;
    setScore(0);
    setSelectedTile(null);
    setIsAnimating(false);
    isAnimatingRef.current = false;
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
