import * as THREE from "three";

export const PROPERTIES_NEED_UPDATE = [
  "aoMap",
  "displacementMap",
  "map",
  "normalMap",
  "roughnessMap",
] as const;

export const BRICK_TEXTURES = {
  aoMap: {
    url: "/textures/brick/brick_ao.png",
    colorSpace: THREE.NoColorSpace,
  },
  displacementMap: {
    url: "/textures/brick/brick_height.png",
    colorSpace: THREE.NoColorSpace,
  },
  map: {
    url: "/textures/brick/brick_color.png",
    colorSpace: THREE.SRGBColorSpace,
  },
  normalMap: {
    url: "/textures/brick/brick_normal.png",
    colorSpace: THREE.NoColorSpace,
  },
  roughnessMap: {
    url: "/textures/brick/brick_roughness.png",
    colorSpace: THREE.NoColorSpace,
  },
} as const;

export const TEXTURE_WRAP_S = THREE.RepeatWrapping;

export const TEXTURE_WRAP_T = THREE.RepeatWrapping;

export const TEXTURE_REPEAT_X = 4;

export const TEXTURE_REPEAT_Y = 2;
