import * as THREE from "three";

export type LoopType =
  | typeof THREE.LoopOnce
  | typeof THREE.LoopRepeat
  | typeof THREE.LoopPingPong;

export type FinishEvent = {
  action: THREE.AnimationAction;
  direction: number;
};

export interface AnimationHelperType {
  getAnimationNames: () => string[];
  play: ({
    name,
    startAt,
    duration,
    loop,
    onFinished,
  }: {
    name: string;
    startAt?: number; // 범위: 0 ~ 1
    duration?: number; // 단위: ms
    loop?: LoopType;
    onFinished?: (event: FinishEvent) => void;
  }) => void;
  update: (time: number) => void;
}
