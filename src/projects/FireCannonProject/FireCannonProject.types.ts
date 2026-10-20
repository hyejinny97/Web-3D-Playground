import * as THREE from "three";
import * as CANNON from "cannon-es";
import type {
  CONCRETE_TEXTURES,
  METAL_TEXTURES,
} from "./FireCannonProject.constants";

export type ConcreteTextureType = keyof typeof CONCRETE_TEXTURES;

export type MetalTextureType = keyof typeof METAL_TEXTURES;

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface GroundType {
  model: THREE.Object3D | null;
  body: CANNON.Body | null;
  init: () => void;
  update: () => void;
}

export interface CannonType {
  model: THREE.Object3D | null;
  body: CANNON.Body | null;
  init: () => void;
  fire: (speed: number) => void; // speed 단위: world unit/s
  update: () => void;
}

export interface CannonBallType {
  model: THREE.Object3D;
  body: CANNON.Body;
  update: () => void;
}

export interface PyramidBoxesType {
  models: THREE.Object3D[];
  bodies: CANNON.Body[];
  init: () => void;
  update: () => void;
}
