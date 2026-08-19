import * as THREE from "three";
import type { ExtrudeGeometryHelperType } from "../KoreaProject.types";

export const DEFAULT_ARGS = {
  curveSegments: 12,
  steps: 1,
  depth: 0,
  bevelEnabled: false,
  bevelThickness: 0.2,
  bevelSize: 0.1,
  bevelOffset: 0,
  bevelSegments: 3,
} as const;

class ExtrudeGeometryHelper implements ExtrudeGeometryHelperType {
  private _args: ExtrudeGeometryHelperType["args"];
  shapes: THREE.Shape | THREE.Shape[];

  constructor(shapes: THREE.Shape | THREE.Shape[]) {
    this._args = { ...DEFAULT_ARGS };
    this.shapes = shapes;
  }

  get args() {
    return this._args;
  }

  setDepth(depth: number) {
    this._args.depth = depth;
  }

  createGeometry() {
    return new THREE.ExtrudeGeometry(this.shapes, {
      curveSegments: this._args.curveSegments,
      steps: this._args.steps,
      depth: this._args.depth,
      bevelEnabled: this._args.bevelEnabled,
      bevelThickness: this._args.bevelThickness,
      bevelSize: this._args.bevelSize,
      bevelOffset: this._args.bevelOffset,
      bevelSegments: this._args.bevelSegments,
    });
  }
}

export default ExtrudeGeometryHelper;
