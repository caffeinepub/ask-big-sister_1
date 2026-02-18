import { useMatch3Game } from '../game/match3/useMatch3Game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Sparkles } from 'lucide-react';
import { Suspense } from 'react';
import StoneMatch3DBoard from '../game/three/StoneMatch3DBoard';

export default function GamePage() {
  const { board, selectedTile, score, isAnimating, selectTile, restart } = useMatch3Game();

  const handleTileClick = (row: number, col: number) => {
    selectTile({ row, col });
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: 'url(/assets/generated/stone-match-bg.dim_1920x1080.png)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-yellow-300" />
            Stone Match 3D
            <Sparkles className="w-10 h-10 text-yellow-300" />
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
            Match 3 or more stones of the same color to score points!
          </p>
        </div>

        {/* Game Container */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* 3D Game Board */}
          <Card className="bg-black/60 backdrop-blur-sm border-4 border-yellow-500/50 shadow-2xl w-full lg:w-auto">
            <CardContent className="p-6">
              <div 
                className="w-full aspect-square max-w-[600px] mx-auto"
                style={{ minHeight: '400px' }}
              >
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Loading 3D board...
                  </div>
                }>
                  <StoneMatch3DBoard
                    board={board}
                    selectedTile={selectedTile}
                    onTileClick={handleTileClick}
                    isAnimating={isAnimating}
                  />
                </Suspense>
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
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Each tile has exactly one stone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Click a stone to select it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Click an adjacent stone to swap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Match 3+ stones of the same color</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Each stone cleared = 10 points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Chain reactions score bonus points!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Drag to rotate the 3D view</span>
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
