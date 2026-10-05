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

export const DEERS_TRANSFORM = [
  {
    scale: new THREE.Vector3(0.4, 0.4, 0.4),
    position: new THREE.Vector3(0.7, 0, 1.3),
    rotationY: 0,
  },
  {
    scale: new THREE.Vector3(0.3, 0.3, 0.3),
    position: new THREE.Vector3(1.2, 0, 1.8),
    rotationY: -Math.PI / 5,
  },
  {
    scale: new THREE.Vector3(0.25, 0.25, 0.25),
    position: new THREE.Vector3(0.4, 0, 2.0),
    rotationY: Math.PI / 2,
  },
];
