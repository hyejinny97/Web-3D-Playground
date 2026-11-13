import * as THREE from "three";
import * as YUKA from "yuka";
import Elements from "./Elements";
import type { StaticElementsType } from "../BeesFlowersProject.types";

abstract class StaticElements extends Elements implements StaticElementsType {
  entities: YUKA.GameEntity[] = [];

  async init() {
    await super.init();
    this.setupEntities();
  }

  private setupEntities() {
    this.models.forEach((model) => {
      const entity = new YUKA.GameEntity();
      entity.setRenderComponent(model, this.sync);
      this.entities.push(entity);
    });
  }

  private sync(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrix.copy(entity.worldMatrix as unknown as THREE.Matrix4);
  }
}

export default StaticElements;
