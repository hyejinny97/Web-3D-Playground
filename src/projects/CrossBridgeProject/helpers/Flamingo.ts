import * as THREE from "three";
import * as CANNON from "cannon-es";
import Character from "./Character";
import {
  BODY_MATERIALS,
  FLAMINGO_SPEED,
} from "../CrossBridgeProject.constants";

class Flamingo extends Character {
  constructor({
    loadingManager,
    initialVisibility,
  }: {
    loadingManager: THREE.LoadingManager;
    initialVisibility?: boolean;
  }) {
    super({
      url: "models/flamingo/scene.gltf",
      loadingManager,
      crossingSpeed: FLAMINGO_SPEED,
      initialVisibility,
    });
  }

  protected scaleModel() {
    if (this.model) {
      this.model.scale.set(5, 5, 5);
      this.model.updateMatrixWorld();
    }
  }

  protected setupBody() {
    const box = new THREE.Box3().setFromObject(this.model!);
    const size = box.getSize(new THREE.Vector3());

    const shape = new CANNON.Sphere(size.y / 2);
    const material = new CANNON.Material(BODY_MATERIALS.character);
    this.body = new CANNON.Body({
      mass: 20,
      shape,
      material,
      linearDamping: 0,
    });
  }

  protected transform() {
    if (this.body) {
      this.body.quaternion.setFromAxisAngle(
        new CANNON.Vec3(0, 1, 0),
        Math.PI / 2,
      );
    }
  }
}

export default Flamingo;
