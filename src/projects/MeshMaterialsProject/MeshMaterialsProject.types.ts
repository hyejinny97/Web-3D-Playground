import * as THREE from "three";
import type { SIDES } from "./MeshMaterialsProject.constants";

export type SideType = (typeof SIDES)[keyof typeof SIDES];

export interface MaterialHelperType {
  args: {
    transparent: boolean;
    opacity: number;
    alphaTest: number;
    side: SideType;
    visible: boolean;
  };
  createControlUI: (update: () => void) => void;
  reset: (update: () => void) => void;
}

export interface MeshBasicMaterialHelperType {
  args: {
    color: THREE.Color;
    fog: boolean;
    wireframe: boolean;
  };
  material: THREE.MeshBasicMaterial;
  createControlUI: () => void;
  reset: () => void;
}

export interface MaterialDictionaryType {
  values: {
    meshBasic: MeshBasicMaterialHelperType;
  };
}

export interface FogHelperType {
  args: {
    fog: boolean;
    fogColor: THREE.Color;
    fogDensity: number;
  };
  createControlUI: () => void;
  reset: () => void;
}
