import * as THREE from "three";
import { ROSE_TRANSFORMATION } from "../../BeesFlowersProject.constants";
import StaticElements from "../StaticElements";

class Rose extends StaticElements {
  protected url = "/models/rose.glb";
  protected count = ROSE_TRANSFORMATION.length;

  protected transform() {
    ROSE_TRANSFORMATION.forEach(({ position, rotationY, scale }, idx) => {
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

export default Rose;
