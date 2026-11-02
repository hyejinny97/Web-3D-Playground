import * as THREE from "three";
import * as CANNON from "cannon-es";

declare module "cannon-es" {
  interface Body {
    name?: string;
  }
}

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface DoorType {
  model: THREE.Object3D | null;
  bodies: CANNON.Body[];
  constraint: CANNON.HingeConstraint | null;
  init: () => void;
  update: () => void;
}

export interface DoorInfoType {
  doorObj?: THREE.Object3D;
  doorBody?: CANNON.Body;
  hingeBody?: CANNON.Body;
  doorBox?: THREE.Box3;
  boardBox?: THREE.Box3;
  doorSize?: THREE.Vector3;
}
