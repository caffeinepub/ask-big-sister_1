import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Board, Position, GRID_SIZE } from '../match3/types';
import { getTileColor } from './materials';
import { getWorldPosition, getStonePosition, TILE_SIZE, STONE_RADIUS, STONE_HEIGHT } from './layout';

interface StoneMatch3DBoardProps {
  board: Board;
  selectedTile: Position | null;
  onTileClick: (row: number, col: number) => void;
  isAnimating: boolean;
}

function Tile({ row, col }: { row: number; col: number }) {
  const [x, y, z] = getWorldPosition(row, col);
  
  const tileTexture = useTexture('/assets/generated/stone-tile-texture.dim_1024x1024.png');
  tileTexture.wrapS = tileTexture.wrapT = THREE.RepeatWrapping;
  
  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
      <meshStandardMaterial map={tileTexture} />
    </mesh>
  );
}

function Stone({
  row,
  col,
  type,
  isSelected,
  onClick,
  disabled,
}: {
  row: number;
  col: number;
  type: number;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [x, y, z] = getStonePosition(row, col);
  
  const stoneTexture = useTexture('/assets/generated/stone-texture-base.dim_1024x1024.png');
  const color = useMemo(() => getTileColor(type as any), [type]);
  
  // Hover state
  const [hovered, setHovered] = useState(false);
  
  // Animate selection
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isSelected ? 1.2 : hovered && !disabled ? 1.1 : 1.0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15
      );
    }
  });
  
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!disabled) onClick();
  };
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!disabled) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };
  
  return (
    <group position={[x, y, z]}>
      <mesh
        ref={meshRef}
        castShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[STONE_RADIUS, STONE_RADIUS, STONE_HEIGHT, 32]} />
        <meshStandardMaterial
          map={stoneTexture}
          color={color}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, -STONE_HEIGHT / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[STONE_RADIUS + 0.05, STONE_RADIUS + 0.15, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

function Scene({ board, selectedTile, onTileClick, isAnimating }: StoneMatch3DBoardProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.3} />
      
      {/* Board tiles */}
      {Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => (
          <Tile key={`tile-${row}-${col}`} row={row} col={col} />
        ))
      )}
      
      {/* Stones - use stable keys based on position, not tile ID */}
      {board.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <Stone
            key={`stone-${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            type={tile.type}
            isSelected={
              selectedTile?.row === rowIndex && selectedTile?.col === colIndex
            }
            onClick={() => onTileClick(rowIndex, colIndex)}
            disabled={isAnimating}
          />
        ))
      )}
      
      {/* Ground plane */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </>
  );
}

export default function StoneMatch3DBoard(props: StoneMatch3DBoardProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 12, 8], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Scene {...props} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={8}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
