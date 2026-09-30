import type {
  FiniteStateMachineType,
  StateInfo,
} from "@/helpers/FiniteStateMachine";
import FiniteStateMachine from "@/helpers/FiniteStateMachine";
import type {
  CarPedalStateType,
  CarPedalType,
} from "../FollowCurveProject.types";
import {
  ACCEL_ACCELERATION,
  BASE_SPEED,
  BRAKE_ACCELERATION,
  MAX_SPEED,
  MIN_SPEED,
  RECOVERY_ACCELERATION,
} from "../FollowCurveProject.constants";

class CarPedal implements CarPedalType {
  private stateMachine: FiniteStateMachineType<
    Record<CarPedalStateType, StateInfo>
  >;
  private _rps: number = BASE_SPEED;

  constructor() {
    this.stateMachine = new FiniteStateMachine({
      statesInfo: {
        idle: {
          update: (delta: number) => {
            if (this._rps > BASE_SPEED) {
              this._rps -= Math.min(
                RECOVERY_ACCELERATION * delta,
                this._rps - BASE_SPEED,
              );
            }
            if (this._rps < BASE_SPEED) {
              this._rps += Math.min(
                RECOVERY_ACCELERATION * delta,
                BASE_SPEED - this._rps,
              );
            }
          },
        },
        accelerate: {
          update: (delta: number) => {
            this._rps = Math.min(
              this._rps + ACCEL_ACCELERATION * delta,
              MAX_SPEED,
            );
          },
        },
        brake: {
          update: (delta: number) => {
            this._rps = Math.max(
              this._rps - BRAKE_ACCELERATION * delta,
              MIN_SPEED,
            );
          },
        },
      },
      initialState: "idle",
    });
  }

  get rps(): number {
    return this._rps;
  }

  update(time: number) {
    this.stateMachine.update(time);
  }

  accelerate() {
    if (this.stateMachine.state === "accelerate") return;
    this.stateMachine.translate("accelerate");
  }

  brake() {
    if (this.stateMachine.state === "brake") return;
    this.stateMachine.translate("brake");
  }

  notPressed() {
    if (this.stateMachine.state === "idle") return;
    this.stateMachine.translate("idle");
  }
}

export default CarPedal;
