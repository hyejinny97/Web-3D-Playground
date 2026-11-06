import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { FloorType } from "../GrabDollProject.types";
import { FLOOR_SIZE } from "../GrabDollProject.constants";

class Floor implements FloorType {
  model: THREE.Object3D | null = null;
  body: CANNON.Body | null = null;

  constructor() {
    this.setupModel();
    this.setupBody();
  }

  private setupModel() {
    const geometry = new THREE.BoxGeometry(
      FLOOR_SIZE.width,
      FLOOR_SIZE.height,
      FLOOR_SIZE.depth,
    );
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x888888),
    });
    this.model = new THREE.Mesh(geometry, material);
  }

  private setupBody() {
    const shape = new CANNON.Box(
      new CANNON.Vec3(
        FLOOR_SIZE.width / 2,
        FLOOR_SIZE.height / 2,
        FLOOR_SIZE.depth / 2,
      ),
    );
    this.body = new CANNON.Body({
      mass: 0,
      shape,
    });
  }

  update() {
    if (!this.model || !this.body) return;
    this.model.position.copy(this.body.position);
    this.model.quaternion.copy(this.body.quaternion);
  }
}

export default Floor;
