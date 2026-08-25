import * as THREE from "three";
import type { PATHS } from "./TubeGeometryProject.constants";

export type PathType = (typeof PATHS)[number];

export interface GeometryHelper {
  args: {
    path: PathType;
    tubularSegments: number;
    radius: number;
    radialSegments: number;
    closed: boolean;
  };
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (update: (updateZoom?: boolean) => void) => void;
}
