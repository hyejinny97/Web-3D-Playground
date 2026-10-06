import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import Ground from "./helpers/Ground";

@RenderLoop()
class MoveCharacterProject extends BaseProject {
  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      this.camera.position.set(0, 2, 5);
    }
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 2);
    this.scene?.add(ambientLight);
  }

  setupModel() {
    const ground = new Ground();
    this.scene?.add(ground.root);
  }
}

export default MoveCharacterProject;
