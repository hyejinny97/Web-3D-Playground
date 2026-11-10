import * as THREE from "three";
import * as CANNON from "cannon-es";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./HitPunchingBagProject.types";
import PunchingBag from "./helpers/PunchingBag";
import { EARTH_GRAVITY } from "@/constants/gravity";
import { PHYSICS_TIMESTEP } from "../FireCannonProject/FireCannonProject.constants";
import {
  IMPULSE_SIZE,
  PUNCHING_BAG_BODY_NAMES,
  PUNCHING_BAG_OBJECT_NAMES,
} from "./HitPunchingBagProject.constants";
import Glove from "./helpers/Glove";

type HitPunchingBagProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class HitPunchingBagProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private physics!: CANNON.World;
  private punchingBag!: PunchingBag;
  private glove!: Glove;
  private raycaster = new THREE.Raycaster();
  declare bagObj?: THREE.Object3D;
  declare bagBody?: CANNON.Body;
  declare private handlePointerDown: (event: PointerEvent) => void;

  constructor({ canvasEl, loadManager }: HitPunchingBagProjectProps) {
    super({ canvasEl });
    this.loadManager = loadManager;
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
    this.glove = new Glove({ loadingManager });

    await Promise.allSettled([this.punchingBag.init(), this.glove.init()]);
    if (this.stopRender) return;

    const models = [this.punchingBag.model!, this.glove.model!];
    const bodies = [...this.punchingBag.bodies];

    models.forEach((model) => this.scene?.add(model));
    bodies.forEach((body) => this.physics.addBody(body));
    this.physics.addConstraint(this.punchingBag.constraint!);

    this.bagObj = this.punchingBag.model!.getObjectByName(
      PUNCHING_BAG_OBJECT_NAMES.bag,
    );
    this.bagBody = this.punchingBag.bodies.find(
      (body) => body.name === PUNCHING_BAG_BODY_NAMES.bag,
    );
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

  setupEvent() {
    this.handlePointerDown = async (event: PointerEvent) => {
      if (!this.bagObj || !this.bagBody || !this.camera) return;

      const hitPointInWorld = this.getHitPoint(event, this.bagObj);
      if (!hitPointInWorld) return;

      const hitPointInLocal = hitPointInWorld.clone();
      this.bagObj.worldToLocal(hitPointInLocal);

      const cameraToHitPoint = new THREE.Vector3()
        .subVectors(hitPointInWorld, this.camera.position)
        .normalize();
      const impulse = cameraToHitPoint.multiplyScalar(IMPULSE_SIZE);

      await this.glove.punch({
        position: hitPointInWorld,
        direction: cameraToHitPoint,
      });

      this.bagBody.applyImpulse(
        new CANNON.Vec3(impulse.x, impulse.y, impulse.z),
        new CANNON.Vec3(
          hitPointInLocal.x,
          hitPointInLocal.y,
          hitPointInLocal.z,
        ),
      );
    };

    this.canvasEl.addEventListener("pointerdown", this.handlePointerDown);
  }

  getHitPoint(
    event: PointerEvent,
    ...targets: [THREE.Object3D, ...THREE.Object3D[]]
  ): THREE.Vector3 | undefined {
    const x = (event.clientX / this.canvasEl.clientWidth) * 2 - 1;
    const y = -(event.clientY / this.canvasEl.clientHeight) * 2 + 1;
    const mouse = new THREE.Vector2(x, y);

    this.raycaster.setFromCamera(mouse, this.camera!);
    const intersects = this.raycaster.intersectObjects(targets);

    return intersects.length > 0 ? intersects[0].point : undefined;
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
    this.canvasEl.removeEventListener("pointerdown", this.handlePointerDown);
  }
}

export default HitPunchingBagProject;
