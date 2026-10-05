import * as THREE from "three";
import type { AnimationHelperType } from "@/helpers/AnimationHelper";
import AnimationHelper from "@/helpers/AnimationHelper";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import type { AnimalType } from "../CloneModelProjec.types";

class Animal implements AnimalType {
  private url: string;
  private loadingManager: THREE.LoadingManager;
  private animation!: AnimationHelperType;
  private gltf!: GLTF;
  root!: THREE.Object3D;

  constructor({
    url,
    loadingManager,
  }: {
    url: string;
    loadingManager: THREE.LoadingManager;
  }) {
    this.url = url;
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadModel();
    this.transform();
    this.animation = new AnimationHelper({
      model: this.gltf.scene,
      clips: this.gltf.animations,
    });
    this.animation.play({ name: "Idle" });
  }

  private async loadModel() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync(this.url);
    this.root = this.gltf.scene;
  }

  protected transform() {}

  update(time: number) {
    this.animation.update(time);
  }
}

export default Animal;
