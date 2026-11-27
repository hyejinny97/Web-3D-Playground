import * as THREE from "three";
import * as YUKA from "yuka";
import type { GROUND_TEXTURES } from "./WalkingStonePathProject.constants";

export type GroundTextureType = keyof typeof GROUND_TEXTURES;

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (percent: number) => void;
  onLoad: () => void;
}

export interface GroundType {
  model: THREE.Mesh | null;
  init: () => void;
}

export interface StoneType {
  models: THREE.Object3D[];
  entities: YUKA.GameEntity[];
  init: () => void;
}
