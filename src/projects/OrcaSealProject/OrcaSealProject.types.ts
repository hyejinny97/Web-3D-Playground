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
  seek: (target: YUKA.Vector3) => void;
  update: (time: number) => void;
}

export interface OrcaType extends DynamicElementType {
  update: (time: number) => void;
}

export interface SealTargetType {
  model: THREE.Mesh;
  position: YUKA.Vector3;
  show: () => void;
  hide: () => void;
  update: (time: number) => void;
}
