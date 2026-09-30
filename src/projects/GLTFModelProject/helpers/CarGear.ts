import * as THREE from "three";
import type { CarGearStateType, CarGearType } from "../GLTFModelProject.types";
import type CarPedal from "./CarPedal";
import type {
  FiniteStateMachineType,
  StateInfo,
} from "@/helpers/FiniteStateMachine";
import FiniteStateMachine from "@/helpers/FiniteStateMachine";

class CarGear implements CarGearType {
  private stateMachine: FiniteStateMachineType<
    Record<CarGearStateType, StateInfo>
  >;
  private _state: CarGearStateType = "parking";

  constructor({
    pedal,
    tireWheels,
  }: {
    pedal: CarPedal;
    tireWheels: THREE.Object3D[];
  }) {
    this.stateMachine = new FiniteStateMachine({
      statesInfo: {
        parking: {
          update: () => {
            this._state = "parking";
          },
        },
        drive: {
          update: (delta: number) => {
            tireWheels.forEach((wheel) => {
              wheel.rotation.x -= THREE.MathUtils.degToRad(pedal.speed * delta);
            });
            this._state = "drive";
          },
        },
        reverse: {
          update: (delta: number) => {
            tireWheels.forEach((wheel) => {
              wheel.rotation.x += THREE.MathUtils.degToRad(pedal.speed * delta);
            });
            this._state = "reverse";
          },
        },
      },
      initialState: "parking",
    });
  }

  get state(): CarGearStateType {
    return this._state;
  }

  update(time: number) {
    this.stateMachine.update(time);
  }

  parking() {
    if (this.stateMachine.state === "parking") return;
    this.stateMachine.translate("parking");
  }

  drive() {
    if (this.stateMachine.state === "drive") return;
    this.stateMachine.translate("drive");
  }

  reverse() {
    if (this.stateMachine.state === "reverse") return;
    this.stateMachine.translate("reverse");
  }
}

export default CarGear;
