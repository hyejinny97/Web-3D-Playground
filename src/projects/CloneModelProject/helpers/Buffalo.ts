import * as THREE from "three";
import Animal from "./Animal";

class Buffalo extends Animal {
  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    super({ url: "/models/buffalo/scene.gltf", loadingManager });
  }

  protected transform() {
    this.root.scale.set(0.4, 0.4, 0.4);
  }
}

export default Buffalo;
