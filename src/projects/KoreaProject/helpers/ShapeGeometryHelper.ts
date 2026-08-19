import * as THREE from "three";
import type { ShapeGeometryHelperType } from "../KoreaProject.types";

class ShapeGeometryHelper implements ShapeGeometryHelperType {
  shapes: THREE.Shape | THREE.Shape[];

  constructor(shapes: THREE.Shape | THREE.Shape[]) {
    this.shapes = shapes;
  }

  createGeometry() {
    return new THREE.ShapeGeometry(this.shapes);
  }
}

export default ShapeGeometryHelper;
