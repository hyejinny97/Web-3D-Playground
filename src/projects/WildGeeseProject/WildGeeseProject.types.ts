import * as THREE from "three";
import * as YUKA from "yuka";

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (percent: number) => void;
  onLoad: () => void;
}

export interface WildGeeseType {
  models: THREE.Object3D[];
  entities: YUKA.Vehicle[];
  init: () => void;
  seek: (target: YUKA.Vector3) => void;
  update: (time: number) => void;
}

export interface TargetType {
  model: THREE.Mesh;
  position: YUKA.Vector3;
  show: () => void;
  hide: () => void;
  update: (time: number) => void;
}
