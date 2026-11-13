import Elements from "../Elements";
import { TALL_GRASS_TRANSFORMATION } from "../../BeesFlowersProject.constants";

class TallGrass extends Elements {
  protected url = "/models/grass1.glb";
  protected count = TALL_GRASS_TRANSFORMATION.length;

  protected transform() {
    TALL_GRASS_TRANSFORMATION.forEach(({ position, rotationY, scale }, idx) => {
      const model = this.models[idx];
      if (!model) return;

      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
      model.scale.set(scale, scale, scale);
    });
  }
}

export default TallGrass;
