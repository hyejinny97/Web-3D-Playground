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

  constructor({ canvasEl, loadManager }: FireCannonProjectProps) {
    super({ canvasEl });
    this.loadManager = loadManager;
    this.createPhysicsWorld();
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
    const ground = new Ground({ loadingManager });
    const cannon = new Cannon({ loadingManager });
    const pyramidBoxes = new PyramidBoxes({ loadingManager, floors: 7 });

    await Promise.allSettled([
      ground.init(),
      cannon.init(),
      pyramidBoxes.init(),
    ]);
    if (this.stopRender) return;

    this.models = [ground.model, cannon.model, pyramidBoxes.model].filter(
      (model) => model !== null,
    );
    this.bodies = [ground.body].filter((model) => model !== null);

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
    this.models.forEach((model, idx) => {
      const body = this.bodies[idx];
      if (body) {
        model.position.copy(body.position);
        model.quaternion.copy(body.quaternion);
      }
    });
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default FireCannonProject;
