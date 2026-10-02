import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadingOptionsType } from "./CloneModelProjec.types";
import type { ConstructorProps } from "@/types/project";
import Serengeti from "./helpers/Serengeti";

type CloneModelProjectProps = ConstructorProps & {
  loadingOptions: LoadingOptionsType;
};

@RenderLoop()
class CloneModelProject extends BaseProject {
  private loadingOptions: LoadingOptionsType;
  private stopRender: boolean = false;

  constructor({ canvasEl, loadingOptions }: CloneModelProjectProps) {
    super({ canvasEl });
    this.loadingOptions = loadingOptions;
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
      this.camera.position.set(0, 2.5, 3.5);
    }
  }

  async setupModel() {
    const loadingManager = this.createLoadingManager();

    const serengeti = new Serengeti({ loadingManager });
    await serengeti.init();
    if (this.stopRender) return;

    this.scene?.add(serengeti.root);
  }

  createLoadingManager(): THREE.LoadingManager {
    const { onStart, onProgress, onLoad } = this.loadingOptions;
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

export default CloneModelProject;
