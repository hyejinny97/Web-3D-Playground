import * as THREE from "three";
import type { MIN_FILTER } from "./TextureMipmapsProject.constants";

export type MinFilterType = keyof typeof MIN_FILTER;

export interface TextureHelperType {
  texture: THREE.Texture;
  createControlUI: () => void;
  reset: () => void;
}
