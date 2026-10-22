import * as THREE from "three";
import * as CANNON from "cannon-es";
import type {
  BARK_TEXTURES,
  GROUND_TEXTURES,
} from "./CrossBridgeProject.constants";

export type BarkTextureType = keyof typeof BARK_TEXTURES;

export type GroundTextureType = keyof typeof GROUND_TEXTURES;

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface BridgeType {
  models: THREE.Object3D[];
  bodies: CANNON.Body[];
  constraints: CANNON.Constraint[];
  init: () => void;
}

export interface GroundType {
  models: THREE.Object3D[];
  bodies: CANNON.Body[];
  init: () => void;
}
