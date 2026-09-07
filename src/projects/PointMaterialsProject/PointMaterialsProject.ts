import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import GeometryHelper from "./helper/GeometryHelper";
import PointMaterialHelper from "./helper/PointMaterialHelper";
import FogHelper from "./helper/FogHelper";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";

@RenderLoop()
class PointMaterialsProject extends BaseProject {
  declare private geometryHelper: GeometryHelper;
  declare private pointMaterialHelper: PointMaterialHelper;
  declare private fogHelper: FogHelper;
  private stop: boolean = false;

  setupScene() {
    super.setupScene();
    if (!this.scene || !this.controlUI) return;
    this.fogHelper = new FogHelper(this.controlUI, this.scene);
  }

  async setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    this.geometryHelper = new GeometryHelper(this.controlUI);
    this.pointMaterialHelper = new PointMaterialHelper(this.controlUI);
    await this.pointMaterialHelper.init();
    if (this.stop) return;

    this.createModel();
    this.zoomFit(this.scene!, 0.5);
    this.addControlUI();
  }

  createModel() {
    const geometry = this.geometryHelper.createGeometry();
    const material = this.pointMaterialHelper.material;
    const points = new THREE.Points(geometry, material);

    const modelName = "points";
    points.name = modelName;

    const oldModel = this.scene?.getObjectByName(modelName);
    if (oldModel && oldModel instanceof THREE.Points) {
      oldModel.geometry?.dispose();
      this.scene?.remove(oldModel);
    }
    this.scene?.add(points);
  }

  zoomFit(obj: THREE.Object3D, margin: number = 0) {
    if (!this.camera) return;

    const zoomHelper = new CameraZoomHelper(this.camera);
    zoomHelper.fit({
      obj,
      margin,
    });
  }

  addControlUI() {
    this.geometryHelper.createControlUI(() => {
      this.createModel();
      this.zoomFit(this.scene!, 0.5);
    });
    this.pointMaterialHelper.createControlUI();
    this.fogHelper.createControlUI();
  }

  removeControlUI() {
    this.geometryHelper.reset(() => {
      this.createModel();
    });
    this.pointMaterialHelper.reset();
    this.fogHelper.reset();
  }

  dispose() {
    this.stop = true;
    super.dispose();
    this.removeControlUI();
  }
}

export default PointMaterialsProject;
