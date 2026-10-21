import * as THREE from "three";
import type {
  MuzzleDirectionStateType,
  MuzzleType,
} from "../FireCannonProject.types";
import {
  CANNON_MUZZLE_NAME,
  MUZZLE_MAX_ROTATION,
  MUZZLE_MIN_ROTATION,
  MUZZLE_SPEED,
} from "../FireCannonProject.constants";
import type {
  FiniteStateMachineType,
  StateInfo,
} from "@/helpers/FiniteStateMachine";
import FiniteStateMachine from "@/helpers/FiniteStateMachine";

class Muzzle implements MuzzleType {
  private cannonModel: THREE.Object3D;
  private stateMachine!: FiniteStateMachineType<
    Record<MuzzleDirectionStateType, StateInfo>
  >;
  model!: THREE.Object3D;

  constructor({ cannonModel }: { cannonModel: THREE.Object3D }) {
    this.cannonModel = cannonModel;
    this.setupModel();
    this.setupStateMachine();
  }

  private setupModel() {
    const muzzle = this.cannonModel.getObjectByName(CANNON_MUZZLE_NAME);
    if (!muzzle) {
      throw new Error(
        `'${CANNON_MUZZLE_NAME}' 이름의 객체를 찾을 수 없습니다.`,
      );
    }
    this.model = muzzle;
  }

  private setupStateMachine() {
    this.stateMachine = new FiniteStateMachine({
      statesInfo: {
        idle: {
          update: () => {},
        },
        up: {
          update: (delta: number) => {
            this.model.rotation.x = Math.min(
              this.model.rotation.x +
                THREE.MathUtils.degToRad(MUZZLE_SPEED) * delta,
              MUZZLE_MAX_ROTATION,
            );
          },
        },
        down: {
          update: (delta: number) => {
            this.model.rotation.x = Math.max(
              this.model.rotation.x -
                THREE.MathUtils.degToRad(MUZZLE_SPEED) * delta,
              MUZZLE_MIN_ROTATION,
            );
          },
        },
      },
      initialState: "idle",
    });
  }

  update(time: number) {
    this.stateMachine.update(time);
  }

  toIdle() {
    if (this.stateMachine.state === "idle") return;
    this.stateMachine.translate("idle");
  }

  toUp() {
    if (this.stateMachine.state === "up") return;
    this.stateMachine.translate("up");
  }

  toDown() {
    if (this.stateMachine.state === "down") return;
    this.stateMachine.translate("down");
  }
}

export default Muzzle;
