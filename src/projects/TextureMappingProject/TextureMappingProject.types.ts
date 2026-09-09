import * as THREE from "three";
import {
  BRICK_TEXTURES,
  ICE_TEXTURES,
} from "./TextureMappingProject.constants";

export type BrickTextureType = keyof typeof BRICK_TEXTURES;

export type IceTextureType = keyof typeof ICE_TEXTURES;

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
    Lava: { helper: BrickMaterialHelperType; initiated: boolean };
    Fabric: { helper: BrickMaterialHelperType; initiated: boolean };
    Glass: { helper: BrickMaterialHelperType; initiated: boolean };
  };
}
