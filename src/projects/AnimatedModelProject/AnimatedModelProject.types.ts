import * as THREE from "three";
import type { ANIMATIONS } from "./AnimatedModelProject.constants";

export type AnimationNameType = (typeof ANIMATIONS)[number];

export interface LoadingOptionsType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface AnimationHelperType {
  getAnimationNames: () => string[];
  play: (name: string) => void;
  update: (time: number) => void;
}

export interface PersonType {
  root: THREE.Object3D;
  animation: AnimationHelperType;
  init: () => void;
  update: (time: number) => void;
}
