import * as THREE from "three";
import * as YUKA from "yuka";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./WildGeeseProject.types";
import WildGeese from "./helpers/WildGeese";

type WildGeeseProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class WildGeeseProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private entityManager = new YUKA.EntityManager();
  private time = new YUKA.Time();
  private wildGeese!: WildGeese;

  constructor({ canvasEl, loadManager }: WildGeeseProjectProps) {
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
      this.camera.position.set(0, 5, 10);
    }
  }

  async setupModel() {
    const loadingManager = this.generateLoadingManager();
    this.wildGeese = new WildGeese({ loadingManager, count: 5 });

    await Promise.allSettled([this.wildGeese.init()]);
    if (this.stopRender) return;

    const models = [...this.wildGeese.models];
    const entities = [...this.wildGeese.entities];

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
    const elapsedTime = this.time.getElapsed(); // 단위: s

    this.entityManager.update(delta);
    this.wildGeese.update(elapsedTime * 1000);
  }

  dispose() {
    super.dispose();
    this.entityManager.clear();
    this.time.dispose();
    this.stopRender = true;
  }
}

export default WildGeeseProject;
