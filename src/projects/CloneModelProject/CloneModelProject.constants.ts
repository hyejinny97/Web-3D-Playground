import * as THREE from "three";

export const GRASS_TEXTURES = {
  aoMap: {
    url: "/textures/grass/grass_ao.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  displacementMap: {
    url: "/textures/grass/grass_height.png",
    colorSpace: THREE.NoColorSpace,
  },
  map: {
    url: "/textures/grass/grass_color.jpg",
    colorSpace: THREE.SRGBColorSpace,
  },
  normalMap: {
    url: "/textures/grass/grass_normal.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  roughnessMap: {
    url: "/textures/grass/grass_roughness.jpg",
    colorSpace: THREE.NoColorSpace,
  },
} as const;

export const TREE_URL = "/models/tree.glb";
