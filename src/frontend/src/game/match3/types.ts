// Match-3 game types and constants

export const GRID_SIZE = 8;
export const TILE_TYPES = 6; // Red, Blue, Green, Yellow, Purple, Orange

export type TileType = 0 | 1 | 2 | 3 | 4 | 5;

export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  type: TileType;
  id: string;
}

export type Board = Tile[][];

export interface Match {
  positions: Position[];
  type: TileType;
}

export interface SwapResult {
  success: boolean;
  matches: Match[];
}
