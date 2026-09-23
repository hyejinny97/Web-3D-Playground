import * as THREE from "three";
import type {
  CarSteeringWheelStateType,
  CarSteeringWheelType,
  FiniteStateMachineType,
  StateInfo,
} from "../GLTFModelProject.types";
import FiniteStateMachine from "./FiniteStateMachine";
import {
  CAR_PART,
  STEERING_WHEEL_MAX_TURN,
  STEERING_WHEEL_TURNING_SPEED,
} from "../GLTFModelProject.constants";

class CarSteeringWheel implements CarSteeringWheelType {
  private stateMachine: FiniteStateMachineType<
    Record<CarSteeringWheelStateType, StateInfo>
  >;

  constructor({
    steeringWheel,
    tireWheels,
  }: {
    steeringWheel: THREE.Object3D;
    tireWheels: THREE.Object3D[];
  }) {
    const frontTireWheelRoots = tireWheels
      .filter(
        (wheel) =>
          wheel.name === CAR_PART.frontLeftTireWheel ||
          wheel.name === CAR_PART.frontRightTireWheel,
      )
      .map((wheel) => wheel.parent)
      .filter((wheelRoot) => !!wheelRoot);

    this.stateMachine = new FiniteStateMachine({
      statesInfo: {
        idle: {
          update: () => {},
        },
        left: {
          update: (delta: number) => {
            steeringWheel.rotation.z = Math.min(
              steeringWheel.rotation.z +
                THREE.MathUtils.degToRad(STEERING_WHEEL_TURNING_SPEED * delta),
              THREE.MathUtils.degToRad(STEERING_WHEEL_MAX_TURN),
            );
            frontTireWheelRoots.forEach((wheelRoot) => {
              wheelRoot.rotation.y = Math.min(
                wheelRoot.rotation.y +
                  THREE.MathUtils.degToRad(
                    STEERING_WHEEL_TURNING_SPEED * delta,
                  ),
                THREE.MathUtils.degToRad(STEERING_WHEEL_MAX_TURN),
              );
            });
          },
        },
        right: {
          update: (delta: number) => {
            steeringWheel.rotation.z = Math.max(
              steeringWheel.rotation.z -
                THREE.MathUtils.degToRad(STEERING_WHEEL_TURNING_SPEED * delta),
              THREE.MathUtils.degToRad(-STEERING_WHEEL_MAX_TURN),
            );
            frontTireWheelRoots.forEach((wheelRoot) => {
              wheelRoot.rotation.y = Math.max(
                wheelRoot.rotation.y -
                  THREE.MathUtils.degToRad(
                    STEERING_WHEEL_TURNING_SPEED * delta,
                  ),
                THREE.MathUtils.degToRad(-STEERING_WHEEL_MAX_TURN),
              );
            });
          },
        },
      },
      initialState: "idle",
    });
  }

  update(time: number) {
    this.stateMachine.update(time);
  }

  turnLeft() {
    if (this.stateMachine.state === "left") return;
    this.stateMachine.translate("left");
  }

  turnRight() {
    if (this.stateMachine.state === "right") return;
    this.stateMachine.translate("right");
  }

  notTurned() {
    if (this.stateMachine.state === "idle") return;
    this.stateMachine.translate("idle");
  }
}

export default CarSteeringWheel;
