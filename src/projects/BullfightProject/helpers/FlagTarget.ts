import * as THREE from "three";
import * as YUKA from "yuka";
import { GROUND_SIZE } from "../BullfightProject.constants";
import type { FlagTargetType } from "../BullfightProject.types";

class FlagTarget implements FlagTargetType {
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

  update(time: number) {
    this.position.x = Math.sin(time * 0.2) * (GROUND_SIZE.width * 0.4);
    this.position.z = Math.cos(time * 0.5) * (GROUND_SIZE.height * 0.4);
    this.model.position.set(this.position.x, this.position.y, this.position.z);
  }
}

export default FlagTarget;
