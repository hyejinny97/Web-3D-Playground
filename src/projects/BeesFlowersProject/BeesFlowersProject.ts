import * as THREE from "three";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./BeesFlowersProject.types";
import Ground from "./helpers/Ground";
import { GROUND_SIZE } from "./BeesFlowersProject.constants";

type BeesFlowersProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class BeesFlowersProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;
  private ground!: Ground;

  constructor({ canvasEl, loadManager }: BeesFlowersProjectProps) {
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
      this.camera.position.set(0, GROUND_SIZE / 2, GROUND_SIZE / 2 + 0.5);
    }
  }

  async setupModel() {
    const loadingManager = this.generateLoadingManager();

    this.ground = new Ground({ loadingManager });

    await this.ground.init();
    if (this.stopRender) return;

    const models = [this.ground.model!];

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

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default BeesFlowersProject;
