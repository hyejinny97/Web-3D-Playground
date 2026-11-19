import AnimationHelper, {
  type AnimationHelperType,
} from "@/helpers/AnimationHelper";
import DynamicElement from "./DynamicElement";
import { ANIMATION_NAME } from "../OrcaSealProject.constants";
import type { SealType } from "../OrcaSealProject.types";

class Seal extends DynamicElement implements SealType {
  protected url: string = "/models/seal/scene.gltf";
  protected maxSpeed: number = 3;
  protected maxForce: number = 50;
  private animation: AnimationHelperType | null = null;

  async init() {
    await super.init();
    this.transformEntity();
    this.setupAnimation();
    this.animation?.play({ name: ANIMATION_NAME.seal.swim, duration: 500 });
  }

  private transformEntity() {
    if (this.entity) {
      this.entity.scale.set(0.2, 0.2, 0.2);
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

  update(time: number) {
    this.animation?.update(time);
  }
}

export default Seal;
