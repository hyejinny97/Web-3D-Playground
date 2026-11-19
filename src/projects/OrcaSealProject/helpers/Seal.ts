import * as YUKA from "yuka";
import AnimationHelper, {
  type AnimationHelperType,
} from "@/helpers/AnimationHelper";
import DynamicElement from "./DynamicElement";
import {
  ANIMATION_NAME,
  ORIGINAL_MODEL_NAME,
} from "../OrcaSealProject.constants";
import type { SealType } from "../OrcaSealProject.types";

class Seal extends DynamicElement implements SealType {
  protected url: string = "/models/seal/scene.gltf";
  protected maxSpeed: number = 5;
  protected maxForce: number = 50;
  private animation: AnimationHelperType | null = null;

  async init() {
    await super.init();
    this.transformModel();
    this.setupAnimation();
    this.animation?.play({ name: ANIMATION_NAME.seal.swim, duration: 500 });
  }

  private transformModel() {
    const originalModel = this.model?.getObjectByName(ORIGINAL_MODEL_NAME);
    if (originalModel) {
      originalModel.scale.set(0.2, 0.2, 0.2);
      originalModel.rotateY(-Math.PI / 2);
    }
  }

  private setupAnimation() {
    if (this.model && this.clips) {
      this.animation = new AnimationHelper({
        model: this.model,
        clips: this.clips,
      });
    }
  }

  seek(target: YUKA.Vector3) {
    if (this.entity) {
      const behavior = new YUKA.SeekBehavior(target);
      this.entity.steering.add(behavior);
    }
  }

  update(time: number) {
    this.animation?.update(time);
  }
}

export default Seal;
