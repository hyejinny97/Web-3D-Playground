import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import CarHelper from "./helpers/CarHelper";
import type { LoadManagerType } from "./GLTFModelProject.types";
import type { ConstructorProps } from "@/types/project";

type GLTFModelProjectProps = ConstructorProps & {
  loadManager: LoadManagerType;
};

@RenderLoop()
class GLTFModelProject extends BaseProject {
  loadManager: LoadManagerType;
  private stopRender: boolean = false;
  declare private carHelper: CarHelper;
  declare private handleKeyDown: (e: KeyboardEvent) => void;
  declare private handleKeyUp: (e: KeyboardEvent) => void;

  constructor({ canvasEl, controlUI, loadManager }: GLTFModelProjectProps) {
    super({ canvasEl, controlUI });
    this.loadManager = loadManager;
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
    this.camera?.position.set(3, 1, 3);
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 1);
    const directionalLight = new THREE.DirectionalLight("white", 2);
    directionalLight.position.set(2, 2, 2);
    this.scene?.add(ambientLight);
    this.scene?.add(directionalLight);
  }

  async setupModel() {
    this.carHelper = new CarHelper({ loadManager: this.loadManager });
    await this.carHelper.init();
    if (this.stopRender) return;

    this.scene?.add(this.carHelper.root);
  }

  update(time: number) {
    this.carHelper?.update(time);
  }

  setupEvent() {
    this.handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "d":
          this.carHelper.gear?.drive();
          break;
        case "r":
          this.carHelper.gear?.reverse();
          break;
        case "p":
          this.carHelper.gear?.parking();
          break;
        case "ArrowUp":
          this.carHelper.pedal?.accelerate();
          break;
        case "ArrowDown":
          this.carHelper.pedal?.brake();
          break;
        case "ArrowLeft":
          this.carHelper.steeringWheel?.turnLeft();
          break;
        case "ArrowRight":
          this.carHelper.steeringWheel?.turnRight();
          break;
        case "l":
          this.carHelper.frontLamps?.toggleLight();
          break;
      }
    };

    this.handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
          this.carHelper.pedal?.notPressed();
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.carHelper.steeringWheel?.notTurned();
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

export default GLTFModelProject;
