import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./FireCannonProject.types";
import Ground from "./helpers/Ground";
import { GROUND_HEIGHT, PHYSICS_TIMESTEP } from "./FireCannonProject.constants";
import Cannon from "./helpers/Cannon";
import PyramidBoxes from "./helpers/PyramidBoxes";
import { EARTH_GRAVITY } from "@/constants/gravity";

type FireCannonProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class FireCannonProject extends BaseProject {
  private loadManager: LoadManagerType;
  private physics!: CANNON.World;
  private stopRender = false;
  private models: THREE.Object3D[] = [];
  private bodies: CANNON.Body[] = [];
  private ground: Ground | null = null;
  private cannon: Cannon | null = null;
  private pyramidBoxes: PyramidBoxes | null = null;
  declare private handleKeydown: (event: KeyboardEvent) => void;
  declare private handleKeypress: (event: KeyboardEvent) => void;
  declare private handleKeyup: (event: KeyboardEvent) => void;

  constructor({ canvasEl, loadManager }: FireCannonProjectProps) {
    super({ canvasEl });
    this.loadManager = loadManager;
    this.createPhysicsWorld();
    this.setupModel();
    this.setupEvent();
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
      this.camera.position.set(0, 3, GROUND_HEIGHT / 2);
    }
  }

  setupLight() {
    super.setupLight();
    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(-2, 2, 2);
    this.scene?.add(directionalLight);
  }

  createPhysicsWorld() {
    this.physics = new CANNON.World({
      gravity: new CANNON.Vec3(0, EARTH_GRAVITY, 0),
    });
  }

  async setupModel() {
    const loadingManager = this.generateLoadingManager();
    this.ground = new Ground({ loadingManager });
    this.cannon = new Cannon({ loadingManager });
    this.pyramidBoxes = new PyramidBoxes({ loadingManager, floors: 7 });

    await Promise.allSettled([
      this.ground.init(),
      this.cannon.init(),
      this.pyramidBoxes.init(),
    ]);
    if (this.stopRender) return;

    this.models = [
      this.ground.model,
      this.cannon.model,
      ...this.pyramidBoxes.models,
    ].filter((model) => model !== null);
    this.bodies = [
      this.ground.body,
      this.cannon.body,
      ...this.pyramidBoxes.bodies,
    ].filter((model) => model !== null);

    this.models.forEach((model) => this.scene?.add(model));
    this.bodies.forEach((body) => this.physics.addBody(body));
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

  update() {
    this.physics.step(PHYSICS_TIMESTEP);
    this.ground?.update();
    this.cannon?.update();
    this.pyramidBoxes?.update();
  }

  setupEvent() {
    this.handleKeyup = (event: KeyboardEvent) => {
      switch (event.key) {
        case " ": {
          const ball = this.cannon?.fire(10);
          if (ball) {
            this.scene?.add(ball.model);
            this.physics.addBody(ball.body);
          }
        }
      }
    };

    window.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("keypress", this.handleKeypress);
    window.addEventListener("keyup", this.handleKeyup);
  }

  dispose() {
    super.dispose();
    window.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("keypress", this.handleKeypress);
    window.removeEventListener("keyup", this.handleKeyup);
    this.stopRender = true;
  }
}

export default FireCannonProject;
