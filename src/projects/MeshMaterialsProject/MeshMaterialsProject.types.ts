import * as THREE from "three";
import type { DEPTH_PACKING, SIDES } from "./MeshMaterialsProject.constants";

export type SideType = (typeof SIDES)[keyof typeof SIDES];

export type DepthPackingType =
  (typeof DEPTH_PACKING)[keyof typeof DEPTH_PACKING];

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

export interface MeshStandardMaterialHelperType {
  args: {
    color: THREE.Color;
    fog: boolean;
    wireframe: boolean;
    emissive: THREE.Color;
    emissiveIntensity: number;
    metalness: number;
    roughness: number;
  };
  material: THREE.MeshStandardMaterial;
  createControlUI: () => void;
  reset: () => void;
}

export interface MeshPhysicalMaterialHelperType {
  args: {
    color: THREE.Color;
    fog: boolean;
    wireframe: boolean;
    emissive: THREE.Color;
    emissiveIntensity: number;
    metalness: number;
    roughness: number;
    ior: number;
    reflectivity: number;
    specularColor: THREE.Color;
    specularIntensity: number;
    iridescence: number;
    iridescenceIOR: number;
    sheenColor: THREE.Color;
    sheen: number;
    sheenRoughness: number;
    clearcoat: number;
    clearcoatRoughness: number;
  };
  material: THREE.MeshPhysicalMaterial;
  createControlUI: () => void;
  reset: () => void;
}

export interface MeshDepthMaterialHelperType {
  args: {
    wireframe: boolean;
    depthPacking: DepthPackingType;
  };
  material: THREE.MeshDepthMaterial;
  createControlUI: () => void;
  reset: () => void;
}

export interface MaterialDictionaryType {
  values: {
    meshBasic: MeshBasicMaterialHelperType;
    meshLambert: MeshLambertMaterialHelperType;
    meshPhong: MeshPhongMaterialHelperType;
    meshStandard: MeshStandardMaterialHelperType;
    meshPhysical: MeshPhysicalMaterialHelperType;
    meshDepth: MeshDepthMaterialHelperType;
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
