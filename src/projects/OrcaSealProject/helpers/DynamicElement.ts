import * as THREE from "three";
import * as YUKA from "yuka";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import type { DynamicElementType } from "../OrcaSealProject.types";
import { ORIGINAL_MODEL_NAME } from "../OrcaSealProject.constants";

abstract class DynamicElement implements DynamicElementType {
  private loadingManager: THREE.LoadingManager;
  protected abstract url: string;
  protected maxSpeed: number = 1;
  protected maxForce: number = 100;
  protected clips: THREE.AnimationClip[] | null = null;
  model: THREE.Object3D | null = null;
  entity: YUKA.Vehicle | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.setupEntity();
    this.connectEntityToModel(this.entity!, this.model!);
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    const gltf = await loader.loadAsync(this.url);
    gltf.scene.name = ORIGINAL_MODEL_NAME;

    this.model = new THREE.Group();
    this.model.add(gltf.scene);
    this.clips = gltf.animations;
  }

  private setupEntity() {
    this.entity = new YUKA.Vehicle();
    this.entity.maxSpeed = this.maxSpeed;
    this.entity.maxForce = this.maxForce;
  }

  private connectEntityToModel(entity: YUKA.GameEntity, model: THREE.Object3D) {
    model.matrixAutoUpdate = false;
    entity.setRenderComponent(model, this.sync);
  }

  private sync(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrix.copy(entity.worldMatrix as unknown as THREE.Matrix4);
  }
}

export default DynamicElement;
