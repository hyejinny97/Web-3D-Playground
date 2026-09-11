import * as THREE from "three";

export const IMAGES = {
  "UV Grid": "/textures/uv_grid.jpg",
  "UV Tile": "/textures/tile.png",
} as const;

export const WRAPPING = {
  ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
  RepeatWrapping: THREE.RepeatWrapping,
  MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
} as const;

export const MIN_FILTER = {
  NearestFilter: THREE.NearestFilter,
  LinearFilter: THREE.LinearFilter,
  NearestMipmapNearestFilter: THREE.NearestMipMapNearestFilter,
  NearestMipmapLinearFilter: THREE.NearestMipMapLinearFilter,
  LinearMipmapNearestFilter: THREE.LinearMipMapNearestFilter,
  LinearMipmapLinearFilter: THREE.LinearMipmapLinearFilter,
} as const;

export const MAG_FILTER = {
  NearestFilter: THREE.NearestFilter,
  LinearFilter: THREE.LinearFilter,
} as const;
