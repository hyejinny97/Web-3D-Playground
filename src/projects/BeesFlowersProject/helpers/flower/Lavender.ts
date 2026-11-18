import { LAVENDER_TRANSFORMATION } from "../../BeesFlowersProject.constants";
import StaticElements from "../StaticElements";

class Lavender extends StaticElements {
  protected name = "lavender";
  protected url = "/models/lavender.glb";
  protected count = LAVENDER_TRANSFORMATION.length;

  protected transformModels() {
    LAVENDER_TRANSFORMATION.forEach(({ position, rotationY, scale }, idx) => {
      const model = this.models[idx];
      if (!model) return;

      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
      model.scale.set(scale, scale, scale);
      model.updateMatrixWorld(true);
    });
  }
}

export default Lavender;
