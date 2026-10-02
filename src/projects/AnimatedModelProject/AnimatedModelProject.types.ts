import * as THREE from "three";
import type { ANIMATIONS } from "./AnimatedModelProject.constants";
import type { AnimationHelperType } from "@/helpers/AnimationHelper";

export type AnimationNameType = (typeof ANIMATIONS)[number];

export interface LoadingOptionsType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface PersonType {
  root: THREE.Object3D;
  animation: AnimationHelperType;
  init: () => void;
  update: (time: number) => void;
}
