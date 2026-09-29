import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { ConstructorProps } from "@/types/project";
import type { LoadingOptionsType } from "./FollowCurveProject.types";
import TrackHelper from "./helpers/TrackHelper";
import CarHelper from "./helpers/CarHelper";
import PathHelper from "./helpers/PathHelper";

type FollowCurveProjectProps = ConstructorProps & {
  loadingOptions: LoadingOptionsType;
};

@RenderLoop()
class FollowCurveProject extends BaseProject {
  loadingOptions: LoadingOptionsType;
  declare trackHelper: TrackHelper;
  declare carHelper: CarHelper;
  declare pathHelper: PathHelper;
  private stopRender: boolean = false;
  declare private handleKeyDown: (e: KeyboardEvent) => void;
  declare private handleKeyUp: (e: KeyboardEvent) => void;

  constructor({ canvasEl, loadingOptions }: FollowCurveProjectProps) {
    super({ canvasEl });
    this.loadingOptions = loadingOptions;
    this.setupModel();
    this.setupEvent();
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
      this.camera.position.set(0, 0.4, 0.4);
      this.camera.near = 0.01;
      this.camera.updateMatrix();
    }
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 1);
    const directionalLight = new THREE.DirectionalLight("white", 2);
    directionalLight.position.set(2, 2, 2);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight);
  }

  async setupModel() {
    const loadManager = this.createLoadManager();
    this.trackHelper = new TrackHelper({ loadManager });
    this.carHelper = new CarHelper({ loadManager });

    await Promise.all([this.trackHelper.init(), this.carHelper.init()]);
    if (this.stopRender) return;

    this.scene?.add(this.trackHelper.root);
    this.scene?.add(this.carHelper.root);

    this.pathHelper = new PathHelper();
    this.scene?.add(this.pathHelper.path);
    // this.pathHelper.followPath(this.carHelper.root);
  }

  createLoadManager(): THREE.LoadingManager {
    const { onStart, onProgress, onLoad } = this.loadingOptions;
    const manager = new THREE.LoadingManager(
      onLoad,
      (_: string, loaded: number, total: number) => onProgress(loaded, total),
    );
    manager.onStart = onStart;
    return manager;
  }

  update(time: number) {
    this.pathHelper?.update(time);
    this.carHelper.update(time);
  }

  setupEvent() {
    this.handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          this.carHelper.pedal?.accelerate();
          break;
        case "ArrowDown":
          this.carHelper.pedal?.brake();
          break;
      }
    };

    this.handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
          this.carHelper.pedal?.notPressed();
          break;
      }
    };

    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }
}

export default FollowCurveProject;
