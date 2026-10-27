import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { BallType } from "../ClothSimulationProject.types";
import {
  BALL_RADIUS,
  MOVEMENT_CIRCLE_CENTER,
  MOVEMENT_CIRCLE_RADIUS,
  MOVEMENT_SPEED,
} from "../ClothSimulationProject.constants";

class Ball implements BallType {
  private then: number = 0; // 단위: s
  private theta: number = 0; // 단위: radian
  model!: THREE.Mesh;
  body!: CANNON.Body;

  constructor() {
    this.setupModel();
    this.setupBody();
  }

  private setupModel() {
    const geometry = new THREE.SphereGeometry(BALL_RADIUS);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0xffffff),
    });
    this.model = new THREE.Mesh(geometry, material);
  }

  private setupBody() {
    const shape = new CANNON.Sphere(BALL_RADIUS * 1.1);
    const material = new CANNON.Material("ball");

    this.body = new CANNON.Body({
      type: CANNON.Body.KINEMATIC,
      shape,
      material,
    });
  }

  update(time: number) {
    time *= 0.001;
    const delta = time - this.then;
    this.then = time;

    this.theta += MOVEMENT_SPEED * delta; // 단위: radian
    this.body.position.set(
      MOVEMENT_CIRCLE_RADIUS * Math.cos(this.theta) + MOVEMENT_CIRCLE_CENTER.x,
      MOVEMENT_CIRCLE_CENTER.y,
      MOVEMENT_CIRCLE_RADIUS * Math.sin(this.theta) + MOVEMENT_CIRCLE_CENTER.z,
    );

    this.model.position.copy(this.body.position);
    this.model.quaternion.copy(this.body.quaternion);
  }
}

export default Ball;
