import * as THREE from "three";
import type {
  CharacterSpeedType,
  SpeedType,
} from "../MoveCharacterProject.types";
import { SPEED } from "../MoveCharacterProject.constants";

class CharacterSpeed implements CharacterSpeedType {
  private model: THREE.Object3D;
  private modelDirection = new THREE.Vector3();
  private speed: number = SPEED.IDLE; // 단위: world unit/s
  private then: number = 0; // 단위: s

  constructor({ character }: { character: THREE.Object3D }) {
    this.model = character;
  }

  changeTo(speed: SpeedType) {
    this.speed = SPEED[speed];
  }

  update(time: number) {
    time *= 0.001; // 단위: s
    const delta = time - this.then;
    this.then = time;

    this.model.getWorldDirection(this.modelDirection);
    this.modelDirection.y = 0;
    this.modelDirection.normalize();

    this.model.position.addScaledVector(
      this.modelDirection,
      this.speed * delta,
    );
  }
}

export default CharacterSpeed;
