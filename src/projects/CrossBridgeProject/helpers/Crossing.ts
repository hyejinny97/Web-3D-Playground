import * as THREE from "three";
import * as CANNON from "cannon-es";
import {
  BOARD_GAP,
  BOARD_WIDTH,
  BOARDS_CNT,
  GROUND_WIDTH,
} from "../CrossBridgeProject.constants";
import type { CrossingType } from "../CrossBridgeProject.types";
import type { GLTF } from "three/examples/jsm/Addons.js";
import AnimationHelper, {
  type AnimationHelperType,
} from "@/helpers/AnimationHelper";

class Crossing implements CrossingType {
  private body: CANNON.Body;
  private gltf: GLTF;
  private speed: number;
  private startPosition!: THREE.Vector3;
  private endPosition!: THREE.Vector3;
  private animation!: AnimationHelperType;
  private isCrossing: boolean = false;

  constructor({
    body,
    gltf,
    speed,
  }: {
    body: CANNON.Body;
    gltf: GLTF;
    speed: number;
  }) {
    this.body = body;
    this.gltf = gltf;
    this.speed = speed;
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
  }

  init() {
    const { x, y, z } = this.startPosition;
    this.body.position.set(x, y, z);
  }

  start() {
    this.isCrossing = true;
    this.animation.play({ name: "Walk" });
    this.init();
  }

  private end() {
    this.isCrossing = false;
    this.animation.stop();
  }

  update(time: number, onCrossEnd: () => void) {
    if (this.body.position.x > this.endPosition.x) {
      this.end();
      onCrossEnd();
    }
    if (this.isCrossing) {
      this.animation?.update(time);
      this.body.velocity.x = this.speed;
      this.body.velocity.z = 0;
      this.body.angularFactor.set(0, 0, 0);
    }
  }
}

export default Crossing;
