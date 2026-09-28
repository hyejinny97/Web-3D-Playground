import * as THREE from "three";

export interface LoadingOptionsType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface TrackHelperType {
  root: THREE.Object3D;
  init: () => void;
}

export interface CarHelperType {
  root: THREE.Object3D;
  init: () => void;
}
