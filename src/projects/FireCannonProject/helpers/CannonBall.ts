import * as THREE from "three";
import * as CANNON from "cannon-es";
import { BALL_RADIUS } from "../FireCannonProject.constants";

class CannonBall {
  model!: THREE.Object3D;
  body!: CANNON.Body;

  constructor() {
    this.setupModel();
    this.setupBody();
  }

  private setupModel() {
    const geometry = new THREE.SphereGeometry(BALL_RADIUS);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#333"),
      metalness: 0.5,
      roughness: 0.5,
    });
    this.model = new THREE.Mesh(geometry, material);
  }

  private setupBody() {
    const shape = new CANNON.Sphere(BALL_RADIUS / 2);
    const material = new CANNON.Material("ball");
    this.body = new CANNON.Body({
      mass: 3,
      shape,
      material,
    });
  }
}

export default CannonBall;
