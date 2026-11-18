import * as THREE from "three";
import * as YUKA from "yuka";

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (percent: number) => void;
  onLoad: () => void;
}

export interface DynamicElementType {
  model: THREE.Object3D | null;
  entity: YUKA.Vehicle | null;
  init: () => void;
}

export interface SealType extends DynamicElementType {
  update: (time: number) => void;
}
