import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";

@RenderLoop()
class BasicProject extends BaseProject {
  update(time: number) {
    time *= 0.001;

    if (this.mesh) {
      this.mesh.rotation.x = time;
      this.mesh.rotation.y = time;
    }
  }
}

export default BasicProject;
