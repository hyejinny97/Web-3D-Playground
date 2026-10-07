import * as THREE from "three";
import type { DIRECTION } from "./MoveCharacterProject.constants";

export type DirectionType = keyof typeof DIRECTION;

export interface LoadingOptionsType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface GroundType {
  root: THREE.Object3D;
}

export interface CharacterDirectionType {
  changeTo: (direction: DirectionType) => void;
  update: () => void;
}

export interface CharacterType {
  root: THREE.Object3D;
  direction: CharacterDirectionType;
  init: () => void;
  update(time: number): void;
}
