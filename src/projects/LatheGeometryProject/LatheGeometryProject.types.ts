import * as THREE from "three";
import { POINTS } from "./LatheGeometryProject.constants";

export type PointsType = (typeof POINTS)[number];

export interface GeometryHelper {
  args: {
    points: PointsType;
    segments: number;
    phiStart: number;
    phiLength: number;
  };
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (update: () => void) => void;
}
