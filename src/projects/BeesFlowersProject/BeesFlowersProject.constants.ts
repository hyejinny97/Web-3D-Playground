import * as THREE from "three";

export const GRASS_TEXTURES = {
  aoMap: {
    url: "/textures/leafy-grass/leafy_grass_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  displacementMap: {
    url: "/textures/leafy-grass/leafy_grass_height.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  map: {
    url: "/textures/leafy-grass/leafy_grass_color.jpg",
    colorSpace: THREE.SRGBColorSpace,
  },
  normalMap: {
    url: "/textures/leafy-grass/leafy_grass_normal.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  roughnessMap: {
    url: "/textures/leafy-grass/leafy_grass_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  metalnessMap: {
    url: "/textures/leafy-grass/leafy_grass_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
} as const;

export const GROUND_SIZE = 3 as const;
