import Elements from "../Elements";
import { GRASS2_TRANSFORMATION } from "../../BeesFlowersProject.constants";

class Grass2 extends Elements {
  protected url = "/models/grass2.glb";
  protected count = GRASS2_TRANSFORMATION.length;

  protected transform() {
    GRASS2_TRANSFORMATION.forEach(({ position, rotationY, scale }, idx) => {
      const model = this.models[idx];
      if (!model) return;

      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
      model.scale.set(scale, scale, scale);
    });
  }
}

export default Grass2;
