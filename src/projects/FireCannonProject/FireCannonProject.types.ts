import * as THREE from "three";
import type { CONCRETE_TEXTURES } from "./FireCannonProject.constants";

export type ConcreteTextureType = keyof typeof CONCRETE_TEXTURES;

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface GroundType {
  root: THREE.Object3D | null;
  init: () => void;
}

export interface CannonType {
  root: THREE.Object3D | null;
  init: () => void;
}
