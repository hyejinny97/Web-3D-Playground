import * as THREE from "three";
import type {
  DIRECTION,
  DIRECTION_KEYS,
  SPEED,
} from "./MoveCharacterProject.constants";

export type DirectionType = keyof typeof DIRECTION;

export type DirectionKeyType = (typeof DIRECTION_KEYS)[number];

export type SpeedType = keyof typeof SPEED;

export interface LoadingOptionsType {
  onStart: () => void;
  onProgress: (count: number, total: number) => void;
  onLoad: () => void;
}

export interface InfiniteGroundType {
  root: THREE.Object3D;
  update: () => void;
}

export interface CharacterDirectionType {
  value: DirectionType;
  changeTo: (direction: DirectionType) => void;
  update: () => void;
}

export interface CharacterSpeedType {
  value: SpeedType;
  changeTo: (speed: SpeedType) => void;
  jumpStart: () => void;
  jumpEnd: () => void;
  update: (time: number) => void;
}

export interface CharacterType {
  root: THREE.Object3D;
  direction: CharacterDirectionType;
  init: () => void;
  idle: () => void;
  walk: () => void;
  run: () => void;
  jump: () => void;
  update(time: number): void;
}
