import * as THREE from "three";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadManagerType } from "./FireCannonProject.types";
import Ground from "./helpers/Ground";
import { GROUND_HEIGHT } from "./FireCannonProject.constants";
import Cannon from "./helpers/Cannon";

type FireCannonProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class FireCannonProject extends BaseProject {
  loadManager: LoadManagerType;
  private stopRender = false;

  constructor({ canvasEl, loadManager }: FireCannonProjectProps) {
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
      this.camera.position.set(0, 3, GROUND_HEIGHT / 2);
    }
  }

  async setupModel() {
    const loadingManager = this.createLoadingManager();
    const ground = new Ground({ loadingManager });
    const cannon = new Cannon({ loadingManager });

    await Promise.allSettled([ground.init(), cannon.init()]);
    if (this.stopRender) return;

    if (ground.root) this.scene?.add(ground.root);
    if (cannon.root) this.scene?.add(cannon.root);
  }

  createLoadingManager(): THREE.LoadingManager {
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

export default FireCannonProject;
