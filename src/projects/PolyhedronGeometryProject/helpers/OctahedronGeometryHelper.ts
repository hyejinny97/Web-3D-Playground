import * as THREE from "three";
import PolyhedronGeometryHelper from "./PolyhedronGeometryHelper";

class OctahedronGeometryHelper extends PolyhedronGeometryHelper {
  controlUIGroupName = "OctahedronGeometry";

  createGeometry() {
    return new THREE.OctahedronGeometry(this.args.radius, this.args.detail);
  }
}

export default OctahedronGeometryHelper;
