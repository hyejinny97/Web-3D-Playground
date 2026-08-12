import * as THREE from "three";
import ExtrudeGeometryHelper from "./ExtrudeGeometryHelper";

class RectangleHelper extends ExtrudeGeometryHelper {
  setShapeName() {
    return `'Rectangle'`;
  }

  createShape() {
    const width = 8;
    const height = 6;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, height);
    shape.lineTo(width, height);
    shape.lineTo(width, 0);
    shape.lineTo(0, 0);
    return shape;
  }
}

export default RectangleHelper;
