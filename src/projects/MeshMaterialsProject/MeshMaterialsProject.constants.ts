import * as THREE from "three";

export const SIDES = {
  FrontSide: THREE.FrontSide,
  BackSide: THREE.BackSide,
  DoubleSide: THREE.DoubleSide,
} as const;

export const PROPERTIES_NEED_UPDATE = [
  "side",
  "flatShading",
  "transparent",
  "fog",
] as const;
