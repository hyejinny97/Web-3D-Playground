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
