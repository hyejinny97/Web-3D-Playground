import * as THREE from "three";
import { gsap } from "gsap";
import type { ConstructorProps } from "@/types/project";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import TextureHelper from "./helpers/TextureHelper";
import {
  MIN_FILTER,
  PLANE_HEIGHT,
  PLANE_WIDTH,
} from "./TextureMipmapsProject.constants";
import type { MinFilterType } from "./TextureMipmapsProject.types";
import GridAlignHelper from "@/helpers/GridAlignHelper";

type TextureMipmapsProjectProps = ConstructorProps & {
  loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
};

@RenderLoop()
class TextureMipmapsProject extends BaseProject {
  declare private textureHelper: TextureHelper;
  private loadTextureImages: TextureMipmapsProjectProps["loadTextureImages"];
  private stopRender: boolean = false;

  constructor({
    canvasEl,
    controlUI,
    loadTextureImages,
  }: TextureMipmapsProjectProps) {
    super({ canvasEl, controlUI });
    this.loadTextureImages = loadTextureImages;
    this.setupModel();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();
    this.setupLight();
    this.setupResizeObserver();
  }

  setupCamera() {
    super.setupCamera();
    if (this.camera) {
      gsap.to(this.camera.position, {
        y: 1,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight("white", 2);
    this.scene?.add(ambientLight);
  }

  async setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    this.textureHelper = new TextureHelper(
      this.controlUI,
      this.loadTextureImages,
    );
    await this.textureHelper.init();
    if (this.stopRender) return;

    const models = this.generateAllModels();
    this.arrangeInGrid(models);
    this.scene?.add(...models);
    this.camera?.position.set(0, -1, 5);
    this.textureHelper.createControlUI();
  }

  generateAllModels(): THREE.Mesh[] {
    return Object.keys(MIN_FILTER).map((key) => {
      const name = key as MinFilterType;
      const filter = MIN_FILTER[name];
      const clonedTexture = this.textureHelper.texture.clone();
      clonedTexture.minFilter = filter;
      const material = new THREE.MeshPhongMaterial({ map: clonedTexture });
      material.side = THREE.DoubleSide;
      return this.generateModel(material);
    });
  }

  generateModel(material: THREE.Material): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT);
    geometry.translate(0, -PLANE_HEIGHT / 2, 0);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  }

  arrangeInGrid(models: THREE.Mesh[]) {
    const gridHelper = new GridAlignHelper({
      rowGap: 10,
      columnGap: PLANE_WIDTH + 2,
      maxGridColumns: 3,
    });
    gridHelper.align(models);
  }

  dispose() {
    super.dispose();
    this.stopRender = true;
  }
}

export default TextureMipmapsProject;
