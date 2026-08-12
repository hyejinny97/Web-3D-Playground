import * as THREE from "three";

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
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (update: () => void) => void;
  reset: (update: () => void) => void;
}

export interface GeometryItemType<H extends GeometryHelper = GeometryHelper> {
  helper: H;
  model?: THREE.Group;
  position?: THREE.Vector3;
}
