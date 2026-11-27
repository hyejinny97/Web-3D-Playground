import * as THREE from "three";
import * as YUKA from "yuka";
import type { StoneType } from "../WalkingStonePathProject.types";
import {
  GLTFLoader,
  SkeletonUtils,
  type GLTF,
} from "three/examples/jsm/Addons.js";
import { GROUND_SIZE } from "../WalkingStonePathProject.constants";

class Stone implements StoneType {
  private loadingManager: THREE.LoadingManager;
  private count!: number;
  private gltf: GLTF | null = null;
  models: THREE.Object3D[] = [];
  entities: YUKA.GameEntity[] = [];

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
    this.setupEntities();
    this.transformEntities();
    this.entities.forEach((entity, idx) =>
      this.connectEntityToModel(entity!, this.models[idx]),
    );
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/stone.glb");

    const SIZE = 0.002;
    this.gltf.scene.scale.set(SIZE, SIZE, SIZE);
    this.gltf.scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(this.gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    this.gltf.scene.position.set(-center.x, -box.min.y, -center.z);
  }

  private setupModels() {
    if (!this.gltf) return;

    Array(this.count)
      .fill(0)
      .forEach(() => {
        const model = SkeletonUtils.clone(this.gltf!.scene);
        const group = new THREE.Group();
        group.add(model);
        this.models.push(group);
      });
  }

  private setupEntities() {
    Array(this.count)
      .fill(0)
      .forEach(() => {
        const entity = new YUKA.GameEntity();
        this.entities.push(entity);
      });
  }

  private connectEntityToModel(entity: YUKA.GameEntity, model: THREE.Object3D) {
    model.matrixAutoUpdate = false;
    entity.setRenderComponent(model, this.sync);
  }

  private sync(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrix.copy(entity.worldMatrix as unknown as THREE.Matrix4);
  }

  private transformEntities() {
    this.entities.forEach((entity) => {
      const SIZE = Math.random() + 1;
      entity.scale.set(SIZE, SIZE, SIZE);
      entity.rotation.fromEuler(0, -2 * Math.PI * Math.random(), 0);
      entity.position.set(
        (Math.random() - 0.5) * GROUND_SIZE.width * 0.8,
        0,
        (Math.random() - 0.5) * GROUND_SIZE.height * 0.8,
      );
    });
  }
}

export default Stone;
