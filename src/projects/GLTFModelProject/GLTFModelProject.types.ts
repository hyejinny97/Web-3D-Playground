import * as THREE from "three";
import {
  CAR_GEAR_STATES,
  CAR_PEDAL_STATES,
  CAR_STEERING_WHEEL_STATES,
} from "./GLTFModelProject.constants";

export type CarGearStateType = (typeof CAR_GEAR_STATES)[number];

export type CarPedalStateType = (typeof CAR_PEDAL_STATES)[number];

export type CarSteeringWheelStateType =
  (typeof CAR_STEERING_WHEEL_STATES)[number];

export interface LoadManagerType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface StateInfo {
  enter?: () => void;
  update?: (delta: number) => void; // 단위: s
  exit?: () => void;
}

export interface FiniteStateMachineType<S extends Record<string, StateInfo>> {
  state: keyof S;
  translate: (newState: keyof S) => void;
  update: (time: number) => void;
}

export interface CarLampsType {
  on: boolean;
  lightOn: () => void;
  lightOff: () => void;
  toggleLight: () => void;
}

export interface CarGearType {
  update: (time: number) => void;
  parking: () => void;
  drive: () => void;
  reverse: () => void;
}

export interface CarPedalType {
  speed: number; // 단위: angle/s
  update: (time: number) => void;
  accelerate: () => void;
  brake: () => void;
  notPressed: () => void;
}

export interface CarSteeringWheelType {
  update: (time: number) => void;
  turnLeft: () => void;
  turnRight: () => void;
  notTurned: () => void;
}

export interface CarHelperType {
  root: THREE.Object3D;
  gear: CarGearType;
  pedal: CarPedalType;
  steeringWheel: CarSteeringWheelType;
  frontLamps: CarLampsType;
  init: () => void;
  update: (time: number) => void;
}
