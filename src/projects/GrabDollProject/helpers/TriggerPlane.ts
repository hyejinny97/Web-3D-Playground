import * as CANNON from "cannon-es";
import type { TriggerPlaneType } from "../GrabDollProject.types";

class TriggerPlane implements TriggerPlaneType {
  body!: CANNON.Body;

  constructor() {
    this.setupBody();
  }

  private setupBody() {
    const shape = new CANNON.Plane();
    this.body = new CANNON.Body({
      mass: 0,
      shape,
      position: new CANNON.Vec3(0, -2, 0),
    });
    this.body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2,
    );
  }
}

export default TriggerPlane;
