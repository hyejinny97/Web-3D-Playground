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

  constructor({ canvasEl, controlUI, loadManager }: GLTFModelProjectProps) {
    super({ canvasEl, controlUI });
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

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default GLTFModelProject;
