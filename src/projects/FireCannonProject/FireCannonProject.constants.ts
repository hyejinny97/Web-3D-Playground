import * as THREE from "three";

export const CONCRETE_TEXTURES = {
  aoMap: {
    url: "/textures/concrete/concrete_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  roughnessMap: {
    url: "/textures/concrete/concrete_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  metalMap: {
    url: "/textures/concrete/concrete_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  map: {
    url: "/textures/concrete/concrete_color.jpg",
    colorSpace: THREE.SRGBColorSpace,
  },
  normalMap: {
    url: "/textures/concrete/concrete_normal.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  displacementMap: {
    url: "/textures/concrete/concrete_height.png",
    colorSpace: THREE.NoColorSpace,
  },
};

export const METAL_TEXTURES = {
  aoMap: {
    url: "/textures/metal/metal_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  roughnessMap: {
    url: "/textures/metal/metal_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  metalMap: {
    url: "/textures/metal/metal_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  map: {
    url: "/textures/metal/metal_color.jpg",
    colorSpace: THREE.SRGBColorSpace,
  },
  normalMap: {
    url: "/textures/metal/metal_normal.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  displacementMap: {
    url: "/textures/metal/metal_height.png",
    colorSpace: THREE.NoColorSpace,
  },
};

export const GROUND_WIDTH = 15;

export const GROUND_HEIGHT = 10;

export const BOX_SIZE = 0.3;

export const BOX_REDUCTION = 2;

export const PHYSICS_TIMESTEP = 1 / 60; // 단위: s

export const BALL_RADIUS = 0.07;

export const CANNON_MUZZLE_NAME = "defaultMaterial_6";

export const DEFAULT_FIRE_SPEED = 10;

export const SPEED_CHANGE = 5;

export const MAX_SPEED = 100;
