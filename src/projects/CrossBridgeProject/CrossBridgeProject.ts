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
import Bird from "./helpers/Bird";

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
  private bird!: Bird;

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
    this.bird = new Bird({ loadingManager });

    await Promise.allSettled([
      this.bridge.init(),
      this.ground.init(),
      this.bird.init(),
    ]);
    if (this.stopRender) return;

    const models = [
      ...this.bridge.models,
      ...this.ground.models,
      this.bird.model!,
    ];
    const bodies = [
      ...this.bridge.bodies,
      ...this.ground.bodies,
      this.bird.body!,
    ];
    const constraints = [
      ...this.bridge.constraints,
      ...this.generateBridgeGroundConstraint(),
    ];

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

  generateBridgeGroundConstraint(): CANNON.LockConstraint[] {
    const leftGround = this.ground.bodies[0];
    const rightGround = this.ground.bodies[1];
    const firstBoard = this.bridge.bodies[0];
    const lastBoard = this.bridge.bodies[BOARDS_CNT - 1];

    const leftConstraint = new CANNON.LockConstraint(leftGround, firstBoard, {
      maxForce: 1e8,
    });
    const rightConstraint = new CANNON.LockConstraint(rightGround, lastBoard, {
      maxForce: 1e8,
    });

    return [leftConstraint, rightConstraint];
  }

  update(time: number) {
    this.physics.step(PHYSICS_TIMESTEP);
    this.bridge.update();
    this.ground.update();
    this.bird.update(time, () => {
      if (this.bird.model) {
        this.bird.model.visible = false;
      }
    });
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default CrossBridgeProject;
