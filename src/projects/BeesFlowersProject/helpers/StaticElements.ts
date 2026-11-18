import * as THREE from "three";
import * as YUKA from "yuka";
import Elements from "./Elements";
import type { StaticElementsType } from "../BeesFlowersProject.types";

abstract class StaticElements extends Elements implements StaticElementsType {
  entities: YUKA.GameEntity[] = [];
  targets: YUKA.Vector3[] = [];

  async init() {
    await super.init();
    this.setupEntities();
    this.setupTargets();
  }

  private setupEntities() {
    this.models.forEach((model) => {
      const entity = new YUKA.GameEntity();
      this.connectEntityToModel(entity, model);
      this.entities.push(entity);
    });
  }

  private connectEntityToModel(entity: YUKA.GameEntity, model: THREE.Object3D) {
    entity.position.set(model.position.x, model.position.y, model.position.z);
    entity.rotation.set(
      model.quaternion.x,
      model.quaternion.y,
      model.quaternion.z,
      model.quaternion.w,
    );
    entity.scale.set(model.scale.x, model.scale.y, model.scale.z);

    model.matrixAutoUpdate = false;
    entity.setRenderComponent(model, this.sync);
  }

  private sync(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrix.copy(entity.worldMatrix as unknown as THREE.Matrix4);
  }

  private setupTargets() {
    this.models.forEach((model, idx) => {
      const box = new THREE.Box3().setFromObject(model);
      const target = new YUKA.Vector3(
        (box.max.x + box.min.x) / 2,
        box.max.y - 0.2,
        (box.max.z + box.min.z) / 2,
      );
      target.name = `${this.name}-${idx}`;
      this.targets.push(target);
    });
  }
}

export default StaticElements;
