import * as THREE from "three";
import type { GRASS_TEXTURES } from "./LionBuffalosProject.constants";

export type GrassTextureType = keyof typeof GRASS_TEXTURES;

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (percent: number) => void;
  onLoad: () => void;
}

export interface GroundType {
  model: THREE.Mesh | null;
  init: () => void;
}
