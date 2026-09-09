import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import MaterialDictionary from "./MaterialDictionary";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";
import type { ConstructorProps } from "@/types/project";
import type { MaterialDictionaryType } from "./TextureMappingProject.types";

type TextureMappingProjectProps = ConstructorProps & {
  selectedTexture: keyof MaterialDictionaryType["values"];
  loadStart: () => void;
  loading: (percent: number) => void;
  loadComplete: () => void;
};

@RenderLoop()
class TextureMappingProject extends BaseProject {
  private geometry = new THREE.SphereGeometry();
  declare private materialDictionary: MaterialDictionary;
  declare private selectedTexture: keyof MaterialDictionaryType["values"];
  private stopRendering = false;
  private loadStart: TextureMappingProjectProps["loadStart"];
  private loading: TextureMappingProjectProps["loading"];
  private loadComplete: TextureMappingProjectProps["loadComplete"];

  constructor({
    canvasEl,
    controlUI,
    selectedTexture,
    loadStart,
    loading,
    loadComplete,
  }: TextureMappingProjectProps) {
    super({ canvasEl, controlUI });
    this.selectedTexture = selectedTexture;
    this.loadStart = loadStart;
    this.loading = loading;
    this.loadComplete = loadComplete;
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

  async setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    this.materialDictionary = new MaterialDictionary(this.controlUI);

    await this.createModel(this.selectedTexture);
    if (this.stopRendering) return;

    this.zoomFit({ obj: this.scene! });
    this.addMaterialControlUI(this.selectedTexture);
  }

  async createModel(name: keyof MaterialDictionaryType["values"]) {
    const material = await this.getMaterial(name);
    const mesh = new THREE.Mesh(this.geometry, material);
    mesh.name = name;

    this.removeAllMesh();
    this.scene?.add(mesh);
  }

  async getMaterial(
    name: keyof MaterialDictionaryType["values"],
  ): Promise<THREE.Material> {
    const { helper, initiated } = this.materialDictionary.values[name];
    if (initiated) {
      return helper.material;
    } else {
      await helper.init({
        onStart: () => {
          this.loadStart();
        },
        onProgress: (_, loaded, total) => {
          this.loading((loaded / total) * 100);
        },
        onLoad: () => {
          this.loadComplete();
        },
      });
      this.materialDictionary.values[name].initiated = true;
      return helper.material;
    }
  }

  removeAllMesh() {
    this.scene?.children
      .filter((obj) => obj instanceof THREE.Mesh)
      .forEach((obj) => this.scene?.remove(obj));
  }

  zoomFit({ obj, margin }: { obj: THREE.Object3D; margin?: number }) {
    if (!this.camera) return;

    const zoomHelper = new CameraZoomHelper(this.camera);
    zoomHelper.fit({
      obj,
      margin,
    });
  }

  addMaterialControlUI(name: keyof MaterialDictionaryType["values"]) {
    const { helper } = this.materialDictionary.values[name];
    helper.createControlUI();
  }

  dispose() {
    super.dispose();
    this.stopRendering = true;
  }
}

export default TextureMappingProject;
