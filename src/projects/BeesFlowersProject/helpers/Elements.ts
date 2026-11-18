import * as THREE from "three";
import {
  GLTFLoader,
  SkeletonUtils,
  type GLTF,
} from "three/examples/jsm/Addons.js";
import type { ElementsType } from "../BeesFlowersProject.types";

abstract class Elements implements ElementsType {
  protected abstract name: string;
  protected abstract url: string;
  protected abstract count: number;
  private loadingManager: THREE.LoadingManager;
  gltf: GLTF | null = null;
  models: THREE.Object3D[] = [];

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.transformGLTF();
    this.setupModels();
    this.transformModels();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync(this.url);
  }

  protected transformGLTF() {}

  private setupModels() {
    if (this.gltf) {
      Array(this.count)
        .fill(0)
        .forEach(() => {
          const clonedModel = SkeletonUtils.clone(this.gltf!.scene);
          this.models.push(clonedModel);
        });
    }
  }

  protected abstract transformModels(): void;
}

export default Elements;
