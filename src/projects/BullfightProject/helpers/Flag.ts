import * as THREE from "three";
import * as YUKA from "yuka";
import {
  GLTFLoader,
  SkeletonUtils,
  type GLTF,
} from "three/examples/jsm/Addons.js";
import {
  FLAG_OFFSET,
  FLAG_SIZE,
  ORIGINAL_MODEL_NAME,
} from "../BullfightProject.constants";
import type { FlagType } from "../BullfightProject.types";

class Flag implements FlagType {
  private loadingManager: THREE.LoadingManager;
  private gltf: GLTF | null = null;
  models: THREE.Object3D[] = [];
  entities: YUKA.Vehicle[] = [];

  constructor({ loadingManager }: { loadingManager: THREE.LoadingManager }) {
    this.loadingManager = loadingManager;
  }

  async init() {
    await this.loadGLTF();
    this.setupModels();
    this.transformModels();
    this.setupEntities();
    this.transformEntities();
    this.entities.forEach((entity, idx) =>
      this.connectEntityToModel(entity, this.models[idx]),
    );
  }

  private async loadGLTF() {
    const loader = new GLTFLoader(this.loadingManager);
    this.gltf = await loader.loadAsync("/models/flag/scene.gltf");
  }

  private setupModels() {
    if (!this.gltf) return;

    const anchor = new THREE.Object3D();
    this.models.push(anchor);

    Array(2)
      .fill(0)
      .forEach(() => {
        const flag = SkeletonUtils.clone(this.gltf!.scene);
        flag.name = ORIGINAL_MODEL_NAME;

        const group = new THREE.Group();
        group.add(flag);
        this.models.push(group);
      });
  }

  private transformModels() {
    this.models.forEach((model, idx) => {
      const isAnchor = idx === 0;
      const isLeftFlag = idx === 1;
      const originalModel = model.getObjectByName(ORIGINAL_MODEL_NAME);
      if (isAnchor || !originalModel) return;

      originalModel.scale.set(FLAG_SIZE, FLAG_SIZE, FLAG_SIZE);
      if (isLeftFlag) originalModel.rotateY(-Math.PI);

      const box = new THREE.Box3().setFromObject(originalModel);
      const center = box.getCenter(new THREE.Vector3());
      originalModel.position.sub(center);
    });
  }

  private setupEntities() {
    const anchor = new YUKA.Vehicle();
    anchor.maxSpeed = 20;
    anchor.maxForce = 50;
    this.entities.push(anchor);

    Array(2)
      .fill(0)
      .forEach(() => {
        const flag = new YUKA.Vehicle();
        flag.maxSpeed = 50;
        flag.maxForce = 80;
        this.entities.push(flag);
      });
  }

  private transformEntities() {
    const anchor = this.entities[0];
    this.entities.forEach((entity, idx) => {
      const isAnchor = idx === 0;
      const isLeftFlag = idx === 1;
      if (isAnchor) return;

      const model = this.models[idx];
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const sign = isLeftFlag ? -1 : 1;

      entity.position.set(
        anchor.position.x + FLAG_OFFSET.x * sign,
        anchor.position.y + FLAG_OFFSET.y * sign + size.y / 2,
        anchor.position.z + FLAG_OFFSET.z * sign,
      );
    });
  }

  private connectEntityToModel(entity: YUKA.GameEntity, model: THREE.Object3D) {
    model.matrixAutoUpdate = false;
    entity.setRenderComponent(model, this.sync);
  }

  private sync(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrix.copy(entity.worldMatrix as unknown as THREE.Matrix4);
  }
}

export default Flag;
