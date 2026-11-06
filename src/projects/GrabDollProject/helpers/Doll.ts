import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { DollType } from "../GrabDollProject.types";
import {
  BODY_NAME,
  DOLL_INIT_POSITION,
  DOLL_SIZE,
} from "../GrabDollProject.constants";

class Doll implements DollType {
  model: THREE.Object3D | null = null;
  body: CANNON.Body | null = null;

  constructor() {
    this.setupModel();
    this.setupBody();
  }

  private setupModel() {
    const geometry = new THREE.BoxGeometry(
      DOLL_SIZE.width,
      DOLL_SIZE.height,
      DOLL_SIZE.depth,
    );
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0xffff00),
    });
    this.model = new THREE.Mesh(geometry, material);
  }

  private setupBody() {
    const shape = new CANNON.Box(
      new CANNON.Vec3(
        DOLL_SIZE.width / 2,
        DOLL_SIZE.height / 2,
        DOLL_SIZE.depth / 2,
      ),
    );
    this.body = new CANNON.Body({
      mass: 1,
      shape,
      position: DOLL_INIT_POSITION,
    });
    this.body.name = BODY_NAME.doll;
  }

  reset() {
    if (this.body) {
      const { x, y, z } = DOLL_INIT_POSITION;
      this.body.position.set(x, y, z);
      this.body.quaternion.set(0, 0, 0, 1);
      this.body.velocity.set(0, 0, 0);
      this.body.angularVelocity.set(0, 0, 0);
    }
  }

  update() {
    if (!this.model || !this.body) return;
    this.model.position.copy(this.body.position);
    this.model.quaternion.copy(this.body.quaternion);
  }
}

export default Doll;
