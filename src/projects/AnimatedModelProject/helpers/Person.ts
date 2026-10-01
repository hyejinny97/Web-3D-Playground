import * as THREE from "three";
import type {
  AnimationHelperType,
  LoadingOptionsType,
} from "../AnimatedModelProject.types";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import AnimationHelper from "./AnimationHelper";

class Person {
  private loadingOptions: LoadingOptionsType;
  declare private gltf: GLTF;
  declare root: THREE.Object3D;
  declare animation: AnimationHelperType;

  constructor({ loadingOptions }: { loadingOptions: LoadingOptionsType }) {
    this.loadingOptions = loadingOptions;
  }

  async init() {
    await this.loadModel();
    this.transform();
    this.animation = new AnimationHelper({ model: this.gltf });
  }

  private async loadModel() {
    const { onStart, onProgress, onLoad } = this.loadingOptions;
    const manager = new THREE.LoadingManager(
      onLoad,
      (_: string, loaded: number, total: number) => onProgress(loaded, total),
    );
    manager.onStart = onStart;

    const loader = new GLTFLoader(manager);
    this.gltf = await loader.loadAsync("/models/man_with_hat.glb");
    this.root = this.gltf.scene;
  }

  private transform() {
    this.root.scale.set(-0.015, 0.015, 0.015);
  }

  update(time: number) {
    this.animation?.update(time);
  }
}

export default Person;
