import * as THREE from "three";
import * as YUKA from "yuka";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./BullfightProject.types";
import Flag from "./helpers/Flag";
import Ground from "./helpers/Ground";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";
import { GROUND_SIZE } from "./BullfightProject.constants";

type BullfightProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class BullfightProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private entityManager = new YUKA.EntityManager();
  private time = new YUKA.Time();

  constructor({ canvasEl, loadManager }: BullfightProjectProps) {
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

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 0.5);
    const directionalLight1 = new THREE.DirectionalLight("white", 1);
    const directionalLight2 = new THREE.DirectionalLight("white", 1);
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
        offsetY: 1,
      });
    }
  }

  async setupModel() {
    const loadingManager = this.generateLoadingManager();
    const ground = new Ground({ loadingManager });
    const flag = new Flag({ loadingManager });

    await Promise.allSettled([ground.init(), flag.init()]);
    if (this.stopRender) return;

    const models = [ground.model!, ...flag.models];
    const entities = [...flag.entities];

    models.forEach((model) => this.scene?.add(model));
    entities.forEach((entity) => this.entityManager.add(entity));
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
    this.entityManager.update(delta);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
    this.entityManager.clear();
    this.time.dispose();
  }
}

export default BullfightProject;
