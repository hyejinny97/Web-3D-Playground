import * as THREE from "three";
import * as YUKA from "yuka";
import type { GRASS_TEXTURES } from "./BeesFlowersProject.constants";

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

export interface ElementsType {
  models: THREE.Object3D[];
  init: () => void;
}

export interface StaticElementsType {
  models: THREE.Object3D[];
  entities: YUKA.GameEntity[];
  init: () => void;
}

export interface DynamicElementsType {
  models: THREE.Object3D[];
  entities: YUKA.Vehicle[];
  init: () => void;
}
