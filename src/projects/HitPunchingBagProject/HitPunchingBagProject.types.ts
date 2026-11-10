import * as THREE from "three";
import * as CANNON from "cannon-es";

declare module "cannon-es" {
  interface Body {
    name?: string;
  }
}

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (percent: number) => void;
  onLoad: () => void;
}

export interface PunchingBagType {
  model: THREE.Object3D | null;
  bodies: CANNON.Body[];
  constraint: CANNON.ConeTwistConstraint | null;
  init: () => void;
  update: () => void;
}

export interface PunchingBagInfoType {
  bagObj?: THREE.Object3D;
  bagBox?: THREE.Box3;
  bagBody?: CANNON.Body;
  anchorBody?: CANNON.Body;
}

export interface GloveType {
  model: THREE.Object3D | null;
  init: () => void;
  punch: ({
    position,
    direction,
  }: {
    position: THREE.Vector3;
    direction: THREE.Vector3;
  }) => void;
}
