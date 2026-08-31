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
  "depthPacking",
] as const;

export const DEFAULT_COLOR = "#049ef4" as const;

export const DEPTH_PACKING = {
  Basic: THREE.BasicDepthPacking,
  RGBA: THREE.RGBADepthPacking,
  RGB: THREE.RGBDepthPacking,
  RG: THREE.RGDepthPacking,
};
