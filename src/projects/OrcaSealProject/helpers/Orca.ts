import * as THREE from "three";
import * as YUKA from "yuka";
import AnimationHelper, {
  type AnimationHelperType,
} from "@/helpers/AnimationHelper";
import DynamicElement from "./DynamicElement";
import {
  ANIMATION_NAME,
  ORCA_ATTACK_DISTANCE,
  ORIGINAL_MODEL_NAME,
} from "../OrcaSealProject.constants";
import type { OrcaType } from "../OrcaSealProject.types";

class Orca extends DynamicElement implements OrcaType {
  protected url: string = "/models/orca/scene.gltf";
  protected maxSpeed: number = 5.5;
  protected maxForce: number = 30;
  private animation: AnimationHelperType | null = null;
  private target: YUKA.MovingEntity | null = null;

  async init() {
    await super.init();
    this.transformModel();
    this.setupAnimation();
    this.animation?.play({ name: ANIMATION_NAME.orca.swim });
  }

  private transformModel() {
    const originalModel = this.model?.getObjectByName(ORIGINAL_MODEL_NAME);
    if (!originalModel) return;

    const scale = 30;
    const box = new THREE.Box3().setFromObject(originalModel);
    const center = box.getCenter(new THREE.Vector3());

    originalModel.scale.setScalar(scale);
    originalModel.position.copy(center).multiplyScalar(-scale);
  }

  private setupAnimation() {
    if (this.model && this.clips) {
      this.animation = new AnimationHelper({
        model: this.model,
        clips: this.clips,
      });
    }
  }

  pursuit(target: YUKA.MovingEntity) {
    this.target = target;
    if (this.entity) {
      const behavior = new YUKA.PursuitBehavior(target);
      behavior.predictionFactor = 3;
      this.entity.steering.add(behavior);
    }
  }

  private attackWhenClose() {
    if (!this.entity || !this.target || !this.animation) return;

    const attackSq = ORCA_ATTACK_DISTANCE * ORCA_ATTACK_DISTANCE;
    const distanceSq = this.entity.position.squaredDistanceTo(
      this.target.position,
    );

    let animationToPlay: string;
    if (distanceSq <= attackSq) {
      animationToPlay = ANIMATION_NAME.orca.attack;
    } else {
      animationToPlay = ANIMATION_NAME.orca.swim;
    }

    if (animationToPlay !== this.animation.getPlayingAnimationName()) {
      this.animation.play({ name: animationToPlay });
    }
  }

  update(time: number) {
    this.animation?.update(time);
    this.attackWhenClose();
  }
}

export default Orca;
