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
    scale: new THREE.Vector3(0.45, 0.45, 0.45),
    position: new THREE.Vector3(0.7, 0, 1.3),
    rotationY: 0,
  },
  {
    scale: new THREE.Vector3(0.35, 0.35, 0.35),
    position: new THREE.Vector3(1.2, 0, 1.8),
    rotationY: -Math.PI / 5,
  },
  {
    scale: new THREE.Vector3(0.3, 0.3, 0.3),
    position: new THREE.Vector3(0.4, 0, 2.0),
    rotationY: Math.PI / 2,
  },
];

export const RABBITS_TRANSFORM = [
  {
    scale: new THREE.Vector3(0.9, 0.9, 0.9),
    position: new THREE.Vector3(-1.0, 0, 1.2),
    rotationY: Math.PI / 6,
  },
  {
    scale: new THREE.Vector3(0.75, 0.75, 0.75),
    position: new THREE.Vector3(-1.5, 0, 1.8),
    rotationY: -Math.PI / 5,
  },
  {
    scale: new THREE.Vector3(1, 1, 1),
    position: new THREE.Vector3(2, 0, -0.5),
    rotationY: -Math.PI / 2,
  },
  {
    scale: new THREE.Vector3(1, 1, 1),
    position: new THREE.Vector3(1.2, 0, -1.8),
    rotationY: Math.PI / 3,
  },
  {
    scale: new THREE.Vector3(0.8, 0.8, 0.8),
    position: new THREE.Vector3(2.0, 0, 2.0),
    rotationY: Math.PI / 4,
  },
];
