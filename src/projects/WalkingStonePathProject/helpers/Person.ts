import * as THREE from "three";
import * as YUKA from "yuka";
import type { PersonType } from "../WalkingStonePathProject.types";
import AnimationHelper from "@/helpers/AnimationHelper";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import {
  ANIMATION_NAME,
  GROUND_SIZE,
} from "../WalkingStonePathProject.constants";

class Person implements PersonType {
  private loadingManager: THREE.LoadingManager;
  private gltf: GLTF | null = null;
  private animation: AnimationHelper | null = null;
  model: THREE.Object3D | null = null;
  entity: YUKA.Vehicle | null = null;

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.setupModel();
    this.setupEntity();
    this.transformEntity();
    this.connectEntityToModel(this.entity!, this.model!);
    this.setupAnimation();
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/woman_with_headphone.gltf");
  }

  private setupModel() {
    if (!this.gltf) return;

    this.model = new THREE.Group();
    this.model.add(this.gltf.scene);

    const SIZE = 0.01;
    this.gltf.scene.scale.set(SIZE, SIZE, SIZE);
    this.gltf.scene.rotateY(Math.PI * 0.2);
    this.gltf.scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(this.gltf.scene);
    this.gltf.scene.position.y = -box.min.y;
  }

  private setupEntity() {
    this.entity = new YUKA.Vehicle();
    this.entity.maxSpeed = 1;
    this.entity.maxForce = 2;
  }

  private connectEntityToModel(entity: YUKA.GameEntity, model: THREE.Object3D) {
    model.matrixAutoUpdate = false;
    entity.setRenderComponent(model, this.sync);
  }

  private sync(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrix.copy(entity.worldMatrix as unknown as THREE.Matrix4);
  }

  private transformEntity() {
    if (!this.entity) return;
    this.entity.position.set(
      (-GROUND_SIZE.width / 2) * 0.9,
      0,
      (-GROUND_SIZE.height / 2) * 0.8,
    );
  }

  private setupAnimation() {
    if (!this.model) return;
    this.animation = new AnimationHelper({
      model: this.model,
      clips: this.gltf!.animations,
    });
    this.animation.play({
      name: ANIMATION_NAME.idle,
    });
  }

  update(time: number) {
    this.animation?.update(time);
  }
}

export default Person;
