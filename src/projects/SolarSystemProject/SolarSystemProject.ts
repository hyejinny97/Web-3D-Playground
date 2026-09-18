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

  setupScene() {
    super.setupScene();
    if (this.scene) {
      const universeImgUrl = "/textures/solar-system/universe.jpeg";
      const loader = new THREE.CubeTextureLoader();
      const cubeTexture = loader.load(Array(6).fill(universeImgUrl));
      cubeTexture.colorSpace = THREE.SRGBColorSpace;
      this.scene.background = cubeTexture;
    }
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 1);
    this.scene?.add(ambientLight);
  }

  async setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    this.solarSystemHelper = new SolarSystemHelper(
      this.controlUI,
      this.loadTextureImages,
    );
    await this.solarSystemHelper.init();
    if (this.stopRender) return;

    this.scene?.add(this.solarSystemHelper.root);
    this.solarSystemHelper.createControlUI();
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
