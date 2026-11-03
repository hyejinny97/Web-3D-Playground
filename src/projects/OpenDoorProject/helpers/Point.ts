import * as THREE from "three";
import type { PointType } from "../OpenDoorProject.types";
import { POINT_INIT_DIRECTION } from "../OpenDoorProject.constants";

class Point implements PointType {
  private material!: THREE.MeshBasicMaterial;
  model!: THREE.Mesh;

  constructor() {
    this.setupModel();
  }

  private setupModel() {
    const geometry = new THREE.CircleGeometry(0.08);
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffffff"),
      transparent: true,
      depthTest: false,
    });
    this.model = new THREE.Mesh(geometry, this.material);
    this.model.name = "point";
    this.model.renderOrder = 999;
    this.model.visible = false;
  }

  private display(position: THREE.Vector3, direction: THREE.Vector3) {
    const targetDirection = direction.clone().normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(POINT_INIT_DIRECTION, targetDirection);

    this.model.position.set(position.x, position.y, position.z);
    this.model.quaternion.copy(quaternion);
    this.model.visible = true;
  }

  displayLow(position: THREE.Vector3, direction: THREE.Vector3) {
    this.material.setValues({ opacity: 0.3 });
    this.display(position, direction);
  }

  displayHigh(position: THREE.Vector3, direction: THREE.Vector3) {
    this.material.setValues({ opacity: 0.8 });
    this.display(position, direction);
  }

  hide() {
    this.model.visible = false;
  }
}

export default Point;
