import * as THREE from "three";
import type { CannonType } from "../FireCannonProject.types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { GROUND_WIDTH } from "../FireCannonProject.constants";

class Cannon implements CannonType {
  private loadingManager: THREE.LoadingManager;
  model: THREE.Object3D | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.transform();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    const gltf = await loader.loadAsync("/models/cannon.glb");
    this.model = gltf.scene;
  }

  private transform() {
    if (this.model) {
      this.model.rotateY(-Math.PI / 2);
      this.model.position.set(-GROUND_WIDTH / 2 + 3, 0.25, 0);
    }
  }
}

export default Cannon;
