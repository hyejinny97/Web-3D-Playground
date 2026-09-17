import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import SolarSystemHelper from "./helpers/SolarSytemHelper";
import type { ConstructorProps } from "@/types/project";

type SolarSystemProjectProps = ConstructorProps & {
  loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
};

@RenderLoop()
class SolarSystemProject extends BaseProject {
  private loadTextureImages: SolarSystemProjectProps["loadTextureImages"];
  private solarSystemHelper!: SolarSystemHelper;
  private stopRender: boolean = false;

  constructor({
    canvasEl,
    controlUI,
    loadTextureImages,
  }: SolarSystemProjectProps) {
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
    if (this.camera) {
      this.camera.near = 15;
      this.camera.far = 1000;
      this.camera.position.set(0, 100, 200);
      this.camera.updateProjectionMatrix();
    }
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 1);
    this.scene?.add(ambientLight);
  }

  async setupModel() {
    this.solarSystemHelper = new SolarSystemHelper(this.loadTextureImages);
    await this.solarSystemHelper.init();
    if (this.stopRender) return;

    this.scene?.add(this.solarSystemHelper.root);
  }

  update(time: number) {
    this.solarSystemHelper.update(time);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default SolarSystemProject;
