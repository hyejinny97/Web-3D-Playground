import * as THREE from "three";
import ExtrudeGeometryHelper, { DEFAULT_ARGS } from "./ExtrudeGeometryHelper";

class OutlinedHeartHelper extends ExtrudeGeometryHelper {
  createInitArgs() {
    return JSON.parse(JSON.stringify({ ...DEFAULT_ARGS, steps: 15 }));
  }

  setShapeName() {
    return `'L-shaped'`;
  }

  setExtrudePathName() {
    return `'Heart curve'`;
  }

  createShape() {
    const lShape = new THREE.Shape(
      [
        [-2, -0.1],
        [2, -0.1],
        [2, 0.6],
        [1.6, 0.6],
        [1.6, 0.1],
        [-2, 0.1],
      ].map((p) => new THREE.Vector2(...p)),
    );
    return lShape;
  }

  createExtrudePath() {
    const x = 2.5;
    const y = 5;
    const points = [
      [x - 2.5, y - 2.5],
      [x - 2.5, y - 2.5],
      [x - 2, y],
      [x, y],
      [x + 3, y],
      [x + 3, y - 3.5],
      [x + 3, y - 3.5],
      [x + 3, y - 5.5],
      [x + 1.5, y - 7.7],
      [x - 2.5, y - 9.5],
      [x - 6, y - 7.7],
      [x - 8, y - 4.5],
      [x - 8, y - 3.5],
      [x - 8, y - 3.5],
      [x - 8, y],
      [x - 5, y],
      [x - 3.5, y],
      [x - 2.5, y - 2.5],
      [x - 2.5, y - 2.5],
    ].map((p) => new THREE.Vector3(...p, 0));

    const path = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 0; i < points.length; i += 3) {
      path.add(new THREE.CubicBezierCurve3(...points.slice(i, i + 4)));
    }
    return path;
  }
}

export default OutlinedHeartHelper;
