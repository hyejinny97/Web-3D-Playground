import Elements from "../Elements";
import { GRASS1_TRANSFORMATION } from "../../BeesFlowersProject.constants";

class Grass1 extends Elements {
  protected url = "/models/grass1.glb";
  protected count = GRASS1_TRANSFORMATION.length;

  protected transform() {
    GRASS1_TRANSFORMATION.forEach(({ position, rotationY, scale }, idx) => {
      const model = this.models[idx];
      if (!model) return;

      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
      model.scale.set(scale, scale, scale);
    });
  }
}

export default Grass1;
