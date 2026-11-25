import * as THREE from "three";
import * as YUKA from "yuka";
import type { BuffaloType } from "../LionBuffalosProject.types";
import {
  GLTFLoader,
  SkeletonUtils,
  type GLTF,
} from "three/examples/jsm/Addons.js";
import {
  ANIMATION_NAME,
  GROUND_SIZE,
  ORIGINAL_MODEL_NAME,
} from "../LionBuffalosProject.constants";
import AnimationHelper from "@/helpers/AnimationHelper";

class Buffalo implements BuffaloType {
  private loadingManager: THREE.LoadingManager;
  private count!: number;
  private gltf: GLTF | null = null;
  private animations: AnimationHelper[] = [];
  models: THREE.Object3D[] = [];
  entities: YUKA.Vehicle[] = [];

  constructor({
    loadingManager,
    count,
  }: {
    loadingManager: THREE.LoadingManager;
    count: number;
  }) {
    this.loadingManager = loadingManager;
    this.count = count;
  }

  async init() {
    await this.loadGLTF();
    this.setupModels();
    this.transformModels();
    this.setupAnimations();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/buffalo/scene.gltf");

    const SIZE = 0.2;
    this.gltf.scene.scale.set(SIZE, SIZE, SIZE);
  }

  private setupModels() {
    if (!this.gltf) return;

    Array(this.count)
      .fill(0)
      .forEach(() => {
        const model = SkeletonUtils.clone(this.gltf!.scene);
        model.name = ORIGINAL_MODEL_NAME;

        const group = new THREE.Group();
        group.add(model);
        this.models.push(group);
      });
  }

  private transformModels() {
    this.models.forEach((model) => {
      const originalModel = model.getObjectByName(ORIGINAL_MODEL_NAME);
      if (!originalModel) return;

      originalModel.position.set(
        this.getRandomNm({
          min: (-GROUND_SIZE.width * 0.8) / 2,
          max: (GROUND_SIZE.width * 0.8) / 2,
        }),
        0,
        this.getRandomNm({
          min: (-GROUND_SIZE.height * 0.8) / 2,
          max: (GROUND_SIZE.height * 0.8) / 2,
        }),
      );
      originalModel.rotateY(
        this.getRandomNm({ min: -2 * Math.PI, max: 2 * Math.PI }),
      );
    });
  }

  private getRandomNm(props?: { min?: number; max?: number }) {
    const { min = 0, max = 1 } = props || {};
    return min + Math.random() * (max - min);
  }

  private setupAnimations() {
    if (!this.gltf) return;
    this.models.forEach((model) => {
      const animation = new AnimationHelper({
        model,
        clips: this.gltf!.animations,
      });
      animation.play({
        name: ANIMATION_NAME.buffalo.idle,
        startAt: this.getRandomNm(),
      });
      this.animations.push(animation);
    });
  }

  update(time: number) {
    this.animations.forEach((animation) => {
      animation.update(time);
    });
  }
}

export default Buffalo;
