import * as THREE from "three";

export const MIPMAP_IMAGE_URLS = [
  "/textures/mipmaps/mip128.png",
  "/textures/mipmaps/mip64.png",
  "/textures/mipmaps/mip32.png",
  "/textures/mipmaps/mip16.png",
  "/textures/mipmaps/mip8.png",
  "/textures/mipmaps/mip4.png",
  "/textures/mipmaps/mip2.png",
  "/textures/mipmaps/mip1.png",
];

export const MIN_FILTER = {
  NearestFilter: THREE.NearestFilter,
  LinearFilter: THREE.LinearFilter,
  NearestMipmapNearestFilter: THREE.NearestMipMapNearestFilter,
  NearestMipmapLinearFilter: THREE.NearestMipMapLinearFilter,
  LinearMipmapNearestFilter: THREE.LinearMipMapNearestFilter,
  LinearMipmapLinearFilter: THREE.LinearMipmapLinearFilter,
} as const;

export const PLANE_WIDTH = 6;

export const PLANE_HEIGHT = 100;
