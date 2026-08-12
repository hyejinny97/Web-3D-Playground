import * as THREE from "three";
import ExtrudeGeometryHelper from "./ExtrudeGeometryHelper";

class FilledHeartHelper extends ExtrudeGeometryHelper {
  setShapeName() {
    return `'Heart'`;
  }

  createShape() {
    const x = 2.5;
    const y = 5;

    const shape = new THREE.Shape();
    shape.moveTo(x - 2.5, y - 2.5);
    shape.bezierCurveTo(x - 2.5, y - 2.5, x - 2, y, x, y);
    shape.bezierCurveTo(x + 3, y, x + 3, y - 3.5, x + 3, y - 3.5);
    shape.bezierCurveTo(x + 3, y - 5.5, x + 1.5, y - 7.7, x - 2.5, y - 9.5);
    shape.bezierCurveTo(x - 6, y - 7.7, x - 8, y - 4.5, x - 8, y - 3.5);
    shape.bezierCurveTo(x - 8, y - 3.5, x - 8, y, x - 5, y);
    shape.bezierCurveTo(x - 3.5, y, x - 2.5, y - 2.5, x - 2.5, y - 2.5);
    return shape;
  }
}

export default FilledHeartHelper;
