import { useRef, useEffect } from 'react';
import { Board, Position } from '../match3/types';
import * as THREE from 'three';

export interface AnimationState {
  isAnimating: boolean;
  swapPositions: [Position, Position] | null;
}

export function useStoneAnimations(
  board: Board,
  isAnimating: boolean,
  selectedTile: Position | null
) {
  const prevBoardRef = useRef<Board>(board);
  const animationStateRef = useRef<AnimationState>({
    isAnimating: false,
    swapPositions: null,
  });

  useEffect(() => {
    prevBoardRef.current = board;
  }, [board]);

  useEffect(() => {
    animationStateRef.current.isAnimating = isAnimating;
  }, [isAnimating]);

  return {
    animationState: animationStateRef.current,
    prevBoard: prevBoardRef.current,
  };
}

// Helper to animate stone position
export function animateStonePosition(
  mesh: THREE.Mesh,
  targetPosition: THREE.Vector3,
  duration: number = 0.3
): Promise<void> {
  return new Promise((resolve) => {
    const startPosition = mesh.position.clone();
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      
      mesh.position.lerpVectors(startPosition, targetPosition, eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    
    animate();
  });
}
