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
  update: (time: number) => void;
}
