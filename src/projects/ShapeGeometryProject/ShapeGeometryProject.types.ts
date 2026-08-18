import * as THREE from "three";
import { SHAPES } from "./ShapeGeometryProject.constants";

export type ShapeType = (typeof SHAPES)[number];

export interface GeometryHelper {
  args: {
    shapeName: ShapeType;
    curveSegments: number;
  };
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (update: () => void) => void;
}
