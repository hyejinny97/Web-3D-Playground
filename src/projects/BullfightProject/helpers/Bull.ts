import * as THREE from "three";
import * as YUKA from "yuka";
import type { BullType } from "../BullfightProject.types";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import type { AnimationHelperType } from "@/helpers/AnimationHelper";
import { BULL_ANIMATION_NAME } from "../BullfightProject.constants";
import AnimationHelper from "@/helpers/AnimationHelper";

class Bull implements BullType {
  private loadingManager: THREE.LoadingManager;
  protected gltf: GLTF | null = null;
  private animation: AnimationHelperType | null = null;
  model: THREE.Object3D | null = null;
  entity: YUKA.Vehicle | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.setupModel();
    this.setupEntity();
    this.connectEntityToModel(this.entity!, this.model!);
    this.setupAnimation();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/bull/scene.gltf");
  }

  private setupModel() {
    if (!this.gltf) return;

    const SIZE = 30;
    this.gltf.scene.scale.set(SIZE, SIZE, SIZE);
    this.gltf.scene.updateMatrixWorld(true);

    this.model = new THREE.Group();
    this.model.add(this.gltf.scene);
  }

  private setupEntity() {
    this.entity = new YUKA.Vehicle();
    this.entity.maxSpeed = 5;
    this.entity.maxForce = 10;
  }

  private connectEntityToModel(entity: YUKA.GameEntity, model: THREE.Object3D) {
    model.matrixAutoUpdate = false;
    entity.setRenderComponent(model, this.sync);
  }

  private sync(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrix.copy(entity.worldMatrix as unknown as THREE.Matrix4);
  }

  private setupAnimation() {
    if (!this.gltf || !this.model) return;

    this.animation = new AnimationHelper({
      model: this.model,
      clips: this.gltf.animations,
    });
    this.animation.play({ name: BULL_ANIMATION_NAME.idle });
  }

  update(time: number) {
    this.animation?.update(time);
  }
}

export default Bull;
