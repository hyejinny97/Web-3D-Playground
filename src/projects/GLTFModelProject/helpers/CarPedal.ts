import {
  ACCEL_ACCELERATION,
  BASE_SPEED,
  BRAKE_ACCELERATION,
  MAX_SPEED,
  MIN_SPEED,
  RECOVERY_ACCELERATION,
} from "../GLTFModelProject.constants";
import type {
  CarPedalStateType,
  CarPedalType,
  FiniteStateMachineType,
  StateInfo,
} from "../GLTFModelProject.types";
import type CarLamps from "./CarLamps";
import FiniteStateMachine from "./FiniteStateMachine";

class CarPedal implements CarPedalType {
  private stateMachine: FiniteStateMachineType<
    Record<CarPedalStateType, StateInfo>
  >;
  private _speed: number = BASE_SPEED;

  constructor({ backLamps }: { backLamps: CarLamps }) {
    this.stateMachine = new FiniteStateMachine({
      statesInfo: {
        idle: {
          update: (delta: number) => {
            if (this._speed > BASE_SPEED) {
              this._speed -= Math.min(
                RECOVERY_ACCELERATION * delta,
                this._speed - BASE_SPEED,
              );
            }
            if (this._speed < BASE_SPEED) {
              this._speed += Math.min(
                RECOVERY_ACCELERATION * delta,
                BASE_SPEED - this._speed,
              );
            }
          },
        },
        accelerate: {
          update: (delta: number) => {
            this._speed = Math.min(
              this._speed + ACCEL_ACCELERATION * delta,
              MAX_SPEED,
            );
          },
        },
        brake: {
          enter: () => {
            backLamps.lightOn();
          },
          update: (delta: number) => {
            this._speed = Math.max(
              this._speed - BRAKE_ACCELERATION * delta,
              MIN_SPEED,
            );
          },
          exit: () => {
            backLamps.lightOff();
          },
        },
      },
      initialState: "idle",
    });
  }

  get speed(): number {
    return this._speed;
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
