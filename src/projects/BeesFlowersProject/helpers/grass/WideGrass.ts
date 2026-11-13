import Elements from "../Elements";
import { WIDE_GRASS_TRANSFORMATION } from "../../BeesFlowersProject.constants";

class WideGrass extends Elements {
  protected url = "/models/grass2.glb";
  protected count = WIDE_GRASS_TRANSFORMATION.length;

  protected transform() {
    WIDE_GRASS_TRANSFORMATION.forEach(({ position, rotationY, scale }, idx) => {
      const model = this.models[idx];
      if (!model) return;

      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
      model.scale.set(scale, scale, scale);
    });
  }
}

export default WideGrass;
