import * as THREE from "three";
import type { SealTargetType } from "../OrcaSealProject.types";
import { TARGET_RANGE_LIMIT } from "../OrcaSealProject.constants";

class SealTarget implements SealTargetType {
  model!: THREE.Mesh;

  constructor() {
    this.setupModel();
    this.hide();
  }

  private setupModel() {
    const geometry = new THREE.SphereGeometry(0.1);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("red"),
    });
    this.model = new THREE.Mesh(geometry, material);
  }

  show() {
    this.model.visible = true;
  }

  hide() {
    this.model.visible = false;
  }

  update(time: number) {
    this.model.position.x =
      Math.cos(time) * Math.sin(time * 0.2) * TARGET_RANGE_LIMIT.x;
    this.model.position.z = Math.sin(time * 0.8) * TARGET_RANGE_LIMIT.y;
    this.model.position.y = Math.sin(time * 0.5) * TARGET_RANGE_LIMIT.z;
  }
}

export default SealTarget;
