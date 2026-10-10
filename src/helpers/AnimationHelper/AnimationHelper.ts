import * as THREE from "three";
import type {
  AnimationHelperType,
  FinishEvent,
  LoopType,
} from "./AnimationHelper.types";

class AnimationHelper implements AnimationHelperType {
  private mixer: THREE.AnimationMixer;
  private clips: THREE.AnimationClip[];
  private playingAction: THREE.AnimationAction | null = null;
  private then: number = 0;
  private handleFinished: (event: FinishEvent) => void;
  private finishedEventHandlers: {
    name: string;
    callback: (event: FinishEvent) => void;
  }[] = [];

  constructor({
    model,
    clips,
  }: {
    model: THREE.Object3D | THREE.AnimationObjectGroup;
    clips: THREE.AnimationClip[];
  }) {
    this.mixer = new THREE.AnimationMixer(model);
    this.clips = clips;

    this.handleFinished = (event: FinishEvent) => {
      this.finishedEventHandlers = this.finishedEventHandlers
        .map((handler) => {
          const { name, callback } = handler;
          if (event.action.getClip().name === name) {
            callback(event);
            return null;
          }
          return handler;
        })
        .filter((handler) => !!handler);
    };
    this.mixer.addEventListener("finished", this.handleFinished);
  }

  getAnimationNames(): string[] {
    return this.clips.map((clip) => clip.name);
  }

  play({
    name,
    startAt = 0,
    duration,
    loop = THREE.LoopRepeat,
    onFinished,
  }: {
    name: string;
    startAt?: number;
    duration?: number;
    loop?: LoopType;
    onFinished?: (event: FinishEvent) => void;
  }) {
    const clip = THREE.AnimationClip.findByName(this.clips, name);
    if (!clip) {
      console.error(`'${name}' 이름의 animation은 없습니다.`);
      return;
    }
    if (startAt < 0 || startAt > 1) {
      console.error(`startAt 값은 0 이상 1 이하 여야 합니다.`);
    }

    if (
      onFinished &&
      this.finishedEventHandlers.every((handler) => handler.name !== name)
    ) {
      this.finishedEventHandlers.push({ name, callback: onFinished });
    }

    const safeStartAt = Math.max(0, Math.min(1, startAt));
    const action = this.mixer.clipAction(clip);

    if (this.playingAction) this.playingAction.fadeOut(0.5);
    action.reset().fadeIn(0.5);
    action.time = clip.duration * safeStartAt;
    action.loop = loop;
    if (duration) action.setDuration(duration * 0.001);
    action.play();
    this.playingAction = action;
  }

  update(time: number) {
    time *= 0.001; // 단위: s
    const delta = time - this.then;
    this.then = time;

    if (this.mixer) this.mixer.update(delta);
  }

  dispose() {
    this.mixer.removeEventListener("finished", this.handleFinished);
  }
}

export default AnimationHelper;
