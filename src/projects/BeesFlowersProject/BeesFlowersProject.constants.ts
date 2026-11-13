import * as THREE from "three";

export const GROUND_SIZE = 3 as const;

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

export const GRASS1_TRANSFORMATION = [
  { position: new THREE.Vector3(0, -0.05, 0), rotationY: 0, scale: 0.01 },
  { position: new THREE.Vector3(1, -0.05, 0), rotationY: 0, scale: 0.01 },
] as const;

export const GRASS2_TRANSFORMATION = [
  { position: new THREE.Vector3(0, 0, 0), rotationY: 0, scale: 0.1 },
] as const;
