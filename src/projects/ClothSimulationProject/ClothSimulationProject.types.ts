import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { CLOTH_TEXTURES } from "./ClothSimulationProject.constants";

export type ClothTextureType = keyof typeof CLOTH_TEXTURES;

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface ClothType {
  model: THREE.Mesh | null;
  bodies: CANNON.Body[];
  constraints: CANNON.DistanceConstraint[];
  init: () => void;
  update: () => void;
}
