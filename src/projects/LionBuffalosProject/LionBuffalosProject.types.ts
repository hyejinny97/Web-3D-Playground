import * as THREE from "three";
import * as YUKA from "yuka";
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

export interface BuffaloType {
  models: THREE.Object3D[];
  entities: YUKA.Vehicle[];
  init: () => void;
  update: (time: number) => void;
}

export interface LionType {
  model: THREE.Object3D | null;
  entity: YUKA.Vehicle | null;
  init: () => void;
  update: (time: number) => void;
}
