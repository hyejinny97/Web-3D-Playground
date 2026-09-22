import * as THREE from "three";
import type {
  CarGearStateType,
  CarGearType,
  FiniteStateMachineType,
  StateInfo,
} from "../GLTFModelProject.types";
import FiniteStateMachine from "./FiniteStateMachine";
import type CarPedal from "./CarPedal";

class CarGear implements CarGearType {
  private stateMachine: FiniteStateMachineType<
    Record<CarGearStateType, StateInfo>
  >;

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
            tireWheels.forEach((wheel) => wheel.rotation.set(0, 0, 0));
          },
        },
        drive: {
          update: (delta: number) => {
            tireWheels.forEach((wheel) => {
              wheel.rotation.x -= THREE.MathUtils.degToRad(pedal.speed * delta);
            });
          },
        },
        reverse: {
          update: (delta: number) => {
            tireWheels.forEach((wheel) => {
              wheel.rotation.x += THREE.MathUtils.degToRad(pedal.speed * delta);
            });
          },
        },
      },
      initialState: "parking",
    });
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
