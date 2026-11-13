import * as THREE from "three";
import { HYDRANGEA_TRANSFORMATION } from "../../BeesFlowersProject.constants";
import StaticElements from "../StaticElements";

class Hydrangea extends StaticElements {
  protected url = "/models/hydrangea.glb";
  protected count = HYDRANGEA_TRANSFORMATION.length;

  protected transform() {
    HYDRANGEA_TRANSFORMATION.forEach(({ position, rotationY, scale }, idx) => {
      const model = this.models[idx];
      if (!model) return;

      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
      model.scale.set(scale, scale, scale);

      const box = new THREE.Box3().setFromObject(model);
      model.position.y -= box.min.y;
    });
  }
}

export default Hydrangea;
