import * as THREE from "three";
import * as YUKA from "yuka";
import type { GROUND_TEXTURES } from "./WalkingStonePathProject.constants";

export type GroundTextureType = keyof typeof GROUND_TEXTURES;

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (percent: number) => void;
  onLoad: () => void;
}

export interface GroundType {
  model: THREE.Mesh | null;
  init: () => void;
}

export interface StoneType {
  models: THREE.Object3D[];
  entities: YUKA.GameEntity[];
  init: () => void;
}

export interface PersonType {
  model: THREE.Object3D | null;
  entity: YUKA.Vehicle | null;
  init: () => void;
  setTarget: (target: YUKA.Vector3) => void;
  seek: () => void;
  update: (time: number) => void;
}

export interface PointType {
  model: THREE.Mesh;
  position: YUKA.Vector3;
  displayLow: (position: THREE.Vector3, direction: THREE.Vector3) => void;
  displayHigh: (position: THREE.Vector3, direction: THREE.Vector3) => void;
  hide: () => void;
  updatePosition: (position: THREE.Vector3) => void;
}
