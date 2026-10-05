import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadingOptionsType } from "./CloneModelProjec.types";
import type { ConstructorProps } from "@/types/project";
import type Animal from "./helpers/Animal";
import type Animals from "./helpers/Animals";
import Serengeti from "./helpers/Serengeti";
import Buffalo from "./helpers/Buffalo";
import Deers from "./helpers/Deers";
import Rabbits from "./helpers/Rabbits";

type CloneModelProjectProps = ConstructorProps & {
  loadingOptions: LoadingOptionsType;
};

@RenderLoop()
class CloneModelProject extends BaseProject {
  private loadingOptions: LoadingOptionsType;
  private stopRender: boolean = false;
  private animals: (Animal | Animals)[] = [];

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
    const buffalo = new Buffalo({ loadingManager });
    const deers = new Deers({ loadingManager });
    const rabbits = new Rabbits({ loadingManager });

    await Promise.allSettled([
      serengeti.init(),
      buffalo.init(),
      deers.init(),
      rabbits.init(),
    ]);
    if (this.stopRender) return;

    this.scene?.add(serengeti.root);
    this.scene?.add(buffalo.root);
    this.scene?.add(...deers.root);
    this.scene?.add(...rabbits.root);

    this.animals.push(buffalo, deers, rabbits);
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

  update(time: number) {
    this.animals.forEach((animal) => animal.update(time));
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default CloneModelProject;
