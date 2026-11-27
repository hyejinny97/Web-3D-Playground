import * as THREE from "three";

export const GROUND_TEXTURES = {
  aoMap: {
    url: "/textures/forest-floor/forest_floor_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  displacementMap: {
    url: "/textures/forest-floor/forest_floor_height.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  map: {
    url: "/textures/forest-floor/forest_floor_color.jpg",
    colorSpace: THREE.SRGBColorSpace,
  },
  normalMap: {
    url: "/textures/forest-floor/forest_floor_normal.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  roughnessMap: {
    url: "/textures/forest-floor/forest_floor_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  metalnessMap: {
    url: "/textures/forest-floor/forest_floor_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
} as const;

export const GROUND_SIZE = {
  width: 8,
  height: 5,
} as const;
