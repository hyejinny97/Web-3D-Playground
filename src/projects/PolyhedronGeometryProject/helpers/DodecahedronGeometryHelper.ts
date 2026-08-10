import * as THREE from "three";
import PolyhedronGeometryHelper from "./PolyhedronGeometryHelper";

class DodecahedronGeometryHelper extends PolyhedronGeometryHelper {
  controlUIGroupName = "DodecahedronGeometry";

  createGeometry() {
    return new THREE.DodecahedronGeometry(this.args.radius, this.args.detail);
  }
}

export default DodecahedronGeometryHelper;
