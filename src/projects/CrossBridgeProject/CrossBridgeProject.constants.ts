import * as THREE from "three";

export const PHYSICS_TIMESTEP = 1 / 60; // 단위: s

export const BARK_TEXTURES = {
  aoMap: {
    url: "/textures/bark/bark_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  roughnessMap: {
    url: "/textures/bark/bark_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  metalMap: {
    url: "/textures/bark/bark_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  map: {
    url: "/textures/bark/bark_color.jpg",
    colorSpace: THREE.SRGBColorSpace,
  },
  normalMap: {
    url: "/textures/bark/bark_normal.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  displacementMap: {
    url: "/textures/bark/bark_height.jpg",
    colorSpace: THREE.NoColorSpace,
  },
};

export const GROUND_TEXTURES = {
  aoMap: {
    url: "/textures/rocks-ground/rocks_ground_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  roughnessMap: {
    url: "/textures/rocks-ground/rocks_ground_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  metalMap: {
    url: "/textures/rocks-ground/rocks_ground_arm.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  map: {
    url: "/textures/rocks-ground/rocks_ground_color.jpg",
    colorSpace: THREE.SRGBColorSpace,
  },
  normalMap: {
    url: "/textures/rocks-ground/rocks_ground_normal.jpg",
    colorSpace: THREE.NoColorSpace,
  },
  displacementMap: {
    url: "/textures/rocks-ground/rocks_ground_height.jpg",
    colorSpace: THREE.NoColorSpace,
  },
};

export const BOARDS_CNT = 11;

export const BOARD_WIDTH = 3;

export const BOARD_HEIGHT = 1;

export const BOARD_DEPTH = 10;

export const BOARD_GAP = 0.2;

export const GROUND_WIDTH = 10;

export const GROUND_HEIGHT = 10;
