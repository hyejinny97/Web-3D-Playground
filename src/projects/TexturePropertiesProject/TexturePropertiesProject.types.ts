import * as THREE from "three";
import type { IMAGES } from "./TexturePropertiesProject.constants";

export type ImageType = keyof typeof IMAGES;

export interface TextureMaterialHelperType {
  args: {
    image: ImageType;
    wrapS: THREE.Wrapping;
    wrapT: THREE.Wrapping;
    repeatX: number;
    repeatY: number;
    offsetX: number;
    offsetY: number;
    centerX: number;
    centerY: number;
    rotation: number;
    minFilter: THREE.MinificationTextureFilter;
    magFilter: THREE.MagnificationTextureFilter;
  };
  texture: THREE.Texture;
  material: THREE.MeshPhongMaterial;
  createControlUI: () => void;
  reset: () => void;
}

export type TexturePropertiesType = THREE.TextureParameters & {
  image?: ImageType;
  repeatX?: number;
  repeatY?: number;
  offsetX?: number;
  offsetY?: number;
  centerX?: number;
  centerY?: number;
  rotation?: number;
};
