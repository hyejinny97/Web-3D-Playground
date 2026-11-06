import * as THREE from "three";
import * as CANNON from "cannon-es";

declare module "cannon-es" {
  interface Body {
    name?: string;
  }
}

export interface FloorType {
  model: THREE.Object3D | null;
  body: CANNON.Body | null;
  update: () => void;
}

export interface DollType {
  model: THREE.Object3D | null;
  body: CANNON.Body | null;
  reset: () => void;
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

export interface TriggerPlaneType {
  body: CANNON.Body;
}

export interface CollideEvent {
  type: "collide";
  target: CANNON.Body; // 이벤트를 수신한 본인(Body) 객체
  body: CANNON.Body; // 나와 충돌한 상대방(Body) 객체
}
