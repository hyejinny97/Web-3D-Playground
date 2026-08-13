import * as THREE from "three";
import type { Font } from "three/examples/jsm/Addons.js";
import type { DIRECTION } from "./TextGeometryProject.constants";

export type DirectionType = (typeof DIRECTION)[number];

export interface GeometryHelper {
  args: {
    text: string;
    font: string;
    size: number;
    direction: DirectionType;
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
  createControlUI: (update: (updateZoom?: boolean) => void) => void;
}

export interface FontsType {
  [name: string]: Font;
}
