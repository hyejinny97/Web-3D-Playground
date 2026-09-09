import * as THREE from "three";

export const PROPERTIES_NEED_UPDATE = [
  "aoMap",
  "displacementMap",
  "map",
  "normalMap",
  "roughnessMap",
  "specularMap",
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

export const ICE_TEXTURES = {
  aoMap: {
    url: "/textures/ice/ice_ao.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  displacementMap: {
    url: "/textures/ice/ice_height.png",
    colorSpace: THREE.NoColorSpace,
  },
  map: {
    url: "/textures/ice/ice_color.jpg",
    colorSpace: THREE.SRGBColorSpace,
  },
  normalMap: {
    url: "/textures/ice/ice_normal.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  specularMap: {
    url: "/textures/ice/ice_specular.jpg",
    colorSpace: THREE.SRGBColorSpace,
  },
} as const;

export const TEXTURE_WRAP_S = THREE.RepeatWrapping;

export const TEXTURE_WRAP_T = THREE.RepeatWrapping;

export const TEXTURE_REPEAT_X = 4;

export const TEXTURE_REPEAT_Y = 2;

export const TEXTURE_MIN_FILTER = THREE.LinearFilter;
