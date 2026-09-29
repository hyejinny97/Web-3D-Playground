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
  declare pathHelper: PathHelper;
  private stopRender: boolean = false;

  constructor({ canvasEl, loadingOptions }: FollowCurveProjectProps) {
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
      this.camera.position.set(0, 0.4, 0.4);
    }
  }

  async setupModel() {
    const loadManager = this.createLoadManager();
    this.trackHelper = new TrackHelper({ loadManager });
    const carHelper = new CarHelper({ loadManager });

    await Promise.all([this.trackHelper.init(), carHelper.init()]);
    if (this.stopRender) return;

    this.scene?.add(this.trackHelper.root);
    this.scene?.add(carHelper.root);

    this.pathHelper = new PathHelper();
    this.scene?.add(this.pathHelper.path);
    this.pathHelper.followPath(carHelper.root);
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
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default FollowCurveProject;
