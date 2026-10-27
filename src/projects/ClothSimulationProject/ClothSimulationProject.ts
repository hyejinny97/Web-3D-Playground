import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./ClothSimulationProject.types";
import { EARTH_GRAVITY } from "@/constants/gravity";
import Cloth from "./helpers/Cloth";
import { PHYSICS_TIMESTEP } from "../FireCannonProject/FireCannonProject.constants";
import Ball from "./helpers/Ball";
import { CLOTH_HEIGHT, CLOTH_WIDTH } from "./ClothSimulationProject.constants";

type ClothSimulationProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class ClothSimulationProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private physics!: CANNON.World;
  private cloth!: Cloth;
  private ball!: Ball;

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

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      this.camera.position.set(0, (CLOTH_HEIGHT / 2) * 1.5, CLOTH_WIDTH);
    }
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 0.3);
    const directionalLight1 = new THREE.DirectionalLight("white", 0.5);
    const directionalLight2 = new THREE.DirectionalLight("white", 0.5);
    directionalLight1.position.set(2, 2, 2);
    directionalLight2.position.set(-2, 2, 2);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight1);
    this.scene?.add(directionalLight2);
  }

  async setupModel() {
    this.createPhysicsWorld();
    const loadingManager = this.generateLoadingManager();
    this.cloth = new Cloth({ loadingManager });
    this.ball = new Ball();

    await this.cloth.init();
    if (this.stopRender) return;

    const models = [this.cloth.model, this.ball.model].filter(
      (el) => el !== null,
    );
    const bodies = [...this.cloth.bodies, this.ball.body];
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

  update(time: number) {
    this.physics.step(PHYSICS_TIMESTEP);
    this.cloth.update();
    this.ball.update(time);
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
