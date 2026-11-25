import * as THREE from "three";
import * as YUKA from "yuka";
import type { GRASS_TEXTURES } from "./BullfightProject.constants";

export type GrassTextureType = keyof typeof GRASS_TEXTURES;

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (percent: number) => void;
  onLoad: () => void;
}

export interface GroundType {
  model: THREE.Mesh | null;
  init: () => void;
}

export interface FlagType {
  models: THREE.Object3D[];
  entities: YUKA.Vehicle[];
  init: () => void;
  seek: (target: YUKA.Vector3) => void;
}

export interface FlagTargetType {
  model: THREE.Mesh;
  position: YUKA.Vector3;
  show: () => void;
  hide: () => void;
  update: (time: number) => void;
}

export interface BullType {
  model: THREE.Object3D | null;
  entity: YUKA.Vehicle | null;
  init: () => void;
  interpose: (entity1: YUKA.Vehicle, entity2: YUKA.Vehicle) => void;
  update: (time: number) => void;
}
