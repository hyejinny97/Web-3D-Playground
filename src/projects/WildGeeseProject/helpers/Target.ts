import * as THREE from "three";
import * as YUKA from "yuka";
import type { TargetType } from "../WildGeeseProject.types";
import { TARGET_RANGE_LIMIT } from "../WildGeeseProject.constants";

class Target implements TargetType {
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
    const SPEED = 0.2;
    this.position.x = Math.sin(time * SPEED) * TARGET_RANGE_LIMIT.x;
    this.position.z = Math.cos(time * SPEED) * TARGET_RANGE_LIMIT.z;
    this.position.y = Math.sin(time * SPEED) * TARGET_RANGE_LIMIT.y;

    this.model.position.set(this.position.x, this.position.y, this.position.z);
  }
}

export default Target;
