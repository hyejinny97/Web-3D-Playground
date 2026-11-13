import * as THREE from "three";
import { GLTFLoader, SkeletonUtils } from "three/examples/jsm/Addons.js";
import type { ElementsType } from "../BeesFlowersProject.types";

abstract class Elements implements ElementsType {
  protected abstract url: string;
  protected abstract count: number;
  private loadingManager: THREE.LoadingManager;
  models: THREE.Object3D[] = [];

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.transform();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    const gltf = await loader.loadAsync(this.url);
    Array(this.count)
      .fill(0)
      .forEach(() => {
        const clonedModel = SkeletonUtils.clone(gltf.scene);
        this.models.push(clonedModel);
      });
  }

  protected abstract transform(): void;
}

export default Elements;
