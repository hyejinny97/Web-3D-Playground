import * as THREE from "three";
import * as CANNON from "cannon-es";
import {
  BOARD_GAP,
  BOARD_WIDTH,
  BOARDS_CNT,
  GROUND_WIDTH,
  MOVEMENT_SPEED,
} from "../CrossBridgeProject.constants";
import type { MovementType } from "../CrossBridgeProject.types";
import type { GLTF } from "three/examples/jsm/Addons.js";
import AnimationHelper, {
  type AnimationHelperType,
} from "@/helpers/AnimationHelper";

class Movement implements MovementType {
  startPosition!: THREE.Vector3;
  private endPosition!: THREE.Vector3;
  private body: CANNON.Body;
  private gltf: GLTF;
  private animation!: AnimationHelperType;

  constructor({ body, gltf }: { body: CANNON.Body; gltf: GLTF }) {
    this.body = body;
    this.gltf = gltf;
    this.setupStartEndPosition();
    this.setupAnimation();
  }

  private setupStartEndPosition() {
    const x =
      (BOARDS_CNT * (BOARD_WIDTH + BOARD_GAP)) / 2 -
      BOARD_GAP +
      GROUND_WIDTH / 2;

    let y = 0;
    const shape = this.body.shapes[0];
    if (shape instanceof CANNON.Box) {
      y = shape.halfExtents.y + 0.5;
    } else if (shape instanceof CANNON.Sphere) {
      y = shape.radius + 0.5;
    }

    this.startPosition = new THREE.Vector3(-x, y, 0);
    this.endPosition = new THREE.Vector3(x, y, 0);
  }

  private setupAnimation() {
    this.animation = new AnimationHelper({
      model: this.gltf.scene,
      clips: this.gltf.animations,
    });
    this.animation.play({ name: "Walk" });
  }

  update(time: number, onCrossEnd: () => void) {
    this.animation?.update(time);

    if (this.body.position.x > this.endPosition.x) {
      onCrossEnd();
      return;
    }
    this.body.velocity.x = MOVEMENT_SPEED;
    this.body.velocity.z = 0;
    this.body.angularFactor.set(0, 0, 0);
  }
}

export default Movement;
