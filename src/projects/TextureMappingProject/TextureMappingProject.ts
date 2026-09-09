import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import MaterialDictionary from "./MaterialDictionary";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";

@RenderLoop()
class TextureMappingProject extends BaseProject {
  private geometry = new THREE.SphereGeometry();
  declare private materialDictionary: MaterialDictionary;
  private stopRendering = false;

  async setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    this.materialDictionary = new MaterialDictionary(this.controlUI);

    await this.createModel("brick");
    if (this.stopRendering) return;

    this.zoomFit({ obj: this.scene! });
    this.addMaterialControlUI("brick");
  }

  async createModel(name: keyof typeof this.materialDictionary.values) {
    const material = await this.getMaterial(name);
    const mesh = new THREE.Mesh(this.geometry, material);
    mesh.name = name;

    this.removeAllMesh();
    this.scene?.add(mesh);
  }

  async getMaterial(
    name: keyof typeof this.materialDictionary.values,
  ): Promise<THREE.Material> {
    const { helper, initiated } = this.materialDictionary.values[name];
    if (initiated) {
      return helper.material;
    } else {
      await helper.init();
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

  addMaterialControlUI(name: keyof typeof this.materialDictionary.values) {
    const { helper } = this.materialDictionary.values[name];
    helper.createControlUI();
  }

  dispose() {
    super.dispose();
    this.stopRendering = true;
  }
}

export default TextureMappingProject;
