import { TileType } from '../match3/types';
import * as THREE from 'three';

// Map TileType to color for 3D rendering
export function getTileColor(type: TileType): THREE.Color {
  switch (type) {
    case 0: return new THREE.Color(0xdc2626); // Red
    case 1: return new THREE.Color(0x2563eb); // Blue
    case 2: return new THREE.Color(0x16a34a); // Green
    case 3: return new THREE.Color(0xeab308); // Yellow
    case 4: return new THREE.Color(0x9333ea); // Purple
    case 5: return new THREE.Color(0xea580c); // Orange
    default: return new THREE.Color(0x808080); // Gray fallback
  }
}

// Get color as hex string for CSS/debugging
export function getTileColorHex(type: TileType): string {
  return '#' + getTileColor(type).getHexString();
}
