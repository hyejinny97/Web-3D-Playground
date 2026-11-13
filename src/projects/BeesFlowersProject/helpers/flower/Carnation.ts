import { CARNATION_TRANSFORMATION } from "../../BeesFlowersProject.constants";
import StaticElements from "../StaticElements";

class Carnation extends StaticElements {
  protected url = "/models/carnation.glb";
  protected count = CARNATION_TRANSFORMATION.length;

  protected transform() {
    CARNATION_TRANSFORMATION.forEach(({ position, rotationY, scale }, idx) => {
      const model = this.models[idx];
      if (!model) return;

      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
      model.scale.set(scale, scale, scale);
    });
  }
}

export default Carnation;
