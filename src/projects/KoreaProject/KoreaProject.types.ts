import * as THREE from "three";
import type ExtrudeGeometryHelper from "./helpers/ExtrudeGeometryHelper";

export interface GeometryHelper {
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
  createGeometry: (shapes: THREE.Shape | THREE.Shape) => THREE.BufferGeometry;
}

export interface SidoDictionaryValueType {
  [codeNm: number]: {
    englishName: string;
    koreanName: string;
    geometryHelper: ExtrudeGeometryHelper;
    model?: THREE.Group;
  };
}
