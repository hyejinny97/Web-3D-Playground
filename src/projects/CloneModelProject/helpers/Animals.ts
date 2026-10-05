import * as THREE from "three";
import type { AnimationHelperType } from "@/helpers/AnimationHelper";
import AnimationHelper from "@/helpers/AnimationHelper";
import {
  GLTFLoader,
  SkeletonUtils,
  type GLTF,
} from "three/examples/jsm/Addons.js";
import type { AnimalsType } from "../CloneModelProjec.types";

class Animals implements AnimalsType {
  private url: string;
  private loadingManager: THREE.LoadingManager;
  private count: number;
  private groupAnimation: boolean;
  protected animations: AnimationHelperType[] = [];
  private gltf!: GLTF;
  root: THREE.Object3D[] = [];

  constructor({
    url,
    count = 1,
    loadingManager,
    groupAnimation = false,
  }: {
    url: string;
    count?: number;
    loadingManager: THREE.LoadingManager;
    groupAnimation?: boolean;
  }) {
    this.url = url;
    this.count = count;
    this.loadingManager = loadingManager;
    this.groupAnimation = groupAnimation;
  }

  async init() {
    await this.loadModel();
    this.setupAnimations();
    this.transform();
    this.animate();
  }

  private async loadModel() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync(this.url);
    Array(this.count)
      .fill(0)
      .forEach(() => {
        const clonedModel = SkeletonUtils.clone(this.gltf.scene);
        this.root.push(clonedModel);
      });
  }

  private setupAnimations() {
    if (this.groupAnimation) {
      const group = new THREE.AnimationObjectGroup(...this.root);
      this.animations = [
        new AnimationHelper({ model: group, clips: this.gltf.animations }),
      ];
    } else {
      this.root.forEach((model) => {
        this.animations.push(
          new AnimationHelper({ model, clips: this.gltf.animations }),
        );
      });
    }
  }

  protected transform() {}

  protected animate() {}

  update(time: number) {
    this.animations.forEach((animation) => animation.update(time));
  }
}

export default Animals;
