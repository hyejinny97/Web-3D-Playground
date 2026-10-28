import * as THREE from "three";
import * as CANNON from "cannon-es";

export const CLOTH_TEXTURES = {
  anisotropyMap: {
    url: "/textures/cloth/cloth_anisotropy.png",
    colorSpace: THREE.NoColorSpace,
  },
  aoMap: {
    url: "/textures/cloth/cloth_ao.png",
    colorSpace: THREE.NoColorSpace,
  },
  map: {
    url: "/textures/cloth/cloth_color.png",
    colorSpace: THREE.SRGBColorSpace,
  },
  displacementMap: {
    url: "/textures/cloth/cloth_height.png",
    colorSpace: THREE.NoColorSpace,
  },
  metalnessMap: {
    url: "/textures/cloth/cloth_metalness.png",
    colorSpace: THREE.NoColorSpace,
  },
  normalMap: {
    url: "/textures/cloth/cloth_normal.png",
    colorSpace: THREE.NoColorSpace,
  },
  roughnessMap: {
    url: "/textures/cloth/cloth_roughness.png",
    colorSpace: THREE.NoColorSpace,
  },
  envMap: {
    url: "/textures/pure_sky.hdr",
    colorSpace: THREE.LinearSRGBColorSpace,
    mapping: THREE.EquirectangularReflectionMapping,
  },
} as const;

export const CLOTH_WIDTH = 1;

export const CLOTH_HEIGHT = 1;

export const CLOTH_WIDTH_SEGMENTS = 14;

export const CLOTH_HEIGHT_SEGMENTS = 14;

export const CLOTH_WIDTH_STEP = CLOTH_WIDTH / CLOTH_WIDTH_SEGMENTS;

export const CLOTH_HEIGHT_STEP = CLOTH_HEIGHT / CLOTH_HEIGHT_SEGMENTS;

export const BALL_RADIUS = 0.15;

export const MOVEMENT_CIRCLE_CENTER = new CANNON.Vec3(0, 0, BALL_RADIUS);

export const MOVEMENT_CIRCLE_RADIUS = BALL_RADIUS;

export const MOVEMENT_SPEED = Math.PI / 2; // 단위: radian/s
