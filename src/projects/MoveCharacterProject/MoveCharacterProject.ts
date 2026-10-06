import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { LoadingOptionsType } from "./MoveCharacterProject.types";
import type { ConstructorProps } from "@/types/project";
import Ground from "./helpers/Ground";
import Character from "./helpers/Character";

type MoveCharacterProjectProps = ConstructorProps & {
  loadingOptions: LoadingOptionsType;
};

@RenderLoop()
class MoveCharacterProject extends BaseProject {
  private loadingOptions: LoadingOptionsType;
  private stopRender: boolean = false;
  private character!: Character;

  constructor({ canvasEl, loadingOptions }: MoveCharacterProjectProps) {
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
      this.camera.position.set(0, 3, 5);
    }
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 2);
    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(10, 10, 10);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight);
  }

  async setupModel() {
    const loadingManager = this.createLoadingManager();
    const ground = new Ground();
    this.character = new Character({ loadingManager });

    await this.character.init();
    if (this.stopRender) return;

    this.scene?.add(ground.root);
    this.scene?.add(this.character.root);
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
    this.character.update(time);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default MoveCharacterProject;
