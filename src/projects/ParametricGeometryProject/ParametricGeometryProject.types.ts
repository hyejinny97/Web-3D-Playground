import * as THREE from "three";
import type { FUNCS } from "./ParametricGeometryProject.constants";
import type { ParametricGeometry } from "three/examples/jsm/Addons.js";

export type FuncsType = (typeof FUNCS)[number];

export interface GeometryHelper {
  args: {
    func: FuncsType;
    slices: number;
    stacks: number;
  };
  createGeometry: () => THREE.BufferGeometry;
  createControlUI: (update: (updateZoom?: boolean) => void) => void;
}

export type ParametricFunc = ConstructorParameters<
  typeof ParametricGeometry
>[0];
