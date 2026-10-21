import * as THREE from "three";
import * as CANNON from "cannon-es";
import type {
  CONCRETE_TEXTURES,
  METAL_TEXTURES,
} from "./FireCannonProject.constants";

export type ConcreteTextureType = keyof typeof CONCRETE_TEXTURES;

export type MetalTextureType = keyof typeof METAL_TEXTURES;

export type MuzzleDirectionStateType = "up" | "down" | "idle";

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface MuzzleType {
  model: THREE.Object3D;
  update: (time: number) => void;
  toIdle: () => void;
  toUp: () => void;
  toDown: () => void;
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
  muzzle: MuzzleType | null;
  init: () => void;
  fire: (speed: number) => void; // speed 단위: world unit/s
  update: (time: number) => void;
  reset: (removeBalls: (balls: CannonBallType[]) => void) => void;
}

export interface CannonBallType {
  model: THREE.Object3D;
  body: CANNON.Body;
  update: () => void;
  disposeModel: () => void;
}

export interface PyramidBoxesType {
  models: THREE.Object3D[];
  bodies: CANNON.Body[];
  init: () => void;
  update: () => void;
  reset: () => void;
}
