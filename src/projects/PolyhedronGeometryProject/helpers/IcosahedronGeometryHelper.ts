import * as THREE from "three";
import PolyhedronGeometryHelper from "./PolyhedronGeometryHelper";

class IcosahedronGeometryHelper extends PolyhedronGeometryHelper {
  controlUIGroupName = "IcosahedronGeometry";

  createGeometry() {
    return new THREE.IcosahedronGeometry(this.args.radius, this.args.detail);
  }
}

export default IcosahedronGeometryHelper;
