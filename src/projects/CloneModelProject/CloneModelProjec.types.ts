import * as THREE from "three";
import type { GRASS_TEXTURES } from "./CloneModelProject.constants";

export type GrassTextureType = keyof typeof GRASS_TEXTURES;

export interface LoadingOptionsType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface SerengetiType {
  root: THREE.Object3D;
  init: () => void;
}
