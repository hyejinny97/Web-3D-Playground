import * as THREE from "three";
import * as CANNON from "cannon-es";

export interface FloorType {
  model: THREE.Object3D | null;
  body: CANNON.Body | null;
  update: () => void;
}

export interface DollType {
  model: THREE.Object3D | null;
  body: CANNON.Body | null;
  update: () => void;
}

export interface MarkerType {
  model: THREE.Object3D | null;
  body: CANNON.Body | null;
  show: () => void;
  hide: () => void;
  locateAt: (position: THREE.Vector3) => void;
  update: () => void;
}

export interface MovementPlaneType {
  model: THREE.Object3D;
  locateAt: (position: THREE.Vector3) => void;
}
