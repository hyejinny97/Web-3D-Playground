import * as THREE from "three";
import PolyhedronGeometryHelper from "./PolyhedronGeometryHelper";

class DodecahedronGeometryHelper extends PolyhedronGeometryHelper {
  createGeometry() {
    return new THREE.DodecahedronGeometry(this.args.radius, this.args.detail);
  }
}

export default DodecahedronGeometryHelper;
