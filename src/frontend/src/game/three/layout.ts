import { GRID_SIZE } from '../match3/types';

// 3D layout constants
export const TILE_SIZE = 1.0;
export const TILE_SPACING = 0.1;
export const STONE_HEIGHT = 0.4;
export const STONE_RADIUS = 0.35;

// Calculate world position for a given row/col
export function getWorldPosition(row: number, col: number): [number, number, number] {
  const totalSize = GRID_SIZE * TILE_SIZE + (GRID_SIZE - 1) * TILE_SPACING;
  const offsetX = -totalSize / 2 + TILE_SIZE / 2;
  const offsetZ = -totalSize / 2 + TILE_SIZE / 2;
  
  const x = offsetX + col * (TILE_SIZE + TILE_SPACING);
  const z = offsetZ + row * (TILE_SIZE + TILE_SPACING);
  
  return [x, 0, z];
}

// Get stone position (slightly elevated above tile)
export function getStonePosition(row: number, col: number): [number, number, number] {
  const [x, , z] = getWorldPosition(row, col);
  return [x, STONE_HEIGHT / 2 + 0.05, z];
}
