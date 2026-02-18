import { Board, Tile, TileType, Position, Match, SwapResult, CascadeResult, GRID_SIZE, TILE_TYPES } from './types';

let tileIdCounter = 0;

function generateTileId(): string {
  return `tile-${tileIdCounter++}`;
}

function createTile(type: TileType): Tile {
  return {
    type,
    id: generateTileId(),
  };
}

function randomTileType(): TileType {
  return Math.floor(Math.random() * TILE_TYPES) as TileType;
}

// Initialize board without immediate matches
export function initializeBoard(): Board {
  const board: Board = [];
  
  for (let row = 0; row < GRID_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      let type: TileType;
      let attempts = 0;
      
      do {
        type = randomTileType();
        attempts++;
      } while (attempts < 50 && wouldCreateMatch(board, row, col, type));
      
      board[row][col] = createTile(type);
    }
  }
  
  return board;
}

// Check if placing a tile would create a match
function wouldCreateMatch(board: Board, row: number, col: number, type: TileType): boolean {
  // Check horizontal
  let horizontalCount = 1;
  if (col >= 1 && board[row][col - 1]?.type === type) horizontalCount++;
  if (col >= 2 && board[row][col - 2]?.type === type) horizontalCount++;
  if (horizontalCount >= 3) return true;
  
  // Check vertical
  let verticalCount = 1;
  if (row >= 1 && board[row - 1]?.[col]?.type === type) verticalCount++;
  if (row >= 2 && board[row - 2]?.[col]?.type === type) verticalCount++;
  if (verticalCount >= 3) return true;
  
  return false;
}

// Check if two positions are adjacent
export function areAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Swap two tiles (returns new board, no mutation)
export function swapTiles(board: Board, pos1: Position, pos2: Position): Board {
  const newBoard = board.map(row => [...row]);
  const temp = newBoard[pos1.row][pos1.col];
  newBoard[pos1.row][pos1.col] = newBoard[pos2.row][pos2.col];
  newBoard[pos2.row][pos2.col] = temp;
  return newBoard;
}

// Find all matches on the board
export function findMatches(board: Board): Match[] {
  const matches: Match[] = [];
  const matched = new Set<string>();
  
  // Check horizontal matches
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - 2; col++) {
      const type = board[row][col].type;
      let count = 1;
      let endCol = col;
      
      for (let c = col + 1; c < GRID_SIZE && board[row][c].type === type; c++) {
        count++;
        endCol = c;
      }
      
      if (count >= 3) {
        const positions: Position[] = [];
        for (let c = col; c <= endCol; c++) {
          const key = `${row}-${c}`;
          if (!matched.has(key)) {
            positions.push({ row, col: c });
            matched.add(key);
          }
        }
        if (positions.length > 0) {
          matches.push({ positions, type });
        }
      }
    }
  }
  
  // Check vertical matches
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE - 2; row++) {
      const type = board[row][col].type;
      let count = 1;
      let endRow = row;
      
      for (let r = row + 1; r < GRID_SIZE && board[r][col].type === type; r++) {
        count++;
        endRow = r;
      }
      
      if (count >= 3) {
        const positions: Position[] = [];
        for (let r = row; r <= endRow; r++) {
          const key = `${r}-${col}`;
          if (!matched.has(key)) {
            positions.push({ row: r, col });
            matched.add(key);
          }
        }
        if (positions.length > 0) {
          matches.push({ positions, type });
        }
      }
    }
  }
  
  return matches;
}

// Clear matched tiles and return new board with unique cleared tile IDs
export function clearMatches(board: Board, matches: Match[]): { board: Board; clearedTileIds: Set<string> } {
  const newBoard = board.map(row => [...row]);
  const clearedTileIds = new Set<string>();
  
  for (const match of matches) {
    for (const pos of match.positions) {
      const tile = newBoard[pos.row][pos.col];
      clearedTileIds.add(tile.id);
      // Replace with a new tile of a placeholder type (we'll refill immediately)
      newBoard[pos.row][pos.col] = createTile(randomTileType());
    }
  }
  
  return { board: newBoard, clearedTileIds };
}

// Apply gravity and refill
export function applyGravityAndRefill(board: Board, clearedPositions: Position[]): Board {
  const newBoard = board.map(row => [...row]);
  
  // Build a set of cleared positions for quick lookup
  const clearedSet = new Set<string>();
  for (const pos of clearedPositions) {
    clearedSet.add(`${pos.row}-${pos.col}`);
  }
  
  // Apply gravity column by column
  for (let col = 0; col < GRID_SIZE; col++) {
    // Collect tiles from bottom to top (excluding cleared positions)
    const tiles: Tile[] = [];
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      if (!clearedSet.has(`${row}-${col}`)) {
        tiles.push(newBoard[row][col]);
      }
    }
    
    // Fill from bottom with existing tiles
    let tileIndex = 0;
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      if (tileIndex < tiles.length) {
        newBoard[row][col] = tiles[tileIndex];
        tileIndex++;
      } else {
        // Create new tiles at the top
        newBoard[row][col] = createTile(randomTileType());
      }
    }
  }
  
  return newBoard;
}

// Attempt a swap and return result
export function attemptSwap(board: Board, pos1: Position, pos2: Position): SwapResult {
  if (!areAdjacent(pos1, pos2)) {
    return { success: false, matches: [] };
  }
  
  const swappedBoard = swapTiles(board, pos1, pos2);
  const matches = findMatches(swappedBoard);
  
  if (matches.length === 0) {
    return { success: false, matches: [] };
  }
  
  return { success: true, matches };
}

// Resolve cascades until no more matches, tracking unique cleared tiles
export function resolveCascades(board: Board, initialMatches: Match[]): CascadeResult {
  let currentBoard = board;
  const allClearedTileIds = new Set<string>();
  
  // Clear initial matches
  const { board: clearedBoard, clearedTileIds: initialCleared } = clearMatches(currentBoard, initialMatches);
  initialCleared.forEach(id => allClearedTileIds.add(id));
  
  // Apply gravity for initial clear
  const positions = initialMatches.flatMap(m => m.positions);
  currentBoard = applyGravityAndRefill(clearedBoard, positions);
  
  // Resolve cascades
  let hasMatches = true;
  while (hasMatches) {
    const matches = findMatches(currentBoard);
    
    if (matches.length === 0) {
      hasMatches = false;
    } else {
      const { board: newClearedBoard, clearedTileIds } = clearMatches(currentBoard, matches);
      clearedTileIds.forEach(id => allClearedTileIds.add(id));
      
      const cascadePositions = matches.flatMap(m => m.positions);
      currentBoard = applyGravityAndRefill(newClearedBoard, cascadePositions);
    }
  }
  
  return { board: currentBoard, clearedTileIds: allClearedTileIds };
}
