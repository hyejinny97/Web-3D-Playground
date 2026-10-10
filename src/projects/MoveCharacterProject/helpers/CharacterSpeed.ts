import * as THREE from "three";
import type {
  CharacterSpeedType,
  SpeedType,
} from "../MoveCharacterProject.types";
import {
  DIRECTION,
  JUMP_ACCELERATION,
  SPEED,
} from "../MoveCharacterProject.constants";
import type CharacterDirection from "./CharacterDirection";

class CharacterSpeed implements CharacterSpeedType {
  private camera: THREE.Camera;
  private model: THREE.Object3D;
  private direction: CharacterDirection;
  private moveDirection = new THREE.Vector3();
  private then: number = 0; // 단위: s
  private jumped: boolean = false;
  private prevSpeed: number = 0;
  value: SpeedType = "IDLE";

  constructor({
    camera,
    character,
    direction,
  }: {
    camera: THREE.Camera;
    character: THREE.Object3D;
    direction: CharacterDirection;
  }) {
    this.camera = camera;
    this.model = character;
    this.direction = direction;
  }

  changeTo(speed: SpeedType) {
    this.value = speed;
  }

  jumpStart() {
    this.jumped = true;
  }

  jumpEnd() {
    this.jumped = false;
  }

  update(time: number) {
    time *= 0.001; // 단위: s
    const delta = time - this.then;
    this.then = time;

    const offset = DIRECTION[this.direction.value];
    let speed: number = SPEED[this.value];
    if (this.jumped) {
      speed = Math.max(0, this.prevSpeed + JUMP_ACCELERATION * delta);
    }
    this.prevSpeed = speed;

    this.camera.getWorldDirection(this.moveDirection);
    this.moveDirection.y = 0;
    this.moveDirection.normalize();
    this.moveDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), offset);

    this.model.position.addScaledVector(this.moveDirection, speed * delta);
  }
}

export default CharacterSpeed;
