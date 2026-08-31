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
  "gradientMap",
] as const;

export const DEFAULT_COLOR = "#049ef4" as const;

export const DEPTH_PACKING = {
  Basic: THREE.BasicDepthPacking,
  RGBA: THREE.RGBADepthPacking,
  RGB: THREE.RGBDepthPacking,
  RG: THREE.RGDepthPacking,
};

export const GRADIENT_MAP_TEXTURES = {
  "Tone-3": [0x111111, 0x666666, 0xbbbbbb],
  "Tone-5": [0x111111, 0x444444, 0x777777, 0xaaaaaa, 0xdddddd],
};
