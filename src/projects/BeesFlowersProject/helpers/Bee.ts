import { BEES_TRANSFORMATION } from "../BeesFlowersProject.constants";
import DynamicElements from "./DynamicElements";

class Bee extends DynamicElements {
  protected url = "/models/bee/scene.gltf";
  protected count = BEES_TRANSFORMATION.length;

  protected transform() {
    BEES_TRANSFORMATION.forEach(({ position, rotationY, scale }, idx) => {
      const model = this.models[idx];
      if (!model) return;

      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
      model.scale.set(scale, scale, scale);
    });
  }
}

export default Bee;
