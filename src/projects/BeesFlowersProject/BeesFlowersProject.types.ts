import * as THREE from "three";
import * as YUKA from "yuka";
import type { GRASS_TEXTURES } from "./BeesFlowersProject.constants";
import type { GLTF } from "three/examples/jsm/Addons.js";

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

export interface ElementsType {
  gltf: GLTF | null;
  models: THREE.Object3D[];
  init: () => void;
}

export interface StaticElementsType extends ElementsType {
  entities: YUKA.GameEntity[];
}

export interface DynamicElementsType extends ElementsType {
  entities: YUKA.Vehicle[];
}

export type JobStateType = "stay" | "seek";

export interface JobType {
  seek: ({ target }: { target: YUKA.Vector3 }) => Promise<void>;
  update: (time: number) => void;
}

export interface BeeType extends DynamicElementsType {
  setTargets: (...targets: YUKA.Vector3[]) => void;
  work: () => void;
  stop: () => void;
  update: (time: number) => void;
}
