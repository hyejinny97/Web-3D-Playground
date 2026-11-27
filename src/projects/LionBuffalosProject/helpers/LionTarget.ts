import * as THREE from "three";
import * as YUKA from "yuka";
import type { LionTargetType } from "../LionBuffalosProject.types";
import { GROUND_SIZE } from "../LionBuffalosProject.constants";

class LionTarget implements LionTargetType {
  model!: THREE.Mesh;
  position = new YUKA.Vector3();

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

  placeRandomly() {
    this.position.x = (Math.random() - 0.5) * GROUND_SIZE.width * 0.8;
    this.position.z = (Math.random() - 0.5) * GROUND_SIZE.height * 0.8;
    this.model.position.set(this.position.x, this.position.y, this.position.z);
  }
}

export default LionTarget;
