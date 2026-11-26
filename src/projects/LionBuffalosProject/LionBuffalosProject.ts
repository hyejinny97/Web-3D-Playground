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

type LionBuffalosProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class LionBuffalosProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private entityManager = new YUKA.EntityManager();
  private time = new YUKA.Time();
  private buffalo!: Buffalo;
  private lion!: Lion;

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

    await Promise.allSettled([
      ground.init(),
      this.buffalo.init(),
      this.lion.init(),
    ]);
    if (this.stopRender) return;

    const models = [ground.model!, ...this.buffalo.models, this.lion.model!];
    const entities = [...this.buffalo.entities];

    entities.forEach((entity) => this.entityManager.add(entity));
    models.forEach((model) => this.scene?.add(model));
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
    this.lion.update(elapsedTime * 1000);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
    this.entityManager.clear();
    this.time.dispose();
  }
}

export default LionBuffalosProject;
