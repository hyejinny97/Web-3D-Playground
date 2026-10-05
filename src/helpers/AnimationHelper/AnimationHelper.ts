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

  play(name: string) {
    const clip = THREE.AnimationClip.findByName(this.clips, name);
    if (!clip) {
      console.warn(`'${name}' 이름의 animation은 없습니다.`);
      return;
    }

    const action = this.mixer.clipAction(clip);
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
