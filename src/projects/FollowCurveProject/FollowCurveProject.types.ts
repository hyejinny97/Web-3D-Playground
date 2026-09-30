import * as THREE from "three";
import type { CAR_PEDAL_STATES } from "./FollowCurveProject.constants";

export type CarPedalStateType = (typeof CAR_PEDAL_STATES)[number];

export interface LoadingOptionsType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface TrackHelperType {
  root: THREE.Object3D;
  init: () => void;
}

export interface CarPedalType {
  rps: number; // rotation per second (단위: angle/s)
  update: (time: number) => void;
  accelerate: () => void;
  brake: () => void;
  notPressed: () => void;
}

export interface CarHelperType {
  root: THREE.Object3D;
  pedal: CarPedalType;
  speed: number; // distance per second (단위: unit/s)
  init: () => void;
  update: (time: number) => void;
  rpsToSpeed: (rds: number) => number;
}

export interface PathHelperType {
  path: THREE.Line;
  visible: () => void;
  invisible: () => void;
  followPath: (model: THREE.Object3D) => void;
  update: (time: number) => void;
}
