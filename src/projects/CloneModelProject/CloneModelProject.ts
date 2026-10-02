import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadingOptionsType } from "./CloneModelProjec.types";
import type { ConstructorProps } from "@/types/project";
import Serengeti from "./helpers/Serengeti";
import Buffalo from "./helpers/Buffalo";
import type Animal from "./helpers/Animal";

type CloneModelProjectProps = ConstructorProps & {
  loadingOptions: LoadingOptionsType;
};

@RenderLoop()
class CloneModelProject extends BaseProject {
  private loadingOptions: LoadingOptionsType;
  private stopRender: boolean = false;
  private animals: Animal[] = [];

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

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 0.5);
    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(2, 2, 2);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight);
  }

  async setupModel() {
    const loadingManager = this.createLoadingManager();
    const serengeti = new Serengeti({ loadingManager });
    const buffalo = new Buffalo({ loadingManager });

    await Promise.allSettled([serengeti.init(), buffalo.init()]);
    if (this.stopRender) return;

    buffalo.root.position.set(-0.6, 0, 0);
    buffalo.root.rotateY(-Math.PI / 4);

    this.scene?.add(serengeti.root);
    this.scene?.add(buffalo.root);
    this.animals.push(buffalo);
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
