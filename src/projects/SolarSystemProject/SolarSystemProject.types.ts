import * as THREE from "three";

export type AstronicObjectNameType =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "saturnRing"
  | "uranusRing"
  | "moon"
  | "ganymede"
  | "io";

export interface AstronicObjectType {
  name: string;
  root: THREE.Object3D;
  mesh: THREE.Mesh;
  parent: THREE.Object3D;
  distance: number; // 단위: scene unit
  rootYTilt?: number; // 범위: 0 ~ 360도
  rootRotation?: number; // 단위: radian/ms
  meshRotation?: number; // 단위: radian/ms
  locateRootToParent: () => void;
  update: (time: number) => void;
}
