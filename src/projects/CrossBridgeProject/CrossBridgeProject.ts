import * as THREE from "three";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./CrossBridgeProject.types";
import Bridge from "./helpers/Bridge";
import {
  BOARD_DEPTH,
  BOARD_WIDTH,
  BOARDS_CNT,
  GROUND_WIDTH,
} from "./CrossBridgeProject.constants";
import Ground from "./helpers/Ground";

type CrossBridgeProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class CrossBridgeProject extends BaseProject {
  private loadManager: LoadManagerType;
  private stopRender = false;

  constructor({ canvasEl, loadManager }: CrossBridgeProjectProps) {
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
      this.camera.position.set(
        0,
        5,
        BOARD_DEPTH / 2 +
          (BOARD_DEPTH / 2) *
            Math.sqrt((BOARDS_CNT / 2) * BOARD_WIDTH + GROUND_WIDTH),
      );
    }
  }

  async setupModel() {
    const loadingManager = this.generateLoadingManager();
    const bridge = new Bridge({ loadingManager });
    const ground = new Ground({ loadingManager });

    await Promise.allSettled([bridge.init(), ground.init()]);
    if (this.stopRender) return;

    const models = [...bridge.models, ...ground.models];
    this.scene?.add(...models);
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

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default CrossBridgeProject;
