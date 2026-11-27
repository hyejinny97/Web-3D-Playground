import * as THREE from "three";
import * as YUKA from "yuka";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./WalkingStonePathProject.types";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";
import { GROUND_SIZE, MODEL_NAME } from "./WalkingStonePathProject.constants";
import Ground from "./helpers/Ground";
import Stone from "./helpers/Stone";
import Person from "./helpers/Person";
import Point from "./helpers/Point";

type WalkingStonePathProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class WalkingStonePathProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private entityManager = new YUKA.EntityManager();
  private time = new YUKA.Time();
  private raycaster = new THREE.Raycaster();
  private ground!: Ground;
  private person!: Person;
  private point!: Point;
  declare private handlePointerMove: (event: PointerEvent) => void;
  declare private handlePointerDown: (event: PointerEvent) => void;

  constructor({ canvasEl, loadManager }: WalkingStonePathProjectProps) {
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

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      const zoomHelper = new CameraZoomHelper(this.camera);
      zoomHelper.fitAreaWithOffsetY({
        area: { width: GROUND_SIZE.width, depth: GROUND_SIZE.height },
        offsetY: 3,
        distanceFactor: 1.25,
      });
    }
  }

  async setupModel() {
    const loadingManager = this.generateLoadingManager();
    this.ground = new Ground({ loadingManager });
    const stone = new Stone({ loadingManager, count: 10 });
    this.person = new Person({ loadingManager });
    this.point = new Point();

    await Promise.allSettled([
      this.ground.init(),
      stone.init(),
      this.person.init(),
    ]);
    if (this.stopRender) return;

    const models = [
      this.ground.model!,
      ...stone.models,
      this.person.model!,
      this.point.model,
    ];
    const entities = [...stone.entities, this.person.entity!];

    entities.forEach((entity) => this.entityManager.add(entity));
    models.forEach((model) => this.scene?.add(model));

    this.person.setTarget(this.point.position);
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

  setupEvent() {
    this.handlePointerMove = (event: PointerEvent) => {
      if (!this.ground.model) return;
      const hit = this.getHit(event);

      if (hit && hit.object.name === MODEL_NAME.ground) {
        this.point.displayLow(hit.point);
      } else {
        this.point.hide();
      }
    };
    this.handlePointerDown = (event: PointerEvent) => {
      if (!this.ground.model) return;
      const hit = this.getHit(event);

      if (hit && hit.object.name === MODEL_NAME.ground) {
        this.point.displayHigh(hit.point);
        this.point.updatePosition(hit.point);
        this.person.seek();
      } else {
        this.point.hide();
      }
    };

    this.canvasEl.addEventListener("pointermove", this.handlePointerMove);
    this.canvasEl.addEventListener("pointerdown", this.handlePointerDown);
  }

  getHit(event: PointerEvent): THREE.Intersection<THREE.Object3D> | undefined {
    const x = (event.clientX / this.canvasEl.clientWidth) * 2 - 1;
    const y = -(event.clientY / this.canvasEl.clientHeight) * 2 + 1;
    const mouse = new THREE.Vector2(x, y);

    this.raycaster.setFromCamera(mouse, this.camera!);
    const intersects = this.raycaster.intersectObjects(
      this.scene!.children.filter((obj) => obj.name !== MODEL_NAME.point),
    );

    return intersects.length > 0 ? intersects[0] : undefined;
  }

  update() {
    const delta = this.time.update().getDelta();
    const elapsedTime = this.time.getElapsed(); // 단위: s

    this.entityManager.update(delta);
    this.person.update(elapsedTime * 1000);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
    this.entityManager.clear();
    this.time.dispose();
    this.canvasEl.removeEventListener("pointermove", this.handlePointerMove);
    this.canvasEl.removeEventListener("pointerdown", this.handlePointerDown);
  }
}

export default WalkingStonePathProject;
