import * as THREE from "three";
import {
  BRICK_TEXTURES,
  FABRIC_TEXTURES,
  GLASS_TEXTURES,
  ICE_TEXTURES,
  LAVA_TEXTURES,
} from "./TextureMappingProject.constants";

export type BrickTextureType = keyof typeof BRICK_TEXTURES;

export type IceTextureType = keyof typeof ICE_TEXTURES;

export type LavaTextureType = keyof typeof LAVA_TEXTURES;

export type FabricTextureType = keyof typeof FABRIC_TEXTURES;

export type GlassTextureType = keyof typeof GLASS_TEXTURES;

export interface BrickMaterialHelperType {
  args: {
    aoMap: boolean;
    aoMapIntensity: number;
    displacementMap: boolean;
    displacementBias: number;
    displacementScale: number;
    map: boolean;
    normalMap: boolean;
    roughnessMap: boolean;
    roughness: number;
  };
  material: THREE.MeshStandardMaterial;
  init: (textureLoad?: TextureLoadingType) => Promise<void>;
  createControlUI: () => void;
  reset: () => void;
}

export interface IceMaterialHelperType {
  args: {
    aoMap: boolean;
    aoMapIntensity: number;
    displacementMap: boolean;
    displacementBias: number;
    displacementScale: number;
    map: boolean;
    normalMap: boolean;
    specularMap: boolean;
    specular: THREE.Color;
    shininess: number;
  };
  material: THREE.MeshPhongMaterial;
  init: (textureLoad?: TextureLoadingType) => Promise<void>;
  createControlUI: () => void;
  reset: () => void;
}

export interface LavaMaterialHelperType {
  args: {
    alphaMap: boolean;
    aoMap: boolean;
    aoMapIntensity: number;
    displacementMap: boolean;
    displacementBias: number;
    displacementScale: number;
    map: boolean;
    normalMap: boolean;
    roughnessMap: boolean;
    roughness: number;
  };
  material: THREE.MeshStandardMaterial;
  init: (textureLoad?: TextureLoadingType) => Promise<void>;
  createControlUI: () => void;
  reset: () => void;
}

export interface FabricMaterialHelperType {
  args: {
    aoMap: boolean;
    aoMapIntensity: number;
    displacementMap: boolean;
    displacementBias: number;
    displacementScale: number;
    map: boolean;
    normalMap: boolean;
    metalnessMap: boolean;
    metalness: number;
    roughnessMap: boolean;
    roughness: number;
  };
  material: THREE.MeshStandardMaterial;
  init: (textureLoad?: TextureLoadingType) => Promise<void>;
  createControlUI: () => void;
  reset: () => void;
}

export interface GlassMaterialHelperType {
  args: {
    alphaMap: boolean;
    aoMap: boolean;
    aoMapIntensity: number;
    displacementMap: boolean;
    displacementBias: number;
    displacementScale: number;
    map: boolean;
    normalMap: boolean;
    metalnessMap: boolean;
    metalness: number;
    roughnessMap: boolean;
    roughness: number;
    transmissionMap: boolean;
    transmission: number;
  };
  material: THREE.MeshPhysicalMaterial;
  init: (textureLoad?: TextureLoadingType) => Promise<void>;
  createControlUI: () => void;
  reset: () => void;
}

export interface TextureLoadingType {
  onStart?: THREE.LoadingManager["onStart"];
  onLoad?: THREE.LoadingManager["onLoad"];
  onProgress?: THREE.LoadingManager["onProgress"];
  onError?: THREE.LoadingManager["onError"];
}

export interface MaterialDictionaryType {
  values: {
    Brick: { helper: BrickMaterialHelperType; initiated: boolean };
    Ice: { helper: IceMaterialHelperType; initiated: boolean };
    Lava: { helper: LavaMaterialHelperType; initiated: boolean };
    Fabric: { helper: FabricMaterialHelperType; initiated: boolean };
    Glass: { helper: GlassMaterialHelperType; initiated: boolean };
  };
}
