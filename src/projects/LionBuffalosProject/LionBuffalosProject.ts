import * as THREE from "three";
import * as YUKA from "yuka";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";
import { GROUND_SIZE } from "./LionBuffalosProject.constants";
import Ground from "./helpers/Ground";
import type { LoadManagerType } from "./LionBuffalosProject.types";
import Buffalo from "./helpers/Buffalo";
import Lion from "./helpers/Lion";
import LionTarget from "./helpers/LionTarget";

type LionBuffalosProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class LionBuffalosProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private entityManager = new YUKA.EntityManager();
  private time = new YUKA.Time();
  private timeoutId: number | null = null;
  private buffalo!: Buffalo;
  private lion!: Lion;
  private lionTarget!: LionTarget;

  constructor({ canvasEl, loadManager }: LionBuffalosProjectProps) {
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
    const ground = new Ground({ loadingManager });
    this.buffalo = new Buffalo({ loadingManager, count: 20 });
    this.lion = new Lion({ loadingManager });
    this.lionTarget = new LionTarget();

    await Promise.allSettled([
      ground.init(),
      this.buffalo.init(),
      this.lion.init(),
    ]);
    if (this.stopRender) return;

    const models = [
      ground.model!,
      ...this.buffalo.models,
      this.lion.model!,
      this.lionTarget.model,
    ];
    const entities = [...this.buffalo.entities, this.lion.entity!];

    entities.forEach((entity) => this.entityManager.add(entity));
    models.forEach((model) => this.scene?.add(model));

    this.buffalo.flee(this.lion.entity!.position);
    this.lion.setTarget(this.lionTarget.position);
    this.timeoutId = setTimeout(this.moveLion.bind(this), 3000);
  }

  async moveLion() {
    this.lionTarget.placeRandomly();
    await this.lion.seek();

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(this.moveLion.bind(this), 2000);
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

  update() {
    const delta = this.time.update().getDelta();
    const elapsedTime = this.time.getElapsed(); // 단위: s

    this.entityManager.update(delta);
    this.buffalo.update(elapsedTime * 1000);
    this.lion.update(elapsedTime * 1000, delta);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
    this.entityManager.clear();
    this.time.dispose();
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}

export default LionBuffalosProject;
