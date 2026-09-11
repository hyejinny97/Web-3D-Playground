import * as THREE from "three";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import TextureMaterialHelper from "./helpers/TextureMaterialHelper";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";

type TexturePropertiesProjectProps = ConstructorProps & {
  loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
};

@RenderLoop()
class TexturePropertiesProject extends BaseProject {
  declare private materialHelper: TextureMaterialHelper;
  private loadTextureImages: TexturePropertiesProjectProps["loadTextureImages"];

  constructor({
    canvasEl,
    controlUI,
    loadTextureImages,
  }: TexturePropertiesProjectProps) {
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

  setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    this.materialHelper = new TextureMaterialHelper(
      this.controlUI,
      this.loadTextureImages,
    );

    this.createModel();
    this.zoomFit({ obj: this.scene!, margin: 0.5 });
    this.materialHelper.createControlUI();
  }

  createModel() {
    const geometry = new THREE.BoxGeometry();
    const { material } = this.materialHelper;
    const mesh = new THREE.Mesh(geometry, material);
    this.scene?.add(mesh);
  }

  zoomFit({ obj, margin }: { obj: THREE.Object3D; margin?: number }) {
    if (!this.camera) return;

    const zoomHelper = new CameraZoomHelper(this.camera);
    zoomHelper.fit({
      obj,
      margin,
    });
  }
}

export default TexturePropertiesProject;
