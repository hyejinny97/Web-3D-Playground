import * as THREE from "three";
import * as YUKA from "yuka";
import type { PointType } from "../WalkingStonePathProject.types";
import { MODEL_NAME } from "../WalkingStonePathProject.constants";

class Point implements PointType {
  private material!: THREE.MeshBasicMaterial;
  model!: THREE.Mesh;
  position = new YUKA.Vector3();

  constructor() {
    this.setupModel();
    this.hide();
  }

  private setupModel() {
    const geometry = new THREE.CircleGeometry(0.2);
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffffff"),
      transparent: true,
      depthTest: false,
    });
    this.model = new THREE.Mesh(geometry, this.material);
    this.model.name = MODEL_NAME.point;
    this.model.renderOrder = 999;
    this.model.rotateX(-Math.PI / 2);
  }

  private display(position: THREE.Vector3) {
    this.model.position.set(position.x, position.y, position.z);
    this.model.visible = true;
  }

  displayLow(position: THREE.Vector3) {
    this.material.setValues({ opacity: 0.3 });
    this.display(position);
  }

  displayHigh(position: THREE.Vector3) {
    this.material.setValues({ opacity: 0.8 });
    this.display(position);
  }

  hide() {
    this.model.visible = false;
  }

  updatePosition(position: THREE.Vector3) {
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
  }
}

export default Point;
