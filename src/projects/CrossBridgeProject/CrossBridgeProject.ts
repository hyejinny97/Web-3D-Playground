import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./CrossBridgeProject.types";
import Bridge from "./helpers/Bridge";
import {
  BOARD_DEPTH,
  BOARD_WIDTH,
  BOARDS_CNT,
  GROUND_WIDTH,
  PHYSICS_TIMESTEP,
} from "./CrossBridgeProject.constants";
import Ground from "./helpers/Ground";
import { EARTH_GRAVITY } from "@/constants/gravity";

type CrossBridgeProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class CrossBridgeProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private physics!: CANNON.World;
  private bridge!: Bridge;
  private ground!: Ground;

  constructor({ canvasEl, loadManager }: CrossBridgeProjectProps) {
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
      this.camera.position.set(
        0,
        5,
        BOARD_DEPTH / 2 +
          (BOARD_DEPTH / 2) *
            Math.sqrt((BOARDS_CNT / 2) * BOARD_WIDTH + GROUND_WIDTH),
      );
    }
  }

  async setupModel() {
    this.createPhysicsWorld();
    const loadingManager = this.generateLoadingManager();
    this.bridge = new Bridge({ loadingManager });
    this.ground = new Ground({ loadingManager });

    await Promise.allSettled([this.bridge.init(), this.ground.init()]);
    if (this.stopRender) return;

    const models = [...this.bridge.models, ...this.ground.models];
    const bodies = [...this.bridge.bodies, ...this.ground.bodies];
    const constraints = [...this.bridge.constraints];

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
    this.bridge.update();
    this.ground.update();
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default CrossBridgeProject;
