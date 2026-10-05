import * as THREE from "three";
import Animals from "./Animals";
import { RABBITS_TRANSFORM } from "../CloneModelProject.constants";

class Rabbits extends Animals {
  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    super({
      url: "/models/rabit/scene.gltf",
      loadingManager,
      count: 5,
      groupAnimation: true,
    });
  }

  protected transform() {
    RABBITS_TRANSFORM.forEach(({ scale, position, rotationY }, idx) => {
      const model = this.root[idx];
      model.scale.set(scale.x, scale.y, scale.z);
      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
    });
  }

  protected animate() {
    this.animations[0].play({ name: "Idle" });
  }
}

export default Rabbits;
