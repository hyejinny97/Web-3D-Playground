import * as THREE from "three";
import * as CANNON from "cannon-es";
import { MARKER_RADIUS } from "../GrabDollProject.constants";

class Marker {
  model: THREE.Object3D | null = null;
  body: CANNON.Body | null = null;

  constructor() {
    this.setupModel();
    this.setupBody();
  }

  private setupModel() {
    const geometry = new THREE.SphereGeometry(MARKER_RADIUS);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0xffffff),
    });
    this.model = new THREE.Mesh(geometry, material);
  }

  private setupBody() {
    const shape = new CANNON.Sphere(MARKER_RADIUS / 2);
    this.body = new CANNON.Body({
      mass: 0,
      shape,
    });
    this.body.collisionFilterGroup = 0;
    this.body.collisionFilterMask = 0;
  }

  update() {
    if (!this.model || !this.body) return;
    this.model.position.copy(this.body.position);
    this.model.quaternion.copy(this.body.quaternion);
  }
}

export default Marker;
