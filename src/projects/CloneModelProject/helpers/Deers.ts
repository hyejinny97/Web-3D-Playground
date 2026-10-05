import * as THREE from "three";
import Animals from "./Animals";
import { DEERS_TRANSFORM } from "../CloneModelProject.constants";

class Deers extends Animals {
  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    super({ url: "/models/deer/scene.gltf", loadingManager, count: 3 });
  }

  protected transform() {
    DEERS_TRANSFORM.forEach(({ scale, position, rotationY }, idx) => {
      const model = this.root[idx];
      model.scale.set(scale.x, scale.y, scale.z);
      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
    });
  }

  protected animate() {
    this.animations.forEach((animation) =>
      animation.play({ name: "Idle", startAt: Math.random() }),
    );
  }
}

export default Deers;
