import * as THREE from "three";
import Animal from "./Animal";

class Buffalo extends Animal {
  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    super({ url: "/models/buffalo/scene.gltf", loadingManager });
  }

  protected transform() {
    this.root.scale.set(0.4, 0.4, 0.4);
    this.root.position.set(-0.6, 0, 0);
    this.root.rotateY(-Math.PI / 4);
  }

  protected animate() {
    this.animation.play({ name: "Idle" });
  }
}

export default Buffalo;
