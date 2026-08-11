import * as THREE from "three";
import PolyhedronGeometryHelper from "./PolyhedronGeometryHelper";

class TetrahedronGeometryHelper extends PolyhedronGeometryHelper {
  createGeometry() {
    return new THREE.TetrahedronGeometry(this.args.radius, this.args.detail);
  }
}

export default TetrahedronGeometryHelper;
