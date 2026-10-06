import * as THREE from "three";

export interface LoadingOptionsType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface GroundType {
  root: THREE.Object3D;
}

export interface CharacterType {
  root: THREE.Object3D;
  init: () => void;
  update(time: number): void;
}
