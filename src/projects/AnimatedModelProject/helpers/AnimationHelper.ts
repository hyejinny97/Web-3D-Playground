import * as THREE from "three";
import type { AnimationHelperType } from "../AnimatedModelProject.types";
import type { GLTF } from "three/examples/jsm/Addons.js";

class AnimationHelper implements AnimationHelperType {
  private mixer: THREE.AnimationMixer;
  private animations: THREE.AnimationClip[];
  private playingAction: THREE.AnimationAction | null = null;
  private timer = new THREE.Timer();

  constructor({ model }: { model: GLTF }) {
    this.mixer = new THREE.AnimationMixer(model.scene);
    this.animations = model.animations;
  }

  getAnimationNames(): string[] {
    return this.animations.map((animation) => animation.name);
  }

  play(name: string) {
    const clip = THREE.AnimationClip.findByName(this.animations, name);
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
