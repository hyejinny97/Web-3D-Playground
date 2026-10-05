import * as THREE from "three";
import type { AnimationHelperType } from "./AnimationHelper.types";

class AnimationHelper implements AnimationHelperType {
  private mixer: THREE.AnimationMixer;
  private clips: THREE.AnimationClip[];
  private playingAction: THREE.AnimationAction | null = null;
  private timer = new THREE.Timer();

  constructor({
    model,
    clips,
  }: {
    model: THREE.Object3D;
    clips: THREE.AnimationClip[];
  }) {
    this.mixer = new THREE.AnimationMixer(model);
    this.clips = clips;
  }

  getAnimationNames(): string[] {
    return this.clips.map((clip) => clip.name);
  }

  play({ name, startAt = 0 }: { name: string; startAt?: number }) {
    const clip = THREE.AnimationClip.findByName(this.clips, name);
    if (!clip) {
      console.error(`'${name}' 이름의 animation은 없습니다.`);
      return;
    }
    if (startAt < 0 || startAt > 1) {
      console.error(`startAt 값은 0 이상 1 이하 여야 합니다.`);
    }

    const safeStartAt = Math.max(0, Math.min(1, startAt));
    const action = this.mixer.clipAction(clip);
    action.time = clip.duration * safeStartAt;

    if (this.playingAction) this.playingAction.fadeOut(0.5);
    action.reset().fadeIn(0.5).play();
    this.playingAction = action;
  }

  update(time: number) {
    this.timer.update(time);
    const delta = this.timer.getDelta();
    if (this.mixer) this.mixer.update(delta);
  }
}

export default AnimationHelper;
