import * as THREE from "three";
import {
  DIRECTION,
  MAX_ROTATION_PER_FRAME,
} from "../MoveCharacterProject.constants";
import type {
  CharacterDirectionType,
  DirectionType,
} from "../MoveCharacterProject.types";

class CharacterDirection implements CharacterDirectionType {
  private camera: THREE.Camera;
  private model: THREE.Object3D;
  private offset: number = DIRECTION.S; // 단위: radian

  constructor({
    camera,
    character,
  }: {
    camera: THREE.Camera;
    character: THREE.Object3D;
  }) {
    this.camera = camera;
    this.model = character;
  }

  private getRelativeYawToCamera(): number {
    return (
      Math.atan2(
        this.camera.position.x - this.model.position.x,
        this.camera.position.z - this.model.position.z,
      ) + Math.PI
    );
  }

  changeTo(direction: DirectionType) {
    this.offset = DIRECTION[direction];
  }

  update() {
    const targetQuaternion = new THREE.Quaternion();
    targetQuaternion.setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.getRelativeYawToCamera() + this.offset,
    );

    this.model.quaternion.rotateTowards(
      targetQuaternion,
      THREE.MathUtils.degToRad(MAX_ROTATION_PER_FRAME),
    );
  }
}

export default CharacterDirection;
