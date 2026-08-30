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

export interface MeshLambertMaterialHelperType {
  args: {
    color: THREE.Color;
    fog: boolean;
    wireframe: boolean;
    emissive: THREE.Color;
    emissiveIntensity: number;
  };
  material: THREE.MeshLambertMaterial;
  createControlUI: () => void;
  reset: () => void;
}

export interface MeshPhongMaterialHelperType {
  args: {
    color: THREE.Color;
    fog: boolean;
    wireframe: boolean;
    emissive: THREE.Color;
    emissiveIntensity: number;
    specular: THREE.Color;
    shininess: number;
  };
  material: THREE.MeshPhongMaterial;
  createControlUI: () => void;
  reset: () => void;
}

export interface MaterialDictionaryType {
  values: {
    meshBasic: MeshBasicMaterialHelperType;
    meshLambert: MeshLambertMaterialHelperType;
    meshPhong: MeshPhongMaterialHelperType;
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
