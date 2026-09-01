import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import type { ConstructorProps } from "@/types/project";
import FogHelper from "./helpers/FogHelper";
import MaterialDictionary from "./MaterialDictionary";
import GridAlignHelper from "@/helpers/GridAlignHelper";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";

type LineMaterialsProjectProps = ConstructorProps & {
  onModelSelect: () => void;
};

@RenderLoop()
class LineMaterialsProject extends BaseProject {
  declare private root: THREE.Group;
  declare private geometry: THREE.BufferGeometry;
  declare private materialDictionary: MaterialDictionary;
  declare private fogHelper: FogHelper;
  declare private selectedMaterial?: keyof MaterialDictionary["values"];
  declare private handleCanvasClick: (event: MouseEvent) => void;
  declare private onModelSelect: LineMaterialsProjectProps["onModelSelect"];

  constructor({
    canvasEl,
    controlUI,
    onModelSelect,
  }: LineMaterialsProjectProps) {
    super({ canvasEl, controlUI });
    this.onModelSelect = onModelSelect;
  }

  init() {
    super.init();
    this.setupEvent();
  }

  setupScene() {
    super.setupScene();

    if (!this.scene || !this.controlUI) return;
    this.fogHelper = new FogHelper(this.controlUI, this.scene);
  }

  setupModel() {
    if (!this.controlUI) throw new Error("controlUI 값이 없습니다.");

    this.materialDictionary = new MaterialDictionary(this.controlUI);
    this.root = new THREE.Group();
    this.scene?.add(this.root);

    this.createGeometry();
    this.createModels();
    this.arrangeInGrid();
    this.zoomFit(this.root);
  }

  createGeometry() {
    const vertices = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];
    const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);
    this.geometry = new THREE.BufferGeometry().setAttribute(
      "position",
      positionAttribute,
    );
  }

  createModel(name: keyof MaterialDictionary["values"]) {
    const materialHelper = this.materialDictionary.values[name];
    const line = new THREE.Line(this.geometry, materialHelper.material);
    line.computeLineDistances();
    line.name = name;
    this.root.add(line);
  }

  createModels() {
    Object.keys(this.materialDictionary["values"]).map((name) => {
      const materialName = name as keyof MaterialDictionary["values"];
      this.createModel(materialName);
    });
  }

  arrangeInGrid() {
    const models = this.root.children.filter(
      (child) => child instanceof THREE.Line,
    );
    const gridHelper = new GridAlignHelper({
      rowGap: 3,
      columnGap: 3,
      maxGridColumns: 2,
    });
    gridHelper.align(models);
  }

  zoomFit(obj: THREE.Object3D, animate: boolean = false, margin: number = 0) {
    if (!this.camera) return;

    const zoomHelper = new CameraZoomHelper(this.camera);
    zoomHelper.fit({
      obj,
      margin,
      animate,
      initLookAtTarget: this.controls?.target,
      onAnimationComplete: (lookAtTarget) => {
        if (this.controls) {
          this.controls.target.copy(lookAtTarget);
          this.controls.update();
        }
      },
    });
  }

  addMaterialControlUI(name: keyof MaterialDictionary["values"]) {
    const materialHelper = this.materialDictionary.values[name];
    materialHelper.createControlUI();
  }

  addFogControlUI() {
    this.fogHelper.createControlUI();
  }

  setupEvent() {
    const raycaster = new THREE.Raycaster();
    this.handleCanvasClick = (event: MouseEvent) => {
      if (this.selectedMaterial) return;

      const x = (event.clientX / this.canvasEl.clientWidth) * 2 - 1;
      const y = -(event.clientY / this.canvasEl.clientHeight) * 2 + 1;
      const clickedPosition = new THREE.Vector2(x, y);

      raycaster.setFromCamera(clickedPosition, this.camera!);
      const intersects = raycaster.intersectObjects(this.root.children);

      if (intersects.length > 0) {
        for (const intersect of intersects) {
          const obj = intersect.object;
          if (obj instanceof THREE.Line) {
            if (this.materialDictionary.isMaterialName(obj.name)) {
              this.selectedMaterial = obj.name;
              this.zoomFit(obj, true, 1);
              this.addMaterialControlUI(obj.name);
              this.addFogControlUI();
              this.onModelSelect();
              break;
            }
          }
        }
      }
    };
    this.canvasEl.addEventListener("click", this.handleCanvasClick);
  }

  reset() {
    this.zoomFit(this.root, true);
    if (this.selectedMaterial) {
      const materialHelper =
        this.materialDictionary.values[this.selectedMaterial];
      materialHelper.reset();
      this.selectedMaterial = undefined;
      this.fogHelper.reset();
    }
  }

  dispose() {
    super.dispose();
    this.canvasEl.removeEventListener("click", this.handleCanvasClick);
  }
}

export default LineMaterialsProject;
