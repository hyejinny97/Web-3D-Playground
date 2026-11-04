import * as CANNON from "cannon-es";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import Floor from "./helpers/Floor";
import Doll from "./helpers/Doll";
import { EARTH_GRAVITY } from "@/constants/gravity";
import { PHYSICS_TIMESTEP } from "../FireCannonProject/FireCannonProject.constants";
import type { ConstructorProps } from "@/types/project";

@RenderLoop()
class GrabDollProject extends BaseProject {
  private physics!: CANNON.World;
  private floor!: Floor;
  private doll!: Doll;

  constructor(props: ConstructorProps) {
    super(props);
    this.setupModel();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();
    this.setupLight();
    this.setupControls();
    this.setupResizeObserver();
  }

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      this.camera.position.set(0, 1, 3);
    }
  }

  setupModel() {
    this.createPhysicsWorld();
    this.floor = new Floor();
    this.doll = new Doll();

    const models = [this.floor.model!, this.doll.model!];
    const bodies = [this.floor.body!, this.doll.body!];

    models.forEach((model) => this.scene?.add(model));
    bodies.forEach((body) => this.physics.addBody(body));
  }

  createPhysicsWorld() {
    this.physics = new CANNON.World({
      gravity: new CANNON.Vec3(0, EARTH_GRAVITY, 0),
    });
  }

  update() {
    this.physics.step(PHYSICS_TIMESTEP);
    this.floor.update();
    this.doll.update();
  }

  disposePhysics() {
    this.physics.bodies.forEach((body) => this.physics.removeBody(body));
    this.physics.contactmaterials = [];
    this.physics.constraints = [];
    this.physics.frictionEquations = [];
  }

  dispose() {
    super.dispose();
    this.disposePhysics();
  }
}

export default GrabDollProject;
