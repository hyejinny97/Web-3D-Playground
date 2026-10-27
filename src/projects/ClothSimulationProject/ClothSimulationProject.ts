import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./ClothSimulationProject.types";
import { EARTH_GRAVITY } from "@/constants/gravity";
import Cloth from "./helpers/Cloth";
import { PHYSICS_TIMESTEP } from "../FireCannonProject/FireCannonProject.constants";

type ClothSimulationProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class ClothSimulationProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private physics!: CANNON.World;
  private cloth!: Cloth;

  constructor({ canvasEl, loadManager }: ClothSimulationProjectProps) {
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
    this.cloth = new Cloth({ loadingManager });

    await this.cloth.init();
    if (this.stopRender) return;

    const models = [this.cloth.model].filter((el) => el !== null);
    const bodies = [...this.cloth.bodies];
    const constraints = [...this.cloth.constraints];

    this.scene?.add(...models);
    bodies.forEach((body) => this.physics.addBody(body));
    constraints.forEach((constraint) => this.physics.addConstraint(constraint));
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
    this.cloth.update();
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

export default ClothSimulationProject;
