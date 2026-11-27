import * as THREE from "three";
import * as YUKA from "yuka";

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

export const GROUND_SIZE = {
  width: 8,
  height: 5,
} as const;

export const ORIGINAL_MODEL_NAME = "model" as const;

export const ANIMATION_NAME = {
  buffalo: {
    idle: "Idle",
    walk: "Buffalo|Buffalo_WalkFast_F",
  },
  lion: {
    idle: "Idle",
    walk: "Walk",
  },
} as const;

export const MAX_TURN_RATE = Math.PI / 2;

export const MOVE_THRESHOLD = 0.1 as const;

export const ARRIVE_TOLERANCE = 0.1 as const;

export const RESTRICTED_AREA = {
  center: new YUKA.Vector3(0, 0, 0),
  radius: Math.min(GROUND_SIZE.width, GROUND_SIZE.height) * 0.5,
} as const;

export const PANIC_DISTANCE = 1 as const;
