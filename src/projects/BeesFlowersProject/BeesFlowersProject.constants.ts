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

export const TALL_GRASS_TRANSFORMATION = [
  { position: new THREE.Vector3(-1, -0.05, -1), rotationY: 0, scale: 0.015 },
  {
    position: new THREE.Vector3(-0.6, -0.05, -1.1),
    rotationY: Math.PI / 2,
    scale: 0.016,
  },
  { position: new THREE.Vector3(1, -0.05, -1), rotationY: 0, scale: 0.013 },
  { position: new THREE.Vector3(0.2, -0.05, -1), rotationY: 0, scale: 0.014 },
  { position: new THREE.Vector3(0, -0.05, -0.6), rotationY: 0, scale: 0.012 },
  {
    position: new THREE.Vector3(-0.05, -0.05, -0.6),
    rotationY: Math.PI / 4,
    scale: 0.011,
  },
  {
    position: new THREE.Vector3(1.2, -0.05, 0.3),
    rotationY: -Math.PI / 3,
    scale: 0.012,
  },
  {
    position: new THREE.Vector3(1, -0.05, 0.4),
    rotationY: 0,
    scale: 0.01,
  },
  {
    position: new THREE.Vector3(-1.1, -0.05, 0.7),
    rotationY: 0,
    scale: 0.012,
  },
] as const;

export const WIDE_GRASS_TRANSFORMATION = [
  { position: new THREE.Vector3(-0.2, -0.05, 0.3), rotationY: 0, scale: 0.14 },
  {
    position: new THREE.Vector3(-1.3, -0.05, 1.3),
    rotationY: -Math.PI,
    scale: 0.07,
  },
] as const;

export const LAVENDER_TRANSFORMATION = [
  { position: new THREE.Vector3(-0.8, -0.15, -0.6), rotationY: 0, scale: 0.7 },
  { position: new THREE.Vector3(-1, -0.15, -0.4), rotationY: 0, scale: 0.6 },
  {
    position: new THREE.Vector3(-0.6, -0.15, -0.25),
    rotationY: 0,
    scale: 0.65,
  },
  { position: new THREE.Vector3(-0.3, -0.15, -0.1), rotationY: 0, scale: 0.55 },
] as const;

export const CARNATION_TRANSFORMATION = [
  { position: new THREE.Vector3(-0.9, 0, 0.9), rotationY: 0, scale: 0.005 },
  {
    position: new THREE.Vector3(-0.6, 0, 1.2),
    rotationY: -Math.PI / 2,
    scale: 0.004,
  },
  {
    position: new THREE.Vector3(-0.4, 0, 1.4),
    rotationY: -Math.PI / 5,
    scale: 0.0035,
  },
] as const;

export const ROSE_TRANSFORMATION = [
  {
    position: new THREE.Vector3(0.4, 0, 0.8),
    rotationY: -Math.PI / 2,
    scale: 0.15,
  },
  {
    position: new THREE.Vector3(0.7, 0, 1.1),
    rotationY: -Math.PI / 3,
    scale: 0.19,
  },
  {
    position: new THREE.Vector3(1.2, 0, 0.9),
    rotationY: 0,
    scale: 0.17,
  },
  {
    position: new THREE.Vector3(1.1, 0, 1.3),
    rotationY: -Math.PI / 4,
    scale: 0.16,
  },
  {
    position: new THREE.Vector3(0.3, 0, 1.35),
    rotationY: (-Math.PI / 3) * 2,
    scale: 0.185,
  },
  {
    position: new THREE.Vector3(0.7, 0, 1.5),
    rotationY: -Math.PI / 4,
    scale: 0.16,
  },
] as const;

export const HYDRANGEA_TRANSFORMATION = [
  { position: new THREE.Vector3(1.2, 0, -1), rotationY: 0, scale: 2.2 },
  {
    position: new THREE.Vector3(0.8, 0, -1),
    rotationY: -Math.PI / 2,
    scale: 2.3,
  },
  { position: new THREE.Vector3(1, 0, -0.65), rotationY: 0, scale: 2 },
  {
    position: new THREE.Vector3(0.5, 0, -0.6),
    rotationY: Math.PI / 2,
    scale: 1.95,
  },
  {
    position: new THREE.Vector3(0.2, 0, -0.65),
    rotationY: 0,
    scale: 2.5,
  },
  {
    position: new THREE.Vector3(0.65, 0, -0.25),
    rotationY: -Math.PI / 3,
    scale: 2,
  },
  {
    position: new THREE.Vector3(0.75, 0, -0.1),
    rotationY: Math.PI / 2,
    scale: 1.9,
  },
  {
    position: new THREE.Vector3(0.3, 0, 0),
    rotationY: 0,
    scale: 1.8,
  },
  {
    position: new THREE.Vector3(0.75, 0, 0.25),
    rotationY: -Math.PI / 4,
    scale: 1.9,
  },
] as const;
