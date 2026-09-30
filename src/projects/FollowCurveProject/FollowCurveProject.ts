import * as THREE from "three";
import type { ActionDispatch, Dispatch } from "react";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { ConstructorProps } from "@/types/project";
import type { LoadingOptionsType } from "./FollowCurveProject.types";
import TrackHelper from "./helpers/TrackHelper";
import CarHelper from "./helpers/CarHelper";
import PathHelper from "./helpers/PathHelper";
import type { ActionType } from "@/components/projects/FollowCurveCanvas/FollowCurveCanvas.types";
import { MAX_SPEED, MIN_SPEED } from "./FollowCurveProject.constants";

type FollowCurveProjectProps = ConstructorProps & {
  loadingOptions: LoadingOptionsType;
  dispatch: ActionDispatch<[action: ActionType]>;
  setSpeedProgress: Dispatch<React.SetStateAction<number>>;
};

@RenderLoop()
class FollowCurveProject extends BaseProject {
  loadingOptions: LoadingOptionsType;
  declare trackHelper: TrackHelper;
  declare carHelper: CarHelper;
  declare pathHelper: PathHelper;
  private stopRender: boolean = false;
  private zoomToCar: boolean = false;
  declare private handleKeyDown: (e: KeyboardEvent) => void;
  declare private handleKeyUp: (e: KeyboardEvent) => void;
  declare private dispatch: ActionDispatch<[action: ActionType]>;
  declare private setSpeedProgress: Dispatch<React.SetStateAction<number>>;

  constructor({
    canvasEl,
    loadingOptions,
    dispatch,
    setSpeedProgress,
  }: FollowCurveProjectProps) {
    super({ canvasEl });
    this.loadingOptions = loadingOptions;
    this.setupModel();
    this.setupEvent();
    this.dispatch = dispatch;
    this.setSpeedProgress = setSpeedProgress;
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
    this.pathHelper.followPath(this.carHelper);
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

  zoomIn() {
    if (!this.camera || !this.carHelper.root) return;
    if (this.controls) {
      this.controls.enabled = false;
    }

    const car = this.carHelper.root;
    const carPosition = car.position;

    const box = new THREE.Box3().setFromObject(car);
    const size = new THREE.Vector3();
    box.getSize(size);
    const carHalfWidth = size.z / 2;

    const direction = new THREE.Vector3();
    const oppositeDirection = new THREE.Vector3();
    car.getWorldDirection(direction);
    oppositeDirection.copy(new THREE.Vector3(-direction.x, 0.3, -direction.z));

    const DISTANCE_FROM_CAR = 0.05;
    const cameraPosition = oppositeDirection
      .multiplyScalar(carHalfWidth + DISTANCE_FROM_CAR)
      .add(carPosition);

    this.camera.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z,
    );
    this.camera.lookAt(direction.x, direction.y, direction.z);
  }

  zoomOut() {
    if (!this.camera) return;
    if (this.controls) {
      this.controls.enabled = true;
    }

    this.camera.position.set(0, 0.4, 0.4);
    this.camera.lookAt(0, 0, 0);
  }

  update(time: number) {
    this.carHelper.update(time);
    this.pathHelper?.update(time);
    if (this.carHelper.speed !== null) {
      this.setSpeedProgress(
        Math.trunc(
          (this.carHelper.speed /
            this.carHelper.rpsToSpeed(MAX_SPEED - MIN_SPEED)) *
            100,
        ),
      );
    }
    if (this.zoomToCar) {
      this.zoomIn();
    }
  }

  setupEvent() {
    this.handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          this.carHelper.pedal?.accelerate();
          this.dispatch({ type: "pedal", value: "accelerate" });
          break;
        case "ArrowDown":
          this.carHelper.pedal?.brake();
          this.dispatch({ type: "pedal", value: "brake" });
          break;
        case "z":
          this.zoomToCar = !this.zoomToCar;
          this.dispatch({ type: "cameraZoom", value: this.zoomToCar });
          if (this.zoomToCar) this.zoomIn();
          else this.zoomOut();
      }
    };

    this.handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
          this.carHelper.pedal?.notPressed();
          this.dispatch({ type: "pedal", value: "idle" });
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
