import * as THREE from "three";
import * as YUKA from "yuka";
import {
  GLTFLoader,
  SkeletonUtils,
  type GLTF,
} from "three/examples/jsm/Addons.js";
import {
  FLAG_OFFSET_FROM_ANCHOR,
  FLAG_SIZE,
  ORIGINAL_MODEL_NAME,
} from "../BullfightProject.constants";
import type { FlagType } from "../BullfightProject.types";

class Flag implements FlagType {
  private loadingManager: THREE.LoadingManager;
  private gltf: GLTF | null = null;
  private flagSize = new THREE.Vector3();
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
    this.alignToSideBySide();
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
      box.getSize(this.flagSize);
      const center = box.getCenter(new THREE.Vector3());
      originalModel.position.sub(center);
    });
  }

  private setupEntities() {
    const anchor = new YUKA.Vehicle();
    anchor.maxSpeed = 10;
    anchor.maxForce = 20;
    this.entities.push(anchor);

    Array(2)
      .fill(0)
      .forEach(() => {
        const flag = new YUKA.Vehicle();
        flag.maxSpeed = 20;
        flag.maxForce = 50;
        this.entities.push(flag);
      });
  }

  private transformEntities() {
    const anchor = this.entities[0];
    anchor.position.y = this.flagSize.y / 2;

    this.entities.forEach((entity, idx) => {
      const isAnchor = idx === 0;
      const isLeftFlag = idx === 1;
      if (isAnchor) return;

      const sign = isLeftFlag ? -1 : 1;
      entity.position.set(
        anchor.position.x + FLAG_OFFSET_FROM_ANCHOR.x * sign,
        anchor.position.y + FLAG_OFFSET_FROM_ANCHOR.y,
        anchor.position.z + FLAG_OFFSET_FROM_ANCHOR.z,
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

  private alignToSideBySide() {
    const anchor = this.entities[0];
    this.entities.forEach((entity, idx) => {
      const isAnchor = idx === 0;
      const isLeftFlag = idx === 1;
      if (isAnchor) return;

      const sign = isLeftFlag ? -1 : 1;
      const offset = new YUKA.Vector3(
        FLAG_OFFSET_FROM_ANCHOR.x * sign,
        FLAG_OFFSET_FROM_ANCHOR.y,
        FLAG_OFFSET_FROM_ANCHOR.z,
      );

      const behavior = new YUKA.OffsetPursuitBehavior(anchor, offset);
      entity.steering.add(behavior);
    });
  }

  seek(target: YUKA.Vector3) {
    target.y = this.flagSize.y / 2;
    const anchor = this.entities[0];
    if (anchor) {
      const behavior = new YUKA.SeekBehavior(target);
      anchor.steering.add(behavior);
    }
  }
}

export default Flag;
