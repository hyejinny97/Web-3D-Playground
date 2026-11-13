import * as THREE from "three";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./BeesFlowersProject.types";
import Ground from "./helpers/Ground";
import { GROUND_SIZE } from "./BeesFlowersProject.constants";
import Grass1 from "./helpers/grass/Grass1";
import Grass2 from "./helpers/grass/Grass2";

type BeesFlowersProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class BeesFlowersProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;

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

    const ground = new Ground({ loadingManager });
    const grass1 = new Grass1({ loadingManager });
    const grass2 = new Grass2({ loadingManager });

    await Promise.allSettled([ground.init(), grass1.init(), grass2.init()]);
    if (this.stopRender) return;

    const models = [ground.model!, ...grass1.models, ...grass2.models];

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
