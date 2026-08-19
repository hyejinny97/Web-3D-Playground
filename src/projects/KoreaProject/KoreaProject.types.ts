import * as THREE from "three";
import type ExtrudeGeometryHelper from "./helpers/ExtrudeGeometryHelper";

export interface ExtrudeGeometryHelperType {
  args: {
    curveSegments: number;
    steps: number;
    depth: number;
    bevelEnabled: boolean;
    bevelThickness: number;
    bevelSize: number;
    bevelOffset: number;
    bevelSegments: number;
  };
  createGeometry: () => THREE.BufferGeometry;
}

export interface ShapeGeometryHelperType {
  createGeometry: () => THREE.BufferGeometry;
}

export interface SidoDictionaryValueType {
  [codeNm: number]: {
    englishName: string;
    koreanName: string;
    geometryHelper: ExtrudeGeometryHelper;
    model?: THREE.Group;
  };
}

export interface SigunguDictionaryValueType {
  [sidoCodeNm: number]: {
    [sigunguCodeNm: number]: {
      englishName: string;
      koreanName: string;
      geometryHelper: ShapeGeometryHelperType;
      model?: THREE.Group;
    };
  };
}

export interface JSONDataType {
  codeNm: number;
  englishName: string;
  koreanName: string;
  shapes: number[][][];
}
