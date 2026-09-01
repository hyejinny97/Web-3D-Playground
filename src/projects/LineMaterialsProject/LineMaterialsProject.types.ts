import * as THREE from "three";

export interface MaterialHelperType {
  args: {
    transparent: boolean;
    opacity: number;
    visible: boolean;
  };
  createControlUI: (update: () => void) => void;
  reset: (update: () => void) => void;
}

export interface LineBasicMaterialHelperType {
  args: {
    color: THREE.Color;
    fog: boolean;
  };
  material: THREE.LineBasicMaterial;
  createControlUI: () => void;
  reset: () => void;
}

export interface LineDashedMaterialHelperType {
  args: {
    color: THREE.Color;
    fog: boolean;
    scale: number;
    dashSize: number;
    gapSize: number;
  };
  material: THREE.LineDashedMaterial;
  createControlUI: () => void;
  reset: () => void;
}

export interface MaterialDictionaryType {
  values: {
    lineBasic: LineBasicMaterialHelperType;
    lineDashed: LineDashedMaterialHelperType;
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
