import * as THREE from "three";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import CubeHelper from "./helper/CubeHelper";

type BasicTransformProjectProps = ConstructorProps & {
  loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
};

@RenderLoop()
class BasicTransformProject extends BaseProject {
  private loadTextureImages: BasicTransformProjectProps["loadTextureImages"];
  private stopRender: boolean = false;

  constructor({
    canvasEl,
    controlUI,
    loadTextureImages,
  }: BasicTransformProjectProps) {
    super({ canvasEl, controlUI });
    this.loadTextureImages = loadTextureImages;
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
    this.camera?.position.set(2, 4, 2);
  }

  async setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    const cubeHelper = new CubeHelper(this.controlUI, this.loadTextureImages);
    await cubeHelper.init();
    if (this.stopRender) return;

    const cube = cubeHelper.mesh;
    this.scene?.add(cube);

    const sceneAxes = new THREE.AxesHelper(3);
    this.scene?.add(sceneAxes);

    const cubeAxes = new THREE.AxesHelper(1);
    cube.add(cubeAxes);

    cubeHelper.createControlUI();
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default BasicTransformProject;
