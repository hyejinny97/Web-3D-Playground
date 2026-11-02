import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./OpenDoorProject.types";
import { EARTH_GRAVITY } from "@/constants/gravity";
import Door from "./helpers/Door";
import { PHYSICS_TIMESTEP } from "../FireCannonProject/FireCannonProject.constants";
import { BODY_NAMES } from "./OpenDoorProject.constants";

type OpenDoorProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class OpenDoorProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private physics!: CANNON.World;
  private door!: Door;

  constructor({ canvasEl, loadManager }: OpenDoorProjectProps) {
    super({ canvasEl });
    this.loadManager = loadManager;
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

  async setupModel() {
    this.createPhysicsWorld();
    const loadingManager = this.generateLoadingManager();
    this.door = new Door({ loadingManager });

    await this.door.init();
    if (this.stopRender) return;

    if (this.door.model) this.scene?.add(this.door.model);
    this.door.bodies.forEach((body) => this.physics.addBody(body));
    if (this.door.constraint) this.physics.addConstraint(this.door.constraint);
  }

  generateLoadingManager(): THREE.LoadingManager {
    const { onStart, onProgress, onLoad } = this.loadManager;
    const manager = new THREE.LoadingManager(
      onLoad,
      (_: string, loaded: number, total: number) => onProgress(loaded, total),
    );
    manager.onStart = onStart;
    return manager;
  }

  createPhysicsWorld() {
    this.physics = new CANNON.World({
      gravity: new CANNON.Vec3(0, EARTH_GRAVITY, 0),
    });
  }

  update() {
    this.physics.step(PHYSICS_TIMESTEP);
    this.door.update();

    const force = new CANNON.Vec3(0, 0, -0.2);
    const doorBody = this.door.bodies.find(
      (body) => body.name === BODY_NAMES.door,
    );
    if (doorBody) {
      doorBody.applyForce(force, doorBody.position);
    }
  }

  disposePhysics() {
    this.physics.bodies.forEach((body) => this.physics.removeBody(body));
    this.physics.contactmaterials = [];
    this.physics.constraints = [];
    this.physics.frictionEquations = [];
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
    this.disposePhysics();
  }
}

export default OpenDoorProject;
