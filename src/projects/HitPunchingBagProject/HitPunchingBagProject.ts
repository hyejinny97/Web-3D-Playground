import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./HitPunchingBagProject.types";
import PunchingBag from "./helpers/PunchingBag";
import { EARTH_GRAVITY } from "@/constants/gravity";
import { PHYSICS_TIMESTEP } from "../FireCannonProject/FireCannonProject.constants";

type HitPunchingBagProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class HitPunchingBagProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private physics!: CANNON.World;
  private punchingBag!: PunchingBag;

  constructor({ canvasEl, loadManager }: HitPunchingBagProjectProps) {
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

  setupScene() {
    super.setupScene();
    if (this.scene) {
      this.scene.background = new THREE.Color(0x333333);
    }
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 1);
    const directionalLight = new THREE.DirectionalLight("white", 5);
    directionalLight.position.set(2, 2, 2);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight);
  }

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      this.camera.position.set(0, 0.2, 3);
    }
  }

  async setupModel() {
    this.createPhysicsWorld();
    const loadingManager = this.generateLoadingManager();

    this.punchingBag = new PunchingBag({ loadingManager });

    await this.punchingBag.init();
    if (this.stopRender) return;

    const models = [this.punchingBag.model!];
    const bodies = [...this.punchingBag.bodies];

    models.forEach((model) => this.scene?.add(model));
    bodies.forEach((body) => this.physics.addBody(body));
    this.physics.addConstraint(this.punchingBag.constraint!);
  }

  generateLoadingManager(): THREE.LoadingManager {
    const { onStart, onProgress, onLoad } = this.loadManager;
    const manager = new THREE.LoadingManager(
      onLoad,
      (_: string, loaded: number, total: number) =>
        onProgress((loaded / total) * 100),
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
    this.punchingBag.update();
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
    this.stopRender = true;
  }
}

export default HitPunchingBagProject;
