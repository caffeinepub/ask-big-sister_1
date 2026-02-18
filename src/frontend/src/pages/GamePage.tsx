import { useMatch3Game } from '../game/match3/useMatch3Game';
import { Position, GRID_SIZE, TileType } from '../game/match3/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Sparkles } from 'lucide-react';

const TILE_IMAGES = [
  '/assets/generated/stone-tile-red.dim_256x256.png',
  '/assets/generated/stone-tile-blue.dim_256x256.png',
  '/assets/generated/stone-tile-green.dim_256x256.png',
  '/assets/generated/stone-tile-yellow.dim_256x256.png',
  '/assets/generated/stone-tile-purple.dim_256x256.png',
  '/assets/generated/stone-tile-orange.dim_256x256.png',
];

export default function GamePage() {
  const { board, selectedTile, score, isAnimating, selectTile, restart } = useMatch3Game();

  const handleTileClick = (row: number, col: number) => {
    selectTile({ row, col });
  };

  const isSelected = (row: number, col: number): boolean => {
    return selectedTile?.row === row && selectedTile?.col === col;
  };

  const getTileImage = (type: TileType): string => {
    // Guard against invalid tile types
    if (type < 0 || type >= TILE_IMAGES.length) {
      return TILE_IMAGES[0]; // Fallback to first image
    }
    return TILE_IMAGES[type];
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: 'url(/assets/generated/stone-match-bg.dim_1920x1080.png)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-yellow-300" />
            Stone Match
            <Sparkles className="w-10 h-10 text-yellow-300" />
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
            Match 3 or more stones of the same color to score points!
          </p>
        </div>

        {/* Game Container */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Game Board */}
          <Card className="bg-black/60 backdrop-blur-sm border-4 border-yellow-500/50 shadow-2xl">
            <CardContent className="p-6">
              <div 
                className="grid gap-2 select-none"
                style={{ 
                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                  maxWidth: '480px',
                }}
              >
                {board.map((row, rowIndex) =>
                  row.map((tile, colIndex) => {
                    const selected = isSelected(rowIndex, colIndex);
                    return (
                      <button
                        key={tile.id}
                        onClick={() => handleTileClick(rowIndex, colIndex)}
                        disabled={isAnimating}
                        className={`
                          aspect-square rounded-lg overflow-hidden
                          transition-all duration-200 ease-out
                          hover:scale-110 active:scale-95
                          ${selected ? 'ring-4 ring-yellow-400 scale-110 shadow-lg shadow-yellow-400/50' : ''}
                          ${isAnimating ? 'pointer-events-none opacity-90' : 'cursor-pointer'}
                          bg-black/40
                        `}
                        style={{
                          width: '100%',
                          maxWidth: '60px',
                        }}
                      >
                        <img
                          src={getTileImage(tile.type)}
                          alt={`Stone ${tile.type}`}
                          className="w-full h-full object-contain"
                          draggable={false}
                        />
                      </button>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Side Panel */}
          <div className="flex flex-col gap-6 w-full lg:w-64">
            {/* Score Card */}
            <Card className="bg-gradient-to-br from-yellow-500/90 to-orange-500/90 backdrop-blur-sm border-4 border-yellow-300 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-white text-2xl">Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-center text-white drop-shadow-lg">
                  {score}
                </div>
              </CardContent>
            </Card>

            {/* Controls Card */}
            <Card className="bg-black/60 backdrop-blur-sm border-4 border-blue-500/50 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-white">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={restart}
                  disabled={isAnimating}
                  className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5" />
                  New Game
                </Button>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card className="bg-black/60 backdrop-blur-sm border-4 border-green-500/50 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-white">How to Play</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">1.</span>
                    <span>Click a stone to select it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">2.</span>
                    <span>Click an adjacent stone to swap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">3.</span>
                    <span>Match 3+ stones of the same color</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">4.</span>
                    <span>Each stone cleared = 10 points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">5.</span>
                    <span>Chain reactions score bonus points!</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
